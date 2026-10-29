# ACM MOTORSPORT — Digital Flagship

Plataforma oficial de **ACM Motorsport** (Andrés Cubero Moreno): marca personal, equipo de rally todoterreno, serie *Objetivo Dakar*, ACM Workshop, ACM Sim Racing y tienda oficial.

> **Estado: Fase 1 + Fase 2 (demo).** Web pública completa y tienda funcional en **modo demostración**: catálogo, filtros, variantes, carrito persistente y checkout que crea pedidos de prueba. **No se cobra nada ni se envía nada a producción.**

## Arranque rápido

```bash
nvm use            # Node 22 (mínimo 20.9)
npm install
cp .env.example .env.local   # opcional: sin variables funciona en modo demo
npm run dev        # http://localhost:3000
```

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build y servidor de producción |
| `npm run typecheck` | TypeScript estricto |
| `npm run lint` | ESLint (config Next.js) |
| `npm test` | Tests unitarios (Vitest) |
| `npm run check` | Todo lo anterior salvo build |

## Stack

Next.js 16 (App Router) · React 19 · TypeScript 6 estricto · Tailwind CSS 4 · Motion · Lucide · Zod 4 · React Hook Form · Vitest.
Componentes de UI propios con la misma convención que shadcn/ui (`cva` + `tailwind-merge`) — ver `docs/ARCHITECTURE.md` para el porqué.

## Estructura

```
src/
  app/                  Rutas (App Router), API routes, sitemap, robots, OG
  components/
    ui/                 Primitivas (Button, Badge, Reveal, SectionHeading…)
    layout/             Header, Footer, PageHero, Logo
    sections/           Bloques editoriales (home, roadmap, sponsors…)
    shop/               Tienda: carrito, ficha, checkout
    media/              Placeholders, curvas de nivel, YouTube lite
    consent/ forms/     Cookies, newsletter, contacto
  content/              Textos y datos editables (sin tocar componentes)
  domain/               Lógica pura: catálogo, carrito, precios, checkout (con tests)
  integrations/         Adaptadores: catálogo demo, Printful, pagos
  lib/                  env, SEO, utilidades
supabase/migrations/    Esquema SQL (Fase 3, no aplicado)
docs/                   Arquitectura, API, despliegue, roadmap
```

## Qué editar sin tocar código de UI

| Quiero cambiar… | Archivo |
|---|---|
| Ficha técnica del Pajero, calendario, resultados, tripulación, patrocinadores | `src/content/motorsport.ts` |
| Vídeos (pegar el ID de YouTube) y proyectos del taller | `src/content/media.ts` |
| Redes, email, navegación | `src/content/site.ts` |
| Textos legales | `src/content/legal.ts` |
| Vídeo del hero | `NEXT_PUBLIC_HERO_VIDEO_URL` en `.env.local` |
| Paleta y tipografía | `src/app/globals.css` (`@theme`) |

## Lo que es placeholder (a propósito)

- **Fotos y vídeos**: bloques etiquetados «Foto/Vídeo pendiente» con el encuadre recomendado.
- **Productos**: catálogo demo con precios ficticios e ilustraciones vectoriales. No se indexan.
- **Patrocinadores**: nombres confirmados, sin logos hasta tener los archivos originales.
- **Textos legales**: marcados como provisionales pendientes de revisión jurídica.
- **Ficha técnica**: campos sin dato muestran «Por confirmar».

## Fases

- [x] **Fase 1** — Arquitectura, diseño, web pública responsive.
- [x] **Fase 2** — Tienda demo: catálogo, filtros, variantes, carrito persistente, checkout preparado.
- [ ] **Fase 3** — Supabase (datos, auth), panel `/admin`, emails transaccionales.
- [ ] **Fase 4** — Stripe Checkout + webhooks, Printful real. **Requiere autorización explícita.**
- [ ] **Fase 5** — GA4/Ads, blog, Merchant Center, automatizaciones (n8n, IA).

Detalle en `docs/ROADMAP.md`.
