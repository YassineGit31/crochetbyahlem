"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category, Product, StockStatus } from "@/types";
import { slugify } from "@/lib/utils";
import { ImageUploader } from "./ImageUploader";
import { Button } from "@/components/ui/Button";
import { createProduct, updateProduct } from "@/services/products";
import { COMMON_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STOCK_OPTIONS: { value: StockStatus; label: string }[] = [
  { value: "en_stock", label: "En stock" },
  { value: "sur_commande", label: "Sur commande" },
  { value: "rupture", label: "Rupture de stock" },
];

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? "");
  const [images, setImages] = useState<string[]>(
    product ? product.images.map((i) => i.url) : []
  );
  const [colors, setColors] = useState<string[]>(product?.colors ?? []);
  const [sizesText, setSizesText] = useState(product?.sizes.join(", ") ?? "");
  const [stockStatus, setStockStatus] = useState<StockStatus>(product?.stock_status ?? "en_stock");
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isCustomizable, setIsCustomizable] = useState(product?.is_customizable ?? true);
  const [productionDays, setProductionDays] = useState(
    product?.production_time_days?.toString() ?? "7"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleColor(color: string) {
    setColors((c) => (c.includes(color) ? c.filter((x) => x !== color) : [...c, color]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !price || images.length === 0) {
      setError("Le nom, le prix et au moins une image sont requis.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        slug: slug || slugify(name),
        name,
        description,
        price: Number(price),
        category_id: categoryId || null,
        main_image_url: images[0],
        imageUrls: images,
        colors,
        sizes: sizesText.split(",").map((s) => s.trim()).filter(Boolean),
        stock_status: stockStatus,
        is_available: isAvailable,
        is_featured: isFeatured,
        is_customizable: isCustomizable,
        production_time_days: Number(productionDays) || 7,
        sort_order: product?.sort_order ?? 999,
      };
      if (product) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      router.push("/admin/produits");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-rose-100 bg-white p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Nom du produit *</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              className="input"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Slug (URL)</label>
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className="input"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="input resize-none"
          />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Prix (DA) *</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Catégorie</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input">
              <option value="">Aucune</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Délai (jours)</label>
            <input
              type="number"
              min={1}
              value={productionDays}
              onChange={(e) => setProductionDays(e.target.value)}
              className="input"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-5">
        <label className="text-sm font-medium text-ink mb-2 block">Images du produit *</label>
        <ImageUploader images={images} onChange={setImages} max={6} />
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink mb-2 block">Couleurs disponibles</label>
          <div className="flex flex-wrap gap-2">
            {COMMON_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleColor(c)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm",
                  colors.includes(c) ? "border-rose-500 bg-rose-50 text-rose-700" : "border-rose-200 text-ink-light"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">
            Tailles disponibles (séparées par des virgules)
          </label>
          <input
            value={sizesText}
            onChange={(e) => setSizesText(e.target.value)}
            placeholder="Petit, Moyen, Grand"
            className="input"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Statut du stock</label>
          <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value as StockStatus)} className="input">
            {STOCK_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-5 space-y-3">
        <Toggle label="Disponible sur la boutique" checked={isAvailable} onChange={setIsAvailable} />
        <Toggle label="Mettre en vedette sur l'accueil" checked={isFeatured} onChange={setIsFeatured} />
        <Toggle label="Personnalisable (couleurs/note client)" checked={isCustomizable} onChange={setIsCustomizable} />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Enregistrement..." : product ? "Enregistrer les modifications" : "Créer le produit"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/produits")}>
          Annuler
        </Button>
      </div>
    </form>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-ink">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-rose-500" : "bg-rose-100"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            checked && "translate-x-5"
          )}
        />
      </button>
    </label>
  );
}
