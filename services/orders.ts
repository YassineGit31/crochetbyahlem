import { Order, OrderStatus } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { isServiceRoleConfigured } from "@/lib/supabase/admin";
import { listDemoOrders, findDemoOrderByNumber } from "@/lib/demo-store";

const SELECT = `*, order_items(*), order_status_history(*)`;

type SupaOrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  commune: string;
  address: string;
  delivery_instructions: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  order_items: Order["items"];
  order_status_history?: Order["status_history"];
};

function mapRow(row: SupaOrderRow): Order {
  return {
    id: row.id,
    order_number: row.order_number,
    customer_name: row.customer_name,
    customer_phone: row.customer_phone,
    wilaya: row.wilaya,
    commune: row.commune,
    address: row.address,
    delivery_instructions: row.delivery_instructions,
    items: row.order_items ?? [],
    subtotal: row.subtotal,
    delivery_fee: row.delivery_fee,
    total: row.total,
    notes: row.notes,
    status: row.status,
    status_history: row.order_status_history,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Admin listing — a Server Component call, so it needs the cookie-bound
 * server client (not the plain browser client) or the admin's session isn't
 * attached and RLS ("orders_admin_only") silently returns nothing.
 */
export async function getOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return listDemoOrders();
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select(SELECT)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getOrders:", error.message);
    return listDemoOrders();
  }
  return (data as unknown as SupaOrderRow[]).map(mapRow);
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!isSupabaseConfigured()) return listDemoOrders().find((o) => o.id === id) ?? null;
  const { createServerSupabaseClient } = await import("@/lib/supabase/server");
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("orders").select(SELECT).eq("id", id).single();
  if (error || !data) return null;
  return mapRow(data as unknown as SupaOrderRow);
}

/**
 * Looks up an order by its public-facing order number, for the customer-facing
 * confirmation page right after checkout. There is no admin/customer session at
 * that point, and RLS on `orders` restricts reads to admins (see
 * supabase/schema.sql, "orders_admin_only") — so, like the /api/orders write
 * path, this deliberately uses the service-role admin client to bypass RLS.
 * Only call this with a value that came from the URL of a page the order's
 * own confirmation redirect sent the customer to, never with user-supplied
 * search input.
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  if (!isSupabaseConfigured() || !isServiceRoleConfigured()) {
    return findDemoOrderByNumber(orderNumber);
  }
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("orders")
    .select(SELECT)
    .eq("order_number", orderNumber)
    .single();
  if (error || !data) return null;
  return mapRow(data as unknown as SupaOrderRow);
}

