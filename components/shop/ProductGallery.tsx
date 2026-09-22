"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Product } from "@/types";

export function ProductGallery({ product }: { product: Product }) {
  const images =
    product.images.length > 0
      ? product.images.map((i) => i.url)
      : [product.main_image_url];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square rounded-[var(--radius-card)] overflow-hidden bg-rose-50">
        <Image
          src={images[active]}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover p-10"
        />
        {!product.is_available && (
          <div className="absolute top-4 left-4 rounded-full bg-ink/80 text-ivory text-xs px-3 py-1.5">
            Indisponible
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 rounded-xl overflow-hidden bg-rose-50 border-2",
                active === i ? "border-rose-500" : "border-transparent"
              )}
            >
              <Image src={src} alt="" fill className="object-cover p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
