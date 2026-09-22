import { createBrowserClient } from "@supabase/ssr";

// Note: no "use client" directive here on purpose. This module exports plain
// functions (no React state/hooks), and is imported from both Server
// Components (services/*.ts, for the config check) and Client Components
// (for the actual browser client). Marking it "use client" would turn every
// export into an opaque client-component reference when imported from the
// server, which breaks `isSupabaseConfigured()` there.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Whether real Supabase credentials are present.
 * When false, the storefront gracefully falls back to demo/seed data so the
 * site is still fully browsable during local development, and admin writes
 * show a clear "demo mode" notice instead of failing silently.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey && !url.includes("YOUR_SUPABASE_URL"));
}

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/** Browser-side Supabase client (safe to use in client components). */
export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase n'est pas configuré. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local."
    );
  }
  if (!browserClient) {
    browserClient = createBrowserClient(url as string, anonKey as string);
  }
  return browserClient;
}
