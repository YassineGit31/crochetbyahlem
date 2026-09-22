"use client";

import { useState } from "react";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const STANDARD_STEPS = [
  "Choisissez une création",
  "Personnalisez-la (couleur, taille)",
  "Passez votre commande",
  "Nous préparons votre création",
  "Livraison",
];

const CUSTOM_STEPS = [
  "Envoyez votre inspiration",
  "Expliquez votre idée",
  "Ahlem vous contacte",
  "Création sur-mesure",
  "Livraison",
];

export function HowItWorks() {
  const [tab, setTab] = useState<"standard" | "custom">("standard");
  const steps = tab === "standard" ? STANDARD_STEPS : CUSTOM_STEPS;

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <SectionHeading eyebrow="Simple et sans détour" title="Comment ça marche" />
          <div className="inline-flex self-start sm:self-auto rounded-full bg-ivory border border-rose-200 p-1">
            <button
              onClick={() => setTab("standard")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                tab === "standard" ? "bg-rose-500 text-ivory" : "text-ink-light"
              )}
            >
              Commande classique
            </button>
            <button
              onClick={() => setTab("custom")}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                tab === "custom" ? "bg-rose-500 text-ivory" : "text-ink-light"
              )}
            >
              Commande personnalisée
            </button>
          </div>
        </div>

        <ol className="grid sm:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <li key={step} className="relative pl-0">
              <span className="font-display text-3xl text-rose-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2 text-sm text-ink leading-snug">{step}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
