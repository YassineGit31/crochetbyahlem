import Link from "next/link";
import { getCustomers } from "@/services/customers";
import { formatDZD, formatDateShort } from "@/lib/utils";

export const metadata = { title: "Clients" };

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Clients</h1>
        <p className="text-sm text-ink-light mt-1">{customers.length} client(s)</p>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-rose-50/60 text-left text-ink-light">
            <tr>
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Téléphone</th>
              <th className="px-4 py-3 font-medium">Wilaya</th>
              <th className="px-4 py-3 font-medium">Commandes</th>
              <th className="px-4 py-3 font-medium">Total dépensé</th>
              <th className="px-4 py-3 font-medium">Dernière commande</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-rose-50/40">
                <td className="px-4 py-3">
                  <Link href={`/admin/clients/${c.id}`} className="font-medium text-rose-600 hover:underline">
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-light">{c.phone}</td>
                <td className="px-4 py-3 text-ink-light">{c.wilaya ?? "—"}</td>
                <td className="px-4 py-3 text-ink">
                  {c.orders_count}
                  {c.custom_requests_count > 0 && (
                    <span className="text-xs text-ink-faint"> + {c.custom_requests_count} sur-mesure</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-ink">{formatDZD(c.total_spent)}</td>
                <td className="px-4 py-3 text-ink-faint text-xs">
                  {c.last_order_at ? formatDateShort(c.last_order_at) : "—"}
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-faint">
                  Aucun client pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
