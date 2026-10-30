-- ACM MOTORSPORT · Fase 3: clics de afiliados y ajustes para guardar pedidos, contactos y newsletter.

-- Clics en enlaces de afiliado (/go/<id>). Sin IP ni datos personales.
create table if not exists affiliate_clicks (
  id         bigserial primary key,
  affiliate  text not null,
  path       text,                 -- página desde la que se hizo clic
  country    text,                 -- país aproximado (cabecera del CDN)
  created_at timestamptz not null default now()
);
create index if not exists affiliate_clicks_affiliate_created on affiliate_clicks (affiliate, created_at desc);
alter table affiliate_clicks enable row level security;
create policy "admin all affiliate_clicks" on affiliate_clicks for all using (is_admin()) with check (is_admin());

-- El origen de la suscripción (pie de página, artículo…), útil para saber qué funciona.
alter table newsletter_subscribers add column if not exists source text;
alter table newsletter_subscribers add column if not exists created_at timestamptz not null default now();

-- Mensajes de contacto: marcar como atendidos desde el panel.
alter table leads add column if not exists handled_at timestamptz;

-- Pedidos: nombre y teléfono para el panel sin abrir el JSON.
alter table orders add column if not exists customer_name text;
alter table orders add column if not exists customer_phone text;

create index if not exists orders_created on orders (created_at desc);
create index if not exists leads_created on leads (created_at desc);

-- Permisos explícitos para el servidor (por si el proyecto no expone tablas nuevas automáticamente).
grant usage on schema public to service_role, authenticated;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant select on products, product_variants, product_images, sponsors to anon, authenticated;
