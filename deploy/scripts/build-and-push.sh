#!/usr/bin/env bash
# Build the easy-reviews image for linux/arm64 (the EC2 host is Graviton/t4g) and
# push it to ECR. Run from anywhere — it cd's to the repo root.
#
#   ./deploy/scripts/build-and-push.sh [tag]
#
# tag defaults to the short git SHA; both <tag> and :latest are pushed.
# Requires: docker (with buildx) and aws CLI with push access to the ECR repo.
#
# Overridable via env: AWS_REGION, AWS_ACCOUNT_ID, NEXT_PUBLIC_APP_URL.
set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query Account --output text)}"
REPO="apps/reviews"
APP_URL="${NEXT_PUBLIC_APP_URL:-https://reviews.bakeoff.app}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

TAG="${1:-$(git rev-parse --short HEAD)}"
ECR_HOST="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE="${ECR_HOST}/${REPO}"

echo "▶ Building ${IMAGE}:${TAG} (+ :latest) for linux/arm64"
echo "  NEXT_PUBLIC_APP_URL=${APP_URL}"

aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_HOST"

# A docker-container builder is required for a reliable --push (cross-)build.
if ! docker buildx inspect reviews-builder >/dev/null 2>&1; then
  docker buildx create --name reviews-builder --driver docker-container >/dev/null
fi

docker buildx build \
  --builder reviews-builder \
  --platform linux/arm64 \
  --build-arg NEXT_PUBLIC_APP_URL="$APP_URL" \
  -t "${IMAGE}:${TAG}" \
  -t "${IMAGE}:latest" \
  --push \
  .

echo "✓ Pushed ${IMAGE}:${TAG} and :latest"
echo
echo "Next — deploy on the box (via SSM):"
echo "  /opt/apps/scripts/deploy.sh reviews ${TAG}"
