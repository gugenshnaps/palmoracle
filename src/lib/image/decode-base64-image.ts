export function decodeBase64Image(base64: string): Buffer {
  const raw = base64.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(raw, "base64");
}
