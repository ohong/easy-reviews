"use server";

import { z } from "zod";
import QRCode from "qrcode";
import { appUrl } from "@/lib/env";

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
