import { readFile } from "fs/promises";
import path from "path";

let cachedStyleReference: string | null = null;

/** Референс макета из public/mock-palm-infographic.png → data URL */
export async function getStyleReferenceDataUrl(): Promise<string | null> {
  if (cachedStyleReference) return cachedStyleReference;
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "mock-palm-infographic.png",
    );
    const buffer = await readFile(filePath);
    cachedStyleReference = `data:image/png;base64,${buffer.toString("base64")}`;
    return cachedStyleReference;
  } catch (e) {
    console.error("[style-reference] failed to load:", e);
    return null;
  }
}
