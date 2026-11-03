// Offline support for the home-screen app. finish-web-build.mjs fills in the two
// placeholders. Everything is served from the cache, and a new deploy takes effect
// the next time the app is opened.
const CACHE = 'food-log-ece2f2a3868f';
const FILES = ["./","_expo/static/js/web/index-0c08c663fdd447bba807d7e54b469b53.js","_expo/static/js/web/index-623c9999dd0e5dcb1a3a078aeb90e4d1.js","assets/node_modules/@expo-google-fonts/ibm-plex-mono/400Regular/IBMPlexMono_400Regular.b112f77f65b1766764ee122703ebdcd0.ttf","assets/node_modules/@expo-google-fonts/ibm-plex-mono/500Medium/IBMPlexMono_500Medium.eddb5e5647bc7910fd2417321769f58d.ttf","assets/node_modules/@expo-google-fonts/ibm-plex-mono/600SemiBold/IBMPlexMono_600SemiBold.7a81255a8c5109e19bab1a2f27d49d1c.ttf","assets/node_modules/@expo-google-fonts/public-sans/400Regular/PublicSans_400Regular.18f93d6b04b3f0303d3b3f4cd2d64e96.ttf","assets/node_modules/@expo-google-fonts/public-sans/500Medium/PublicSans_500Medium.80840e462a09263d0e9833565df34cfd.ttf","assets/node_modules/@expo-google-fonts/public-sans/600SemiBold/PublicSans_600SemiBold.9903b8962526b688e7df03f2f9c7dfa7.ttf","assets/node_modules/@expo-google-fonts/public-sans/800ExtraBold/PublicSans_800ExtraBold.fabb198c07b75b1c1536b9db5c1bd46b.ttf","favicon.ico","icon-180.png","icon-192.png","icon-512.png","manifest.webmanifest"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Open Food Facts requests are left alone, so they always hit the network.
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  const lookup = request.mode === 'navigate' ? './' : request;
  event.respondWith(caches.match(lookup, { ignoreSearch: true }).then((hit) => hit || fetch(request)));
});
