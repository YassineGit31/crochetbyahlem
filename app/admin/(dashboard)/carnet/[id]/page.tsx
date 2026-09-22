import { notFound } from "next/navigation";
import { PersonalOrderForm } from "@/components/admin/PersonalOrderForm";
import { PersonalOrderStatusSelect } from "@/components/admin/PersonalOrderStatusSelect";
import { PersonalOrderDeleteButton } from "@/components/admin/PersonalOrderDeleteButton";
import { Button } from "@/components/ui/Button";
import { getPersonalOrderById } from "@/services/personalOrders";
import { formatDZD, formatDateShort, computeDeadlineDate, daysUntil, cn } from "@/lib/utils";
import {
  updatePersonalOrderAction,
  updatePersonalOrderStatusAction,
  deletePersonalOrderAction,
  addPersonalOrderPaymentAction,
} from "../actions";

export const metadata = { title: "Détail — Mon Carnet" };

export default async function PersonalOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getPersonalOrderById(id);
  if (!order) notFound();

  const paid = order.payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = order.total_amount - paid;
  const deadlineDate = computeDeadlineDate(order.order_date, order.deadline_days);
  const remainingDays = daysUntil(deadlineDate);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="font-display text-2xl text-ink">{order.client_name}</h1>
        <PersonalOrderStatusSelect
          orderId={order.id}
          status={order.status}
          action={updatePersonalOrderStatusAction}
        />
      </div>

      {/* Résumé paiement */}
      <div className="grid grid-cols-3 gap-3">
        <SummaryBox label="Total" value={formatDZD(order.total_amount)} />
        <SummaryBox label="Payé" value={formatDZD(paid)} tone="emerald" />
        <SummaryBox label="Reste" value={formatDZD(remaining)} tone={remaining > 0 ? "rose" : "default"} />
      </div>

      {deadlineDate && (
        <p className="text-sm text-ink-light">
          Délai promis : {order.deadline_days} jour(s) — livraison attendue le{" "}
          <span className="font-medium text-ink">{formatDateShort(deadlineDate.toISOString())}</span>
          {remainingDays !== null && (
            <span
              className={cn(
                "ml-2 text-xs font-medium",
                remainingDays < 0 ? "text-red-600" : remainingDays <= 2 ? "text-amber-600" : "text-ink-faint"
              )}
            >
              {remainingDays < 0
                ? `(en retard de ${Math.abs(remainingDays)} j)`
                : remainingDays === 0
                  ? "(aujourd'hui)"
                  : `(dans ${remainingDays} j)`}
            </span>
          )}
        </p>
      )}

      {/* Paiements */}
      <div className="rounded-2xl border border-rose-100 bg-white p-5 space-y-4">
        <h2 className="font-display text-lg text-ink">Paiements (BaridiMob)</h2>
        {order.payments.length > 0 ? (
          <ul className="divide-y divide-rose-100">
            {order.payments.map((p) => (
              <li key={p.id} className="py-2.5 flex items-center justify-between text-sm">
                <div>
                  <p className="text-ink font-medium">{formatDZD(p.amount)}</p>
                  {p.note && <p className="text-xs text-ink-faint">{p.note}</p>}
                </div>
                <span className="text-xs text-ink-faint">{formatDateShort(p.paid_at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-faint">Aucun paiement enregistré pour l&apos;instant.</p>
        )}

        <form
          action={addPersonalOrderPaymentAction.bind(null, order.id)}
          className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-rose-100"
        >
          <input
            type="number"
            min={0}
            step="1"
            name="amount"
            required
            placeholder="Montant reçu (DA)"
            className="input flex-1"
          />
          <input name="note" placeholder="Note (optionnel)" className="input flex-1" />
          <Button type="submit" variant="secondary" size="sm">
            Ajouter
          </Button>
        </form>
      </div>

      {/* Modifier la commande */}
      <div>
        <h2 className="font-display text-lg text-ink mb-3">Modifier la commande</h2>
        <PersonalOrderForm
          order={order}
          action={updatePersonalOrderAction.bind(null, order.id)}
          submitLabel="Enregistrer les modifications"
        />
      </div>

      <div className="pt-2">
        <PersonalOrderDeleteButton orderId={order.id} action={deletePersonalOrderAction} />
      </div>
    </div>
  );
}

function SummaryBox({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "emerald" | "rose";
}) {
  return (
    <div className="rounded-xl border border-rose-100 bg-white p-4">
      <p className="text-xs text-ink-light">{label}</p>
      <p
        className={cn(
          "mt-1 font-display text-lg",
          tone === "emerald" ? "text-emerald-700" : tone === "rose" ? "text-rose-600" : "text-ink"
        )}
      >
        {value}
      </p>
    </div>
  );
}
