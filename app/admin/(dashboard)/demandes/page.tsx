import Link from "next/link";
import { CustomStatusBadge } from "@/components/admin/primitives";
import { getCustomRequests } from "@/services/customRequests";
import { formatDateShort } from "@/lib/utils";
import { CREATION_TYPE_LABELS } from "@/types";

export const metadata = { title: "Demandes personnalisées" };

export default async function AdminCustomRequestsPage() {
  const requests = await getCustomRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Demandes personnalisées</h1>
        <p className="text-sm text-ink-light mt-1">{requests.length} demande(s)</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((req) => (
          <Link
            key={req.id}
            href={`/admin/demandes/${req.id}`}
            className="rounded-2xl border border-rose-100 bg-white p-5 hover:border-rose-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-ink">#{req.request_number}</p>
              <CustomStatusBadge status={req.status} />
            </div>
            <p className="text-sm text-ink-light">{req.customer_name}</p>
            <p className="text-xs text-ink-faint mt-1">
              {CREATION_TYPE_LABELS[req.creation_type]} · {formatDateShort(req.created_at)}
            </p>
            <p className="text-sm text-ink mt-3 line-clamp-2">{req.description}</p>
            {req.images.length > 0 && (
              <p className="text-xs text-rose-500 mt-2">{req.images.length} image(s) jointe(s)</p>
            )}
          </Link>
        ))}
        {requests.length === 0 && (
          <p className="text-ink-faint col-span-full text-center py-10">Aucune demande pour le moment.</p>
        )}
      </div>
    </div>
  );
}
