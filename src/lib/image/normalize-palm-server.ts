import sharp from "sharp";
import type { PalmTransform } from "@/lib/types/palm-analysis";

const OUTPUT_WIDTH = 400;
const OUTPUT_HEIGHT = 500;

/**
 * Вырезает ладонь, поворачивает пальцами вверх, фиксированный кадр 4:5.
 */
export async function normalizePalmImage(
  imageBuffer: Buffer,
  transform: PalmTransform,
): Promise<string> {
  const base = sharp(imageBuffer).rotate();
  const meta = await base.metadata();
  const imgW = meta.width ?? 1;
  const imgH = meta.height ?? 1;

  const pad = 0.06;
  const w = Math.min(1, transform.width + pad * 2);
  const h = Math.min(1, transform.height + pad * 2);
  const left = Math.max(
    0,
    Math.min(imgW - 1, Math.floor((transform.centerX - w / 2) * imgW)),
  );
  const top = Math.max(
    0,
    Math.min(imgH - 1, Math.floor((transform.centerY - h / 2) * imgH)),
  );
  const width = Math.max(
    32,
    Math.min(imgW - left, Math.floor(w * imgW)),
  );
  const height = Math.max(
    32,
    Math.min(imgH - top, Math.floor(h * imgH)),
  );

  const cropped = await base
    .extract({ left, top, width, height })
    .rotate(-transform.rotationDeg, { background: { r: 253, g: 250, b: 245 } })
    .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, {
      fit: "contain",
      background: { r: 253, g: 250, b: 245 },
    })
    .jpeg({ quality: 88 })
    .toBuffer();

  return `data:image/jpeg;base64,${cropped.toString("base64")}`;
}
