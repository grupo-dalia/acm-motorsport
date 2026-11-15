import type { ManualDef } from "@/components/manual/manual-part-page";
import { manualSystems, manualVehicle } from "@/content/manual-pajero-iii";
import { nivaSystems, nivaVehicle } from "@/content/manual-lada-niva";
import { nivaSeo, pajeroSeo } from "@/content/manual-seo";

export const pajeroManual: ManualDef = { vehicle: manualVehicle, systems: manualSystems, seo: pajeroSeo, label: "Manual Pajero III" };
export const nivaManual: ManualDef = { vehicle: nivaVehicle, systems: nivaSystems, seo: nivaSeo, label: "Manual Lada Niva" };
