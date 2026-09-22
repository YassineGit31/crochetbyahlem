"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Copy, Trash2, Pencil, Star } from "lucide-react";
import { Product } from "@/types";
import { formatDZD, cn } from "@/lib/utils";
import { deleteProduct, duplicateProduct, toggleProductAvailability } from "@/services/products";

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Supprimer définitivement ce produit ?")) return;
    setBusyId(id);
    await deleteProduct(id);
    router.refresh();
    setBusyId(null);
  }

  async function handleDuplicate(id: string) {
    setBusyId(id);
    await duplicateProduct(id);
    router.refresh();
    setBusyId(null);
  }

  async function handleToggle(id: string, next: boolean) {
    setBusyId(id);
    await toggleProductAvailability(id, next);
    router.refresh();
    setBusyId(null);
  }

  return (
    <div className="rounded-2xl border border-rose-100 bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-rose-50/60 text-left text-ink-light">
          <tr>
            <th className="px-4 py-3 font-medium">Produit</th>
            <th className="px-4 py-3 font-medium">Catégorie</th>
            <th className="px-4 py-3 font-medium">Prix</th>
            <th className="px-4 py-3 font-medium">Statut</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rose-100">
          {products.map((p) => (
            <tr key={p.id} className={cn(busyId === p.id && "opacity-50")}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 rounded-lg overflow-hidden bg-rose-50 shrink-0">
                    <Image src={p.main_image_url} alt="" fill className="object-cover p-1" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink truncate flex items-center gap-1.5">
                      {p.name}
                      {p.is_featured && <Star className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />}
                    </p>
                    <p className="text-xs text-ink-faint">{p.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-ink-light">{p.category?.name ?? "—"}</td>
              <td className="px-4 py-3 font-medium text-rose-600">{formatDZD(p.price)}</td>
              <td className="px-4 py-3">
                <button
                  onClick={() => handleToggle(p.id, !p.is_available)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    p.is_available ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"
                  )}
                >
                  {p.is_available ? "Disponible" : "Indisponible"}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1.5">
                  <Link
                    href={`/admin/produits/${p.id}`}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-rose-50 text-ink-light"
                    aria-label="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDuplicate(p.id)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-rose-50 text-ink-light"
                    aria-label="Dupliquer"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-ink-faint">
                Aucun produit pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
