# Noticias, guías y afiliación

## Publicar un artículo
1. Crea `content/news/mi-articulo.md` (el nombre del archivo es la URL: `/noticias/mi-articulo`).
2. Cabecera obligatoria:
```yaml
---
title: "Título claro, con la búsqueda que respondería"
summary: "Entre 20 y 220 caracteres. Es la descripción en Google y al compartir."
date: 2026-11-02
category: rally-raid   # objetivo-dakar | rally-raid | taller | overland | sim-racing
draft: true           # true = solo visible en local; quítalo para publicar
youtubeId: abcdefghijk # opcional: vídeo principal arriba del todo
sources:               # obligatorio si es actualidad de otros
  - title: "Nombre del medio"
    url: "https://..."
---
```
3. Bloques que puedes insertar en el texto:
   - `{{video:ID}}` vídeo de YouTube
   - `{{affiliate:starlink}}` caja de afiliado (definidos en `src/content/affiliates.ts`)
   - `{{product:slug}}` producto de la tienda
4. Commit + push → Vercel publica. Sale solo en `/noticias`, la home, el sitemap y el RSS (`/noticias/rss.xml`).

## Reglas para que Google lo premie (y no lo castigue)
- **Nada de copiar o reescribir noticias de otros en masa.** Google lo trata como *scaled content abuse* y puede hundir todo el dominio.
- Sí: actualidad con **opinión y experiencia propia** (lo que ya haces en ACM Motor News), con la fuente enlazada.
- Mejor tráfico estable: **guías evergreen** que respondan búsquedas reales (instalaciones, regularidad, preparación 4x4), cada una con su vídeo y su bloque de producto/afiliado.

## Afiliación
- Todos los enlaces salen por `/go/<id>` (se mide el clic y se cambia el destino sin tocar artículos).
- Divulgación visible en cada bloque y `rel="sponsored nofollow"`.
- Pendiente de rellenar en `src/content/affiliates.ts`: enlace de referido de Starlink, URL de Euro4x4parts.

## Automatización propuesta (Fase 5)
Guion de ACM Motor News o enlace a una noticia → Claude redacta un borrador con tu voz y fuentes → se abre un Pull Request con `draft: true` → lo revisas desde el móvil y haces merge → Vercel publica. Aprobación humana siempre antes de publicar.
