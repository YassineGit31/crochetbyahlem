import {
  Order,
  CustomRequest,
  Product,
  Category,
  DeliveryZone,
  StoreSettings,
  PersonalOrder,
  PersonalOrderStatus,
} from "@/types";
import { demoOrders, demoCustomRequests, demoProducts, demoCategories, demoDeliveryZones } from "@/services/demo-data";
import { DEFAULT_SETTINGS } from "@/lib/constants";
import { slugify } from "@/lib/utils";

// Module-level state persists for the lifetime of the Node process, which is
// enough to demo the full "submit order -> confirmation page" flow locally
// before a real Supabase project is connected. It intentionally does NOT
// persist across server restarts or serverless cold starts — see
// README.md "Mode démo" for details.

declare global {
  // eslint-disable-next-line no-var
  var __demoOrders: Order[] | undefined;
  // eslint-disable-next-line no-var
  var __demoCustomRequests: CustomRequest[] | undefined;
  // eslint-disable-next-line no-var
  var __demoProducts: Product[] | undefined;
  // eslint-disable-next-line no-var
  var __demoCategories: Category[] | undefined;
  // eslint-disable-next-line no-var
  var __demoDeliveryZones: DeliveryZone[] | undefined;
  // eslint-disable-next-line no-var
  var __demoSettings: StoreSettings | undefined;
  // eslint-disable-next-line no-var
  var __demoPersonalOrders: PersonalOrder[] | undefined;
}

function getOrdersStore(): Order[] {
  if (!global.__demoOrders) global.__demoOrders = [...demoOrders];
  return global.__demoOrders;
}

function getRequestsStore(): CustomRequest[] {
  if (!global.__demoCustomRequests) global.__demoCustomRequests = [...demoCustomRequests];
  return global.__demoCustomRequests;
}

function getProductsStore(): Product[] {
  if (!global.__demoProducts) global.__demoProducts = [...demoProducts];
  return global.__demoProducts;
}

function getCategoriesStore(): Category[] {
  if (!global.__demoCategories) global.__demoCategories = [...demoCategories];
  return global.__demoCategories;
}

function getDeliveryZonesStore(): DeliveryZone[] {
  if (!global.__demoDeliveryZones) global.__demoDeliveryZones = [...demoDeliveryZones];
  return global.__demoDeliveryZones;
}

function getSettingsStore(): StoreSettings {
  if (!global.__demoSettings) global.__demoSettings = { ...DEFAULT_SETTINGS };
  return global.__demoSettings;
}

function getPersonalOrdersStore(): PersonalOrder[] {
  if (!global.__demoPersonalOrders) global.__demoPersonalOrders = [];
  return global.__demoPersonalOrders;
}

export function addDemoOrder(order: Order) {
  getOrdersStore().unshift(order);
}

export function findDemoOrderByNumber(orderNumber: string): Order | null {
  return getOrdersStore().find((o) => o.order_number === orderNumber) ?? null;
}

export function listDemoOrders(): Order[] {
  return getOrdersStore();
}

export function nextDemoOrderNumber(): string {
  const year = new Date().getFullYear();
  const store = getOrdersStore();
  const sequences = store
    .map((o) => o.order_number.match(/(\d{4})-(\d{4})$/))
    .filter((m): m is RegExpMatchArray => Boolean(m) && Number(m![1]) === year)
    .map((m) => Number(m[2]));
  const next = (sequences.length > 0 ? Math.max(...sequences) : 0) + 1;
  return `CB-AH-${year}-${String(next).padStart(4, "0")}`;
}

export function nextDemoCustomRequestNumber(): string {
  const year = new Date().getFullYear();
  const store = getRequestsStore();
  const sequences = store
    .map((r) => r.request_number.match(/(\d{4})-(\d{4})$/))
    .filter((m): m is RegExpMatchArray => Boolean(m) && Number(m![1]) === year)
    .map((m) => Number(m[2]));
  const next = (sequences.length > 0 ? Math.max(...sequences) : 0) + 1;
  return `CUSTOM-${year}-${String(next).padStart(4, "0")}`;
}

export function updateDemoOrderStatus(id: string, status: Order["status"]) {
  const store = getOrdersStore();
  const order = store.find((o) => o.id === id);
  if (order) {
    order.status = status;
    order.updated_at = new Date().toISOString();
  }
}

export function updateDemoCustomRequestStatus(id: string, status: CustomRequest["status"]) {
  const store = getRequestsStore();
  const request = store.find((r) => r.id === id);
  if (request) {
    request.status = status;
    request.updated_at = new Date().toISOString();
  }
}

export function updateDemoCustomRequestNotes(id: string, adminNotes: string) {
  const store = getRequestsStore();
  const request = store.find((r) => r.id === id);
  if (request) {
    request.admin_notes = adminNotes;
    request.updated_at = new Date().toISOString();
  }
}
export function addDemoCustomRequest(request: CustomRequest) {
  getRequestsStore().unshift(request);
}

export function findDemoCustomRequestByNumber(requestNumber: string): CustomRequest | null {
  return getRequestsStore().find((r) => r.request_number === requestNumber) ?? null;
}

export function findDemoCustomRequestById(id: string): CustomRequest | null {
  return getRequestsStore().find((r) => r.id === id) ?? null;
}

export function listDemoCustomRequests(): CustomRequest[] {
  return getRequestsStore();
}

// ---------------------------------------------------------------------------
// Products (demo-mode admin CRUD)
// ---------------------------------------------------------------------------

export function listDemoProducts(): Product[] {
  return getProductsStore();
}

export function findDemoProductById(id: string): Product | null {
  return getProductsStore().find((p) => p.id === id) ?? null;
}

export function createDemoProduct(input: Omit<Product, "id" | "created_at" | "updated_at" | "slug"> & { slug?: string }): Product {
  const store = getProductsStore();
  const now = new Date().toISOString();
  const product: Product = {
    ...input,
    id: crypto.randomUUID(),
    slug: input.slug || `${slugify(input.name)}-${Math.random().toString(36).slice(2, 6)}`,
    created_at: now,
    updated_at: now,
  };
  store.unshift(product);
  return product;
}

export function updateDemoProduct(id: string, patch: Partial<Product>): Product | null {
  const store = getProductsStore();
  const index = store.findIndex((p) => p.id === id);
  if (index === -1) return null;
  store[index] = { ...store[index], ...patch, updated_at: new Date().toISOString() };
  return store[index];
}

export function deleteDemoProduct(id: string) {
  global.__demoProducts = getProductsStore().filter((p) => p.id !== id);
}

export function duplicateDemoProduct(id: string): Product | null {
  const original = findDemoProductById(id);
  if (!original) return null;
  return createDemoProduct({
    ...original,
    name: `${original.name} (copie)`,
    is_featured: false,
  });
}

// ---------------------------------------------------------------------------
// Categories (demo-mode admin CRUD)
// ---------------------------------------------------------------------------

export function listDemoCategories(): Category[] {
  return getCategoriesStore();
}

export function createDemoCategory(input: Omit<Category, "id" | "created_at" | "updated_at" | "slug"> & { slug?: string }): Category {
  const store = getCategoriesStore();
  const now = new Date().toISOString();
  const category: Category = {
    ...input,
    id: crypto.randomUUID(),
    slug: input.slug || slugify(input.name),
    created_at: now,
    updated_at: now,
  };
  store.push(category);
  return category;
}

export function updateDemoCategory(id: string, patch: Partial<Category>): Category | null {
  const store = getCategoriesStore();
  const index = store.findIndex((c) => c.id === id);
  if (index === -1) return null;
  store[index] = { ...store[index], ...patch, updated_at: new Date().toISOString() };
  return store[index];
}

export function deleteDemoCategory(id: string) {
  global.__demoCategories = getCategoriesStore().filter((c) => c.id !== id);
}

// ---------------------------------------------------------------------------
// Delivery zones (demo-mode admin CRUD)
// ---------------------------------------------------------------------------

export function listDemoDeliveryZones(): DeliveryZone[] {
  return getDeliveryZonesStore();
}

export function createDemoDeliveryZone(input: Omit<DeliveryZone, "id">): DeliveryZone {
  const zone: DeliveryZone = { ...input, id: crypto.randomUUID() };
  getDeliveryZonesStore().push(zone);
  return zone;
}

export function updateDemoDeliveryZone(id: string, patch: Partial<DeliveryZone>): DeliveryZone | null {
  const store = getDeliveryZonesStore();
  const index = store.findIndex((z) => z.id === id);
  if (index === -1) return null;
  store[index] = { ...store[index], ...patch };
  return store[index];
}

export function deleteDemoDeliveryZone(id: string) {
  global.__demoDeliveryZones = getDeliveryZonesStore().filter((z) => z.id !== id);
}

// ---------------------------------------------------------------------------
// Settings (demo-mode)
// ---------------------------------------------------------------------------

export function getDemoSettings(): StoreSettings {
  return getSettingsStore();
}

export function updateDemoSettings(patch: Partial<StoreSettings>): StoreSettings {
  global.__demoSettings = { ...getSettingsStore(), ...patch };
  return global.__demoSettings;
}

// ---------------------------------------------------------------------------
// "Mon Carnet" — personal orders (demo-mode)
// ---------------------------------------------------------------------------

export function listDemoPersonalOrders(): PersonalOrder[] {
  return [...getPersonalOrdersStore()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function findDemoPersonalOrderById(id: string): PersonalOrder | null {
  return getPersonalOrdersStore().find((o) => o.id === id) ?? null;
}

export function createDemoPersonalOrder(
  input: Omit<PersonalOrder, "id" | "payments" | "created_at" | "updated_at">
): PersonalOrder {
  const now = new Date().toISOString();
  const order: PersonalOrder = {
    ...input,
    id: crypto.randomUUID(),
    payments: [],
    created_at: now,
    updated_at: now,
  };
  getPersonalOrdersStore().unshift(order);
  return order;
}

export function updateDemoPersonalOrder(
  id: string,
  patch: Partial<Pick<PersonalOrder, "client_name" | "client_phone" | "order_date" | "total_amount" | "deadline_days" | "notes">>
): PersonalOrder | null {
  const order = findDemoPersonalOrderById(id);
  if (!order) return null;
  Object.assign(order, patch, { updated_at: new Date().toISOString() });
  return order;
}

export function updateDemoPersonalOrderStatus(id: string, status: PersonalOrderStatus) {
  const order = findDemoPersonalOrderById(id);
  if (order) {
    order.status = status;
    order.updated_at = new Date().toISOString();
  }
}

export function deleteDemoPersonalOrder(id: string) {
  global.__demoPersonalOrders = getPersonalOrdersStore().filter((o) => o.id !== id);
}

export function addDemoPersonalOrderPayment(
  orderId: string,
  amount: number,
  note?: string
): PersonalOrder | null {
  const order = findDemoPersonalOrderById(orderId);
  if (!order) return null;
  order.payments.unshift({
    id: crypto.randomUUID(),
    personal_order_id: orderId,
    amount,
    paid_at: new Date().toISOString().slice(0, 10),
    note: note ?? null,
    created_at: new Date().toISOString(),
  });
  order.updated_at = new Date().toISOString();
  return order;
}
