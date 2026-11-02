/* Gatherly V40 — visible Sign out (header + sidebar) */
(function(){
 var OUT='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l5-5-5-5"/><path d="M15 12H4"/></svg>';
 function signedIn(){try{return !!(accountState&&accountState.user)}catch(e){return false}}
 function arm(btn,label){
  if(btn.dataset.armed==='1'){doOut();return}
  btn.dataset.armed='1';btn.classList.add('armed');
  var span=btn.querySelector('span.g40-lbl'),old=span&&span.textContent;if(span)span.textContent='Tap again to sign out';
  btn.setAttribute('aria-label','Confirm sign out');
  setTimeout(function(){btn.dataset.armed='';btn.classList.remove('armed');if(span)span.textContent=old;btn.setAttribute('aria-label',label)},3200);
 }
 async function doOut(){
  try{await fetch('/api/auth/logout',{method:'POST',headers:{'content-type':'application/json'},body:'{}',credentials:'same-origin'})}catch(e){}
  try{localStorage.removeItem('gatherly_board')}catch(e){}
  location.href=location.pathname;
 }
 function ensure(){
  var top=document.querySelector('header.top .top-actions');
  if(top&&!document.getElementById('g40TopLogout')){
   var b=document.createElement('button');b.type='button';b.id='g40TopLogout';b.title='Sign out';b.setAttribute('aria-label','Sign out');b.innerHTML=OUT;
   b.addEventListener('click',function(){arm(b,'Sign out')});top.appendChild(b);
  }
  var acc=document.getElementById('g5AccountNav');
  if(acc&&!document.getElementById('g40SideLogout')){
   var s=document.createElement('button');s.type='button';s.id='g40SideLogout';s.setAttribute('aria-label','Sign out');
   s.innerHTML=OUT+'<span class="g40-lbl">Sign out</span>';
   s.addEventListener('click',function(){arm(s,'Sign out')});acc.insertAdjacentElement('afterend',s);
  }
  var on=signedIn();
  ['g40TopLogout','g40SideLogout'].forEach(function(id){var e=document.getElementById(id);if(e)e.classList.toggle('show',on)});
 }
 function boot(){ensure();new MutationObserver(ensure).observe(document.body,{childList:true,subtree:true,characterData:true});setInterval(ensure,1500)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
