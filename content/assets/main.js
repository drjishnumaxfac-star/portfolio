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


/* SketchRoot logo: letters hop around confused, reshuffle, settle into "SketchRoot"; the two o's are eyes that look around and blink.
   Driven by requestAnimationFrame on SVG transform attributes (no CSS animation), so it runs on iOS/Android/desktop alike. */
(function(){
  var svg=document.querySelector('.sr-logo');
  if(!svg)return;
  var T=10,gs=[].slice.call(svg.querySelectorAll('.sr-g')).map(function(g,i){
    var b={x:0,y:0,width:0,height:0};try{b=g.getBBox();}catch(e){}var v=function(n){return parseFloat(g.style.getPropertyValue(n))||0;},eye=g.querySelector('.sr-eye'),pu=g.querySelector('.sr-pupil');
    return{g:g,i:i,cx:b.x+b.width/2,cy:b.y+b.height/2,w:[[0,0,0],[v('--x1'),v('--y1'),v('--r1')],[v('--x2'),v('--y2'),v('--r2')],[v('--x3'),v('--y3'),v('--r3')],[0,0,0]],eye:eye,pu:pu};
  });
  var K=[0.44,0.52,0.60,0.68,0.80];
  function back(t){var s=1.70158,u=t-1;return 1+(s+1)*u*u*u+s*u*u;}
  var LOOK=[[0,0,0],[.04,0,0],[.09,-6,-1],[.15,-6,-1],[.20,6,-2],[.26,6,-2],[.31,-3,5],[.36,-3,5],[.41,0,0],[.45,0,0],[.50,6,-5],[.54,-6,4],[.58,5,5],[.62,-5,-5],[.66,6,1],[.70,-6,-1],[.80,0,0],[1,0,0]];
  function look(p){for(var k=1;k<LOOK.length;k++){if(p<=LOOK[k][0]){var a=LOOK[k-1],b=LOOK[k],f=(p-a[0])/(b[0]-a[0]||1);return[a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f];}}return[0,0];}
  function frame(now){
    var s=now/1000;
    gs.forEach(function(o){
      var p=(((s-o.i*0.06)%T)+T)%T/T,x=0,y=0,r=0;
      if(p>K[0]&&p<K[4]){for(var k=1;k<5;k++){if(p<=K[k]){var f=back((p-K[k-1])/(K[k]-K[k-1])),a=o.w[k-1],b=o.w[k];x=a[0]+(b[0]-a[0])*f;y=a[1]+(b[1]-a[1])*f;r=a[2]+(b[2]-a[2])*f;break;}}}
      o.g.setAttribute('transform',(x||y||r)?'translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+r.toFixed(1)+' '+o.cx.toFixed(1)+' '+o.cy.toFixed(1)+')':'');
      if(o.eye){
        var q=(s%3.6)/3.6,sy=q<0.90?1:(q<0.94?1-0.92*(q-0.90)/0.04:(q<1?0.08+0.92*(q-0.94)/0.06:1));
        o.eye.setAttribute('transform','translate('+o.cx.toFixed(1)+' '+o.cy.toFixed(1)+') scale(1 '+sy.toFixed(3)+') translate('+(-o.cx).toFixed(1)+' '+(-o.cy).toFixed(1)+')');
        var l=look(p);o.pu.setAttribute('transform','translate('+l[0].toFixed(1)+' '+l[1].toFixed(1)+')');
      }
    });
    if(!document.hidden)requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange',function(){if(!document.hidden)requestAnimationFrame(frame);});
  requestAnimationFrame(frame);
}());
