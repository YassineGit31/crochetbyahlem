"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/primitives";

export function Hero() {
  return (
    <section className="relative overflow-hidden stitch-texture">
      <Container className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-8 items-center pt-12 pb-16 sm:pt-16 sm:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-sm font-medium text-rose-500 mb-4">Fait main, en petite série</p>
          <h1 className="font-display text-[2.75rem] leading-[1.05] sm:text-6xl text-ink">
            Crochet
            <br />
            by Ahlem
          </h1>
          <p className="mt-5 text-lg text-ink-light max-w-md leading-relaxed">
            Des créations faites à la main, imaginées avec amour et réalisées
            spécialement pour vous.
          </p>
          <p className="mt-2 text-ink-faint">Handmade with love 🧶💗</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/creations" size="lg">
              Découvrir les créations
            </LinkButton>
            <LinkButton href="/personnalise" variant="secondary" size="lg">
              Créer une commande personnalisée
            </LinkButton>
          </div>
        </motion.div>

        <div className="relative h-[360px] sm:h-[440px] lg:h-[480px]">
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -6 }}
            animate={{ opacity: 1, y: 0, rotate: -6 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="absolute left-[6%] top-[6%] w-[52%] aspect-[4/5] rounded-[2rem] bg-rose-100 shadow-[var(--shadow-bloom)] overflow-hidden"
          >
            <Image src="/demo/bouquet-fleurs.svg" alt="Bouquet au crochet" fill className="object-cover p-5" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            transition={{ duration: 0.6, delay: 0.22, ease: "easeOut" }}
            className="absolute right-[4%] top-[0%] w-[46%] aspect-[4/5] rounded-[2rem] bg-cream-dark shadow-[var(--shadow-bloom)] overflow-hidden"
          >
            <Image src="/demo/ours-amigurumi.svg" alt="Ourson au crochet" fill className="object-cover p-5" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            transition={{ duration: 0.6, delay: 0.34, ease: "easeOut" }}
            className="absolute left-[20%] bottom-[2%] w-[42%] aspect-square rounded-[2rem] bg-ivory shadow-[var(--shadow-bloom)] overflow-hidden"
          >
            <Image src="/demo/poupee-crochet.svg" alt="Poupée au crochet" fill className="object-cover p-5" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
