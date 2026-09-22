// Core domain types for Crochet by Ahlem.
// These mirror the Supabase schema defined in /supabase/schema.sql.

export type UUID = string;

export interface Category {
  id: UUID;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: UUID;
  product_id: UUID;
  url: string;
  sort_order: number;
  alt_text: string | null;
}

export interface ProductVariant {
  id: UUID;
  product_id: UUID;
  label: string; // e.g. "Rose / Taille M"
  price_delta: number; // added to base price, can be 0
  stock_quantity: number | null; // null = not tracked
  is_available: boolean;
}

export type StockStatus = "en_stock" | "sur_commande" | "rupture";

export interface Product {
  id: UUID;
  slug: string;
  name: string;
  description: string;
  price: number; // DZD
  category_id: UUID | null;
  category?: Category | null;
  main_image_url: string;
  images: ProductImage[];
  colors: string[];
  sizes: string[];
  variants: ProductVariant[];
  stock_status: StockStatus;
  is_available: boolean;
  is_featured: boolean;
  is_customizable: boolean;
  production_time_days: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type WilayaName = string;

export interface DeliveryZone {
  id: UUID;
  wilaya: WilayaName;
  fee: number; // DZD, 0 = free
  is_enabled: boolean;
  note: string | null;
}

export interface CartItemOptions {
  color?: string;
  size?: string;
  variantId?: UUID;
  variantLabel?: string;
  note?: string;
}

export interface CartItem {
  id: string; // client-generated composite id (product + options)
  productId: UUID;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  options: CartItemOptions;
}

export type OrderStatus =
  | "nouvelle"
  | "confirmee"
  | "en_preparation"
  | "prete"
  | "expediee"
  | "livree"
  | "annulee";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  nouvelle: "Nouvelle",
  confirmee: "Confirmée",
  en_preparation: "En préparation",
  prete: "Prête",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
};

export const ORDER_STATUS_EMOJI: Record<OrderStatus, string> = {
  nouvelle: "🟡",
  confirmee: "🔵",
  en_preparation: "🟣",
  prete: "🟢",
  expediee: "🚚",
  livree: "✅",
  annulee: "🔴",
};

export interface OrderItem {
  id: UUID;
  order_id: UUID;
  product_id: UUID | null;
  product_name: string;
  product_image: string | null;
  unit_price: number;
  quantity: number;
  options: CartItemOptions;
  line_total: number;
}

export interface OrderStatusHistoryEntry {
  id: UUID;
  order_id: UUID;
  status: OrderStatus;
  note: string | null;
  created_at: string;
}

export interface Order {
  id: UUID;
  order_number: string; // CB-AH-2026-0042
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  commune: string;
  address: string;
  delivery_instructions: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  notes: string | null;
  status: OrderStatus;
  status_history?: OrderStatusHistoryEntry[];
  created_at: string;
  updated_at: string;
}

export type CustomRequestStatus =
  | "nouvelle_demande"
  | "en_discussion"
  | "devis_envoye"
  | "acceptee"
  | "en_preparation"
  | "terminee"
  | "refusee";

export const CUSTOM_STATUS_LABELS: Record<CustomRequestStatus, string> = {
  nouvelle_demande: "Nouvelle demande",
  en_discussion: "En discussion",
  devis_envoye: "Devis envoyé",
  acceptee: "Acceptée",
  en_preparation: "En préparation",
  terminee: "Terminée",
  refusee: "Refusée",
};

export type CreationType =
  | "amigurumi"
  | "poupee"
  | "personnage"
  | "bouquet"
  | "sac"
  | "porte_cles"
  | "decoration"
  | "cadeau"
  | "autre";

export const CREATION_TYPE_LABELS: Record<CreationType, string> = {
  amigurumi: "Amigurumi",
  poupee: "Poupée",
  personnage: "Personnage",
  bouquet: "Bouquet",
  sac: "Sac",
  porte_cles: "Porte-clés",
  decoration: "Décoration",
  cadeau: "Cadeau",
  autre: "Autre",
};

export type Occasion =
  | "anniversaire"
  | "mariage"
  | "cadeau"
  | "naissance"
  | "saint_valentin"
  | "decoration"
  | "autre";

export const OCCASION_LABELS: Record<Occasion, string> = {
  anniversaire: "Anniversaire",
  mariage: "Mariage",
  cadeau: "Cadeau",
  naissance: "Naissance",
  saint_valentin: "Saint-Valentin",
  decoration: "Décoration",
  autre: "Autre",
};

export type CreationSize = "petit" | "moyen" | "grand" | "personnalise";

export interface CustomRequestImage {
  id: UUID;
  request_id: UUID;
  url: string;
  sort_order: number;
}

export interface CustomRequest {
  id: UUID;
  request_number: string; // CUSTOM-2026-0028
  customer_name: string;
  customer_phone: string;
  wilaya: string;
  commune: string;
  address: string;
  creation_type: CreationType;
  description: string;
  colors: string[];
  size: CreationSize;
  custom_dimensions: string | null;
  quantity: number;
  occasion: Occasion;
  desired_date: string | null;
  budget: number | null;
  notes: string | null;
  images: CustomRequestImage[];
  status: CustomRequestStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: UUID;
  name: string;
  phone: string;
  wilaya: string | null;
  orders_count: number;
  total_spent: number;
  custom_requests_count: number;
  last_order_at: string | null;
  created_at: string;
}

// -----------------------------------------------------------------------------
// "Mon Carnet" — personal order tracker (phone/WhatsApp/in-person orders,
// separate from website checkout orders above).
// -----------------------------------------------------------------------------

export type PersonalOrderStatus = "en_cours" | "termine" | "livre" | "annule";

export const PERSONAL_ORDER_STATUS_LABELS: Record<PersonalOrderStatus, string> = {
  en_cours: "En cours",
  termine: "Terminé",
  livre: "Livré",
  annule: "Annulé",
};

export const PERSONAL_ORDER_STATUS_EMOJI: Record<PersonalOrderStatus, string> = {
  en_cours: "🟣",
  termine: "🟢",
  livre: "✅",
  annule: "🔴",
};

export interface PersonalOrderPayment {
  id: UUID;
  personal_order_id: UUID;
  amount: number;
  paid_at: string;
  note: string | null;
  created_at: string;
}

export interface PersonalOrder {
  id: UUID;
  client_name: string;
  client_phone: string;
  order_date: string;
  total_amount: number;
  deadline_days: number | null;
  status: PersonalOrderStatus;
  notes: string | null;
  payments: PersonalOrderPayment[];
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  business_name: string;
  instagram_username: string;
  whatsapp_number: string; // international format, e.g. 213555112233
  facebook_url: string | null;
  tiktok_url: string | null;
  business_description: string;
  default_production_days: number;
  custom_production_days: number;
  currency: string;
  free_delivery_threshold: number | null;
}
