import { Category } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  listDemoCategories,
  createDemoCategory,
  updateDemoCategory,
  deleteDemoCategory,
} from "@/lib/demo-store";

export async function getCategories(options?: { includeDisabled?: boolean }): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    const all = listDemoCategories();
    return options?.includeDisabled ? all : all.filter((c) => c.is_enabled);
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  let query = supabase.from("categories").select("*").order("sort_order", { ascending: true });
  if (!options?.includeDisabled) query = query.eq("is_enabled", true);
  const { data, error } = await query;
  if (error) {
    console.error("getCategories:", error.message);
    return listDemoCategories();
  }
  return data as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories({ includeDisabled: true });
  return categories.find((c) => c.slug === slug) ?? null;
}

export type CategoryInput = Omit<Category, "id" | "created_at" | "updated_at">;

export async function createCategory(input: CategoryInput): Promise<Category> {
  if (!isSupabaseConfigured()) return createDemoCategory(input);
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data, error } = await supabase.from("categories").insert(input).select("*").single();
  if (error || !data) throw new Error(error?.message ?? "Erreur lors de la création.");
  return data as Category;
}

export async function updateCategory(id: string, input: Partial<CategoryInput>): Promise<void> {
  if (!isSupabaseConfigured()) {
    updateDemoCategory(id, input);
    return;
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    deleteDemoCategory(id);
    return;
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
