function toggleMob(){document.getElementById('nav-mob').classList.toggle('open');}
document.addEventListener('click',e=>{const mob=document.getElementById('nav-mob');if(mob && !e.target.closest('nav') && !e.target.closest('.nav-mob')){mob.classList.remove('open');}});
function checkMob(){const ham=document.getElementById('ham');if(!ham)return;if(window.innerWidth<=960){ham.style.display='flex'}else{ham.style.display='none';document.getElementById('nav-mob').classList.remove('open')}}
window.addEventListener('resize',checkMob);checkMob();
let obs;
function initRv(){if(obs)obs.disconnect();obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');if(e.target.id==='stats-grid'||(e.target.closest&&e.target.closest('#stats-grid')))startCounters();}}),{threshold:0.07,rootMargin:'0px 0px -20px 0px'});const els=Array.from(document.querySelectorAll('.rv'));let i=0;function chunk(){const slice=els.slice(i,i+40);slice.forEach(el=>{el.classList.remove('vis');obs.observe(el)});i+=40;if(i<els.length)requestAnimationFrame(chunk)}chunk();}
let countersStarted=false;
function startCounters(){if(countersStarted)return;countersStarted=true;document.querySelectorAll('.counter').forEach(el=>{const target=parseInt(el.dataset.target);const dur=2200;const start=performance.now();function update(now){const p=Math.min((now-start)/dur,1);const ease=1-Math.pow(1-p,3);const cur=Math.floor(ease*target);el.textContent=cur>=1000?cur.toLocaleString():cur;if(p<1)requestAnimationFrame(update);else el.textContent=target>=1000?target.toLocaleString():target;}requestAnimationFrame(update);});}
const nav=document.getElementById('mnav');
if(nav){window.addEventListener('scroll',()=>{nav.style.background=window.scrollY>50?'rgba(25,25,25,0.97)':'rgba(25,25,25,0.93)';});}
document.addEventListener('DOMContentLoaded',()=>setTimeout(initRv,200));

/* SketchRoot founder logo: 3D tilt that follows the cursor (desktop) or device tilt (mobile) */
(function(){
  var hero=document.getElementById('hero-wrap')||document.querySelector('.hero');
  var logo=document.querySelector('.h-founder-img');
  if(!hero||!logo)return;
  var MAX=16,raf=0,tx=0,ty=0;
  function set(rx,ry){
    tx=rx;ty=ry;if(raf)return;
    raf=requestAnimationFrame(function(){raf=0;logo.style.transform='perspective(500px) rotateX('+(tx*MAX)+'deg) rotateY('+(ty*MAX)+'deg) scale(1.06)';logo.style.filter='drop-shadow('+(-ty*6)+'px '+(tx*6+3)+'px 7px rgba(0,0,0,.45))';});
  }
  function clear(){tx=0;ty=0;logo.style.transform='';logo.style.filter='';}
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.addEventListener('mousemove',function(e){
      var w=window.innerWidth,h=window.innerHeight;
      var r=logo.getBoundingClientRect();
      var rx=-(e.clientY-(r.top+r.height/2))/(h/2);
      var ry=(e.clientX-(r.left+r.width/2))/(w/2);
      set(Math.max(-1,Math.min(1,rx*1.4)),Math.max(-1,Math.min(1,ry*1.4)));
    });
    document.addEventListener('mouseleave',clear);
  }
  var running=false;
  function startOrientation(){
    if(running)return;running=true;var bB=null,bG=null;
    window.addEventListener('deviceorientation',function(e){
      var b=e.beta||0,g=e.gamma||0;
      if(bB===null){bB=b;bG=g;return;}
      set(-Math.max(-1,Math.min(1,(b-bB)/25)),Math.max(-1,Math.min(1,(g-bG)/25)));
    });
  }
  if('DeviceOrientationEvent' in window){
    if(typeof DeviceOrientationEvent.requestPermission==='function'){
      document.addEventListener('click',function h(){
        DeviceOrientationEvent.requestPermission().then(function(s){if(s==='granted')startOrientation();}).catch(function(){});
        document.removeEventListener('click',h);
      },{once:true});
    }else{startOrientation();}
  }
}());

/* Consultation mini form: builds a pre-filled WhatsApp message (no data is sent to or stored on this site) */
(function(){
  var f=document.getElementById('consult-form');
  if(!f)return;
  try{var sp=new URLSearchParams(location.search);var q=sp.get('loc');var src=sp.get('src');if(q&&f.location){for(var i=0;i<f.location.options.length;i++){if(f.location.options[i].text===q){f.location.selectedIndex=i;break;}}}}catch(e){}
  var selDay='',selTime='';
  (function(){var box=document.getElementById('cf-days');if(!box)return;var DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],MN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var d=new Date(),shown=0,MAXD=60,more=document.createElement('button');more.type='button';more.className='slot-more';
    function addDays(n){for(var k=0;k<n&&shown<MAXD;k++){shown++;var x=new Date(d.getFullYear(),d.getMonth(),d.getDate()+shown);var b=document.createElement('button');b.type='button';b.className='slot-chip';b.setAttribute('aria-pressed','false');b.dataset.v=DN[x.getDay()]+' '+x.getDate()+' '+MN[x.getMonth()];b.innerHTML='<small>'+DN[x.getDay()]+'</small>'+x.getDate()+' '+MN[x.getMonth()];box.insertBefore(b,more);}if(shown>=MAXD)more.remove();else more.textContent='More dates \u2192';}
    box.appendChild(more);more.addEventListener('click',function(e){e.stopPropagation();addDays(14);});addDays(14);
    function wire(c,set){c.addEventListener('click',function(e){var t=e.target.closest('.slot-chip');if(!t)return;var on=t.getAttribute('aria-pressed')==='true';[].forEach.call(c.querySelectorAll('.slot-chip'),function(n){n.setAttribute('aria-pressed','false');});if(!on){t.setAttribute('aria-pressed','true');set(t.dataset.v);}else set('');progress();});}
    wire(box,function(v){selDay=v;});wire(document.getElementById('cf-times'),function(v){selTime=v;});
    [].forEach.call(document.querySelectorAll('#cf-times .slot-chip'),function(n){n.setAttribute('aria-pressed','false');});})();
  var steps=document.querySelectorAll('#bk-steps li');
  function setStep(n,allDone){for(var i=0;i<steps.length;i++){var k=i+1;steps[i].className=(k<n||(allDone&&k<=n))?'bk-ok':(k===n?'bk-on':'');}}
  function progress(){var n=1;if(f.name.value.trim()&&f.concern.value)n=2;if(n===2&&(f.details.value.trim().length>2))n=3;setStep(n);}
  ['input','change'].forEach(function(ev){f.addEventListener(ev,progress);});
  progress();
  var SRC={gbp:'Google Business Profile',maps:'Google Maps',instagram:'Instagram',whatsapp:'WhatsApp',print:'Print'};
  var srcLabel='';try{var _s=new URLSearchParams(location.search).get('src');if(_s)srcLabel=SRC[_s.toLowerCase()]||_s.replace(/[^\w .-]/g,'').slice(0,30);}catch(e){}
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var name=f.name.value.trim(),concern=f.concern.value,loc=f.location.value,det=f.details.value.trim();
    var err=document.getElementById('cf-err');
    if(!name||!concern){if(err)err.hidden=false;(name?f.concern:f.name).focus();return;}
    if(err)err.hidden=true;
    var msg='Hello Dr. Jishnu Mohan, I would like to book a consultation.\n'+
      'Name: '+name+'\nConcern: '+concern+'\nPreferred location: '+loc+
      (det?'\nDetails: '+det:'')+((selDay||selTime)?'\nPreferred slot: '+[selDay,selTime].filter(Boolean).join(', ')+' (please confirm availability)':'')+(srcLabel?'\nFound via: '+srcLabel:'');
    var url='https://wa.me/918848026261?text='+encodeURIComponent(msg);
    var done=document.getElementById('cf-done'),wa=document.getElementById('cf-wa');
    if(wa)wa.href=url;var sn=document.getElementById('cf-slot-note');if(sn)sn.textContent=(selDay||selTime)?('Requested slot: '+[selDay,selTime].filter(Boolean).join(', ')+'. The clinic will confirm it on WhatsApp.'):'';if(done){done.hidden=false;done.scrollIntoView({behavior:'smooth',block:'nearest'});}
    if(typeof setStep==='function')setStep(4);
    window.open(url,'_blank','noopener');
  });
}());
