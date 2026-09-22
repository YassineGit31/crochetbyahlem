"use client";

// Browser-only mutations for the admin custom-request detail page. Kept in
// its own file (separate from services/customRequests.ts) because that file
// also exports server-only reads that import next/headers — bundling both
// together broke `next build` when a Client Component imported anything
// from it.

import { CustomRequestStatus } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { updateDemoCustomRequestStatus, updateDemoCustomRequestNotes } from "@/lib/demo-store";

export async function updateCustomRequestStatus(
  id: string,
  status: CustomRequestStatus
): Promise<void> {
  if (!isSupabaseConfigured()) {
    updateDemoCustomRequestStatus(id, status);
    return;
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { error } = await supabase
    .from("custom_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateCustomRequestAdminNotes(id: string, adminNotes: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    updateDemoCustomRequestNotes(id, adminNotes);
    return;
  }
  const { createClient } = await import("@/lib/supabase/client");
  const supabase = createClient();
  const { error } = await supabase
    .from("custom_requests")
    .update({ admin_notes: adminNotes, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
