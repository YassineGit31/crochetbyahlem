import { DeliveryZone } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  listDemoDeliveryZones,
  createDemoDeliveryZone,
  updateDemoDeliveryZone,
  deleteDemoDeliveryZone,
} from "@/lib/demo-store";

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  if (!isSupabaseConfigured()) return listDemoDeliveryZones().filter((z) => z.is_enabled);
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .eq("is_enabled", true)
    .order("wilaya", { ascending: true });
  if (error) {
    console.error("getDeliveryZones:", error.message);
    return listDemoDeliveryZones();
  }
  return data as DeliveryZone[];
}

/** Admin listing — includes disabled zones too. */
export async function getAllDeliveryZones(): Promise<DeliveryZone[]> {
  if (!isSupabaseConfigured()) return listDemoDeliveryZones();
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("delivery_zones")
    .select("*")
    .order("wilaya", { ascending: true });
  if (error) {
    console.error("getAllDeliveryZones:", error.message);
    return listDemoDeliveryZones();
  }
  return data as DeliveryZone[];
}

export type DeliveryZoneInput = Omit<DeliveryZone, "id">;

export async function createDeliveryZone(input: DeliveryZoneInput): Promise<DeliveryZone> {
  if (!isSupabaseConfigured()) return createDemoDeliveryZone(input);
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data, error } = await supabase.from("delivery_zones").insert(input).select("*").single();
  if (error || !data) throw new Error(error?.message ?? "Erreur lors de la création.");
  return data as DeliveryZone;
}

export async function updateDeliveryZone(id: string, input: Partial<DeliveryZoneInput>): Promise<void> {
  if (!isSupabaseConfigured()) {
    updateDemoDeliveryZone(id, input);
    return;
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { error } = await supabase.from("delivery_zones").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteDeliveryZone(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    deleteDemoDeliveryZone(id);
    return;
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { error } = await supabase.from("delivery_zones").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
