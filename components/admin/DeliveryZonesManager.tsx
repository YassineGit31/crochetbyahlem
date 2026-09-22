"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { DeliveryZone } from "@/types";
import { WILAYAS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { createDeliveryZone, updateDeliveryZone, deleteDeliveryZone } from "@/services/delivery";

export function DeliveryZonesManager({ zones }: { zones: DeliveryZone[] }) {
  const router = useRouter();
  const [newWilaya, setNewWilaya] = useState("");
  const [newFee, setNewFee] = useState("");
  const [saving, setSaving] = useState(false);

  const usedWilayas = new Set(zones.map((z) => z.wilaya));
  const availableWilayas = WILAYAS.filter((w) => !usedWilayas.has(w));

  async function handleAdd() {
    if (!newWilaya || !newFee) return;
    setSaving(true);
    await createDeliveryZone({ wilaya: newWilaya, fee: Number(newFee), is_enabled: true, note: null });
    setNewWilaya("");
    setNewFee("");
    router.refresh();
    setSaving(false);
  }

  async function handleFeeChange(id: string, fee: number) {
    await updateDeliveryZone(id, { fee });
    router.refresh();
  }

  async function handleToggle(id: string, enabled: boolean) {
    await updateDeliveryZone(id, { is_enabled: enabled });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette zone de livraison ?")) return;
    await deleteDeliveryZone(id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Livraison</h1>
        <p className="text-sm text-ink-light mt-1">
          Définissez les frais de livraison par wilaya. Ils sont appliqués automatiquement au moment
          du paiement.
        </p>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-rose-50/60 text-left text-ink-light">
            <tr>
              <th className="px-4 py-3 font-medium">Wilaya</th>
              <th className="px-4 py-3 font-medium">Frais</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100">
            {zones.map((zone) => (
              <tr key={zone.id}>
                <td className="px-4 py-3 text-ink">{zone.wilaya}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      defaultValue={zone.fee}
                      onBlur={(e) => handleFeeChange(zone.id, Number(e.target.value))}
                      className="w-24 rounded-lg border border-rose-200 px-2 py-1 text-sm"
                    />
                    <span className="text-ink-faint text-xs">DA</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggle(zone.id, !zone.is_enabled)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      zone.is_enabled ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"
                    )}
                  >
                    {zone.is_enabled ? "Active" : "Désactivée"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(zone.id)}
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg hover:bg-rose-50 text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-5">
        <p className="text-sm font-medium text-ink mb-3">Ajouter une wilaya</p>
        <div className="flex flex-wrap gap-3">
          <select value={newWilaya} onChange={(e) => setNewWilaya(e.target.value)} className="input sm:max-w-xs">
            <option value="">Choisir une wilaya</option>
            {availableWilayas.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            value={newFee}
            onChange={(e) => setNewFee(e.target.value)}
            placeholder="Frais (DA)"
            className="input sm:max-w-[140px]"
          />
          <Button onClick={handleAdd} disabled={saving || !newWilaya || !newFee} className="gap-2">
            <Plus className="h-4 w-4" /> Ajouter
          </Button>
        </div>
      </div>

      <p className="text-xs text-ink-faint">
        Astuce : la livraison gratuite au-delà d&apos;un certain montant se configure dans{" "}
        <span className="text-rose-500">Paramètres</span>.
      </p>
    </div>
  );
}
