import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isServiceRoleConfigured(): boolean {
  return Boolean(url && serviceRoleKey);
}

/**
 * Bypasses Row Level Security. Never import this file from a Client
 * Component and never send SUPABASE_SERVICE_ROLE_KEY to the browser —
 * it is deliberately NOT prefixed with NEXT_PUBLIC_.
 *
 * Used only inside app/api/** route handlers to:
 *  - re-validate product prices/availability server-side before an order
 *    is written (never trust the price sent by the client), and
 *  - write orders/custom requests with a server-generated order number.
 */
export function createAdminClient() {
  if (!isServiceRoleConfigured()) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquant. Ajoutez-le dans .env.local (voir .env.example)."
    );
  }
  return createSupabaseClient(url as string, serviceRoleKey as string, {
    auth: { persistSession: false },
  });
}
