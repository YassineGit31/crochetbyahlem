"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PersonalOrder, PersonalOrderStatus, PERSONAL_ORDER_STATUS_LABELS } from "@/types";
import { PersonalOrderStatusBadge } from "./primitives";
import { formatDZD, formatDateShort, computeDeadlineDate, daysUntil, cn } from "@/lib/utils";

export function PersonalOrdersTable({ orders }: { orders: PersonalOrder[] }) {
  const [statusFilter, setStatusFilter] = useState<PersonalOrderStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (o) => o.client_name.toLowerCase().includes(q) || o.client_phone.includes(q)
      );
    }
    return list;
  }, [orders, statusFilter, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client, un numéro..."
          className="input sm:max-w-xs"
        />
        <div className="flex gap-2 overflow-x-auto">
          <FilterPill active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
            Toutes
          </FilterPill>
          {(Object.keys(PERSONAL_ORDER_STATUS_LABELS) as PersonalOrderStatus[]).map((s) => (
            <FilterPill key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
              {PERSONAL_ORDER_STATUS_LABELS[s]}
            </FilterPill>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-rose-50/60 text-left text-ink-light">
            <tr>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Payé</th>
              <th className="px-4 py-3 font-medium">Reste</th>
              <th className="px-4 py-3 font-medium">Délai</th>
              <th className="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100">
            {filtered.map((order) => {
              const paid = order.payments.reduce((sum, p) => sum + p.amount, 0);
              const remaining = order.total_amount - paid;
              const deadlineDate = computeDeadlineDate(order.order_date, order.deadline_days);
              const remainingDays = daysUntil(deadlineDate);
              return (
                <tr key={order.id} className="hover:bg-rose-50/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/carnet/${order.id}`}
                      className="font-medium text-rose-600 hover:underline"
                    >
                      {order.client_name}
                    </Link>
                    <p className="text-xs text-ink-faint">{order.client_phone}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-faint text-xs">
                    {formatDateShort(order.order_date)}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{formatDZD(order.total_amount)}</td>
                  <td className="px-4 py-3 text-emerald-700">{formatDZD(paid)}</td>
                  <td className={cn("px-4 py-3 font-medium", remaining > 0 ? "text-rose-600" : "text-ink-faint")}>
                    {formatDZD(remaining)}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {deadlineDate ? (
                      <span
                        className={cn(
                          remainingDays !== null && remainingDays < 0
                            ? "text-red-600 font-medium"
                            : remainingDays !== null && remainingDays <= 2
                              ? "text-amber-600 font-medium"
                              : "text-ink-light"
                        )}
                      >
                        {formatDateShort(deadlineDate.toISOString())}
                        {remainingDays !== null && (
                          <span className="block text-ink-faint">
                            {remainingDays < 0
                              ? `en retard de ${Math.abs(remainingDays)}j`
                              : remainingDays === 0
                                ? "aujourd'hui"
                                : `dans ${remainingDays}j`}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-ink-faint">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <PersonalOrderStatusBadge status={order.status} />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-faint">
                  Aucune commande trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium border transition-colors",
        active
          ? "bg-rose-500 border-rose-500 text-ivory"
          : "bg-white border-rose-200 text-ink-light hover:border-rose-400"
      )}
    >
      {children}
    </button>
  );
}
