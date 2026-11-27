import { describe, expect, it } from "vitest";
import { activeCountries, activeZoneFor, deliveryWindow, flatShippingCents, formatDeliveryWindow, zoneFor } from "./shipping";
import { shippingZones } from "@/content/shipping";
import { customerSchema } from "./checkout";

const customer = { email: "a@b.es", name: "Ana Pérez", address1: "Calle Mayor 1", city: "Madrid", postalCode: "28001", province: "Madrid", country: "ES" };

describe("zonas de envío", () => {
  it("hoy solo vende a España peninsular y Baleares", () => {
    expect(activeCountries().map((c) => c.code)).toEqual(["ES"]);
    expect(activeZoneFor("ES", "28001")?.id).toBe("ES");
    expect(activeZoneFor("ES", "07001")?.id).toBe("ES"); // Baleares
    expect(activeZoneFor("ES", "35001")).toBeNull(); // Las Palmas
    expect(activeZoneFor("ES", "38001")).toBeNull(); // Tenerife
    expect(activeZoneFor("ES", "51001")).toBeNull(); // Ceuta
    expect(activeZoneFor("ES", "52001")).toBeNull(); // Melilla
    expect(activeZoneFor("PT", "1000-001")).toBeNull();
    expect(activeZoneFor("MX", "01000")).toBeNull();
  });
  it("clasifica cada dirección en su zona", () => {
    expect(zoneFor("ES", "35001")?.id).toBe("ES-islas");
    expect(zoneFor("FR", "75001")?.id).toBe("UE");
    expect(zoneFor("AR", "1000")?.id).toBe("LATAM");
    expect(zoneFor("US", "10001")?.id).toBe("resto");
  });
  it("activar una zona es cambiar una línea", () => {
    const zones = shippingZones.map((z) => (z.id === "UE" ? { ...z, active: true } : z));
    expect(activeZoneFor("FR", "75001", zones)?.id).toBe("UE");
    expect(activeCountries(zones).map((c) => c.code)).toContain("PT");
  });
  it("tarifa fija de España: 4,95 € y gratis desde 60 €", () => {
    const es = shippingZones.find((z) => z.id === "ES")!;
    expect(flatShippingCents(es, 5999, true)).toBe(495);
    expect(flatShippingCents(es, 6000, true)).toBe(0);
    expect(flatShippingCents(es, 0, false)).toBe(0);
  });
  it("el checkout rechaza Canarias, Ceuta, Melilla y otros países", () => {
    expect(customerSchema.safeParse(customer).success).toBe(true);
    expect(customerSchema.safeParse({ ...customer, postalCode: "35001" }).success).toBe(false);
    expect(customerSchema.safeParse({ ...customer, postalCode: "52001" }).success).toBe(false);
    expect(customerSchema.safeParse({ ...customer, country: "FR", postalCode: "75001" }).success).toBe(false);
  });
});

describe("deliveryWindow", () => {
  it("cuenta solo días laborables", () => {
    // viernes 27 nov 2026 → +5 laborables = vie 4 dic; +11 = lun 14 dic
    const w = deliveryWindow(new Date("2026-11-27T12:00:00+01:00"));
    expect(w.from.toISOString().slice(0, 10)).toBe("2026-12-04");
    expect(w.to.toISOString().slice(0, 10)).toBe("2026-12-14");
    expect(formatDeliveryWindow(w)).toBe("entre el vie 4 y el lun 14 de dic");
  });
});
