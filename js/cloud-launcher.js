(async()=>{
 const note=document.getElementById('cloudStatus'),KEY='rida_fabrics_pro_v3',PROFILE='rida_offline_profile_v1',PENDING='rida_pending_sync_v1';
 const load=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(new Error(src+' failed to load'));document.body.appendChild(s)});
 if(new URLSearchParams(location.search).get('offline')==='1'){
  try{window.RIDA_OFFLINE_MODE=true;document.body.dataset.offlineMode='true';if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js').catch(()=>{});document.body.classList.remove('is-booting');if(note)note.textContent='Offline workspace · this device only';await load('js/app.js');await load('js/advanced.js');await load('js/shopkeeper.js');await load('js/product-fields.js');await load('js/fabric-sales.js?v=20261015-shopkeeper-alarm-4');await load('js/daily-reports.js');await load('js/industry.js');await load('js/assistant.js');document.querySelector('.logout')?.remove();document.querySelector('.top-actions a[href="account.html"]')?.remove();document.querySelectorAll('.top-actions a[href="starter-guide.html"]').forEach(x=>x.textContent='Offline guide');window.logout=()=>toast('Offline workspace has no sign-in. Keep this phone locked and export regular backups.');const startTour=()=>{const tour=document.createElement('script');tour.src='js/onboarding.js';document.body.appendChild(tour)};startTour();return}catch(error){document.body.classList.remove('is-booting');if(note)note.textContent='Could not load the offline workspace: '+(error.message||'check the cached app files');return}
 }
 const online=()=>navigator.onLine;
 const renderStatus=(message)=>{if(note)note.textContent=message};
 const offlineProfile=()=>{try{return JSON.parse(localStorage.getItem(PROFILE)||'null')}catch{return null}};
 const allowedOffline=p=>{if(!p)return false;const trialOk=p.trialEndsAt&&Date.now()<Date.parse(p.trialEndsAt),free=p.freeAccessMode==='lifetime'||(p.freeAccessMode==='until'&&p.freeAccessUntil&&Date.now()<=Date.parse(p.freeAccessUntil));return trialOk||free||p.subscriptionStatus==='active'};
 async function boot(){
  if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js').catch(()=>{});
  let user,data,isOffline=false;
  try{
   const auth=await fetch('/api/me');if(auth.status===401){location.replace('/login.html?return=%2Fapp.html');return}if(!auth.ok)throw Error('Could not verify your account');
   ({user}=await auth.json());if(!user.access){location.replace('/account.html');return}
   const response=await fetch('/api/data');if(!response.ok)throw Error('Could not load your business data');({data}=await response.json());
   const pending=localStorage.getItem(PENDING);if(pending){try{data=JSON.parse(pending);const sync=await fetch('/api/data',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({data})});if(sync.ok)localStorage.removeItem(PENDING);else throw Error('Pending offline changes could not sync')}catch(e){localStorage.setItem(PENDING,JSON.stringify(data));renderStatus('Offline changes are saved on this device; sync is pending.')}}
   localStorage.setItem(PROFILE,JSON.stringify({id:user.id,name:user.name,email:user.email,businessName:user.businessName,businessType:user.businessType,modules:user.modules,trialEndsAt:user.trialEndsAt,subscriptionStatus:user.subscriptionStatus,freeAccessMode:user.freeAccessMode,freeAccessUntil:user.freeAccessUntil}));
  }catch(error){
   isOffline=true;user=offlineProfile();try{data=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}
   if(!user||!data){document.body.classList.remove('is-booting');renderStatus('Connect to the internet and sign in once to enable offline use.');return}
   if(!allowedOffline(user)){document.body.classList.remove('is-booting');renderStatus('Your saved access has ended. Connect to the internet to renew or ask your administrator.');return}
   renderStatus('Offline mode · changes stay on this device until sync.');
  }
  const owner={id:user.id,name:user.name,username:user.email,password:'',role:'Super Admin',active:true,permissions:['all']};
  data.users=Array.isArray(data.users)?data.users:[];const index=data.users.findIndex(x=>x.id===user.id);if(index>=0)data.users[index]={...data.users[index],...owner};else data.users.unshift(owner);
  data.currentUser=user.id;data.settings??={currency:'Rs',primary:'#6F12A0'};data.businesses??=[];
  if(!data.businesses.length)data.businesses.push({id:crypto.randomUUID(),name:user.businessName,type:user.businessType||'General Retail',currency:'Rs'});
  if(data.businesses[0]&&!data.businesses[0].type)data.businesses[0].type=user.businessType||'General Retail';
  data.currentBusiness??=data.businesses[0].id;data.restaurantTables??=[];data.restaurantOrders??=[];data.shopkeeperOrders??=[];
  localStorage.setItem(KEY,JSON.stringify(data));window.ridaAccount=user;
  let syncing=Promise.resolve(),timer;
  async function syncLocal(){if(!online())return;let payload;try{payload=JSON.parse(localStorage.getItem(KEY)||'null')}catch{return}if(!payload)return;syncing=syncing.then(async()=>{try{const res=await fetch('/api/data',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({data:payload})});if(res.status===402){location.href='/account.html';return}if(!res.ok)throw Error((await res.json()).error||'Sync failed');localStorage.removeItem(PENDING);renderStatus(`Synced · ${user.businessName}`)}catch{localStorage.setItem(PENDING,JSON.stringify(payload));renderStatus('Sync pending · your changes are saved on this device.')}});return syncing}
  const original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){original.call(this,k,v);if(k===KEY){localStorage.setItem(PENDING,v);clearTimeout(timer);timer=setTimeout(()=>{if(online())syncLocal();else renderStatus('Offline mode · changes saved on this device.')},250)}};
  window.addEventListener('online',syncLocal);window.addEventListener('online',()=>renderStatus(`Connected · syncing ${user.businessName}…`));window.addEventListener('offline',()=>renderStatus('Offline mode · changes saved on this device.'));
  document.body.classList.remove('is-booting');await load('js/app.js');await load('js/advanced.js');
  const activeBusiness=data.businesses.find(b=>b.id===data.currentBusiness),isClothing=/clothing|fabric|fashion|apparel/i.test(activeBusiness?.type||user.businessType||'');const allowed=new Set(user.modules||[]);
  document.getElementById('shopkeeperNav')?.remove();if(isClothing){allowed.add('shopkeeper');allowed.add('shopkeeperManagement')}if(!isClothing){document.getElementById('posModeShopkeeper')?.remove()}
  document.querySelectorAll('#mainNav button[data-page]').forEach(button=>{if(!allowed.has(button.dataset.page))button.remove()});
  const originalShow=window.showPage;window.showPage=page=>{if(!allowed.has(page)){window.toast?.('This module is not enabled for this account.');return}return originalShow(page)};
  window.logout=async()=>{if(online())await fetch('/api/logout',{method:'POST'});localStorage.removeItem(PROFILE);location.href='/login.html'};window.login=()=>location.href='/login.html';
  if(!isOffline)renderStatus(user.freeAccessMode&&user.freeAccessMode!=='none'?`Business workspace · ${user.businessName}`:`Trial · ${user.trialDaysRemaining} day(s) left · ${user.businessName}`);
  await load('js/shopkeeper.js');await load('js/product-fields.js');await load('js/fabric-sales.js?v=20261015-shopkeeper-alarm-4');await load('js/daily-reports.js');await load('js/industry.js');await load('js/assistant.js');
  const startTour=()=>{const tour=document.createElement('script');tour.src='js/onboarding.js';tour.onerror=()=>{if(note)note.textContent='Workspace loaded. Open How to use for setup help.'};document.body.appendChild(tour)};
  try{await load('js/module-guide.js')}catch{}startTour();if(isOffline)renderStatus('Offline mode · changes saved on this device; sync when connected.');else if(localStorage.getItem(PENDING))syncLocal();if(isClothing)window.showPage?.('pos');
 }
 boot().catch(error=>{document.body.classList.remove('is-booting');renderStatus((error.message||'Unable to connect')+' — start through node server.js or install for offline use.')});
})();
