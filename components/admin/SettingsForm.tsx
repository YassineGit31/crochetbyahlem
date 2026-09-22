"use client";

import { useState } from "react";
import { StoreSettings } from "@/types";
import { Button } from "@/components/ui/Button";
import { updateSettings } from "@/services/settings";

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await updateSettings(form);
    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="rounded-2xl border border-rose-100 bg-white p-5 space-y-4">
        <h2 className="font-display text-lg text-ink">Informations générales</h2>
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Nom de la marque</label>
          <input value={form.business_name} onChange={(e) => update("business_name", e.target.value)} className="input" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">Description</label>
          <textarea
            value={form.business_description}
            onChange={(e) => update("business_description", e.target.value)}
            rows={2}
            className="input resize-none"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Nom d&apos;utilisateur Instagram</label>
            <input
              value={form.instagram_username}
              onChange={(e) => update("instagram_username", e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Devise</label>
            <input value={form.currency} onChange={(e) => update("currency", e.target.value)} className="input" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">Facebook (optionnel)</label>
            <input
              value={form.facebook_url ?? ""}
              onChange={(e) => update("facebook_url", e.target.value || null)}
              className="input"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">TikTok (optionnel)</label>
            <input
              value={form.tiktok_url ?? ""}
              onChange={(e) => update("tiktok_url", e.target.value || null)}
              className="input"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-5 space-y-4">
        <h2 className="font-display text-lg text-ink">WhatsApp</h2>
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">
            Numéro WhatsApp (format international, sans le +)
          </label>
          <input
            value={form.whatsapp_number}
            onChange={(e) => update("whatsapp_number", e.target.value)}
            placeholder="213555112233"
            className="input"
          />
          <p className="text-xs text-ink-faint mt-1">
            Utilisé partout sur le site pour générer les liens WhatsApp — vous ne le modifiez qu&apos;ici.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-rose-100 bg-white p-5 space-y-4">
        <h2 className="font-display text-lg text-ink">Délais & livraison</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">
              Délai par défaut (jours)
            </label>
            <input
              type="number"
              min={1}
              value={form.default_production_days}
              onChange={(e) => update("default_production_days", Number(e.target.value))}
              className="input"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink mb-1.5 block">
              Délai commande personnalisée (jours)
            </label>
            <input
              type="number"
              min={1}
              value={form.custom_production_days}
              onChange={(e) => update("custom_production_days", Number(e.target.value))}
              className="input"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink mb-1.5 block">
            Livraison gratuite à partir de (DA, laisser vide pour désactiver)
          </label>
          <input
            type="number"
            min={0}
            value={form.free_delivery_threshold ?? ""}
            onChange={(e) => update("free_delivery_threshold", e.target.value ? Number(e.target.value) : null)}
            className="input"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
        </Button>
        {saved && <span className="text-sm text-emerald-600">Enregistré ✓</span>}
      </div>
    </form>
  );
}
