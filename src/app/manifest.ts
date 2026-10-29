import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ACM Motorsport",
    short_name: "ACM",
    start_url: "/",
    display: "standalone",
    background_color: "#080A0F",
    theme_color: "#080A0F",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
