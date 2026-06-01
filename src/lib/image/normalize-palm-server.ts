import sharp from "sharp";
import type { PalmTransform } from "@/lib/types/palm-analysis";

const OUTPUT_WIDTH = 400;
const OUTPUT_HEIGHT = 500;

function clampRotation(deg: number): number {
  let r = deg;
  while (r > 45) r -= 90;
  while (r < -45) r += 90;
  return Math.max(-45, Math.min(45, r));
}

/**
 * Вырезает ладонь, поворачивает пальцами вверх, фиксированный кадр 4:5.
 * rotationDeg: положительный = против часовой (sharp).
 */
export async function normalizePalmImage(
  imageBuffer: Buffer,
  transform: PalmTransform,
): Promise<string> {
  const rotation = clampRotation(transform.rotationDeg);
  const base = sharp(imageBuffer).rotate(); // EXIF
  const meta = await base.metadata();
  const imgW = meta.width ?? 1;
  const imgH = meta.height ?? 1;

  const pad = 0.08;
  const w = Math.min(0.95, transform.width + pad * 2);
  const h = Math.min(0.95, transform.height + pad * 2);
  const left = Math.max(
    0,
    Math.min(imgW - 32, Math.floor((transform.centerX - w / 2) * imgW)),
  );
  const top = Math.max(
    0,
    Math.min(imgH - 32, Math.floor((transform.centerY - h / 2) * imgH)),
  );
  const width = Math.max(32, Math.min(imgW - left, Math.floor(w * imgW)));
  const height = Math.max(32, Math.min(imgH - top, Math.floor(h * imgH)));

  const cropped = await base
    .extract({ left, top, width, height })
    .rotate(rotation, {
      background: { r: 253, g: 250, b: 245 },
    })
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, {
      fit: "contain",
      position: "centre",
      background: { r: 253, g: 250, b: 245 },
    })
    .jpeg({ quality: 88 })
    .toBuffer();

  return `data:image/jpeg;base64,${cropped.toString("base64")}`;
}
