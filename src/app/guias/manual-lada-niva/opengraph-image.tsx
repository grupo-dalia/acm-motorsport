import { manualOgImage, manualOgSize } from "@/components/manual/manual-og";
import { nivaVehicle } from "@/content/manual-lada-niva";

export const alt = `Manual de taller ${nivaVehicle.model} (${nivaVehicle.chassis}) · ACM Motorsport`;
export const size = manualOgSize;
export const contentType = "image/png";

export default function OG() {
  return manualOgImage(nivaVehicle);
}
