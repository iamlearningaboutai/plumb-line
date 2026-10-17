// Plumb Line service worker: makes the app open with no internet once it has been loaded.
// Bump VERSION whenever app files change so devices pick up the new version.
const VERSION = "plumb-line-v1";
const CORE = [
  "./", "index.html", "manifest.webmanifest",
  "vendor/jspdf.umd.min.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png",
  "mp/pose.js", "mp/pose_solution_packed_assets_loader.js",
  "mp/pose_solution_simd_wasm_bin.js", "mp/pose_solution_wasm_bin.js",
  "mp/pose_solution_simd_wasm_bin.wasm", "mp/pose_solution_wasm_bin.wasm",
  "mp/pose_solution_packed_assets.data", "mp/pose_landmark_full.tflite", "mp/pose_web.binarypb"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && !k.startsWith("fonts")).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // The app page: try the network first so updates arrive, fall back to the saved copy offline.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put("index.html", copy)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  // Google Fonts: keep a copy once seen.
  if (url.hostname.endsWith("googleapis.com") || url.hostname.endsWith("gstatic.com")) {
    e.respondWith(caches.open("fonts").then(c => c.match(req).then(hit => hit || fetch(req).then(r => { c.put(req, r.clone()); return r; }))));
    return;
  }
  // Everything else from this site: saved copy first (the pose model is large).
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req)));
  }
});
