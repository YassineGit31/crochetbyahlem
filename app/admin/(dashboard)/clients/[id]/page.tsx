import { notFound } from "next/navigation";
import Link from "next/link";
import { getCustomerById } from "@/services/customers";
import { getOrders } from "@/services/orders";
import { getCustomRequests } from "@/services/customRequests";
import { OrderStatusBadge, CustomStatusBadge } from "@/components/admin/primitives";
import { formatDZD, formatDateShort } from "@/lib/utils";

export const metadata = { title: "Profil client" };

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  const [orders, requests] = await Promise.all([getOrders(), getCustomRequests()]);
  const customerOrders = orders.filter((o) => o.customer_phone === customer.phone);
  const customerRequests = requests.filter((r) => r.customer_phone === customer.phone);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">{customer.name}</h1>
        <p className="text-sm text-ink-light mt-1">
          {customer.phone} {customer.wilaya && `· ${customer.wilaya}`}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-rose-100 bg-white p-4">
          <p className="text-xs text-ink-light">Commandes</p>
          <p className="font-display text-xl text-ink mt-1">{customer.orders_count}</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-white p-4">
          <p className="text-xs text-ink-light">Total dépensé</p>
          <p className="font-display text-xl text-ink mt-1">{formatDZD(customer.total_spent)}</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-white p-4">
          <p className="text-xs text-ink-light">Demandes sur-mesure</p>
          <p className="font-display text-xl text-ink mt-1">{customer.custom_requests_count}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-5">
        <h2 className="font-display text-xl text-ink mb-4">Historique des commandes</h2>
        <ul className="divide-y divide-rose-100">
          {customerOrders.map((order) => (
            <li key={order.id} className="py-3 flex items-center justify-between">
              <Link href={`/admin/commandes/${order.id}`} className="text-rose-600 hover:underline font-medium">
                #{order.order_number}
              </Link>
              <span className="text-xs text-ink-faint">{formatDateShort(order.created_at)}</span>
              <span className="font-medium text-ink">{formatDZD(order.total)}</span>
              <OrderStatusBadge status={order.status} />
            </li>
          ))}
          {customerOrders.length === 0 && <p className="text-ink-faint py-4">Aucune commande.</p>}
        </ul>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-5">
        <h2 className="font-display text-xl text-ink mb-4">Demandes personnalisées</h2>
        <ul className="divide-y divide-rose-100">
          {customerRequests.map((r) => (
            <li key={r.id} className="py-3 flex items-center justify-between">
              <Link href={`/admin/demandes/${r.id}`} className="text-rose-600 hover:underline font-medium">
                #{r.request_number}
              </Link>
              <span className="text-xs text-ink-faint">{formatDateShort(r.created_at)}</span>
              <CustomStatusBadge status={r.status} />
            </li>
          ))}
          {customerRequests.length === 0 && <p className="text-ink-faint py-4">Aucune demande.</p>}
        </ul>
      </div>
    </div>
  );
}
