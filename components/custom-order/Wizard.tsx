"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, X, AlertCircle, Sparkles } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { Button } from "@/components/ui/Button";
import {
  CREATION_TYPE_OPTIONS,
  OCCASION_OPTIONS,
  SIZE_OPTIONS,
  COMMON_COLORS,
  WILAYAS,
  MAX_INSPIRATION_IMAGES,
} from "@/lib/constants";
import { CreationType, CreationSize, Occasion } from "@/types";
import { validateImageFile, uploadInspirationImages } from "@/lib/upload";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface ImageEntry {
  id: string;
  file: File;
  previewUrl: string;
}

interface FormState {
  creationType: CreationType;
  description: string;
  colors: string[];
  size: CreationSize;
  customDimensions: string;
  quantity: number;
  occasion: Occasion;
  desiredDate: string;
  budget: string;
  customerName: string;
  customerPhone: string;
  wilaya: string;
  commune: string;
  address: string;
  notes: string;
}

const STORAGE_KEY = "crochet-by-ahlem-custom-wizard";

const INITIAL_STATE: FormState = {
  creationType: "amigurumi",
  description: "",
  colors: [],
  size: "moyen",
  customDimensions: "",
  quantity: 1,
  occasion: "cadeau",
  desiredDate: "",
  budget: "",
  customerName: "",
  customerPhone: "",
  wilaya: "",
  commune: "",
  address: "",
  notes: "",
};

export function CustomOrderWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Restore saved progress + optional prefill from a product page's
  // "Demander une personnalisation" link.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setForm({ ...INITIAL_STATE, ...JSON.parse(saved) });
      } catch {
        /* ignore corrupt local storage */
      }
    }
    const inspiration = searchParams.get("inspiration");
    if (inspiration && !saved) {
      setForm((f) => ({ ...f, description: `Basé sur : ${inspiration}\n` }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    setImageError(null);
    const incoming = Array.from(fileList);
    if (images.length + incoming.length > MAX_INSPIRATION_IMAGES) {
      setImageError(`Vous pouvez ajouter jusqu'à ${MAX_INSPIRATION_IMAGES} images.`);
      return;
    }
    for (const file of incoming) {
      const error = validateImageFile(file);
      if (error) {
        setImageError(error);
        continue;
      }
      setImages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) },
      ]);
    }
  }

  function removeImage(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  function toggleColor(color: string) {
    setForm((f) => ({
      ...f,
      colors: f.colors.includes(color) ? f.colors.filter((c) => c !== color) : [...f.colors, color],
    }));
  }

  function canGoNext(): boolean {
    if (step === 1) return form.description.trim().length >= 10;
    if (step === 3) {
      return (
        form.customerName.trim().length >= 2 &&
        /^0[5-7][0-9]{8}$/.test(form.customerPhone.trim()) &&
        Boolean(form.wilaya) &&
        form.commune.trim().length > 0 &&
        form.address.trim().length >= 5
      );
    }
    return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const imageUrls = await uploadInspirationImages(images.map((i) => i.file));
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          wilaya: form.wilaya,
          commune: form.commune,
          address: form.address,
          creationType: form.creationType,
          description: form.description,
          colors: form.colors,
          size: form.size,
          customDimensions: form.customDimensions || undefined,
          quantity: form.quantity,
          occasion: form.occasion,
          desiredDate: form.desiredDate || undefined,
          budget: form.budget ? Number(form.budget) : undefined,
          notes: form.notes || undefined,
          imageUrls,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Une erreur est survenue, réessayez.");
        setSubmitting(false);
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/personnalise/confirmation/${data.requestNumber}`);
    } catch {
      setSubmitError("Impossible d'envoyer votre demande. Vérifiez votre connexion.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <StepIndicator current={step} />

      <div className="mt-10 min-h-[360px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div>
                <h2 className="font-display text-2xl text-ink">Montrez-nous votre inspiration</h2>
                <p className="mt-2 text-ink-light">
                  Ajoutez jusqu&apos;à {MAX_INSPIRATION_IMAGES} images : une capture d&apos;écran,
                  une photo, une couleur qui vous inspire...
                </p>
                {!isSupabaseConfigured() && (
                  <p className="mt-3 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                    Mode démo : les images restent en aperçu local et ne seront pas hébergées tant
                    que Supabase Storage n&apos;est pas configuré (voir le README).
                  </p>
                )}
                <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden bg-rose-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.previewUrl} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-ink/70 text-ivory flex items-center justify-center"
                        aria-label="Retirer l'image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {images.length < MAX_INSPIRATION_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-rose-300 flex flex-col items-center justify-center gap-1.5 text-ink-light hover:border-rose-400 hover:text-rose-500"
                    >
                      <ImagePlus className="h-6 w-6" />
                      <span className="text-xs">Ajouter</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                {imageError && (
                  <p className="mt-3 text-sm text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" /> {imageError}
                  </p>
                )}
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="font-display text-2xl text-ink">Qu&apos;aimeriez-vous que l&apos;on crée ?</h2>
                <p className="mt-2 text-ink-light">Décrivez votre idée le plus précisément possible.</p>
                <div className="mt-6">
                  <p className="text-sm font-medium text-ink mb-2">Type de création</p>
                  <div className="flex flex-wrap gap-2">
                    {CREATION_TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update("creationType", opt.value)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm transition-colors",
                          form.creationType === opt.value
                            ? "border-rose-500 bg-rose-50 text-rose-700"
                            : "border-rose-200 text-ink-light hover:border-rose-400"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <label className="text-sm font-medium text-ink mb-2 block">
                    Décrivez votre idée <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    rows={6}
                    placeholder="Décrivez votre idée le plus précisément possible... Ex : Je voudrais une poupée inspirée de cette photo, avec une robe rose et des cheveux bruns..."
                    className="input resize-none"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-display text-2xl text-ink">Personnalisez votre création</h2>
                <div className="mt-6">
                  <p className="text-sm font-medium text-ink mb-2">Couleurs préférées</p>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleColor(c)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm transition-colors",
                          form.colors.includes(c)
                            ? "border-rose-500 bg-rose-50 text-rose-700"
                            : "border-rose-200 text-ink-light hover:border-rose-400"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-ink mb-2">Taille</p>
                    <div className="flex flex-wrap gap-2">
                      {SIZE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update("size", opt.value)}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm transition-colors",
                            form.size === opt.value
                              ? "border-rose-500 bg-rose-50 text-rose-700"
                              : "border-rose-200 text-ink-light hover:border-rose-400"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {form.size === "personnalise" && (
                      <input
                        value={form.customDimensions}
                        onChange={(e) => update("customDimensions", e.target.value)}
                        placeholder="Dimensions souhaitées"
                        className="input mt-3"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink mb-2">Quantité</p>
                    <input
                      type="number"
                      min={1}
                      value={form.quantity}
                      onChange={(e) => update("quantity", Math.max(1, Number(e.target.value)))}
                      className="input"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-medium text-ink mb-2">Occasion</p>
                  <div className="flex flex-wrap gap-2">
                    {OCCASION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => update("occasion", opt.value)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm transition-colors",
                          form.occasion === opt.value
                            ? "border-rose-500 bg-rose-50 text-rose-700"
                            : "border-rose-200 text-ink-light hover:border-rose-400"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-ink mb-2 block">
                      Pour quelle date souhaitez-vous votre création ?
                    </label>
                    <input
                      type="date"
                      value={form.desiredDate}
                      onChange={(e) => update("desiredDate", e.target.value)}
                      min={new Date().toISOString().slice(0, 10)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink mb-2 block">
                      Budget approximatif (optionnel)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={form.budget}
                      onChange={(e) => update("budget", e.target.value)}
                      placeholder="En DA"
                      className="input"
                    />
                  </div>
                </div>
                <p className="mt-4 text-sm text-ink-light bg-rose-50 border border-rose-100 rounded-xl px-4 py-3">
                  Les commandes personnalisées nécessitent généralement 20 jours ou plus selon la
                  complexité de la création.
                </p>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-display text-2xl text-ink">Vos coordonnées</h2>
                <p className="mt-2 text-ink-light">Pour vous recontacter et organiser la livraison.</p>
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <input
                    value={form.customerName}
                    onChange={(e) => update("customerName", e.target.value)}
                    placeholder="Nom complet *"
                    className="input"
                  />
                  <input
                    value={form.customerPhone}
                    onChange={(e) => update("customerPhone", e.target.value)}
                    placeholder="Téléphone * (ex: 0551223344)"
                    className="input"
                  />
                  <select
                    value={form.wilaya}
                    onChange={(e) => update("wilaya", e.target.value)}
                    className="input"
                  >
                    <option value="">Wilaya *</option>
                    {WILAYAS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                  <input
                    value={form.commune}
                    onChange={(e) => update("commune", e.target.value)}
                    placeholder="Commune *"
                    className="input"
                  />
                </div>
                <input
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Adresse complète *"
                  className="input mt-4"
                />
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={3}
                  placeholder="Note additionnelle (optionnel)"
                  className="input mt-4 resize-none"
                />
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="font-display text-2xl text-ink">Vérifiez votre demande</h2>
                <p className="mt-2 text-ink-light">
                  Ahlem étudiera votre demande et vous recontactera avec une proposition.
                </p>
                <div className="mt-6 space-y-4 rounded-[var(--radius-card)] bg-ivory border border-rose-100 p-6">
                  <SummaryRow
                    label="Type"
                    value={CREATION_TYPE_OPTIONS.find((o) => o.value === form.creationType)?.label}
                  />
                  <SummaryRow label="Description" value={form.description} multiline />
                  {form.colors.length > 0 && <SummaryRow label="Couleurs" value={form.colors.join(", ")} />}
                  <SummaryRow
                    label="Taille"
                    value={SIZE_OPTIONS.find((o) => o.value === form.size)?.label}
                  />
                  <SummaryRow label="Quantité" value={String(form.quantity)} />
                  <SummaryRow
                    label="Occasion"
                    value={OCCASION_OPTIONS.find((o) => o.value === form.occasion)?.label}
                  />
                  {form.desiredDate && <SummaryRow label="Date souhaitée" value={form.desiredDate} />}
                  {form.budget && <SummaryRow label="Budget" value={`${form.budget} DA`} />}
                  <SummaryRow label="Images" value={`${images.length} image(s) jointe(s)`} />
                  <div className="pt-3 border-t border-rose-100">
                    <SummaryRow label="Nom" value={form.customerName} />
                    <SummaryRow label="Téléphone" value={form.customerPhone} />
                    <SummaryRow label="Adresse" value={`${form.address}, ${form.commune}, ${form.wilaya}`} />
                  </div>
                </div>
                {submitError && (
                  <div className="mt-4 flex items-start gap-2 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    {submitError}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Retour
        </Button>
        {step < 4 ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canGoNext()}>
            Suivant
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={submitting} className="gap-2">
            <Sparkles className="h-4 w-4" />
            {submitting ? "Envoi en cours..." : "Envoyer ma demande"}
          </Button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value?: string;
  multiline?: boolean;
}) {
  if (!value) return null;
  return (
    <div className={cn("flex", multiline ? "flex-col gap-1" : "justify-between gap-4")}>
      <span className="text-sm text-ink-light shrink-0">{label}</span>
      <span className={cn("text-sm text-ink", multiline ? "" : "text-right")}>{value}</span>
    </div>
  );
}
