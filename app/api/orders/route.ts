import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validations";
import { getProductById } from "@/services/products";
import { getDeliveryZones } from "@/services/delivery";
import { getSettings } from "@/services/settings";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { isServiceRoleConfigured, createAdminClient } from "@/lib/supabase/admin";
import { addDemoOrder, nextDemoOrderNumber } from "@/lib/demo-store";
import { Order, OrderItem } from "@/types";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const input = parsed.data;

  // Re-validate every product & price server-side — never trust the client.
  const items: OrderItem[] = [];
  for (const line of input.items) {
    const product = await getProductById(line.productId);
    if (!product) {
      return NextResponse.json(
        { error: `Une des créations de votre panier n'existe plus.` },
        { status: 400 }
      );
    }
    if (!product.is_available) {
      return NextResponse.json(
        { error: `"${product.name}" n'est plus disponible.` },
        { status: 400 }
      );
    }
    items.push({
      id: crypto.randomUUID(),
      order_id: "",
      product_id: product.id,
      product_name: product.name,
      product_image: product.main_image_url,
      unit_price: product.price,
      quantity: line.quantity,
      options: line.options,
      line_total: product.price * line.quantity,
    });
  }

  const subtotal = items.reduce((sum, i) => sum + i.line_total, 0);
  const [zones, settings] = await Promise.all([getDeliveryZones(), getSettings()]);
  const zone = zones.find((z) => z.wilaya.toLowerCase() === input.wilaya.toLowerCase());
  let deliveryFee = zone ? zone.fee : 0;
  if (settings.free_delivery_threshold && subtotal >= settings.free_delivery_threshold) {
    deliveryFee = 0;
  }
  const total = subtotal + deliveryFee;
  const now = new Date().toISOString();

  if (!isSupabaseConfigured() || !isServiceRoleConfigured()) {
    const order: Order = {
      id: crypto.randomUUID(),
      order_number: nextDemoOrderNumber(),
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      wilaya: input.wilaya,
      commune: input.commune,
      address: input.address,
      delivery_instructions: input.deliveryInstructions ?? null,
      items: items.map((i) => ({ ...i, order_id: "demo" })),
      subtotal,
      delivery_fee: deliveryFee,
      total,
      notes: input.notes ?? null,
      status: "nouvelle",
      created_at: now,
      updated_at: now,
    };
    addDemoOrder(order);
    return NextResponse.json({ orderNumber: order.order_number });
  }

  const admin = createAdminClient();
  const { data: orderNumberData, error: rpcError } = await admin.rpc("next_order_number");
  if (rpcError) {
    console.error("next_order_number:", rpcError.message);
    return NextResponse.json({ error: "Impossible de générer le numéro de commande." }, { status: 500 });
  }
  const orderNumber = orderNumberData as string;

  const { data: insertedOrder, error: orderError } = await admin
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      wilaya: input.wilaya,
      commune: input.commune,
      address: input.address,
      delivery_instructions: input.deliveryInstructions ?? null,
      subtotal,
      delivery_fee: deliveryFee,
      total,
      notes: input.notes ?? null,
      status: "nouvelle",
    })
    .select("id")
    .single();

  if (orderError || !insertedOrder) {
    console.error("insert order:", orderError?.message);
    return NextResponse.json({ error: "Impossible d'enregistrer la commande." }, { status: 500 });
  }

  const orderId = insertedOrder.id as string;
  const { error: itemsError } = await admin.from("order_items").insert(
    items.map((i) => ({
      order_id: orderId,
      product_id: i.product_id,
      product_name: i.product_name,
      product_image: i.product_image,
      unit_price: i.unit_price,
      quantity: i.quantity,
      options: i.options,
      line_total: i.line_total,
    }))
  );
  if (itemsError) {
    console.error("insert order_items:", itemsError.message);
  }

  await admin
    .from("order_status_history")
    .insert({ order_id: orderId, status: "nouvelle", note: null });

  // Upsert the customer record so returning customers are recognized.
  try {
    await admin.rpc("upsert_customer_from_order", {
      p_name: input.customerName,
      p_phone: input.customerPhone,
      p_wilaya: input.wilaya,
      p_total: total,
    });
  } catch {
    // Non-critical — the order itself has already been saved successfully.
  }

  return NextResponse.json({ orderNumber });
}
