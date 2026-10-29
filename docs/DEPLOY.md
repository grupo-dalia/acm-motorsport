# Despliegue en Vercel

> No desplegar a producción ni activar cobros sin autorización explícita de Andrés.

1. Subir el repo a GitHub (`git push`). El workflow `.github/workflows/ci.yml` ejecuta typecheck, lint, tests y build en cada push/PR.
2. En Vercel: **Add New → Project → Import** el repositorio. Framework: Next.js (autodetectado). Node 22.
3. Variables de entorno (Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL` = dominio final (p. ej. `https://acmmotorsport.es`)
   - `COMMERCE_MODE=demo` (hasta Fase 4)
   - Opcionales: `NEXT_PUBLIC_HERO_VIDEO_URL`, `NEXT_PUBLIC_GA_ID`
4. Desplegar primero como **Preview**. Revisar en móvil, Lighthouse/PageSpeed y `/api/status`.
5. Dominio: Settings → Domains. Añadir registros DNS indicados por Vercel.

## Vídeo del hero
MP4 H.264 o WebM, 1080p, sin audio, 8–15 s en bucle, idealmente < 8 MB. Alojar en Supabase Storage, Vercel Blob o CDN y poner la URL en `NEXT_PUBLIC_HERO_VIDEO_URL` (+ `NEXT_PUBLIC_HERO_POSTER_URL` con un fotograma JPG/AVIF).

## Activar pagos (Fase 4 — requiere aprobación)
1. Stripe en modo test: `STRIPE_SECRET_KEY=sk_test_…`, webhook a `/api/webhooks/stripe`, `STRIPE_WEBHOOK_SECRET`.
2. `COMMERCE_MODE=sandbox` → pruebas end-to-end con tarjetas de test.
3. Printful con `PRINTFUL_API_KEY`: los pedidos se crean como borrador (`confirm=false`).
4. Solo tras validar: claves live + `COMMERCE_MODE=live` + `ALLOW_LIVE_ORDERS=true`.
