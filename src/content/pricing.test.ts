import { applyPricing, announcement } from "@/content/pricing";
import { test, expect } from "vitest";
test("pricing", () => {
  const bf = new Date("2026-11-25T12:00:00+01:00");
  expect(applyPricing("camisetas", 1038, bf)).toEqual({ priceCents: 1995, compareAtCents: 2495 });
  expect(applyPricing("camisetas", 2995, new Date("2026-12-05T12:00:00+01:00"))).toEqual({ priceCents: 2995, compareAtCents: null });
  expect(applyPricing("sudaderas", 3250, new Date("2026-12-05"))).toEqual({ priceCents: 4495, compareAtCents: null });
  expect(announcement(new Date("2026-12-05T12:00:00+01:00"))).toMatch(/10 de diciembre/);
  expect(announcement(new Date("2026-12-15T12:00:00+01:00"))).toMatch(/después de Navidad/);
  expect(announcement(new Date("2027-01-05"))).toBeNull();
});
