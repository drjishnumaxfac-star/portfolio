function toggleMob(){document.getElementById('nav-mob').classList.toggle('open');}
document.addEventListener('click',e=>{const mob=document.getElementById('nav-mob');if(mob && !e.target.closest('nav') && !e.target.closest('.nav-mob')){mob.classList.remove('open');}});
function checkMob(){const ham=document.getElementById('ham');if(!ham)return;if(window.innerWidth<=960){ham.style.display='flex'}else{ham.style.display='none';document.getElementById('nav-mob').classList.remove('open')}}
window.addEventListener('resize',checkMob);checkMob();
let obs;
function initRv(){if(obs)obs.disconnect();obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');if(e.target.id==='stats-grid'||(e.target.closest&&e.target.closest('#stats-grid')))startCounters();}}),{threshold:0.07,rootMargin:'0px 0px -20px 0px'});
  const els=Array.from(document.querySelectorAll('.rv'));
  let i=0;
  function chunk(){
    const slice=els.slice(i,i+40);
    slice.forEach(el=>{el.classList.remove('vis');obs.observe(el)});
    i+=40;
    if(i<els.length) requestAnimationFrame(chunk);
  }
  chunk();
}
let countersStarted=false;
function startCounters(){if(countersStarted)return;countersStarted=true;document.querySelectorAll('.counter').forEach(el=>{const target=parseInt(el.dataset.target);const dur=2200;const start=performance.now();function update(now){const p=Math.min((now-start)/dur,1);const ease=1-Math.pow(1-p,3);const cur=Math.floor(ease*target);el.textContent=cur>=1000?cur.toLocaleString():cur;if(p<1)requestAnimationFrame(update);else el.textContent=target>=1000?target.toLocaleString():target;}requestAnimationFrame(update);});}
const nav=document.getElementById('mnav');
if(nav){window.addEventListener('scroll',()=>{nav.style.background=window.scrollY>50?'rgba(25,25,25,0.97)':'rgba(25,25,25,0.93)';});}
document.addEventListener('DOMContentLoaded',()=>setTimeout(initRv,200));
