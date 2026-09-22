import { Container, SectionHeading } from "@/components/ui/primitives";
import { FavoritesView } from "@/components/shop/FavoritesView";
import { getProducts } from "@/services/products";

export const metadata = { title: "Mes favoris" };

export default async function FavoritesPage() {
  const products = await getProducts();
  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading eyebrow="Coups de cœur" title="Mes favoris" className="mb-10" />
      <FavoritesView products={products} />
    </Container>
  );
}
