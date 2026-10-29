# Roadmap por fases

## ✅ Fase 1 — Web pública
Home (hero, piloto, Objetivo Dakar, tienda, vídeos, Workshop, Sim Racing, patrocinadores, newsletter), Motorsport (historia, tripulación, ficha técnica, calendario, resultados, galería, patrocinio + formulario), Objetivo Dakar, Workshop, Sim Racing, Contacto, legales, 404, SEO técnico (metadata, canonical, OG, sitemap, robots, JSON-LD), consentimiento de cookies.

## ✅ Fase 2 — Tienda demo
Catálogo con categorías, búsqueda, filtros por tipo de venta, orden; ficha con colores, tallas, disponibilidad por variante, galería, relacionados; carrito persistente (localStorage validado), cupón de prueba `DEMO10`, envío gratis desde 60 € (tarifa demo); checkout con validación, idempotencia y pedido de prueba.

## Fase 3 — Backend y admin
- Aplicar `supabase/migrations/0001_init.sql`; `CatalogProvider` sobre Supabase.
- Auth Supabase + `/admin` protegido por middleware y `admin_users`.
- Admin: Dashboard (ventas, ingresos, costes, comisiones, publicidad, beneficio de contribución — usando `domain/pricing.ts`), Productos, Pedidos (estados, incidencias, reembolsos), Clientes, Contenidos, Patrocinadores, Afiliación (alta manual de ingresos Starlink y otros; solo `paid` cuenta como disponible), Analítica, Configuración, importación CSV.
- Emails transaccionales (Resend o similar). Leads y newsletter persistentes (doble opt-in).

## Fase 4 — Integraciones reales (requiere autorización)
Stripe Checkout + webhooks firmados; Printful (sync de productos, borradores, confirmación tras pago, tracking); gestión de incidencias y reembolsos.

## Fase 5 — Crecimiento
GA4 con consentimiento y `purchase` server-side, Google Ads/Meta (CAPI), Merchant Center feed, blog editorial (MDX o Supabase), versión en inglés (`/en`, `hreflang`), automatizaciones A–F con n8n/Claude, registro de auditoría y aprobación humana para cualquier movimiento de dinero.
