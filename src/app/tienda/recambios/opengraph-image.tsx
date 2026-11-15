import { recambiosOgImage, recambiosOgSize } from "@/components/shop/recambios-og";

export const alt = "Recambios 4x4 · ACM Motorsport × Euro4x4parts";
export const size = recambiosOgSize;
export const contentType = "image/png";

export default function OG() {
  return recambiosOgImage();
}
