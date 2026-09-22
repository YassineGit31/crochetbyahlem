import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/services/categories";

export const metadata = { title: "Nouveau produit" };

export default async function NewProductPage() {
  const categories = await getCategories({ includeDisabled: true });
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-ink">Nouveau produit</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
