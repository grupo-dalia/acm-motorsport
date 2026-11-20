import type { ManualDef } from "@/components/manual/manual-part-page";
import { manualSystems, manualVehicle } from "@/content/manual-pajero-iii";
import { nivaSystems, nivaVehicle } from "@/content/manual-lada-niva";
import { nivaSeo, pajeroSeo, pajeroSeoEn } from "@/content/manual-seo";
import { manualSystemsEn, manualVehicleEn } from "@/content/manual-pajero-iii.en";

export const pajeroManual: ManualDef = { vehicle: manualVehicle, systems: manualSystems, seo: pajeroSeo, label: "Manual Pajero III", lang: "es", alt: { en: manualVehicleEn } };
export const nivaManual: ManualDef = { vehicle: nivaVehicle, systems: nivaSystems, seo: nivaSeo, label: "Manual Lada Niva", lang: "es" };
export const pajeroManualEn: ManualDef = { vehicle: manualVehicleEn, systems: manualSystemsEn, seo: pajeroSeoEn, label: "Pajero III workshop manual", lang: "en", alt: { es: manualVehicle } };
