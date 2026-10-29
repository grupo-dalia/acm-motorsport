import "server-only";

/**
 * Limitador en memoria (por instancia). Suficiente para demo y como freno básico.
 * En producción con varias instancias: sustituir por Upstash/Redis o Vercel Firewall.
 */
const hits = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return { ok: true };
  }
  entry.count++;
  return { ok: entry.count <= limit };
}

export function clientKey(req: Request, scope: string) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  return `${scope}:${ip}`;
}
