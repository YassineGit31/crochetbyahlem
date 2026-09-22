import { Hero } from "@/components/home/Hero";
import { TrustBadges } from "@/components/home/TrustBadges";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CustomCta } from "@/components/home/CustomCta";
import { CategoriesShowcase } from "@/components/home/CategoriesShowcase";
import { HowItWorks } from "@/components/home/HowItWorks";
import { InstagramSection } from "@/components/home/InstagramSection";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { Faq } from "@/components/home/Faq";
import { getFeaturedProducts } from "@/services/products";
import { getCategories } from "@/services/categories";
import { getSettings } from "@/services/settings";

export default async function HomePage() {
  const [products, categories, settings] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getSettings(),
  ]);

  return (
    <>
      <Hero />
      <TrustBadges />
      <FeaturedProducts products={products} />
      <CustomCta />
      <CategoriesShowcase categories={categories} />
      <HowItWorks />
      <InstagramSection username={settings.instagram_username} />
      <AboutTeaser />
      <Faq />
    </>
  );
}
