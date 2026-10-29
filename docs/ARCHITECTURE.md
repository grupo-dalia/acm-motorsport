# Arquitectura y decisiones

## Principios

1. **La UI no conoce proveedores.** Las páginas hablan con `integrations/commerce` (interfaces `CatalogProvider`, `PaymentProvider`, `FulfillmentProvider`). Cambiar demo → Supabase/Stripe/Printful no toca componentes.
2. **Dominio puro y testeado.** `src/domain/*` no importa React ni SDKs: carrito, precios, IVA, márgenes, validación de checkout.
3. **El servidor es la fuente de verdad del dinero.** El cliente solo guarda `{productId, variantId, qty}`. `/api/checkout` recalcula precios, envío y cupones desde el catálogo.
4. **Seguro por defecto.** Sin claves → modo demo. `live` exige claves **y** `ALLOW_LIVE_ORDERS=true` (`lib/env.ts → effectiveCommerceMode`).
5. **Contenido separado del código.** Todo lo editorial vive en `src/content/*` y migrará a Supabase en Fase 3.

## Flujo de compra (diseño completo; en demo se detiene en el paso 3)

```
Cliente ── POST /api/checkout {cart, customer, idempotencyKey}
  1. Zod valida entrada + rate limit
  2. priceCart() recalcula con el catálogo (descarta variantes inexistentes/agotadas/afiliación)
  3. createDraftOrder() → pedido `pending_payment` (UNIQUE idempotency_key)
  4. PaymentProvider.createCheckout() → URL de Stripe Checkout             [Fase 4]
Stripe ── webhook checkout.session.completed (firma verificada)            [Fase 4]
  5. webhook_events (provider, event_id) evita reprocesar
  6. order → `paid`
  7. Printful: createDraft() (confirm=false) → confirm() solo si mode=live
  8. order → `in_production` → `shipped` (webhook Printful con tracking)
```

Nunca se confirma producción sin pago verificado. No se almacenan datos de tarjeta (los gestiona Stripe).

## Decisiones

| Decisión | Motivo |
|---|---|
| **Next.js 16 App Router + RSC** | La mayoría de páginas son estáticas (SSG) → excelente SEO y Core Web Vitals. Solo son cliente: header, carrito, formularios, animaciones. |
| **TypeScript 6.0** (no 7.0) | TS 7 (compilador nativo) es muy reciente; Next 16 usa la API JS de TypeScript. Se migrará cuando el ecosistema lo soporte oficialmente. |
| **Tailwind 4 con `@theme`** | Tokens de marca en CSS, sin `tailwind.config`. |
| **Componentes propios estilo shadcn** en lugar del CLI de shadcn/ui | El diseño necesitaba primitivas muy específicas (botones cuadrados, badges mono, placeholders). Mismo patrón (`cva`, `cn`), sin Radix aún porque no hay componentes complejos. Cuando lleguen (diálogos del admin, selects, tablas) se añaden con `npx shadcn add`. |
| **Hubot Sans + Mona Sans, autoalojadas** | Pareja diseñada para ir junta: Hubot (grotesca técnica y ancha) para titulares en minúscula y peso medio, como la tipografía de marcas de coches; Mona para texto. OFL, servidas desde el propio dominio. `next/font/local` evita CLS. |
| **Mapa de la ruta como pieza central** | España → Marruecos → Arabia Saudí generado en build con Natural Earth (`world-atlas` + `d3-geo`): SVG estático, 0 KB de JS. Es el único momento animado de la home (la ruta se dibuja al cargar). |
| **Ritmo oscuro / claro** | Azul medianoche como campo de marca, bloques en papel claro para lo editorial y la tienda. El rojo solo en acciones principales y en la ruta. Sin etiquetas en mayúsculas, numeraciones ni cajas decorativas. |
| **Globo 3D guiado por scroll (three.js + React Three Fiber)** | La home es una historia: la cámara viaja España → Marruecos → Arabia Saudí y la ruta se dibuja con el scroll. Puntos de tierra precalculados con Natural Earth (`scripts/build-globe-data.mjs` → `public/globe/dots.bin`, 25 KB). El mapa SVG se ve mientras carga el WebGL y queda como respaldo si no hay WebGL o con "reducir movimiento". |
| **Dunas nocturnas procedurales** | Shader propio (ruido fractal + perfil de duna) en Objetivo Dakar. Solo renderiza mientras está en pantalla. |
| **Carga del 3D** | `next/dynamic` sin SSR: el motor 3D (~240 KB gzip) se descarga después del contenido y solo en páginas que lo usan. |
| **Microinteracciones** | Scroll inercial (Lenis), titulares palabra a palabra (solo CSS), imágenes que se descubren con scroll-driven animations (CSS, mejora progresiva) e inclinación 3D en tarjetas de producto (solo ratón). Todo se desactiva con `prefers-reduced-motion`. |
| **Filtros de tienda por URL (GET)** | Funcionan sin JS, se pueden compartir y son indexables. |
| **YouTube «lite»** | No carga iframe ni cookies de terceros hasta pulsar play. |
| **Productos demo con `noindex`** | No contaminar Google con productos ficticios. |
| **Idempotencia en memoria (demo)** | Misma interfaz que la versión con `UNIQUE(idempotency_key)` en Postgres. |
| **Rate limit en memoria** | Freno básico. En producción multi-instancia → Upstash o Vercel Firewall. |

## Accesibilidad

HTML semántico, skip link, foco visible, `aria-current` en navegación, drawer con Escape y retorno de foco, formularios con errores anunciados (`role="alert"`), contraste alto sobre fondo oscuro, reduced motion. Objetivo WCAG 2.2 AA: falta auditoría con lector de pantalla real.
