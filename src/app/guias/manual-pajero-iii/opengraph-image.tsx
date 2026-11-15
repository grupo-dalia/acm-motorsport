import { manualOgImage, manualOgSize } from "@/components/manual/manual-og";
import { manualVehicle } from "@/content/manual-pajero-iii";

export const alt = `Manual de taller ${manualVehicle.model} (${manualVehicle.chassis}) · ACM Motorsport`;
export const size = manualOgSize;
export const contentType = "image/png";

export default function OG() {
  return manualOgImage(manualVehicle);
}
