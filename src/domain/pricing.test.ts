import { describe, expect, it } from "vitest";
import { contribution, netFromGross, priceForMargin, vatFromGross } from "./pricing";

describe("pricing", () => {
  it("desglosa IVA del 21 %", () => {
    expect(netFromGross(12100)).toBe(10000);
    expect(vatFromGross(12100)).toBe(2100);
  });
  it("calcula beneficio de contribución", () => {
    const r = contribution({ grossRevenueCents: 12100, productionCostCents: 4000, shippingCostCents: 500, paymentFeeCents: 200, adSpendCents: 1000 });
    expect(r.netRevenueCents).toBe(10000);
    expect(r.contributionCents).toBe(4300);
    expect(r.marginPct).toBeCloseTo(0.43);
  });
  it("precio para margen objetivo cubre el margen", () => {
    const price = priceForMargin(1250, 0.5);
    expect(netFromGross(price)).toBeGreaterThanOrEqual(2500);
  });
});
