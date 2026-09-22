import Link from "next/link";
import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Category } from "@/types";

export function CategoriesShowcase({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  return (
    <section className="py-20 sm:py-24 bg-ivory">
      <Container>
        <SectionHeading eyebrow="Univers" title="Explorez par catégorie" className="mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/creations?categorie=${cat.slug}`}
              className="group relative aspect-square rounded-[var(--radius-card)] bg-rose-50 overflow-hidden flex items-end"
            >
              {cat.image_url && (
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  className="object-cover p-8 transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="relative z-10 w-full p-4 bg-gradient-to-t from-ink/50 to-transparent">
                <span className="text-ivory font-medium">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
