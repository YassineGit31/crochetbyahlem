import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { LinkButton } from "@/components/ui/Button";
import { listDemoCustomRequests } from "@/lib/demo-store";
import { getSettings } from "@/services/settings";
import { buildCustomRequestWhatsAppMessage, buildWaLink } from "@/lib/whatsapp";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { isServiceRoleConfigured } from "@/lib/supabase/admin";
import { CustomRequest } from "@/types";

// Same reasoning as services/orders.ts getOrderByNumber: this runs right after
// submission, before any admin/customer session exists, and RLS on
// custom_requests restricts reads to admins ("custom_requests_admin_only" in
// supabase/schema.sql). So this deliberately uses the service-role admin
// client to bypass RLS, mirroring the /api/custom-requests write path.
async function findByNumber(requestNumber: string): Promise<CustomRequest | null> {
  if (!isSupabaseConfigured() || !isServiceRoleConfigured()) {
    return listDemoCustomRequests().find((r) => r.request_number === requestNumber) ?? null;
  }
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("custom_requests")
    .select("*, custom_request_images(*)")
    .eq("request_number", requestNumber)
    .single();
  if (error || !data) return null;
  return {
    ...data,
    colors: data.colors ?? [],
    images: data.custom_request_images ?? [],
  } as CustomRequest;
}

export const metadata = { title: "Demande envoyée" };

export default async function CustomRequestConfirmationPage({
  params,
}: {
  params: Promise<{ requestNumber: string }>;
}) {
  const { requestNumber } = await params;
  const [request, settings] = await Promise.all([
    findByNumber(decodeURIComponent(requestNumber)),
    getSettings(),
  ]);
  if (!request) notFound();

  const imageUrls = request.images.map((i) => i.url);
  const waLink = buildWaLink(
    settings.whatsapp_number,
    buildCustomRequestWhatsAppMessage(request, imageUrls)
  );

  return (
    <Container className="py-16 sm:py-20 max-w-2xl text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-rose-500" />
      </div>
      <h1 className="mt-6 font-display text-3xl sm:text-4xl text-ink">
        Merci pour votre demande 💗
      </h1>
      <p className="mt-3 text-ink-light">
        Votre demande de création personnalisée a bien été enregistrée.
      </p>
      <p className="mt-4 inline-block rounded-full bg-ivory border border-rose-200 px-5 py-2 font-display text-lg text-rose-600">
        #{request.request_number}
      </p>
      <p className="mt-8 text-ink-light">
        Ahlem va étudier votre projet et vous recontactera bientôt avec une
        proposition et un délai de réalisation.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <LinkButton href={waLink} target="_blank" rel="noopener noreferrer" variant="whatsapp" size="lg">
          Contacter Crochet by Ahlem sur WhatsApp
        </LinkButton>
        <LinkButton href="/creations" variant="secondary" size="lg">
          Voir les créations
        </LinkButton>
      </div>
    </Container>
  );
}
