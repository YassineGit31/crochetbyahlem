import Link from "next/link";
import Image from "next/image";
import { Camera, Heart } from "lucide-react";
import { Container } from "@/components/ui/primitives";

export function Footer({
  instagramUsername = "crochetbyahlem",
}: {
  instagramUsername?: string;
}) {
  return (
    <footer className="mt-24 bg-ivory border-t border-rose-100 pb-24 md:pb-0">
      <Container className="py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <Image src="/logo-mark.svg" alt="" width={36} height={36} className="rounded-full" />
            <span className="font-display text-lg text-ink">Crochet by Ahlem</span>
          </div>
          <p className="text-sm text-ink-light leading-relaxed max-w-xs">
            Des créations faites à la main, imaginées avec amour et réalisées
            spécialement pour vous.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink mb-3">Navigation</p>
          <ul className="space-y-2 text-sm text-ink-light">
            <li><Link href="/creations" className="hover:text-rose-500">Nos créations</Link></li>
            <li><Link href="/personnalise" className="hover:text-rose-500">Commande personnalisée</Link></li>
            <li><Link href="/a-propos" className="hover:text-rose-500">À propos</Link></li>
            <li><Link href="/contact" className="hover:text-rose-500">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink mb-3">Retrouvez-nous</p>
          <a
            href={`https://www.instagram.com/${instagramUsername}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-ink-light hover:text-rose-500"
          >
            <Camera className="h-4 w-4" /> @{instagramUsername}
          </a>
        </div>
      </Container>

      <Container className="pb-8">
        <div className="pt-6 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint">
          <p>© {new Date().getFullYear()} Crochet by Ahlem. Tous droits réservés.</p>
          <p className="inline-flex items-center gap-1">
            Fait avec <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" /> en Algérie
          </p>
        </div>
      </Container>
    </footer>
  );
}
