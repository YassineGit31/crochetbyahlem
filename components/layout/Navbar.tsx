"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/Button";
import { useCartStore, cartCount } from "@/lib/store/cart";
import { useHasMounted } from "@/hooks/useHasMounted";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/creations", label: "Créations" },
  { href: "/personnalise", label: "Personnalisé" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.open);
  const mounted = useHasMounted();
  const count = mounted ? cartCount(items) : 0;

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-rose-100">
      <Container className="flex items-center justify-between h-[72px]">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMenuOpen(false)}>
          <Image src="/logo-mark.svg" alt="" width={40} height={40} className="rounded-full" />
          <span className="font-display text-lg sm:text-xl text-ink leading-none">
            Crochet by Ahlem
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-rose-500",
                pathname === link.href ? "text-rose-500" : "text-ink-light"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LinkButton href="/creations" size="sm" className="hidden sm:inline-flex">
            Commander
          </LinkButton>
          <button
            aria-label="Ouvrir le panier"
            onClick={openCart}
            className="relative flex items-center justify-center h-11 w-11 rounded-full hover:bg-rose-100/70 transition-colors"
          >
            <ShoppingBag className="h-5 w-5 text-ink" strokeWidth={1.75} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-rose-500 text-ivory text-[11px] font-semibold">
                {count}
              </span>
            )}
          </button>
          <button
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex items-center justify-center h-11 w-11 rounded-full hover:bg-rose-100/70 transition-colors"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-rose-100 bg-cream"
          >
            <Container className="flex flex-col py-3">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "py-3 text-base font-medium border-b border-rose-100/70 last:border-0",
                    pathname === link.href ? "text-rose-500" : "text-ink"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
