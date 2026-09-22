-- =============================================================================
-- CROCHET BY AHLEM — SUPABASE SCHEMA
-- =============================================================================
-- Run this once in your Supabase project's SQL Editor (Database > SQL Editor).
-- It creates every table, function, trigger and Row Level Security policy the
-- app needs. Safe to re-run: destructive statements are guarded with
-- IF EXISTS / IF NOT EXISTS wherever practical.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. TABLES
-- -----------------------------------------------------------------------------

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int not null default 0,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null default 0,
  category_id uuid references categories (id) on delete set null,
  main_image_url text not null,
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  stock_status text not null default 'en_stock' check (stock_status in ('en_stock', 'sur_commande', 'rupture')),
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_customizable boolean not null default true,
  production_time_days int not null default 7,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  alt_text text
);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products (id) on delete cascade,
  label text not null,
  price_delta numeric(10, 2) not null default 0,
  stock_quantity int,
  is_available boolean not null default true
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  customer_phone text not null,
  wilaya text not null,
  commune text not null,
  address text not null,
  delivery_instructions text,
  subtotal numeric(10, 2) not null default 0,
  delivery_fee numeric(10, 2) not null default 0,
  total numeric(10, 2) not null default 0,
  notes text,
  status text not null default 'nouvelle' check (
    status in ('nouvelle', 'confirmee', 'en_preparation', 'prete', 'expediee', 'livree', 'annulee')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  product_name text not null,
  product_image text,
  unit_price numeric(10, 2) not null default 0,
  quantity int not null default 1,
  options jsonb not null default '{}'::jsonb,
  line_total numeric(10, 2) not null default 0
);

create table if not exists order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  status text not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists custom_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique,
  customer_name text not null,
  customer_phone text not null,
  wilaya text not null,
  commune text not null,
  address text not null,
  creation_type text not null,
  description text not null,
  colors text[] not null default '{}',
  size text not null default 'moyen' check (size in ('petit', 'moyen', 'grand', 'personnalise')),
  custom_dimensions text,
  quantity int not null default 1,
  occasion text not null,
  desired_date date,
  budget numeric(10, 2),
  notes text,
  status text not null default 'nouvelle_demande' check (
    status in ('nouvelle_demande', 'en_discussion', 'devis_envoye', 'acceptee', 'en_preparation', 'terminee', 'refusee')
  ),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists custom_request_images (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references custom_requests (id) on delete cascade,
  url text not null,
  sort_order int not null default 0
);

create table if not exists delivery_zones (
  id uuid primary key default gen_random_uuid(),
  wilaya text not null unique,
  fee numeric(10, 2) not null default 0,
  is_enabled boolean not null default true,
  note text
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  wilaya text,
  orders_count int not null default 0,
  total_spent numeric(10, 2) not null default 0,
  custom_requests_count int not null default 0,
  last_order_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists settings (
  id int primary key default 1 check (id = 1),
  business_name text not null default 'Crochet by Ahlem',
  instagram_username text not null default 'crochetbyahlem',
  whatsapp_number text not null default '213500000000',
  facebook_url text,
  tiktok_url text,
  business_description text not null default '',
  default_production_days int not null default 7,
  custom_production_days int not null default 20,
  currency text not null default 'DA',
  free_delivery_threshold numeric(10, 2)
);

insert into settings (id) values (1) on conflict (id) do nothing;

-- Order/custom-request reference number counters, one row per year.
create table if not exists order_number_counters (
  year int primary key,
  counter int not null default 0
);

create table if not exists custom_request_number_counters (
  year int primary key,
  counter int not null default 0
);

-- -----------------------------------------------------------------------------
-- 2. FUNCTIONS & TRIGGERS
-- -----------------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_categories_updated_at on categories;
create trigger trg_categories_updated_at before update on categories
  for each row execute function set_updated_at();

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at before update on orders
  for each row execute function set_updated_at();

drop trigger if exists trg_custom_requests_updated_at on custom_requests;
create trigger trg_custom_requests_updated_at before update on custom_requests
  for each row execute function set_updated_at();

-- Generates "CB-AH-2026-0042" style order numbers, sequential per calendar year.
create or replace function next_order_number()
returns text as $$
declare
  y int := extract(year from now());
  c int;
begin
  insert into order_number_counters (year, counter) values (y, 1)
    on conflict (year) do update set counter = order_number_counters.counter + 1
    returning counter into c;
  return 'CB-AH-' || y || '-' || lpad(c::text, 4, '0');
end;
$$ language plpgsql security definer;

-- Generates "CUSTOM-2026-0028" style request numbers, sequential per year.
create or replace function next_custom_request_number()
returns text as $$
declare
  y int := extract(year from now());
  c int;
begin
  insert into custom_request_number_counters (year, counter) values (y, 1)
    on conflict (year) do update set counter = custom_request_number_counters.counter + 1
    returning counter into c;
  return 'CUSTOM-' || y || '-' || lpad(c::text, 4, '0');
end;
$$ language plpgsql security definer;

-- Called by the server-side order API (service role) after an order is
-- inserted, so returning customers are recognized in the admin dashboard.
create or replace function upsert_customer_from_order(
  p_name text, p_phone text, p_wilaya text, p_total numeric
)
returns void as $$
begin
  insert into customers (name, phone, wilaya, orders_count, total_spent, last_order_at)
    values (p_name, p_phone, p_wilaya, 1, p_total, now())
    on conflict (phone) do update set
      name = excluded.name,
      wilaya = excluded.wilaya,
      orders_count = customers.orders_count + 1,
      total_spent = customers.total_spent + excluded.total_spent,
      last_order_at = now();
end;
$$ language plpgsql security definer;

-- Keeps customers.custom_requests_count in sync whenever a new request comes in.
create or replace function bump_customer_custom_requests()
returns trigger as $$
begin
  insert into customers (name, phone, wilaya, custom_requests_count)
    values (new.customer_name, new.customer_phone, new.wilaya, 1)
    on conflict (phone) do update set
      custom_requests_count = customers.custom_requests_count + 1;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_bump_customer_custom_requests on custom_requests;
create trigger trg_bump_customer_custom_requests after insert on custom_requests
  for each row execute function bump_customer_custom_requests();

-- Returns true if the currently authenticated user is a registered admin.
-- Used inside RLS policies below.
create or replace function is_admin()
returns boolean as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$ language sql security definer stable;

-- -----------------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

alter table admins enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;
alter table custom_requests enable row level security;
alter table custom_request_images enable row level security;
alter table delivery_zones enable row level security;
alter table customers enable row level security;
alter table settings enable row level security;

-- admins: a user may check their own membership; only admins manage the list.
drop policy if exists "admins_select_self" on admins;
create policy "admins_select_self" on admins for select
  using (user_id = auth.uid() or is_admin());
drop policy if exists "admins_write_admin_only" on admins;
create policy "admins_write_admin_only" on admins for all
  using (is_admin()) with check (is_admin());

-- categories: public can read enabled categories, admins manage everything.
drop policy if exists "categories_public_read" on categories;
create policy "categories_public_read" on categories for select
  using (is_enabled = true or is_admin());
drop policy if exists "categories_admin_write" on categories;
create policy "categories_admin_write" on categories for insert with check (is_admin());
drop policy if exists "categories_admin_update" on categories;
create policy "categories_admin_update" on categories for update using (is_admin());
drop policy if exists "categories_admin_delete" on categories;
create policy "categories_admin_delete" on categories for delete using (is_admin());

-- products: public can read available products, admins manage everything.
drop policy if exists "products_public_read" on products;
create policy "products_public_read" on products for select
  using (is_available = true or is_admin());
drop policy if exists "products_admin_insert" on products;
create policy "products_admin_insert" on products for insert with check (is_admin());
drop policy if exists "products_admin_update" on products;
create policy "products_admin_update" on products for update using (is_admin());
drop policy if exists "products_admin_delete" on products;
create policy "products_admin_delete" on products for delete using (is_admin());

drop policy if exists "product_images_public_read" on product_images;
create policy "product_images_public_read" on product_images for select using (true);
drop policy if exists "product_images_admin_write" on product_images;
create policy "product_images_admin_write" on product_images for all
  using (is_admin()) with check (is_admin());

drop policy if exists "product_variants_public_read" on product_variants;
create policy "product_variants_public_read" on product_variants for select using (true);
drop policy if exists "product_variants_admin_write" on product_variants;
create policy "product_variants_admin_write" on product_variants for all
  using (is_admin()) with check (is_admin());

-- orders / order_items / order_status_history: customers never read or write
-- directly — every write goes through the /api/orders route using the
-- service role key, which bypasses RLS after re-validating prices
-- server-side. Only admins can read/update through the dashboard.
drop policy if exists "orders_admin_only" on orders;
create policy "orders_admin_only" on orders for all using (is_admin()) with check (is_admin());
drop policy if exists "order_items_admin_only" on order_items;
create policy "order_items_admin_only" on order_items for all using (is_admin()) with check (is_admin());
drop policy if exists "order_status_history_admin_only" on order_status_history;
create policy "order_status_history_admin_only" on order_status_history for all
  using (is_admin()) with check (is_admin());

-- custom_requests / custom_request_images: same reasoning — writes happen
-- via the service role in /api/custom-requests.
drop policy if exists "custom_requests_admin_only" on custom_requests;
create policy "custom_requests_admin_only" on custom_requests for all
  using (is_admin()) with check (is_admin());
drop policy if exists "custom_request_images_admin_only" on custom_request_images;
create policy "custom_request_images_admin_only" on custom_request_images for all
  using (is_admin()) with check (is_admin());

-- delivery_zones: public reads enabled zones (to compute fees at checkout);
-- admins manage everything.
drop policy if exists "delivery_zones_public_read" on delivery_zones;
create policy "delivery_zones_public_read" on delivery_zones for select
  using (is_enabled = true or is_admin());
drop policy if exists "delivery_zones_admin_write" on delivery_zones;
create policy "delivery_zones_admin_write" on delivery_zones for all
  using (is_admin()) with check (is_admin());

-- customers: admin-only, never exposed to the public.
drop policy if exists "customers_admin_only" on customers;
create policy "customers_admin_only" on customers for all using (is_admin()) with check (is_admin());

-- settings: public can read (storefront needs the WhatsApp number, Instagram
-- handle, etc.), only admins can update.
drop policy if exists "settings_public_read" on settings;
create policy "settings_public_read" on settings for select using (true);
drop policy if exists "settings_admin_update" on settings;
create policy "settings_admin_update" on settings for update using (is_admin());

-- -----------------------------------------------------------------------------
-- 4. STORAGE BUCKETS
-- -----------------------------------------------------------------------------
-- Public buckets so product/category photos and inspiration images can be
-- displayed directly via their public URL.

insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('category-images', 'category-images', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('custom-request-images', 'custom-request-images', true)
  on conflict (id) do nothing;

drop policy if exists "product_images_bucket_public_read" on storage.objects;
create policy "product_images_bucket_public_read" on storage.objects for select
  using (bucket_id in ('product-images', 'category-images', 'custom-request-images'));

drop policy if exists "product_images_bucket_admin_write" on storage.objects;
create policy "product_images_bucket_admin_write" on storage.objects for all
  using (bucket_id in ('product-images', 'category-images') and is_admin())
  with check (bucket_id in ('product-images', 'category-images') and is_admin());

-- Anyone can upload an inspiration image for a custom request — this is the
-- one deliberate public-write exception, needed before the request row (and
-- its admin ownership) exists yet. Uploaded files are write-once (no update)
-- and the bucket only serves static images, so this does not expose any
-- customer data.
drop policy if exists "custom_request_images_bucket_public_insert" on storage.objects;
create policy "custom_request_images_bucket_public_insert" on storage.objects for insert
  with check (bucket_id = 'custom-request-images');

-- =============================================================================
-- NEXT STEPS
-- =============================================================================
-- 1. In Supabase Auth, create the admin user (Authentication > Users > Add user).
-- 2. Then run, replacing the email:
--
--      insert into admins (user_id, name)
--      select id, 'Ahlem' from auth.users where email = 'ahlem@example.com';
--
-- 3. (Optional) Run seed.sql to populate demo products/categories/delivery
--    zones so the storefront isn't empty on first deploy.
-- =============================================================================
