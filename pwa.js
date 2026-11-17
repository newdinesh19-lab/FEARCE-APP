/* Registers the service worker and tells the app when a new version is waiting. */
(function () {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').then(function (reg) {
    function waiting() { if (reg.waiting && navigator.serviceWorker.controller) { window.FEARCE_upd = reg; window.dispatchEvent(new Event('fearce-update')); } }
    waiting();
    reg.addEventListener('updatefound', function () { var n = reg.installing; if (n) n.addEventListener('statechange', function () { if (n.state === 'installed') waiting(); }); });
    setInterval(function () { try { reg.update(); } catch (e) { } }, 3600000);
  }).catch(function () { });
  navigator.serviceWorker.addEventListener('controllerchange', function () { if (window.__fxReload) location.reload(); });
})();
