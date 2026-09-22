"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Order, OrderStatus, ORDER_STATUS_LABELS } from "@/types";
import { OrderStatusBadge } from "./primitives";
import { formatDZD, formatDateShort, cn } from "@/lib/utils";

export function OrdersTable({ orders }: { orders: Order[] }) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== "all") list = list.filter((o) => o.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.includes(q)
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
          {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
            <FilterPill key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
              {ORDER_STATUS_LABELS[s]}
            </FilterPill>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-rose-50/60 text-left text-ink-light">
            <tr>
              <th className="px-4 py-3 font-medium">Commande</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Wilaya</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-rose-50/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/commandes/${order.id}`} className="font-medium text-rose-600 hover:underline">
                    #{order.order_number}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <p className="text-ink">{order.customer_name}</p>
                  <p className="text-xs text-ink-faint">{order.customer_phone}</p>
                </td>
                <td className="px-4 py-3 text-ink-light">{order.wilaya}</td>
                <td className="px-4 py-3 font-medium text-ink">{formatDZD(order.total)}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-ink-faint text-xs">{formatDateShort(order.created_at)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-faint">
                  Aucune commande.
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
        "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border",
        active ? "bg-rose-500 border-rose-500 text-ivory" : "bg-white border-rose-200 text-ink-light"
      )}
    >
      {children}
    </button>
  );
}
