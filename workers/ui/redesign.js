/* Gatherly V40 — Sign out button inside the profile dialog (reuses the app's own #g5Logout handler) */
(function(){
 var OUT='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l5-5-5-5"/><path d="M15 12H4"/></svg>';
 function enhance(){
  var dlg=document.querySelector('#overlay .g8-profile-dialog');
  var real=document.getElementById('g5Logout');
  if(!dlg||!real||dlg.querySelector('#g40ProfileOut'))return;
  var row=document.createElement('div');row.className='g40-out-row';
  var b=document.createElement('button');b.type='button';b.id='g40ProfileOut';b.innerHTML=OUT+'<span>Sign out</span>';
  b.addEventListener('click',function(){var r=document.getElementById('g5Logout');if(r)r.click()});
  row.appendChild(b);
  var anchor=Array.prototype.find.call(dlg.querySelectorAll('button'),function(x){return /Settings/.test(x.textContent)});
  if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(row,anchor.nextSibling);else dlg.appendChild(row);
 }
 function boot(){enhance();new MutationObserver(enhance).observe(document.getElementById('overlay')||document.body,{childList:true,subtree:true})}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
