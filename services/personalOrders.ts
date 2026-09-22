import { PersonalOrder, PersonalOrderStatus } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  listDemoPersonalOrders,
  findDemoPersonalOrderById,
  createDemoPersonalOrder,
  updateDemoPersonalOrder,
  updateDemoPersonalOrderStatus,
  deleteDemoPersonalOrder,
  addDemoPersonalOrderPayment,
} from "@/lib/demo-store";

// This service is only ever called from Server Components and Server Actions
// (see app/admin/(dashboard)/carnet/actions.ts), so it always uses the
// cookie-aware server client — this keeps the admin session working reliably
// for both reads and writes, on the server, without needing a separate API
// route for every mutation.

const SELECT = `*, personal_order_payments(*)`;

type SupaRow = {
  id: string;
  client_name: string;
  client_phone: string;
  order_date: string;
  total_amount: number;
  deadline_days: number | null;
  status: PersonalOrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  personal_order_payments: PersonalOrder["payments"];
};

function mapRow(row: SupaRow): PersonalOrder {
  return {
    id: row.id,
    client_name: row.client_name,
    client_phone: row.client_phone,
    order_date: row.order_date,
    total_amount: row.total_amount,
    deadline_days: row.deadline_days,
    status: row.status,
    notes: row.notes,
    payments: (row.personal_order_payments ?? []).sort(
      (a, b) => new Date(b.paid_at).getTime() - new Date(a.paid_at).getTime()
    ),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export type PersonalOrderInput = {
  client_name: string;
  client_phone: string;
  order_date: string;
  total_amount: number;
  deadline_days: number | null;
  notes: string | null;
};

export async function getPersonalOrders(): Promise<PersonalOrder[]> {
  if (!isSupabaseConfigured()) return listDemoPersonalOrders();
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("personal_orders")
    .select(SELECT)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getPersonalOrders:", error.message);
    return [];
  }
  return (data as unknown as SupaRow[]).map(mapRow);
}

export async function getPersonalOrderById(id: string): Promise<PersonalOrder | null> {
  if (!isSupabaseConfigured()) return findDemoPersonalOrderById(id);
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("personal_orders")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return mapRow(data as unknown as SupaRow);
}

export async function createPersonalOrder(input: PersonalOrderInput): Promise<PersonalOrder> {
  if (!isSupabaseConfigured()) {
    return createDemoPersonalOrder({ ...input, status: "en_cours" });
  }
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("personal_orders")
    .insert({ ...input, status: "en_cours" })
    .select(SELECT)
    .single();
  if (error) throw new Error(error.message);
  return mapRow(data as unknown as SupaRow);
}

export async function updatePersonalOrder(id: string, input: PersonalOrderInput): Promise<void> {
  if (!isSupabaseConfigured()) {
    updateDemoPersonalOrder(id, input);
    return;
  }
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("personal_orders").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updatePersonalOrderStatus(
  id: string,
  status: PersonalOrderStatus
): Promise<void> {
  if (!isSupabaseConfigured()) {
    updateDemoPersonalOrderStatus(id, status);
    return;
  }
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("personal_orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deletePersonalOrder(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    deleteDemoPersonalOrder(id);
    return;
  }
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("personal_orders").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function addPersonalOrderPayment(
  orderId: string,
  amount: number,
  note?: string
): Promise<void> {
  if (!isSupabaseConfigured()) {
    addDemoPersonalOrderPayment(orderId, amount, note);
    return;
  }
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("personal_order_payments")
    .insert({ personal_order_id: orderId, amount, note: note ?? null });
  if (error) throw new Error(error.message);
}

export async function deletePersonalOrderPayment(paymentId: string): Promise<void> {
  if (!isSupabaseConfigured()) return; // demo mode: not needed for the local walkthrough
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("personal_order_payments").delete().eq("id", paymentId);
  if (error) throw new Error(error.message);
}
