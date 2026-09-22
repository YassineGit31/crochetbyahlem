import { isSupabaseConfigured } from "@/lib/supabase/client";
import { MAX_IMAGE_SIZE_MB } from "@/lib/constants";

/** Downscales + re-encodes an image in the browser before upload, so a 12MB
 *  phone photo doesn't get sent as-is. Falls back to the original file if
 *  canvas encoding fails for any reason. */
export async function compressImage(file: File, maxWidth = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality)
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Ce fichier n'est pas une image.";
  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Cette image est trop grande. Choisissez une image de moins de ${MAX_IMAGE_SIZE_MB} Mo.`;
  }
  return null;
}

/**
 * Uploads inspiration images to the public "custom-request-images" Supabase
 * Storage bucket and returns their public URLs. In demo mode (no Supabase
 * configured) it returns an empty array — the wizard still works end to end
 * with local previews, but no hosted URLs are available for the WhatsApp
 * message yet. See README "Mode démo".
 */
export async function uploadInspirationImages(files: File[]): Promise<string[]> {
  if (!isSupabaseConfigured() || files.length === 0) return [];
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const urls: string[] = [];
  for (const file of files) {
    const compressed = await compressImage(file);
    const path = `${crypto.randomUUID()}-${compressed.name}`;
    const { error } = await supabase.storage
      .from("custom-request-images")
      .upload(path, compressed, { contentType: compressed.type, upsert: false });
    if (error) {
      console.error("upload image:", error.message);
      continue;
    }
    const { data } = supabase.storage.from("custom-request-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}
