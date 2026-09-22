import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/services/categories";
import { getProductById } from "@/services/products";

export const metadata = { title: "Modifier le produit" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    getCategories({ includeDisabled: true }),
    getProductById(id),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-ink">Modifier « {product.name} »</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
