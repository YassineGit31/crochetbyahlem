"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product, Category } from "@/types";
import { ProductFilters, SortOption } from "./ProductFilters";
import { ProductCard } from "./ProductCard";
import { EmptyState } from "@/components/ui/primitives";

export function ShopView({
  products,
  categories,
  initialCategory,
}: {
  products: Product[];
  categories: Category[];
  initialCategory: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  function updateCategory(slug: string | null) {
    setCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("categorie", slug);
    else params.delete("categorie");
    router.replace(`/creations${params.toString() ? `?${params}` : ""}`, { scroll: false });
  }

  const filtered = useMemo(() => {
    let list = [...products];
    if (category) list = list.filter((p) => p.category?.slug === category);
    if (onlyAvailable) list = list.filter((p) => p.is_available && p.stock_status !== "rupture");
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "featured":
        list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
        break;
      case "newest":
        list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
    }
    return list;
  }, [products, category, search, sort, onlyAvailable]);

  return (
    <div className="space-y-8">
      <ProductFilters
        categories={categories}
        activeCategory={category}
        onCategoryChange={updateCategory}
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
        onlyAvailable={onlyAvailable}
        onOnlyAvailableChange={setOnlyAvailable}
      />

      {filtered.length === 0 ? (
        <EmptyState title="Aucune création trouvée." description="Essayez une autre recherche ou catégorie." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-9">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
