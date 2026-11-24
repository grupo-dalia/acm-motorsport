import { describe, expect, it, vi } from "vitest";
import { buildPurchasePayload, normalizePhone, sendPurchaseToMeta, sha256 } from "./meta-capi";
import { purchaseEventId } from "./meta-pixel";

const base = { orderReference: "ACM-XYZ-1234", valueCents: 5490, contents: [{ id: "SKU-1", quantity: 2, itemPriceCents: 2495 }], eventSourceUrl: "https://www.acmmotorsport.com/checkout/exito", eventTime: 1_700_000_000 };

describe("meta CAPI", () => {
  it("hashea email y teléfono normalizados y usa el mismo event_id que el navegador", () => {
    const body = buildPurchasePayload({ ...base, email: "  Ana@Ejemplo.ES ", phone: "612 345 678", country: "ES" });
    const e = body.data[0]!;
    expect(e.event_id).toBe(purchaseEventId("ACM-XYZ-1234"));
    expect(e.user_data.em).toEqual([sha256("ana@ejemplo.es")]);
    expect(e.user_data.ph).toEqual([sha256("34612345678")]);
    expect(JSON.stringify(e)).not.toContain("ana@ejemplo.es");
    expect(e.custom_data).toMatchObject({ currency: "EUR", value: 54.9, content_type: "product", content_ids: ["SKU-1"], num_items: 2 });
  });
  it("normaliza teléfonos", () => {
    expect(normalizePhone("+34 612-345-678")).toBe("34612345678");
    expect(normalizePhone("0034612345678")).toBe("34612345678");
    expect(normalizePhone("")).toBeNull();
  });
  it("no envía nada sin ID de píxel o sin token", async () => {
    const f = vi.spyOn(globalThis, "fetch");
    expect(await sendPurchaseToMeta(base, { pixelId: undefined, token: "t", testCode: undefined })).toEqual({ sent: false, error: "not_configured" });
    expect(await sendPurchaseToMeta(base, { pixelId: "1", token: undefined, testCode: undefined })).toEqual({ sent: false, error: "not_configured" });
    expect(f).not.toHaveBeenCalled();
    f.mockRestore();
  });
});
