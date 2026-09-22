"use client";

import { Trash2 } from "lucide-react";

export function PersonalOrderDeleteButton({
  orderId,
  action,
}: {
  orderId: string;
  action: (id: string) => Promise<void>;
}) {
  return (
    <form
      action={() => {
        if (confirm("Supprimer définitivement cette commande et ses paiements ?")) {
          action(orderId);
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 hover:underline"
      >
        <Trash2 className="h-4 w-4" /> Supprimer la commande
      </button>
    </form>
  );
}
