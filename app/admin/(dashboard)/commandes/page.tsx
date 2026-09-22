import { OrdersTable } from "@/components/admin/OrdersTable";
import { getOrders } from "@/services/orders";

export const metadata = { title: "Commandes" };

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Commandes</h1>
        <p className="text-sm text-ink-light mt-1">{orders.length} commande(s)</p>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
