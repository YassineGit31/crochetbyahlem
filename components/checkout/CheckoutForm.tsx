"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";
import { useHasMounted } from "@/hooks/useHasMounted";
import { DeliveryZone, StoreSettings } from "@/types";
import { WILAYAS } from "@/lib/constants";
import { formatDZD } from "@/lib/utils";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/primitives";

export function CheckoutForm({
  deliveryZones,
  settings,
}: {
  deliveryZones: DeliveryZone[];
  settings: StoreSettings;
}) {
  const router = useRouter();
  const mounted = useHasMounted();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = mounted ? cartSubtotal(items) : 0;
  const zone = useMemo(
    () => deliveryZones.find((z) => z.wilaya.toLowerCase() === wilaya.toLowerCase()),
    [deliveryZones, wilaya]
  );
  const freeDelivery = Boolean(
    settings.free_delivery_threshold && subtotal >= settings.free_delivery_threshold
  );
  const deliveryFee = wilaya ? (freeDelivery ? 0 : zone?.fee ?? null) : null;
  const total = subtotal + (deliveryFee ?? 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          wilaya,
          commune,
          address,
          deliveryInstructions: deliveryInstructions || undefined,
          notes: notes || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            options: i.options,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue, réessayez.");
        setSubmitting(false);
        return;
      }
      clear();
      router.push(`/commande/confirmation/${data.orderNumber}`);
    } catch {
      setError("Impossible d'envoyer votre commande. Vérifiez votre connexion.");
      setSubmitting(false);
    }
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <EmptyState
        title="Votre panier est encore vide 💗"
        description="Découvrez nos créations et ajoutez vos coups de cœur avant de passer commande."
        action={<LinkButton href="/creations">Voir les créations</LinkButton>}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1.2fr_1fr] gap-10">
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-xl text-ink mb-4">Informations personnelles</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nom complet" required>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input"
                placeholder="Sarah Bendaoud"
              />
            </Field>
            <Field label="Téléphone" required>
              <input
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="input"
                placeholder="0551223344"
              />
            </Field>
            <Field label="Wilaya" required>
              <select
                required
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                className="input"
              >
                <option value="">Sélectionnez votre wilaya</option>
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Commune" required>
              <input
                required
                value={commune}
                onChange={(e) => setCommune(e.target.value)}
                className="input"
                placeholder="Es Senia"
              />
            </Field>
          </div>
          <Field label="Adresse complète" required className="mt-4">
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input"
              placeholder="12 rue des Oliviers"
            />
          </Field>
          <Field label="Indications de livraison (optionnel)" className="mt-4">
            <input
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              className="input"
              placeholder="Étage, point de repère, horaires..."
            />
          </Field>
        </div>

        <div>
          <h2 className="font-display text-xl text-ink mb-4">Notes additionnelles</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="input resize-none"
            placeholder="Une précision sur votre commande ?"
          />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}
      </div>

      <div className="rounded-[var(--radius-card)] bg-ivory border border-rose-100 p-6 h-fit sticky top-24">
        <h2 className="font-display text-xl text-ink mb-4">Récapitulatif</h2>
        <ul className="space-y-4 max-h-72 overflow-y-auto pr-1">
          {items.map((item) => (
            <li key={item.id} className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-rose-50">
                <Image src={item.image} alt={item.name} fill className="object-cover p-1.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">
                  {item.quantity}x {item.name}
                </p>
                {(item.options.color || item.options.size) && (
                  <p className="text-xs text-ink-light">
                    {[item.options.color, item.options.size].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
              <span className="text-sm font-semibold text-rose-600 shrink-0">
                {formatDZD(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 pt-5 border-t border-rose-100 space-y-2 text-sm">
          <div className="flex justify-between text-ink-light">
            <span>Sous-total</span>
            <span className="text-ink">{formatDZD(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-light">
            <span>Livraison</span>
            <span className="text-ink">
              {!wilaya
                ? "Sélectionnez une wilaya"
                : deliveryFee === null
                ? "Non disponible, nous vous contacterons"
                : deliveryFee === 0
                ? "Gratuite"
                : formatDZD(deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between text-base font-semibold pt-2 border-t border-rose-100">
            <span>Total</span>
            <span className="text-rose-600">{formatDZD(total)}</span>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full mt-6" disabled={submitting}>
          {submitting ? "Envoi en cours..." : "Confirmer ma commande"}
        </Button>
        <p className="mt-3 text-xs text-ink-faint text-center">
          Nous vous contacterons pour confirmer votre commande et les détails de livraison.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="text-sm font-medium text-ink mb-1.5 block">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}
