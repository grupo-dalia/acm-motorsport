-- ACM MOTORSPORT · Esquema inicial (Fase 3)
-- Preparado, NO aplicado. Revisar antes de ejecutar: `supabase db push` o SQL editor.
-- Importes en céntimos (integer). Fechas en timestamptz (UTC).

create extension if not exists "pgcrypto";

-- ───────── Catálogo ─────────
create type fulfillment_type as enum ('acm', 'pod', 'affiliate');

create table products (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  tagline         text,
  description     text,
  category        text not null,
  collection      text,
  fulfillment     fulfillment_type not null,
  price_cents     integer not null check (price_cents >= 0),
  unit_cost_cents integer check (unit_cost_cents >= 0),
  vat_rate        numeric(4,3) not null default 0.21,
  featured        boolean not null default false,
  active          boolean not null default false,
  affiliate_url   text,
  affiliate_partner text,
  provider        text,               -- 'printful' | 'manual'
  provider_product_id text,
  seo             jsonb not null default '{}',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table product_variants (
  id                  uuid primary key default gen_random_uuid(),
  product_id          uuid not null references products(id) on delete cascade,
  sku                 text not null unique,
  color               text,
  size                text,
  price_cents         integer not null check (price_cents >= 0),
  stock               integer,          -- null = bajo demanda
  available           boolean not null default true,
  provider_variant_id text,
  unique (product_id, color, size)
);

create table product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  variant_id  uuid references product_variants(id) on delete cascade,
  url         text not null,
  alt         text not null,
  position    smallint not null default 0
);

create table coupons (
  code        text primary key,
  percent_off numeric(5,4) check (percent_off > 0 and percent_off <= 1),
  amount_off_cents integer check (amount_off_cents > 0),
  starts_at   timestamptz,
  ends_at     timestamptz,
  max_uses    integer,
  used        integer not null default 0,
  active      boolean not null default true,
  check ((percent_off is null) <> (amount_off_cents is null))
);

-- ───────── Pedidos ─────────
create type order_status as enum ('pending_payment','paid','payment_failed','in_production','shipped','delivered','incident','refunded','cancelled');

create table orders (
  id                 uuid primary key default gen_random_uuid(),
  reference          text not null unique,
  idempotency_key    uuid not null unique,              -- evita pedidos duplicados
  status             order_status not null default 'pending_payment',
  mode               text not null check (mode in ('demo','sandbox','live')),
  email              text not null,
  shipping_address   jsonb not null,
  subtotal_cents     integer not null,
  discount_cents     integer not null default 0,
  shipping_cents     integer not null default 0,
  total_cents        integer not null,
  coupon_code        text references coupons(code),
  payment_provider   text,
  payment_session_id text unique,
  payment_intent_id  text unique,
  provider_order_id  text,                              -- Printful
  tracking_number    text,
  tracking_url       text,
  production_cost_cents integer,
  shipping_cost_cents   integer,
  payment_fee_cents     integer,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  variant_id    uuid references product_variants(id),
  sku           text not null,
  name          text not null,
  qty           integer not null check (qty between 1 and 10),
  unit_cents    integer not null,
  fulfillment   fulfillment_type not null
);

create table order_events (
  id         bigserial primary key,
  order_id   uuid not null references orders(id) on delete cascade,
  type       text not null,          -- status_change | webhook | incident | refund | note
  payload    jsonb not null default '{}',
  actor      text not null,          -- system | admin:<uid> | webhook:<provider>
  created_at timestamptz not null default now()
);

-- Webhooks procesados (idempotencia de eventos externos)
create table webhook_events (
  provider    text not null,
  event_id    text not null,
  received_at timestamptz not null default now(),
  primary key (provider, event_id)
);

-- ───────── Finanzas y afiliación ─────────
create table revenue_entries (
  id          uuid primary key default gen_random_uuid(),
  source      text not null,          -- 'starlink', 'euro4x4parts', 'youtube', ...
  kind        text not null check (kind in ('affiliate','sponsorship','platform','other')),
  amount_cents integer not null,
  status      text not null check (status in ('expected','confirmed','paid')),  -- solo 'paid' cuenta como disponible
  period_start date,
  period_end   date,
  reference   text,
  notes       text,
  created_by  uuid,
  created_at  timestamptz not null default now()
);

create table ad_spend (
  id          uuid primary key default gen_random_uuid(),
  platform    text not null,          -- google_ads | meta_ads
  campaign    text,
  date        date not null,
  spend_cents integer not null,
  conversions integer,
  revenue_cents integer,
  imported_from text,                 -- csv | api
  unique (platform, campaign, date)
);

create table csv_imports (
  id          uuid primary key default gen_random_uuid(),
  source      text not null,
  filename    text not null,
  rows        integer not null,
  status      text not null,
  created_by  uuid,
  created_at  timestamptz not null default now()
);

-- ───────── Contenido y leads ─────────
create table sponsors (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  tier        text not null check (tier in ('principal','oficial','colaborador')),
  description text,
  logo_url    text,
  url         text,
  code        text,
  active      boolean not null default true,
  position    smallint not null default 0
);

create table leads (
  id          uuid primary key default gen_random_uuid(),
  topic       text not null,
  name        text not null,
  company     text,
  email       text not null,
  message     text not null,
  consent_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

create table newsletter_subscribers (
  email        text primary key,
  consent_at   timestamptz not null,
  confirmed_at timestamptz,           -- doble opt-in
  unsubscribed_at timestamptz
);

-- ───────── Automatizaciones (auditoría y aprobación humana) ─────────
create table automation_runs (
  id           uuid primary key default gen_random_uuid(),
  automation   text not null,         -- new_product | new_order | reel_brief | ads_review | finance | alerts
  status       text not null check (status in ('queued','running','awaiting_approval','approved','rejected','done','failed')),
  input        jsonb not null default '{}',
  output       jsonb,
  requires_approval boolean not null default false,
  approved_by  uuid,
  approved_at  timestamptz,
  created_at   timestamptz not null default now()
);

-- ───────── Admin ─────────
create table admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role    text not null check (role in ('owner','editor','viewer'))
);

-- ───────── RLS: todo cerrado por defecto ─────────
alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_images enable row level security;
alter table coupons enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_events enable row level security;
alter table webhook_events enable row level security;
alter table revenue_entries enable row level security;
alter table ad_spend enable row level security;
alter table csv_imports enable row level security;
alter table sponsors enable row level security;
alter table leads enable row level security;
alter table newsletter_subscribers enable row level security;
alter table automation_runs enable row level security;
alter table admin_users enable row level security;

create function is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from admin_users where user_id = auth.uid());
$$;

-- Lectura pública solo de catálogo activo y patrocinadores activos
create policy "catalogo publico" on products for select using (active);
create policy "variantes publicas" on product_variants for select using (exists (select 1 from products p where p.id = product_id and p.active));
create policy "imagenes publicas" on product_images for select using (exists (select 1 from products p where p.id = product_id and p.active));
create policy "sponsors publicos" on sponsors for select using (active);

-- Admin: acceso completo
do $$
declare t text;
begin
  foreach t in array array['products','product_variants','product_images','coupons','orders','order_items','order_events','revenue_entries','ad_spend','csv_imports','sponsors','leads','newsletter_subscribers','automation_runs'] loop
    execute format('create policy "admin all %1$s" on %1$I for all using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;
-- Inserciones de pedidos, leads y webhooks: solo desde el servidor con service_role (bypassa RLS).
