// src/sw.ts
//
// Custom service worker source, built by the Workbox plugin via
// `injectManifest`. Vite-PWA (or workbox-build directly) reads this file,
// injects the precache manifest in place of `self.__WB_MANIFEST` below, and
// emits the final `sw.js` that actually gets registered in the browser.
//
// This only handles offline asset precaching/serving. There is no push
// notification support — Zankoline doesn't need it, and shipping unused
// notification permission requests just adds friction and an unexplained
// browser prompt for users.

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
};

// Take control of open clients/tabs as soon as this worker activates,
// instead of waiting for a full reload.
self.skipWaiting();
clientsClaim();

// Remove any caches left over from a previous service worker version.
cleanupOutdatedCaches();

// Workbox replaces this array at build time with the actual list of
// built assets (JS/CSS/HTML/icons) to cache for offline use. Do not
// remove or rename `self.__WB_MANIFEST` — the build plugin looks for
// this exact expression.
precacheAndRoute(self.__WB_MANIFEST);
