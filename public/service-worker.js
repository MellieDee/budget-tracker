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
  // "/icons/icon-192.png",
  "icons/icon-144.png",
  "/icons/icon-512.png"
]

// ------------------ Install Service Worker -----------------
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Installing cache: ' + CACHE_NAME)
        return cache.addAll(FILES_TO_CACHE)
      })
  )
})

// ----------  Activate SW & Delete outdated caches --------------
self.addEventListener('activate', function (e) {
  e.waitUntil(
    // look for cached files with matching prefix
    caches.keys().then(function (keyList) {
      let cacheKeepList = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      })

      // add to keeplist
      cacheKeepList.push(CACHE_NAME);

      // when all promises are resolved - then return
      return Promise.all(keyList.map(function (key, i) {
        if (cacheKeepList.indexOf(key) === -1) {
          console.log('Deleting cache: ' + keyList[i]);
          return caches.delete(keyList[i])
        }
      }));
    })
  );
});



//-------------- Respond with cached resources --------------
// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})


// ------test code w/ AT -------------------
// self.addEventListener('fetch', function (e) {
//   console.log('Line 55: fetch request : ' + e.request)
//   e.respondWith(
//     //if resource IS cached retrieve it:
//     caches.open(CACHE_NAME).then(cache => {
//       fetch(e.request)
//         .then(response => {
//           console.log('Line 61: ' + response)
//           if (response) {
//             console.log('LINE 62 responding with cache : ' + e.request.url)
//             cache.put(e.request.url, response.clone())
//           }
//           return response
//           // } else { //if resource isn't cached - then get regular way:
//           //   console.log('file is not cached, fetching : ' + e.request.url)
//           //   return fetch(request)
//           // }
//         })
//         .catch(err => {
//           console.log("This is the stinky error")
//           return cache.match(e.request)
//         })
//       // return request || fetch(e.request)

//     })
//   )
// })

