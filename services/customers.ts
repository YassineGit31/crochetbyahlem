import { Customer } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { demoCustomers } from "./demo-data";

export async function getCustomers(): Promise<Customer[]> {
  if (!isSupabaseConfigured()) return demoCustomers;
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("last_order_at", { ascending: false, nullsFirst: false });
  if (error) {
    console.error("getCustomers:", error.message);
    return demoCustomers;
  }
  return data as Customer[];
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  if (!isSupabaseConfigured()) return demoCustomers.find((c) => c.id === id) ?? null;
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("customers").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as Customer;
}
