"use server";

import { z } from "zod";
import QRCode from "qrcode";
import { appUrl, features } from "@/lib/env";
import { generateSign } from "@/lib/services/signs";

/**
 * Build the shareable review link + QR for a business the owner picked. QR
 * encoding happens here (server) so the `qrcode` package never ships to the
 * client. Returns both a PNG data URL (for display + raster download) and an
 * SVG string (for crisp print at any size).
 */

const placeIdSchema = z.string().min(1).max(300);

export type QrResult =
  | { ok: true; url: string; png: string; svg: string }
  | { ok: false; error: string };

export async function generateQrAction(placeId: string): Promise<QrResult> {
  const parsed = placeIdSchema.safeParse(placeId.trim());
  if (!parsed.success) return { ok: false, error: "That business id looks off." };

  // Spec-shaped link; /review normalizes it to /review/[placeId] (QR = no confirm).
  const url = `${appUrl}/review?placeId=${encodeURIComponent(parsed.data)}`;

  try {
    const [png, svg] = await Promise.all([
      QRCode.toDataURL(url, {
        margin: 2,
        width: 640,
        errorCorrectionLevel: "M",
      }),
      QRCode.toString(url, {
        type: "svg",
        margin: 2,
        errorCorrectionLevel: "M",
      }),
    ]);
    return { ok: true, url, png, svg };
  } catch {
    return { ok: false, error: "Couldn't generate the QR code — try again." };
  }
}

/**
 * Generate a counter-sign concept preview via fal.ai (nano-banana-2). A design
 * mockup — the QR shown is decorative; the real scannable QR comes from
 * `generateQrAction`. Returns a PNG data URL on success.
 */

const businessNameSchema = z.string().trim().min(1).max(200);

export type SignResult =
  | { ok: true; png: string }
  | { ok: false; error: string };

export async function generateSignAction(
  businessName: string,
): Promise<SignResult> {
  if (!features.imageGeneration) {
    return {
      ok: false,
      error: "Sign generation isn't configured yet — the server is missing its fal.ai key.",
    };
  }

  const parsed = businessNameSchema.safeParse(businessName);
  if (!parsed.success) return { ok: false, error: "That business name looks off." };

  try {
    const { png } = await generateSign({ businessName: parsed.data });
    return { ok: true, png };
  } catch {
    return { ok: false, error: "Couldn't design the sign — try again." };
  }
}
