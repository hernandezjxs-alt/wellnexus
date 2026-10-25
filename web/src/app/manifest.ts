import type { MetadataRoute } from "next";

export const dynamic = "force-static";
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wellnexus",
    short_name: "Wellnexus",
    description: "Ingeniería de pozos y producción",
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    background_color: "#17212F",
    theme_color: "#3E6A94",
    icons: [
      { src: `${base}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${base}/icons/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${base}/icons/icon-maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
