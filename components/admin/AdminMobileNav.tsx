"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/carnet", label: "Mon Carnet" },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/demandes", label: "Demandes personnalisées" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/livraison", label: "Livraison" },
  { href: "/admin/parametres", label: "Paramètres" },
];

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    if (isSupabaseConfigured()) {
      const { createClient } = await import("@/lib/supabase/client");
      await createClient().auth.signOut();
    } else {
      await fetch("/api/admin/demo-logout", { method: "POST" });
    }
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="lg:hidden sticky top-0 z-30 bg-ink text-cream">
      <div className="flex items-center justify-between h-14 px-4">
        <span className="font-display text-sm">Crochet by Ahlem — Admin</span>
        <button onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="px-3 pb-3 space-y-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm",
                pathname === l.href ? "bg-rose-500 text-ivory" : "text-cream/80"
              )}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-cream/80"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
