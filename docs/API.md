# API

Todas las rutas validan con Zod y aplican rate limit por IP (en memoria).

## `POST /api/checkout`
Crea un pedido (demo) y devuelve la URL de pago.

```json
{
  "cart": { "lines": [{ "productId": "tee-acm-core", "variantId": "tee-acm-core-negro-m", "qty": 1 }], "coupon": "DEMO10" },
  "customer": { "email": "...", "name": "...", "address1": "...", "city": "...", "postalCode": "28001", "province": "...", "country": "ES" },
  "acceptTerms": true,
  "idempotencyKey": "uuid-v4"
}
```
- `200` `{ ok, orderId, mode, replayed, redirectUrl, totalCents }` — `replayed: true` si la clave ya existía.
- `409` productos no disponibles · `422` validación (`issues[]`) · `429` rate limit.

## `POST /api/newsletter`
`{ email, consent: true }` → `{ ok, message }`. Demo: no se almacena.

## `POST /api/contact`
`{ topic: "patrocinio"|"colaboracion"|"prensa"|"tienda"|"otro", name, company?, email, message, consent: true }`. Demo: no se envía.

## `GET /api/status`
Estado de integraciones sin secretos:
```json
{ "ok": true, "commerceMode": "demo", "catalog": "demo", "payments": "not_configured", "fulfillment": "not_configured", "database": "not_configured", "email": "not_configured" }
```

## Previstas
| Ruta | Fase | Uso |
|---|---|---|
| `POST /api/webhooks/stripe` | 4 | `checkout.session.completed`, `charge.refunded` (firma verificada, idempotente vía `webhook_events`) |
| `POST /api/webhooks/printful` | 4 | Estados de producción y tracking |
| `POST /api/automations/:name` | 5 | Disparadores para n8n con token firmado (HMAC) |

## Eventos (para analítica y automatizaciones, Fase 5)
`view_item`, `add_to_cart`, `begin_checkout`, `purchase` (solo tras webhook de pago, nunca desde el cliente), `generate_lead`, `sign_up`.
