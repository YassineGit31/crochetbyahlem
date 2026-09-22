import { Suspense } from "react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { ShopView } from "@/components/shop/ShopView";
import { getProducts } from "@/services/products";
import { getCategories } from "@/services/categories";

export const metadata = {
  title: "Nos créations",
  description: "Découvrez toutes les créations au crochet de Crochet by Ahlem : amigurumis, bouquets, accessoires, décoration et plus encore.",
};

export default async function CreationsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading eyebrow="Boutique" title="Nos créations" className="mb-10" />
      <Suspense fallback={null}>
        <ShopView
          products={products}
          categories={categories}
          initialCategory={categorie ?? null}
        />
      </Suspense>
    </Container>
  );
}
