"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartItemOptions } from "@/types";

interface AddToCartInput {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  options: CartItemOptions;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (input: AddToCartInput) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

function computeItemId(productId: string, options: CartItemOptions): string {
  return [productId, options.color, options.size, options.variantId]
    .filter(Boolean)
    .join("::");
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (input) => {
        const id = computeItemId(input.productId, input.options);
        const existing = get().items.find((i) => i.id === id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + input.quantity } : i
            ),
            isOpen: true,
          });
          return;
        }
        set({
          items: [
            ...get().items,
            {
              id,
              productId: input.productId,
              slug: input.slug,
              name: input.name,
              image: input.image,
              unitPrice: input.unitPrice,
              quantity: input.quantity,
              options: input.options,
            },
          ],
          isOpen: true,
        });
      },
      removeItem: (itemId) => set({ items: get().items.filter((i) => i.id !== itemId) }),
      updateQuantity: (itemId, quantity) =>
        set({
          items: get()
            .items.map((i) => (i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i)),
        }),
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
    }),
    {
      name: "crochet-by-ahlem-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
