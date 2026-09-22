import Image from "next/image";
import { Container } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/Button";

export function CustomCta() {
  return (
    <section className="py-4">
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-rose-500 px-8 py-14 sm:px-16 sm:py-16 text-center">
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-rose-400/50" />
          <div className="absolute -bottom-14 -right-10 h-52 w-52 rounded-full bg-rose-600/40" />
          <div className="relative max-w-xl mx-auto">
            <Image
              src="/demo/cadeau-etoile.svg"
              alt=""
              width={64}
              height={64}
              className="mx-auto mb-5 rounded-2xl"
            />
            <h2 className="font-display text-3xl sm:text-4xl text-ivory">
              Votre idée. Notre crochet.
            </h2>
            <p className="mt-4 text-rose-50 leading-relaxed">
              Une idée en tête ? Envoyez-nous votre inspiration et racontez-nous
              votre idée. Ahlem créera quelque chose spécialement pour vous.
            </p>
            <div className="mt-8">
              <LinkButton href="/personnalise" variant="secondary" size="lg">
                Créer ma commande personnalisée
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
