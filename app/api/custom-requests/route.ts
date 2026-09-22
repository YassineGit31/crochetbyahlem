import { NextRequest, NextResponse } from "next/server";
import { customRequestSchema } from "@/lib/validations";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { isServiceRoleConfigured, createAdminClient } from "@/lib/supabase/admin";
import { addDemoCustomRequest, nextDemoCustomRequestNumber } from "@/lib/demo-store";
import { CustomRequest } from "@/types";
import { buildCustomRequestWhatsAppMessage } from "@/lib/whatsapp";
import { notifyShopOfCustomRequest } from "@/lib/whatsapp-cloud";
import { getSettings } from "@/services/settings";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = customRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const input = parsed.data;
  const now = new Date().toISOString();

  if (!isSupabaseConfigured() || !isServiceRoleConfigured()) {
    const request: CustomRequest = {
      id: crypto.randomUUID(),
      request_number: nextDemoCustomRequestNumber(),
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      wilaya: input.wilaya,
      commune: input.commune,
      address: input.address,
      creation_type: input.creationType,
      description: input.description,
      colors: input.colors,
      size: input.size,
      custom_dimensions: input.customDimensions ?? null,
      quantity: input.quantity,
      occasion: input.occasion,
      desired_date: input.desiredDate ?? null,
      budget: input.budget ?? null,
      notes: input.notes ?? null,
      images: input.imageUrls.map((url, i) => ({
        id: crypto.randomUUID(),
        request_id: "demo",
        url,
        sort_order: i,
      })),
      status: "nouvelle_demande",
      admin_notes: null,
      created_at: now,
      updated_at: now,
    };
    addDemoCustomRequest(request);
    const settings = await getSettings();
    await notifyShopOfCustomRequest(
      settings.whatsapp_number,
      buildCustomRequestWhatsAppMessage(request, input.imageUrls),
      input.imageUrls
    );
    return NextResponse.json({ requestNumber: request.request_number });
  }

  const admin = createAdminClient();
  const { data: numberData, error: rpcError } = await admin.rpc("next_custom_request_number");
  if (rpcError) {
    console.error("next_custom_request_number:", rpcError.message);
    return NextResponse.json({ error: "Impossible de générer la référence." }, { status: 500 });
  }
  const requestNumber = numberData as string;

  const { data: inserted, error: insertError } = await admin
    .from("custom_requests")
    .insert({
      request_number: requestNumber,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      wilaya: input.wilaya,
      commune: input.commune,
      address: input.address,
      creation_type: input.creationType,
      description: input.description,
      colors: input.colors,
      size: input.size,
      custom_dimensions: input.customDimensions ?? null,
      quantity: input.quantity,
      occasion: input.occasion,
      desired_date: input.desiredDate ?? null,
      budget: input.budget ?? null,
      notes: input.notes ?? null,
      status: "nouvelle_demande",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("insert custom_request:", insertError?.message);
    return NextResponse.json({ error: "Impossible d'enregistrer la demande." }, { status: 500 });
  }

  if (input.imageUrls.length > 0) {
    const { error: imagesError } = await admin.from("custom_request_images").insert(
      input.imageUrls.map((url, i) => ({
        request_id: inserted.id,
        url,
        sort_order: i,
      }))
    );
    if (imagesError) console.error("insert custom_request_images:", imagesError.message);
  }

  const settings = await getSettings();
  const fullRequest: CustomRequest = {
    id: inserted.id,
    request_number: requestNumber,
    customer_name: input.customerName,
    customer_phone: input.customerPhone,
    wilaya: input.wilaya,
    commune: input.commune,
    address: input.address,
    creation_type: input.creationType,
    description: input.description,
    colors: input.colors,
    size: input.size,
    custom_dimensions: input.customDimensions ?? null,
    quantity: input.quantity,
    occasion: input.occasion,
    desired_date: input.desiredDate ?? null,
    budget: input.budget ?? null,
    notes: input.notes ?? null,
    images: [],
    status: "nouvelle_demande",
    admin_notes: null,
    created_at: now,
    updated_at: now,
  };
  await notifyShopOfCustomRequest(
    settings.whatsapp_number,
    buildCustomRequestWhatsAppMessage(fullRequest, input.imageUrls),
    input.imageUrls
  );

  return NextResponse.json({ requestNumber });
}
