"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Order, OrderStatus, ORDER_STATUS_LABELS } from "@/types";
import { OrderStatusBadge } from "./primitives";
import { formatDZD, formatDate } from "@/lib/utils";
import { updateOrderStatus } from "@/services/orders-client";
import { Button } from "@/components/ui/Button";

const STATUS_ORDER: OrderStatus[] = [
  "nouvelle",
  "confirmee",
  "en_preparation",
  "prete",
  "expediee",
  "livree",
  "annulee",
];

export function OrderDetail({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleStatusChange(newStatus: OrderStatus) {
    setSaving(true);
    setStatus(newStatus);
    await updateOrderStatus(order.id, newStatus, note || undefined);
    setNote("");
    router.refresh();
    setSaving(false);
  }

  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
      <div className="space-y-6">
        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl text-ink">Articles commandés</h2>
            <OrderStatusBadge status={status} />
          </div>
          <ul className="space-y-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex gap-3">
                {item.product_image && (
                  <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-rose-50">
                    <Image src={item.product_image} alt={item.product_name} fill className="object-cover p-1.5" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink">
                    {item.quantity}x {item.product_name}
                  </p>
                  {(item.options.color || item.options.size || item.options.note) && (
                    <p className="text-xs text-ink-light mt-0.5">
                      {[item.options.color, item.options.size].filter(Boolean).join(" · ")}
                      {item.options.note && <span className="block italic mt-0.5">« {item.options.note} »</span>}
                    </p>
                  )}
                </div>
                <span className="text-sm font-semibold text-rose-600">{formatDZD(item.line_total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-rose-100 space-y-1.5 text-sm">
            <div className="flex justify-between text-ink-light">
              <span>Sous-total</span>
              <span>{formatDZD(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-light">
              <span>Livraison</span>
              <span>{order.delivery_fee === 0 ? "Gratuite" : formatDZD(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between font-semibold text-ink pt-1.5 border-t border-rose-100">
              <span>Total</span>
              <span className="text-rose-600">{formatDZD(order.total)}</span>
            </div>
          </div>
          {order.notes && (
            <div className="mt-4 rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-ink-light">
              <span className="font-medium text-ink">Note client : </span>
              {order.notes}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <h2 className="font-display text-xl text-ink mb-4">Client & livraison</h2>
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            <Info label="Nom" value={order.customer_name} />
            <Info label="Téléphone" value={order.customer_phone} />
            <Info label="Wilaya" value={order.wilaya} />
            <Info label="Commune" value={order.commune} />
            <Info label="Adresse" value={order.address} className="sm:col-span-2" />
            {order.delivery_instructions && (
              <Info label="Indications" value={order.delivery_instructions} className="sm:col-span-2" />
            )}
          </dl>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <h2 className="font-display text-xl text-ink mb-4">Statut de la commande</h2>
          <div className="space-y-2">
            {STATUS_ORDER.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={saving || s === status}
                className={`w-full text-left rounded-xl px-4 py-2.5 text-sm border transition-colors ${
                  s === status
                    ? "border-rose-500 bg-rose-50 text-rose-700 font-medium"
                    : "border-rose-100 text-ink-light hover:border-rose-300"
                }`}
              >
                {ORDER_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note interne pour ce changement de statut (optionnel)"
            rows={2}
            className="input mt-4 resize-none"
          />
        </div>

        {order.status_history && order.status_history.length > 0 && (
          <div className="rounded-2xl border border-rose-100 bg-white p-5">
            <h2 className="font-display text-lg text-ink mb-4">Historique</h2>
            <ul className="space-y-3">
              {order.status_history
                .slice()
                .reverse()
                .map((entry) => (
                  <li key={entry.id} className="text-sm">
                    <p className="text-ink">{ORDER_STATUS_LABELS[entry.status]}</p>
                    <p className="text-xs text-ink-faint">{formatDate(entry.created_at)}</p>
                    {entry.note && <p className="text-xs text-ink-light italic mt-0.5">{entry.note}</p>}
                  </li>
                ))}
            </ul>
          </div>
        )}

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => router.push("/admin/commandes")}
        >
          Retour aux commandes
        </Button>
      </div>
    </div>
  );
}

function Info({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-ink-faint text-xs">{label}</dt>
      <dd className="text-ink mt-0.5">{value}</dd>
    </div>
  );
}
