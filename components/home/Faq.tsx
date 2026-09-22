"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Combien de temps faut-il pour préparer une commande ?",
    a: "Le délai varie selon la création choisie, généralement entre 3 et 12 jours pour un produit existant. Il est indiqué sur chaque fiche produit.",
  },
  {
    q: "Les commandes personnalisées sont-elles possibles ?",
    a: "Oui, c'est même notre spécialité. Envoyez votre inspiration via la page « Créer une commande personnalisée » et Ahlem vous recontactera pour en discuter.",
  },
  {
    q: "Livrez-vous ?",
    a: "Oui, la livraison est disponible dans plusieurs wilayas. Les frais sont calculés automatiquement selon votre wilaya au moment de la commande.",
  },
  {
    q: "Comment fonctionne une commande personnalisée ?",
    a: "Vous partagez vos inspirations et vos envies (couleurs, taille, occasion, délai). Ahlem étudie votre demande et vous recontacte avec une proposition et un délai réaliste, généralement 20 jours ou plus selon la complexité.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Le paiement se fait à la livraison ou selon les modalités convenues ensemble après confirmation de votre commande sur WhatsApp.",
  },
  {
    q: "Puis-je demander une modification ?",
    a: "Bien sûr, tant que la création n'a pas encore été commencée. Contactez-nous rapidement sur WhatsApp pour toute modification.",
  },
  {
    q: "Puis-je choisir les couleurs ?",
    a: "Oui, la plupart de nos créations sont disponibles dans plusieurs couleurs, et beaucoup peuvent être adaptées à vos préférences.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 sm:py-24">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Questions fréquentes" title="Tout ce qu'il faut savoir" align="center" className="mx-auto mb-10" />
        <div className="divide-y divide-rose-100 border-y border-rose-100">
          {FAQS.map((item, i) => (
            <div key={item.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-medium text-ink">{item.q}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-rose-400 transition-transform",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              {open === i && (
                <p className="pb-5 text-ink-light leading-relaxed pr-8">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
