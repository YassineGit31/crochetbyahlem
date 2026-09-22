"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Sparkles,
  Users,
  Truck,
  Settings,
  LogOut,
  ExternalLink,
  NotebookText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/carnet", label: "Mon Carnet", icon: NotebookText },
  { href: "/admin/commandes", label: "Commandes", icon: ShoppingBag },
  { href: "/admin/demandes", label: "Demandes personnalisées", icon: Sparkles },
  { href: "/admin/produits", label: "Produits", icon: Package },
  { href: "/admin/categories", label: "Catégories", icon: FolderTree },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/livraison", label: "Livraison", icon: Truck },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export function AdminSidebar() {
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
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-ink text-cream min-h-screen sticky top-0">
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-white/10">
        <Image src="/logo-mark.svg" alt="" width={30} height={30} className="rounded-full" />
        <span className="font-display text-sm leading-tight">Crochet by Ahlem<br /><span className="text-cream/50 text-xs">Admin</span></span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active ? "bg-rose-500 text-ivory" : "text-cream/70 hover:bg-white/5 hover:text-cream"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/70 hover:bg-white/5 hover:text-cream"
        >
          <ExternalLink className="h-4 w-4" /> Voir le site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cream/70 hover:bg-white/5 hover:text-cream"
        >
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </div>
    </aside>
  );
}
