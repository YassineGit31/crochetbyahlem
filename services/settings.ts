import { StoreSettings } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { getDemoSettings, updateDemoSettings } from "@/lib/demo-store";

export async function getSettings(): Promise<StoreSettings> {
  if (!isSupabaseConfigured()) return getDemoSettings();
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).single();
  if (error || !data) {
    console.error("getSettings:", error?.message);
    return DEFAULT_SETTINGS;
  }
  return data as StoreSettings;
}

export async function updateSettings(patch: Partial<StoreSettings>): Promise<StoreSettings> {
  if (!isSupabaseConfigured()) return updateDemoSettings(patch);
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { data, error } = await supabase
    .from("settings")
    .update(patch)
    .eq("id", 1)
    .select("*")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Erreur lors de la mise à jour.");
  return data as StoreSettings;
}
