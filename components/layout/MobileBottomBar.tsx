"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Sparkles, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore, cartCount } from "@/lib/store/cart";
import { useHasMounted } from "@/hooks/useHasMounted";
import { buildWaLink } from "@/lib/whatsapp";

const ITEMS = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/creations", label: "Créations", icon: ShoppingBag },
  { href: "/personnalise", label: "Personnalisé", icon: Sparkles },
];

export function MobileBottomBar({ whatsappNumber }: { whatsappNumber: string }) {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.open);
  const mounted = useHasMounted();
  const count = mounted ? cartCount(items) : 0;

  const waLink = buildWaLink(
    whatsappNumber,
    "Bonjour Crochet by Ahlem 👋 J'aimerais avoir quelques informations."
  );

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40">
      <div className="absolute -top-16 right-4">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacter sur WhatsApp"
          className="flex items-center justify-center h-14 w-14 rounded-full bg-[#3FA96A] text-ivory shadow-[var(--shadow-bloom)]"
        >
          <MessageCircle className="h-6 w-6" strokeWidth={1.75} fill="currentColor" />
        </a>
      </div>
      <nav className="bg-ivory/95 backdrop-blur border-t border-rose-100 pb-[env(safe-area-inset-bottom)]">
        <ul className="grid grid-cols-4 h-16">
          {ITEMS.map(({ href, label, icon: Icon }) => (
            <li key={href} className="flex">
              <Link
                href={href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center gap-1 text-[11px] font-medium",
                  pathname === href ? "text-rose-500" : "text-ink-light"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
                {label}
              </Link>
            </li>
          ))}
          <li className="flex">
            <button
              onClick={openCart}
              className="flex-1 flex flex-col items-center justify-center gap-1 text-[11px] font-medium text-ink-light relative"
            >
              <span className="relative">
                <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-rose-500 text-ivory text-[9px] font-semibold">
                    {count}
                  </span>
                )}
              </span>
              Panier
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
