import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Lets phones install Algo Clash to the home screen as a full-screen app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Algo Clash — C++ data structures & algorithms RPG",
    short_name: "Algo Clash",
    description: "A creature RPG where every battle is a real interview problem. Write the C++ by hand.",
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b1020",
    theme_color: "#0b1020",
    icons: [
      { src: `${base}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${base}/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${base}/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
