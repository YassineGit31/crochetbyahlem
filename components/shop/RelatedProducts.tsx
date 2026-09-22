import { Product } from "@/types";
import { SectionHeading } from "@/components/ui/primitives";
import { ProductCard } from "@/components/shop/ProductCard";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <div className="mt-20 pt-14 border-t border-rose-100">
      <SectionHeading eyebrow="Vous aimerez aussi" title="D'autres créations" className="mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-9">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  );
}
