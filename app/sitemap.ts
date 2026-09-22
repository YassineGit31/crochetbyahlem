import type { MetadataRoute } from "next";
import { getProducts } from "@/services/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://crochetbyahlem.example";
  const products = await getProducts();

  const staticRoutes = ["", "/creations", "/personnalise", "/a-propos", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/creations/${p.slug}`,
    lastModified: p.updated_at,
  }));

  return [...staticRoutes, ...productRoutes];
}
