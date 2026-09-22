"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Clock, Sparkles } from "lucide-react";
import { Product, StockStatus } from "@/types";
import { formatDZD, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/primitives";
import { Button, LinkButton } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cart";

const STOCK_LABELS: Record<StockStatus, { label: string; tone: "sage" | "gold" | "ink" }> = {
  en_stock: { label: "En stock", tone: "sage" },
  sur_commande: { label: "Sur commande", tone: "gold" },
  rupture: { label: "Rupture de stock", tone: "ink" },
};

export function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [color, setColor] = useState<string | undefined>(product.colors[0]);
  const [size, setSize] = useState<string | undefined>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [justAdded, setJustAdded] = useState(false);

  const stock = STOCK_LABELS[product.stock_status];
  const disabled = !product.is_available || product.stock_status === "rupture";

  function handleAdd(goToCheckout: boolean) {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.main_image_url,
      unitPrice: product.price,
      quantity,
      options: { color, size, note: note.trim() || undefined },
    });
    if (goToCheckout) {
      router.push("/commande");
    } else {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  }

  return (
    <div>
      {product.category && (
        <Badge tone="rose" className="mb-3">
          {product.category.name}
        </Badge>
      )}
      <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">{product.name}</h1>
      <div className="mt-3 flex items-center gap-3">
        <span className="font-display text-2xl text-rose-600">{formatDZD(product.price)}</span>
        <Badge tone={stock.tone}>{stock.label}</Badge>
      </div>

      <p className="mt-5 text-ink-light leading-relaxed">{product.description}</p>

      <div className="mt-5 flex items-center gap-2 text-sm text-ink-light">
        <Clock className="h-4 w-4 text-rose-400" />
        Délai de préparation estimé : environ {product.production_time_days} jours
      </div>

      {product.colors.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-ink mb-2">Couleur</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  color === c
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-rose-200 text-ink-light hover:border-rose-400"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-medium text-ink mb-2">Taille</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  size === s
                    ? "border-rose-500 bg-rose-50 text-rose-700"
                    : "border-rose-200 text-ink-light hover:border-rose-400"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm font-medium text-ink mb-2">Quantité</p>
        <div className="inline-flex items-center gap-3 border border-rose-200 rounded-full px-2 py-1">
          <button
            aria-label="Diminuer"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-9 w-9 flex items-center justify-center text-ink-light hover:text-rose-500"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center">{quantity}</span>
          <button
            aria-label="Augmenter"
            onClick={() => setQuantity((q) => q + 1)}
            className="h-9 w-9 flex items-center justify-center text-ink-light hover:text-rose-500"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {product.is_customizable && (
        <div className="mt-6">
          <label className="text-sm font-medium text-ink mb-2 block">Une demande particulière ?</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Précisez ici toute demande particulière pour cette création..."
            className="w-full rounded-2xl border border-rose-200 bg-ivory px-4 py-3 text-sm focus:border-rose-400 focus:outline-none resize-none"
          />
        </div>
      )}

      <div className="mt-7 flex flex-col sm:flex-row gap-3">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1"
          disabled={disabled}
          onClick={() => handleAdd(false)}
        >
          {justAdded ? "Ajouté ✓" : "Ajouter au panier"}
        </Button>
        <Button size="lg" className="flex-1" disabled={disabled} onClick={() => handleAdd(true)}>
          Commander
        </Button>
      </div>

      {product.is_customizable && (
        <LinkButton
          href={`/personnalise?inspiration=${encodeURIComponent(product.name)}`}
          variant="ghost"
          size="sm"
          className="mt-4 w-full justify-center gap-2"
        >
          <Sparkles className="h-4 w-4" /> Demander une personnalisation
        </LinkButton>
      )}
    </div>
  );
}
