const CACHE='pleniora-ai-shell-v35',ROOT=new URL('./',self.registration.scope);
const SHELL=['./','app.html','app.html?offline=1','index.html','login.html','account.html','css/style.css','css/market.css','js/cloud-launcher.js','js/app.js','js/advanced.js','js/shopkeeper.js','js/product-fields.js','js/fabric-sales.js','js/fabric-sales.js?v=20261015-shopkeeper-alarm-4','js/daily-reports.js','js/industry.js','js/assistant.js','js/onboarding.js','manifest.webmanifest','offline.webmanifest','icons/rida-180.png','icons/rida-192.png','icons/rida-512.png'].map(path=>new URL(path,ROOT).href);
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==location.origin||url.pathname.startsWith('/api/'))return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response}).catch(async()=>await caches.match(request)||await caches.match(new URL('app.html',ROOT).href)||await caches.match(ROOT.href)));
    return;
  }
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(request,response.clone()));return response})));
});
