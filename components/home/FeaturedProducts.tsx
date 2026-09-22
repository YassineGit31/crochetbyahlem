import { Container, SectionHeading } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/Button";
import { ProductCard } from "@/components/shop/ProductCard";
import { Product } from "@/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <SectionHeading eyebrow="Sélection" title="Nos créations" />
          <LinkButton href="/creations" variant="secondary" size="sm">
            Voir toutes les créations
          </LinkButton>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-9">
          {products.slice(0, 8).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
