import type { ManualVehicle, System } from "@/content/manual-types";
import { manualSystems, manualVehicle } from "@/content/manual-pajero-iii";
import { nivaSystems, nivaVehicle } from "@/content/manual-lada-niva";

/** Catálogo de manuales interactivos que salen en /guias, agrupables por marca. */
export type ManualEntry = { href: string; brand: string; vehicle: ManualVehicle; systems: System[] };

export const manuals: ManualEntry[] = [
  { href: "/guias/manual-pajero-iii", brand: "Mitsubishi", vehicle: manualVehicle, systems: manualSystems },
  { href: "/guias/manual-lada-niva", brand: "Lada", vehicle: nivaVehicle, systems: nivaSystems },
];

export const countJobs = (systems: System[]) => systems.reduce((n, s) => n + s.parts.length, 0);
