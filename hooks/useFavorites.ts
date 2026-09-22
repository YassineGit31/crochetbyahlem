"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  ids: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const exists = get().ids.includes(id);
        set({ ids: exists ? get().ids.filter((i) => i !== id) : [...get().ids, id] });
      },
      isFavorite: (id) => get().ids.includes(id),
    }),
    { name: "crochet-by-ahlem-favorites" }
  )
);
