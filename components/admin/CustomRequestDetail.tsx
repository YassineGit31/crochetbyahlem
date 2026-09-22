"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CustomRequest,
  CustomRequestStatus,
  CUSTOM_STATUS_LABELS,
  CREATION_TYPE_LABELS,
  OCCASION_LABELS,
} from "@/types";
import { formatDZD, formatDate } from "@/lib/utils";
import { updateCustomRequestStatus, updateCustomRequestAdminNotes } from "@/services/customRequests-client";
import { Button } from "@/components/ui/Button";
import { SIZE_OPTIONS } from "@/lib/constants";

const STATUS_ORDER: CustomRequestStatus[] = [
  "nouvelle_demande",
  "en_discussion",
  "devis_envoye",
  "acceptee",
  "en_preparation",
  "terminee",
  "refusee",
];

export function CustomRequestDetail({ request }: { request: CustomRequest }) {
  const router = useRouter();
  const [status, setStatus] = useState(request.status);
  const [adminNotes, setAdminNotes] = useState(request.admin_notes ?? "");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  async function handleStatusChange(next: CustomRequestStatus) {
    setSavingStatus(true);
    setStatus(next);
    await updateCustomRequestStatus(request.id, next);
    router.refresh();
    setSavingStatus(false);
  }

  async function handleSaveNotes() {
    setSavingNotes(true);
    await updateCustomRequestAdminNotes(request.id, adminNotes);
    router.refresh();
    setSavingNotes(false);
  }

  const sizeLabel = SIZE_OPTIONS.find((s) => s.value === request.size)?.label ?? request.size;

  return (
    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
      <div className="space-y-6">
        {request.images.length > 0 && (
          <div className="rounded-2xl border border-rose-100 bg-white p-5">
            <h2 className="font-display text-xl text-ink mb-4">Inspirations ({request.images.length})</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {request.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setLightbox(img.url)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-rose-50"
                >
                  <Image src={img.url} alt="" fill className="object-cover" unoptimized={img.url.startsWith("blob:")} />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <h2 className="font-display text-xl text-ink mb-4">Le projet</h2>
          <dl className="space-y-3 text-sm">
            <Info label="Type de création" value={CREATION_TYPE_LABELS[request.creation_type]} />
            <Info label="Description" value={request.description} multiline />
            {request.colors.length > 0 && <Info label="Couleurs" value={request.colors.join(", ")} />}
            <Info
              label="Taille"
              value={sizeLabel + (request.custom_dimensions ? ` (${request.custom_dimensions})` : "")}
            />
            <Info label="Quantité" value={String(request.quantity)} />
            <Info label="Occasion" value={OCCASION_LABELS[request.occasion]} />
            {request.desired_date && <Info label="Date souhaitée" value={formatDate(request.desired_date)} />}
            {request.budget && <Info label="Budget indiqué" value={formatDZD(request.budget)} />}
            {request.notes && <Info label="Note client" value={request.notes} multiline />}
          </dl>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <h2 className="font-display text-xl text-ink mb-4">Client</h2>
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            <Info label="Nom" value={request.customer_name} />
            <Info label="Téléphone" value={request.customer_phone} />
            <Info label="Wilaya" value={request.wilaya} />
            <Info label="Commune" value={request.commune} />
            <Info label="Adresse" value={request.address} className="sm:col-span-2" />
          </dl>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <h2 className="font-display text-xl text-ink mb-4">Statut</h2>
          <div className="space-y-2">
            {STATUS_ORDER.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={savingStatus || s === status}
                className={`w-full text-left rounded-xl px-4 py-2.5 text-sm border transition-colors ${
                  s === status
                    ? "border-rose-500 bg-rose-50 text-rose-700 font-medium"
                    : "border-rose-100 text-ink-light hover:border-rose-300"
                }`}
              >
                {CUSTOM_STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white p-5">
          <h2 className="font-display text-lg text-ink mb-3">Notes internes</h2>
          <p className="text-xs text-ink-faint mb-2">Visibles uniquement par l&apos;équipe, jamais par le client.</p>
          <textarea
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={4}
            className="input resize-none"
            placeholder="Ex : Devis envoyé le 12/09, en attente de retour..."
          />
          <Button size="sm" className="mt-3" onClick={handleSaveNotes} disabled={savingNotes}>
            {savingNotes ? "Enregistrement..." : "Enregistrer la note"}
          </Button>
        </div>

        <Button variant="secondary" className="w-full" onClick={() => router.push("/admin/demandes")}>
          Retour aux demandes
        </Button>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-ink/80 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-2xl w-full aspect-square">
            <Image src={lightbox} alt="" fill className="object-contain" unoptimized={lightbox.startsWith("blob:")} />
          </div>
        </div>
      )}
    </div>
  );
}

function Info({
  label,
  value,
  multiline,
  className,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-ink-faint text-xs">{label}</dt>
      <dd className={`text-ink mt-0.5 ${multiline ? "whitespace-pre-wrap" : ""}`}>{value}</dd>
    </div>
  );
}
