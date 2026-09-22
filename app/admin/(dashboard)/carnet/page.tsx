import { Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { PersonalOrdersTable } from "@/components/admin/PersonalOrdersTable";
import { getPersonalOrders } from "@/services/personalOrders";

export const metadata = { title: "Mon Carnet" };

export default async function PersonalOrdersPage() {
  const orders = await getPersonalOrders();
  const totalDue = orders.reduce((sum, o) => {
    const paid = o.payments.reduce((s, p) => s + p.amount, 0);
    return sum + Math.max(o.total_amount - paid, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Mon Carnet</h1>
          <p className="text-sm text-ink-light mt-1">
            {orders.length} commande(s) — {totalDue > 0 ? `${totalDue.toLocaleString("fr-FR")} DA restant à recevoir au total` : "tout est payé"}
          </p>
        </div>
        <LinkButton href="/admin/carnet/nouveau" className="gap-2">
          <Plus className="h-4 w-4" /> Nouvelle commande
        </LinkButton>
      </div>
      <PersonalOrdersTable orders={orders} />
    </div>
  );
}
