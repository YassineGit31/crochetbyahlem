import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { getCategories } from "@/services/categories";

export const metadata = { title: "Catégories" };

export default async function AdminCategoriesPage() {
  const categories = await getCategories({ includeDisabled: true });
  return <CategoriesManager categories={categories} />;
}
