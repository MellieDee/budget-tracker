const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/css/styles.css",
  "/js/index.js",
  "/js/idb.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
]


self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Installing cache: ' + CACHE_NAME)
        return cache.addAll(FILES_TO_CACHE)
      })
  )
})