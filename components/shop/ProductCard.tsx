"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { formatDZD, cn } from "@/lib/utils";
import { useFavoritesStore } from "@/hooks/useFavorites";
import { useHasMounted } from "@/hooks/useHasMounted";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const isFavorite = useFavoritesStore((s) => s.isFavorite(product.id));
  const toggle = useFavoritesStore((s) => s.toggle);
  const mounted = useHasMounted();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index, 6) * 0.04 }}
      className="group"
    >
      <Link href={`/creations/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] rounded-[var(--radius-card)] overflow-hidden bg-rose-50">
          <Image
            src={product.main_image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover p-6 transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {product.category && (
            <span className="absolute top-3 left-3 rounded-full bg-ivory/90 px-3 py-1 text-[11px] font-medium text-ink-light">
              {product.category.name}
            </span>
          )}
          <button
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-ivory/90 flex items-center justify-center hover:bg-ivory"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                mounted && isFavorite ? "fill-rose-500 text-rose-500" : "text-ink-light"
              )}
            />
          </button>
          {!product.is_available && (
            <div className="absolute inset-0 bg-ivory/70 flex items-center justify-center">
              <span className="rounded-full bg-ink/80 text-ivory text-xs px-3 py-1.5">
                Indisponible
              </span>
            </div>
          )}
        </div>
        <div className="mt-3 px-0.5">
          <p className="text-[0.95rem] font-medium text-ink truncate">{product.name}</p>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-display text-[1.05rem] text-rose-600">
              {formatDZD(product.price)}
            </span>
            {product.stock_status === "sur_commande" && (
              <span className="text-[11px] text-ink-faint">Sur commande</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
