import { Suspense } from "react";
import { Container } from "@/components/ui/primitives";
import { CustomOrderWizard } from "@/components/custom-order/Wizard";

export const metadata = {
  title: "Créer une commande personnalisée",
  description:
    "Envoyez votre inspiration et décrivez votre projet : Ahlem crée des pièces uniques au crochet, pensées spécialement pour vous.",
};

export default function CustomOrderPage() {
  return (
    <Container className="py-12 sm:py-16 max-w-3xl">
      <div className="text-center mb-10">
        <p className="text-sm font-medium text-rose-500 mb-3">✨ Créons quelque chose d&apos;unique</p>
        <h1 className="font-display text-3xl sm:text-4xl text-ink">
          Vous avez une idée ? Montrez-nous ce que vous imaginez.
        </h1>
        <p className="mt-4 text-ink-light leading-relaxed max-w-xl mx-auto">
          Chaque création peut être pensée spécialement pour vous. Envoyez-nous
          votre inspiration et décrivez votre projet.
        </p>
      </div>
      <Suspense fallback={null}>
        <CustomOrderWizard />
      </Suspense>
    </Container>
  );
}
