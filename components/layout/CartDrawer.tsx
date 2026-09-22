"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";
import { formatDZD } from "@/lib/utils";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/primitives";
import { useHasMounted } from "@/hooks/useHasMounted";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const mounted = useHasMounted();

  const subtotal = mounted ? cartSubtotal(items) : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px]"
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-label="Panier"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-50 h-dvh w-full sm:w-[420px] bg-cream shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 sm:px-6 h-[72px] border-b border-rose-100">
              <h2 className="font-display text-xl text-ink">Votre panier</h2>
              <button
                aria-label="Fermer le panier"
                onClick={close}
                className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-rose-100/70"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
              {!mounted || items.length === 0 ? (
                <EmptyState
                  title="Votre panier est encore vide 💗"
                  description="Découvrez nos créations et ajoutez vos coups de cœur."
                  action={
                    <LinkButton href="/creations" size="sm" onClick={close}>
                      Voir les créations
                    </LinkButton>
                  }
                />
              ) : (
                <ul className="space-y-5">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-rose-50">
                        <Image src={item.image} alt={item.name} fill className="object-cover p-2" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                            {(item.options.color || item.options.size || item.options.variantLabel) && (
                              <p className="text-xs text-ink-light mt-0.5">
                                {[item.options.color, item.options.size, item.options.variantLabel]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </p>
                            )}
                          </div>
                          <button
                            aria-label="Retirer"
                            onClick={() => removeItem(item.id)}
                            className="text-ink-faint hover:text-rose-500 shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 border border-rose-200 rounded-full px-1">
                            <button
                              aria-label="Diminuer la quantité"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-7 w-7 flex items-center justify-center text-ink-light hover:text-rose-500 disabled:opacity-30"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                            <button
                              aria-label="Augmenter la quantité"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-7 w-7 flex items-center justify-center text-ink-light hover:text-rose-500"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold text-rose-600">
                            {formatDZD(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {mounted && items.length > 0 && (
              <div className="border-t border-rose-100 px-5 sm:px-6 py-5 space-y-4">
                <div className="flex items-center justify-between text-sm text-ink-light">
                  <span>Sous-total</span>
                  <span className="font-semibold text-ink">{formatDZD(subtotal)}</span>
                </div>
                <p className="text-xs text-ink-faint">
                  Livraison calculée à l&apos;étape suivante selon votre wilaya.
                </p>
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={close}>
                    Continuer
                  </Button>
                  <LinkButton href="/commande" className="flex-1" onClick={close}>
                    Commander
                  </LinkButton>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
