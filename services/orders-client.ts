"use client";

// Browser-only mutation for the admin order-detail page. Kept in its own file
// (separate from services/orders.ts) because that file also exports
// server-only reads that import next/headers — bundling both together broke
// `next build` when a Client Component imported anything from it.

import { OrderStatus } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { updateDemoOrderStatus } from "@/lib/demo-store";

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  note?: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    updateDemoOrderStatus(id, status);
    return;
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { error: updateError } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (updateError) throw new Error(updateError.message);

  const { error: historyError } = await supabase
    .from("order_status_history")
    .insert({ order_id: id, status, note: note ?? null });
  if (historyError) throw new Error(historyError.message);
}
