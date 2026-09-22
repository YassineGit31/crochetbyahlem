"use client";

import { Search } from "lucide-react";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc";

interface ProductFiltersProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
  search: string;
  onSearchChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  onlyAvailable: boolean;
  onOnlyAvailableChange: (value: boolean) => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  featured: "En vedette",
  newest: "Nouveautés",
  "price-asc": "Prix croissant",
  "price-desc": "Prix décroissant",
};

export function ProductFilters({
  categories,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
  sort,
  onSortChange,
  onlyAvailable,
  onOnlyAvailableChange,
}: ProductFiltersProps) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher une création..."
            className="w-full rounded-full border border-rose-200 bg-ivory pl-10 pr-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-ink-light">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => onOnlyAvailableChange(e.target.checked)}
              className="h-4 w-4 rounded accent-rose-500"
            />
            Disponibles uniquement
          </label>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-full border border-rose-200 bg-ivory px-4 py-2.5 text-sm focus:border-rose-400 focus:outline-none"
          >
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => onCategoryChange(null)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition-colors",
            activeCategory === null
              ? "bg-rose-500 border-rose-500 text-ivory"
              : "bg-ivory border-rose-200 text-ink-light hover:border-rose-400"
          )}
        >
          Tout
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.slug)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition-colors",
              activeCategory === cat.slug
                ? "bg-rose-500 border-rose-500 text-ivory"
                : "bg-ivory border-rose-200 text-ink-light hover:border-rose-400"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
