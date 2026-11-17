/* FEARCE service worker. Bump VERSION on every release so installed copies detect the update. */
const VERSION = 'fearce-1.9.4';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'offline.html', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL))); self.skipWaiting(); /* new versions take over at once; the shell is fetched network-first so a reload always shows the latest build */ });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('fearce-') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('message', async e => {
  const d = e.data || {};
  if (d.t === 'skip') self.skipWaiting();
  if (d.t === 'precache') {
    try { const c = await caches.open(VERSION); await c.addAll(SHELL); const n = (await c.keys()).length; (await self.clients.matchAll()).forEach(cl => cl.postMessage({ t: 'offline-ready', n })); }
    catch (err) { (await self.clients.matchAll()).forEach(cl => cl.postMessage({ t: 'offline-fail' })); }
  }
});
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return; const u = new URL(r.url);
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(x => { if (x && x.ok) { const cp = x.clone(); caches.open(VERSION).then(c => c.put('index.html', cp)); } return x; }).catch(() => caches.match('index.html').then(h => h || caches.match('offline.html')))); return; }
  if (u.origin === location.origin) { e.respondWith(fetch(r).then(x => { if (x && x.ok) { const cp = x.clone(); caches.open(VERSION).then(c => c.put(r, cp)); } return x; }).catch(() => caches.match(r))); return; }
  if (/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) { e.respondWith(caches.open(VERSION + '-fonts').then(c => c.match(r).then(h => h || fetch(r).then(x => { c.put(r, x.clone()); return x; }).catch(() => h)))); }
});
