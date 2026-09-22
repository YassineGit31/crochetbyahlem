-- -----------------------------------------------------------------------------
-- "Mon Carnet" — personal order tracker for orders taken by phone/WhatsApp/
-- in-person, separate from the website's automatic checkout orders.
-- Run this once in the Supabase SQL Editor, AFTER schema.sql has already
-- been run (it reuses the is_admin() function defined there).
-- -----------------------------------------------------------------------------

create table if not exists personal_orders (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_phone text not null,
  order_date date not null default current_date,
  total_amount numeric(10, 2) not null default 0,
  deadline_days integer,
  status text not null default 'en_cours'
    check (status in ('en_cours', 'termine', 'livre', 'annule')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists personal_order_payments (
  id uuid primary key default gen_random_uuid(),
  personal_order_id uuid not null references personal_orders(id) on delete cascade,
  amount numeric(10, 2) not null,
  paid_at date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists personal_order_payments_order_id_idx
  on personal_order_payments(personal_order_id);

-- Keep updated_at fresh on every edit.
create or replace function bump_personal_order_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists personal_orders_bump_updated_at on personal_orders;
create trigger personal_orders_bump_updated_at
  before update on personal_orders
  for each row execute function bump_personal_order_updated_at();

-- Row Level Security — admin-only, exactly like the rest of the dashboard.
alter table personal_orders enable row level security;
alter table personal_order_payments enable row level security;

drop policy if exists "personal_orders_admin_only" on personal_orders;
create policy "personal_orders_admin_only" on personal_orders for all
  using (is_admin()) with check (is_admin());

drop policy if exists "personal_order_payments_admin_only" on personal_order_payments;
create policy "personal_order_payments_admin_only" on personal_order_payments for all
  using (is_admin()) with check (is_admin());
