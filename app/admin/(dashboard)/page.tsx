import Link from "next/link";
import { StatCard, OrderStatusBadge, CustomStatusBadge } from "@/components/admin/primitives";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { getOrders } from "@/services/orders";
import { getCustomRequests } from "@/services/customRequests";
import { formatDZD, formatDateShort } from "@/lib/utils";

export const metadata = { title: "Tableau de bord" };

export default async function AdminDashboardPage() {
  const [orders, requests] = await Promise.all([getOrders(), getCustomRequests()]);

  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.status === "nouvelle").length;
  const inProgress = orders.filter((o) => ["confirmee", "en_preparation", "prete", "expediee"].includes(o.status)).length;
  const completed = orders.filter((o) => o.status === "livree").length;
  const cancelled = orders.filter((o) => o.status === "annulee").length;
  const revenue = orders.filter((o) => o.status !== "annulee").reduce((s, o) => s + o.total, 0);

  const recentOrders = orders.slice(0, 5);
  const recentRequests = requests.slice(0, 4);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Tableau de bord</h1>
        <p className="text-sm text-ink-light mt-1">Vue d&apos;ensemble de votre activité.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Commandes" value={totalOrders} />
        <StatCard label="Nouvelles" value={newOrders} tone="rose" />
        <StatCard label="En cours" value={inProgress} />
        <StatCard label="Livrées" value={completed} />
        <StatCard label="Annulées" value={cancelled} />
        <StatCard label="Revenu total" value={formatDZD(revenue)} />
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-5">
        <p className="text-sm font-medium text-ink mb-3">Revenu des 14 derniers jours</p>
        <RevenueChart orders={orders} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium text-ink">Commandes récentes</p>
            <Link href="/admin/commandes" className="text-sm text-rose-500 hover:underline">
              Tout voir
            </Link>
          </div>
          <ul className="space-y-3">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/commandes/${order.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-rose-50"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">#{order.order_number}</p>
                    <p className="text-xs text-ink-light">
                      {order.customer_name} · {formatDateShort(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-rose-600">{formatDZD(order.total)}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </Link>
              </li>
            ))}
            {recentOrders.length === 0 && <p className="text-sm text-ink-faint">Aucune commande.</p>}
          </ul>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium text-ink">Demandes personnalisées récentes</p>
            <Link href="/admin/demandes" className="text-sm text-rose-500 hover:underline">
              Tout voir
            </Link>
          </div>
          <ul className="space-y-3">
            {recentRequests.map((request) => (
              <li key={request.id}>
                <Link
                  href={`/admin/demandes/${request.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 hover:bg-rose-50"
                >
                  <div>
                    <p className="text-sm font-medium text-ink">#{request.request_number}</p>
                    <p className="text-xs text-ink-light">
                      {request.customer_name} · {formatDateShort(request.created_at)}
                    </p>
                  </div>
                  <CustomStatusBadge status={request.status} />
                </Link>
              </li>
            ))}
            {recentRequests.length === 0 && <p className="text-sm text-ink-faint">Aucune demande.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
