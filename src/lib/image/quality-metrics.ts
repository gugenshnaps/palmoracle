import sharp from "sharp";
import { QUALITY_THRESHOLDS } from "@/lib/image/quality-thresholds";

export interface ImageQualityMetrics {
  brightness: number;
  contrast: number;
  darkRatio: number;
  blurVariance: number;
  pass: boolean;
  failReason: string | null;
}

function laplacianVariance(pixels: Uint8Array, width: number, height: number): number {
  let sum = 0;
  let sumSq = 0;
  let n = 0;
  const kernel = (y: number, x: number) => {
    const c = pixels[y * width + x];
    const lap =
      -4 * c +
      (pixels[(y - 1) * width + x] ?? c) +
      (pixels[(y + 1) * width + x] ?? c) +
      (pixels[y * width + (x - 1)] ?? c) +
      (pixels[y * width + (x + 1)] ?? c);
    sum += lap;
    sumSq += lap * lap;
    n++;
  };
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) kernel(y, x);
  }
  const mean = sum / n;
  return sumSq / n - mean * mean;
}

export async function analyzeImageMetrics(
  imageBuffer: Buffer,
): Promise<ImageQualityMetrics> {
  const rotated = sharp(imageBuffer).rotate();
  const { data, info } = await rotated
    .resize(320, 320, { fit: "inside", withoutEnlargement: true })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = new Uint8Array(data);
  const n = pixels.length;
  let sum = 0;
  let dark = 0;
  for (let i = 0; i < n; i++) {
    sum += pixels[i];
    if (pixels[i] < 45) dark++;
  }
  const brightness = sum / n;
  let variance = 0;
  for (let i = 0; i < n; i++) {
    const d = pixels[i] - brightness;
    variance += d * d;
  }
  const contrast = Math.sqrt(variance / n);
  const darkRatio = dark / n;

  const blurVariance = laplacianVariance(
    pixels,
    info.width,
    info.height,
  );

  let failReason: string | null = null;
  if (brightness < QUALITY_THRESHOLDS.minBrightness) {
    failReason =
      "Слишком темно. Включите свет или снимите ладонь у окна — ладонь должна быть хорошо видна.";
  } else if (darkRatio > QUALITY_THRESHOLDS.maxDarkRatio) {
    failReason =
      "Ладонь почти не видна (силуэт). Снимите при хорошем освещении, ладонь к камере.";
  } else if (contrast < QUALITY_THRESHOLDS.minContrast) {
    failReason =
      "Мало контраста — детали ладони не читаются. Добавьте света и избегайте подсветки сзади.";
  } else if (blurVariance < QUALITY_THRESHOLDS.minBlurVariance) {
    failReason = "Фото размыто. Держите телефон неподвижно и сфокусируйтесь на ладони.";
  }

  return {
    brightness: Math.round(brightness),
    contrast: Math.round(contrast),
    darkRatio: Math.round(darkRatio * 100) / 100,
    blurVariance: Math.round(blurVariance),
    pass: failReason === null,
    failReason,
  };
}
