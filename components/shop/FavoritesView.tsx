"use client";

import { Product } from "@/types";
import { useFavoritesStore } from "@/hooks/useFavorites";
import { useHasMounted } from "@/hooks/useHasMounted";
import { ProductCard } from "@/components/shop/ProductCard";
import { EmptyState } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/Button";

export function FavoritesView({ products }: { products: Product[] }) {
  const ids = useFavoritesStore((s) => s.ids);
  const mounted = useHasMounted();

  if (!mounted) return null;

  const favorites = products.filter((p) => ids.includes(p.id));

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="Aucun favori pour le moment 💗"
        description="Ajoutez des créations à vos favoris en cliquant sur le cœur."
        action={<LinkButton href="/creations">Voir les créations</LinkButton>}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-9">
      {favorites.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
