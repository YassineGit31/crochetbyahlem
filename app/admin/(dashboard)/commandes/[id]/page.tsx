import { notFound } from "next/navigation";
import { OrderDetail } from "@/components/admin/OrderDetail";
import { getOrderById } from "@/services/orders";

export const metadata = { title: "Détail de la commande" };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-ink">Commande #{order.order_number}</h1>
      <OrderDetail order={order} />
    </div>
  );
}
