"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateImageFile, compressImage } from "@/lib/upload";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function ImageUploader({
  images,
  onChange,
  bucket = "product-images",
  max = 6,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    setError(null);
    const files = Array.from(fileList).slice(0, Math.max(0, max - images.length));
    if (files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];
    for (const file of files) {
      const validation = validateImageFile(file);
      if (validation) {
        setError(validation);
        continue;
      }
      if (isSupabaseConfigured()) {
        const compressed = await compressImage(file);
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const path = `${crypto.randomUUID()}-${compressed.name}`;
        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, compressed, { contentType: compressed.type });
        if (uploadError) {
          setError(uploadError.message);
          continue;
        }
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        newUrls.push(data.publicUrl);
      } else {
        // Demo mode: local object URL preview only (not persisted across reloads).
        newUrls.push(URL.createObjectURL(file));
      }
    }
    onChange([...images, ...newUrls]);
    setUploading(false);
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      {!isSupabaseConfigured() && (
        <p className="mb-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5">
          Mode démo : les images ne sont pas hébergées de façon permanente.
        </p>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((url, i) => (
          <div key={url + i} className="relative aspect-square rounded-xl overflow-hidden bg-rose-50 border border-rose-100">
            <Image src={url} alt="" fill className="object-cover p-1.5" unoptimized={url.startsWith("blob:")} />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-ink/70 text-ivory flex items-center justify-center"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={cn(
              "aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-ink-light hover:border-rose-400 hover:text-rose-500",
              dragOver ? "border-rose-400 bg-rose-50" : "border-rose-200"
            )}
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
            <span className="text-[11px]">Glisser ou cliquer</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
