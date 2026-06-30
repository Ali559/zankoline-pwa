import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa"; // PWA plugin
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),

    // 🔑 PWA Plugin Configuration
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/*.png"],
      manifest: {
        name: "Zankoline",
        short_name: "ZL",
        display: "fullscreen",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "<%= pwa.iconPath %>",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          // Add smaller icon sizes here as needed
        ],
      },
      // You can disable generation of a workbox service worker file
      // if you rely on the template's minimal service-worker.js
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
