import { CustomRequest } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { listDemoCustomRequests, findDemoCustomRequestById } from "@/lib/demo-store";

const SELECT = `*, custom_request_images(*)`;

type SupaRow = Omit<CustomRequest, "images" | "colors"> & {
  colors: string[] | null;
  custom_request_images?: CustomRequest["images"];
};

function mapRow(row: SupaRow): CustomRequest {
  return {
    ...row,
    colors: row.colors ?? [],
    images: row.custom_request_images ?? [],
  };
}

export async function getCustomRequests(): Promise<CustomRequest[]> {
  if (!isSupabaseConfigured()) return listDemoCustomRequests();
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  // TEMP DEBUG — remove once the empty-admin-list issue is resolved.
  const { data: debugUser, error: debugUserError } = await supabase.auth.getUser();
  console.log(
    "[DEBUG getCustomRequests] auth.getUser() ->",
    debugUser?.user?.id ?? null,
    debugUser?.user?.email ?? null,
    debugUserError?.message ?? null
  );
  const { data, error } = await supabase
    .from("custom_requests")
    .select(SELECT)
    .order("created_at", { ascending: false });
  console.log(
    "[DEBUG getCustomRequests] rows:",
    data?.length ?? 0,
    "error:",
    error?.message ?? null,
    error?.code ?? null
  );
  if (error) {
    console.error("getCustomRequests:", error.message);
    return listDemoCustomRequests();
  }
  return (data as unknown as SupaRow[]).map(mapRow);
}

export async function getCustomRequestById(id: string): Promise<CustomRequest | null> {
  if (!isSupabaseConfigured()) return findDemoCustomRequestById(id);
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("custom_requests").select(SELECT).eq("id", id).single();
  if (error || !data) return null;
  return mapRow(data as unknown as SupaRow);
}

