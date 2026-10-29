import { describe, expect, it } from "vitest";
import { customerSchema } from "./checkout";
import { createDraftOrder } from "@/integrations/commerce";
import { demoCatalog } from "@/integrations/commerce/demo-catalog";

const customer = { email: "a@b.es", name: "Ana Pérez", address1: "Calle Mayor 1", city: "Madrid", postalCode: "28001", province: "Madrid", country: "ES" as const };

describe("checkout", () => {
  it("valida códigos postales españoles", () => {
    expect(customerSchema.safeParse(customer).success).toBe(true);
    expect(customerSchema.safeParse({ ...customer, postalCode: "60001" }).success).toBe(false);
    expect(customerSchema.safeParse({ ...customer, postalCode: "2800" }).success).toBe(false);
  });
  it("es idempotente: la misma clave devuelve el mismo pedido", async () => {
    const tee = demoCatalog.find((p) => p.id === "tee-acm-core")!;
    const cart = { coupon: null, lines: [{ productId: tee.id, variantId: tee.variants[0]!.id, qty: 1 }] };
    const key = crypto.randomUUID();
    const a = await createDraftOrder(cart, customer, key);
    const b = await createDraftOrder(cart, customer, key);
    expect(b.replayed).toBe(true);
    expect(b.order.id).toBe(a.order.id);
    expect(a.order.mode).toBe("demo");
    expect(a.order.status).toBe("pending_payment");
  });
  it("rechaza carritos sin productos válidos", async () => {
    await expect(createDraftOrder({ coupon: null, lines: [] }, customer, crypto.randomUUID())).rejects.toThrow();
  });
});
