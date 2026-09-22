import { notFound } from "next/navigation";
import { CustomRequestDetail } from "@/components/admin/CustomRequestDetail";
import { getCustomRequestById } from "@/services/customRequests";

export const metadata = { title: "Détail de la demande" };

export default async function AdminCustomRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getCustomRequestById(id);
  if (!request) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-ink">Demande #{request.request_number}</h1>
      <CustomRequestDetail request={request} />
    </div>
  );
}
