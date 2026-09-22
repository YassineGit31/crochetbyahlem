import Link from "next/link";
import { Plus } from "lucide-react";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { getProducts } from "@/services/products";

export const metadata = { title: "Produits" };

export default async function AdminProductsPage() {
  const products = await getProducts({ includeUnavailable: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Produits</h1>
          <p className="text-sm text-ink-light mt-1">{products.length} produit(s)</p>
        </div>
        <Link
          href="/admin/produits/nouveau"
          className="inline-flex items-center gap-2 rounded-full bg-rose-500 text-ivory px-5 py-2.5 text-sm font-medium hover:bg-rose-600"
        >
          <Plus className="h-4 w-4" /> Nouveau produit
        </Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
