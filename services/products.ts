import { Product } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  listDemoProducts,
  findDemoProductById,
  createDemoProduct,
  updateDemoProduct,
  deleteDemoProduct,
  duplicateDemoProduct,
} from "@/lib/demo-store";

type SupaProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category_id: string | null;
  main_image_url: string;
  colors: string[] | null;
  sizes: string[] | null;
  stock_status: Product["stock_status"];
  is_available: boolean;
  is_featured: boolean;
  is_customizable: boolean;
  production_time_days: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  product_images?: { id: string; url: string; sort_order: number; alt_text: string | null }[];
  product_variants?: {
    id: string;
    label: string;
    price_delta: number;
    stock_quantity: number | null;
    is_available: boolean;
  }[];
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    sort_order: number;
    is_enabled: boolean;
    created_at: string;
    updated_at: string;
  } | null;
};

function mapRow(row: SupaProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    category_id: row.category_id,
    category: row.category ?? null,
    main_image_url: row.main_image_url,
    images: (row.product_images ?? []).map((img) => ({ ...img, product_id: row.id })),
    colors: row.colors ?? [],
    sizes: row.sizes ?? [],
    variants: (row.product_variants ?? []).map((v) => ({ ...v, product_id: row.id })),
    stock_status: row.stock_status,
    is_available: row.is_available,
    is_featured: row.is_featured,
    is_customizable: row.is_customizable,
    production_time_days: row.production_time_days,
    sort_order: row.sort_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

const SELECT = `*, product_images(*), product_variants(*), category:categories(*)`;

export async function getProducts(options?: {
  categorySlug?: string;
  includeUnavailable?: boolean;
}): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    let list = listDemoProducts();
    if (!options?.includeUnavailable) list = list.filter((p) => p.is_available);
    if (options?.categorySlug) {
      list = list.filter((p) => p.category?.slug === options.categorySlug);
    }
    return list;
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  let query = supabase.from("products").select(SELECT).order("sort_order", { ascending: true });
  if (!options?.includeUnavailable) query = query.eq("is_available", true);
  const { data, error } = await query;
  if (error) {
    console.error("getProducts:", error.message);
    return listDemoProducts();
  }
  let products = (data as unknown as SupaProductRow[]).map(mapRow);
  if (options?.categorySlug) {
    products = products.filter((p) => p.category?.slug === options.categorySlug);
  }
  return products;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.is_featured);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return listDemoProducts().find((p) => p.slug === slug) ?? null;
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data, error } = await supabase.from("products").select(SELECT).eq("slug", slug).single();
  if (error || !data) return null;
  return mapRow(data as unknown as SupaProductRow);
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return findDemoProductById(id);
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data, error } = await supabase.from("products").select(SELECT).eq("id", id).single();
  if (error || !data) return null;
  return mapRow(data as unknown as SupaProductRow);
}

// ---------------------------------------------------------------------------
// Admin mutations
// ---------------------------------------------------------------------------

export type ProductInput = Omit<
  Product,
  "id" | "created_at" | "updated_at" | "images" | "variants" | "category"
> & { imageUrls: string[] };

export async function createProduct(input: ProductInput): Promise<Product> {
  if (!isSupabaseConfigured()) {
    return createDemoProduct({
      ...input,
      images: input.imageUrls.map((url, i) => ({ id: crypto.randomUUID(), product_id: "", url, sort_order: i, alt_text: null })),
      variants: [],
      category: null,
    });
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      slug: input.slug,
      name: input.name,
      description: input.description,
      price: input.price,
      category_id: input.category_id,
      main_image_url: input.main_image_url,
      colors: input.colors,
      sizes: input.sizes,
      stock_status: input.stock_status,
      is_available: input.is_available,
      is_featured: input.is_featured,
      is_customizable: input.is_customizable,
      production_time_days: input.production_time_days,
      sort_order: input.sort_order,
    })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Erreur lors de la création du produit.");
  if (input.imageUrls.length > 0) {
    await supabase.from("product_images").insert(
      input.imageUrls.map((url, i) => ({ product_id: data.id, url, sort_order: i }))
    );
  }
  const created = await getProductById(data.id);
  if (!created) throw new Error("Produit créé mais introuvable.");
  return created;
}

export async function updateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  if (!isSupabaseConfigured()) {
    const { imageUrls, ...rest } = input;
    updateDemoProduct(id, {
      ...rest,
      ...(imageUrls
        ? { images: imageUrls.map((url, i) => ({ id: crypto.randomUUID(), product_id: id, url, sort_order: i, alt_text: null })) }
        : {}),
    });
    return;
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { imageUrls, ...rest } = input;
  const { error } = await supabase
    .from("products")
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  if (imageUrls) {
    await supabase.from("product_images").delete().eq("product_id", id);
    if (imageUrls.length > 0) {
      await supabase
        .from("product_images")
        .insert(imageUrls.map((url, i) => ({ product_id: id, url, sort_order: i })));
    }
  }
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    deleteDemoProduct(id);
    return;
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function duplicateProduct(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return duplicateDemoProduct(id);
  }
  const original = await getProductById(id);
  if (!original) return null;
  return createProduct({
    slug: `${original.slug}-copie-${Math.random().toString(36).slice(2, 6)}`,
    name: `${original.name} (copie)`,
    description: original.description,
    price: original.price,
    category_id: original.category_id,
    main_image_url: original.main_image_url,
    imageUrls: original.images.map((i) => i.url),
    colors: original.colors,
    sizes: original.sizes,
    stock_status: original.stock_status,
    is_available: original.is_available,
    is_featured: false,
    is_customizable: original.is_customizable,
    production_time_days: original.production_time_days,
    sort_order: original.sort_order,
  });
}

export async function toggleProductAvailability(id: string, isAvailable: boolean): Promise<void> {
  await updateProduct(id, { is_available: isAvailable });
}
