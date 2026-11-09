// Offline support for the home-screen app. finish-web-build.mjs fills in the two
// placeholders. Everything is served from the cache, and a new deploy takes effect
// the next time the app is opened.
const CACHE = 'food-log-8e22ae36cc49';
const FILES = ["./","_expo/static/js/web/__common-5f34736aa76aabb2007fc22d6492412e.js","_expo/static/js/web/__expo-metro-runtime-97703ae02682710149335928b974f18d.js","_expo/static/js/web/_layout-680b5dcf8c0556a8cd59ce83fb9ceed9.js","_expo/static/js/web/_layout-f5f01f7aece96114df4793a1896af79a.js","_expo/static/js/web/add-meal-114ba7a951085fba083bd333ba1ee0ab.js","_expo/static/js/web/edit-food-74b3cca1589aa24400c137cdea213468.js","_expo/static/js/web/entry-277f09efa4c3de9dd145c66a1924b935.js","_expo/static/js/web/history-aafccb43795d31fe823b19e53ba2f0f9.js","_expo/static/js/web/index-3cf998b92d0a62cf058b8bd078ea9c9c.js","_expo/static/js/web/index-5cfb056ca6d5698304f4b450a55b4fd3.js","_expo/static/js/web/meal-115e39142fd46085e11d20bac68c9c3f.js","_expo/static/js/web/setup-8145bc5ae470c28d41e3ebc8f36a9c41.js","assets/node_modules/@expo-google-fonts/ibm-plex-mono/400Regular/IBMPlexMono_400Regular.b112f77f65b1766764ee122703ebdcd0.ttf","assets/node_modules/@expo-google-fonts/ibm-plex-mono/500Medium/IBMPlexMono_500Medium.eddb5e5647bc7910fd2417321769f58d.ttf","assets/node_modules/@expo-google-fonts/ibm-plex-mono/600SemiBold/IBMPlexMono_600SemiBold.7a81255a8c5109e19bab1a2f27d49d1c.ttf","assets/node_modules/@expo-google-fonts/public-sans/400Regular/PublicSans_400Regular.18f93d6b04b3f0303d3b3f4cd2d64e96.ttf","assets/node_modules/@expo-google-fonts/public-sans/500Medium/PublicSans_500Medium.80840e462a09263d0e9833565df34cfd.ttf","assets/node_modules/@expo-google-fonts/public-sans/600SemiBold/PublicSans_600SemiBold.9903b8962526b688e7df03f2f9c7dfa7.ttf","assets/node_modules/@expo-google-fonts/public-sans/800ExtraBold/PublicSans_800ExtraBold.fabb198c07b75b1c1536b9db5c1bd46b.ttf","assets/node_modules/expo-router/assets/arrow_down.017bc6ba3fc25503e5eb5e53826d48a8.png","assets/node_modules/expo-router/assets/error.d1ea1496f9057eb392d5bbf3732a61b7.png","assets/node_modules/expo-router/assets/file.19eeb73b9593a38f8e9f418337fc7d10.png","assets/node_modules/expo-router/assets/forward.d8b800c443b8972542883e0b9de2bdc6.png","assets/node_modules/expo-router/assets/pkg.ab19f4cbc543357183a20571f68380a3.png","assets/node_modules/expo-router/assets/react-navigation/elements/back-icon-mask.0a328cd9c1afd0afe8e3b1ec5165b1b4.png","assets/node_modules/expo-router/assets/react-navigation/elements/back-icon.35ba0eaec5a4f5ed12ca16fabeae451d.png","assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55.png","assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@2x.png","assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@3x.png","assets/node_modules/expo-router/assets/react-navigation/elements/clear-icon.c94f6478e7ae0cdd9f15de1fcb9e5e55@4x.png","assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7.png","assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@2x.png","assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@3x.png","assets/node_modules/expo-router/assets/react-navigation/elements/close-icon.808e1b1b9b53114ec2838071a7e6daa7@4x.png","assets/node_modules/expo-router/assets/react-navigation/elements/search-icon.286d67d3f74808a60a78d3ebf1a5fb57.png","assets/node_modules/expo-router/assets/sitemap.412dd9275b6b48ad28f5e3d81bb1f626.png","assets/node_modules/expo-router/assets/unmatched.20e71bdf79e3a97bf55fd9e164041578.png","favicon.ico","icon-180.png","icon-192.png","icon-512.png","manifest.webmanifest"];

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
