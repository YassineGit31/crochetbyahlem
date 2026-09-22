import Image from "next/image";
import { Container } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/Button";

export function AboutTeaser() {
  return (
    <section className="py-20 sm:py-24">
      <Container className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-[4/3] rounded-[var(--radius-card)] bg-rose-100 overflow-hidden order-2 md:order-1">
          <Image src="/demo/plante-crochet.svg" alt="" fill className="object-cover p-10" />
        </div>
        <div className="order-1 md:order-2">
          <p className="text-sm font-medium text-rose-500 mb-3">Notre histoire</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink">Fait main avec amour 💗</h2>
          <p className="mt-4 text-ink-light leading-relaxed">
            Crochet by Ahlem est né d&apos;une passion pour le fil et la patience
            du travail fait main. Chaque pièce est pensée, dessinée puis
            tissée à la main, maille après maille, avec le souci du détail
            qu&apos;on retrouve rarement en série.
          </p>
          <p className="mt-3 text-ink-light leading-relaxed">
            Aujourd&apos;hui, Ahlem crée pour celles et ceux qui cherchent un
            objet unique, un cadeau qui a du sens, ou une création pensée
            spécialement pour un moment précis de leur vie.
          </p>
          <div className="mt-7">
            <LinkButton href="/a-propos" variant="secondary">
              En savoir plus
            </LinkButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
