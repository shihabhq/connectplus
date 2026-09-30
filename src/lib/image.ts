/** Resizes an image file to at most `max` pixels on its longest side and returns a JPEG data URL. */
export async function resizeImageToDataUrl(file: File, max = 800): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("That file is not an image. Choose a JPG, PNG or WebP photo.");
  }
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("That image could not be read. Try a different photo.");
  });
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not resize the photo.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.86);
}
