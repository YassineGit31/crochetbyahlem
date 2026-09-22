import { cn } from "@/lib/utils";
import {
  OrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_EMOJI,
  CustomRequestStatus,
  CUSTOM_STATUS_LABELS,
  PersonalOrderStatus,
  PERSONAL_ORDER_STATUS_LABELS,
  PERSONAL_ORDER_STATUS_EMOJI,
} from "@/types";

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "default" | "rose";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        tone === "rose" ? "bg-rose-500 border-rose-500 text-ivory" : "bg-white border-rose-100"
      )}
    >
      <p className={cn("text-sm", tone === "rose" ? "text-rose-50" : "text-ink-light")}>{label}</p>
      <p className={cn("mt-1.5 font-display text-2xl", tone === "rose" ? "text-ivory" : "text-ink")}>
        {value}
      </p>
      {hint && (
        <p className={cn("mt-1 text-xs", tone === "rose" ? "text-rose-50/80" : "text-ink-faint")}>
          {hint}
        </p>
      )}
    </div>
  );
}

const ORDER_TONES: Record<OrderStatus, string> = {
  nouvelle: "bg-amber-100 text-amber-800",
  confirmee: "bg-blue-100 text-blue-800",
  en_preparation: "bg-purple-100 text-purple-800",
  prete: "bg-emerald-100 text-emerald-800",
  expediee: "bg-sky-100 text-sky-800",
  livree: "bg-green-100 text-green-800",
  annulee: "bg-red-100 text-red-800",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium", ORDER_TONES[status])}>
      {ORDER_STATUS_EMOJI[status]} {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

const CUSTOM_TONES: Record<CustomRequestStatus, string> = {
  nouvelle_demande: "bg-amber-100 text-amber-800",
  en_discussion: "bg-blue-100 text-blue-800",
  devis_envoye: "bg-purple-100 text-purple-800",
  acceptee: "bg-emerald-100 text-emerald-800",
  en_preparation: "bg-sky-100 text-sky-800",
  terminee: "bg-green-100 text-green-800",
  refusee: "bg-red-100 text-red-800",
};

export function CustomStatusBadge({ status }: { status: CustomRequestStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", CUSTOM_TONES[status])}>
      {CUSTOM_STATUS_LABELS[status]}
    </span>
  );
}

const PERSONAL_ORDER_TONES: Record<PersonalOrderStatus, string> = {
  en_cours: "bg-purple-100 text-purple-800",
  termine: "bg-emerald-100 text-emerald-800",
  livre: "bg-green-100 text-green-800",
  annule: "bg-red-100 text-red-800",
};

export function PersonalOrderStatusBadge({ status }: { status: PersonalOrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
        PERSONAL_ORDER_TONES[status]
      )}
    >
      {PERSONAL_ORDER_STATUS_EMOJI[status]} {PERSONAL_ORDER_STATUS_LABELS[status]}
    </span>
  );
}
