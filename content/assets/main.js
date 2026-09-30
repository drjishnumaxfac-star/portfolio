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

/* Homepage positioning and search-intent language. The existing visual system is retained. */
function enhanceHomepageSEO(){
  if(!document.body) return;
  const home=document.getElementById('hero-wrap');
  if(!home) return;

  const title='Maxillofacial Surgeon & Implantologist in Kochi | Dr. Jishnu Mohan';
  const description='Dr. Jishnu Mohan is an Oral & Maxillofacial Surgeon and Implantologist in Kochi specialising in advanced dental implants, zygomatic implants, craniomaxillofacial implants, non surgical TMJ treatment for jaw pain and clicking, and care for snoring and sleep apnea.';
  document.title=title;
  let meta=document.querySelector('meta[name="description"]');
  if(meta) meta.setAttribute('content',description);
  else{meta=document.createElement('meta');meta.name='description';meta.content=description;document.head.appendChild(meta);}
  document.querySelectorAll('meta[property="og:title"],meta[name="twitter:title"]').forEach(el=>el.setAttribute('content',title));
  document.querySelectorAll('meta[property="og:description"],meta[name="twitter:description"]').forEach(el=>el.setAttribute('content',description));

  const eye=home.querySelector('.h-eye');
  if(eye) eye.textContent='Oral & Maxillofacial Surgeon & Implantologist · Kochi, Kerala';
  const quote=home.querySelector('.h-quote');
  if(quote) quote.textContent='Advanced Maxillofacial Surgeon & Implantologist';

  const desc=home.querySelector('.h-desc');
  if(desc) desc.innerHTML='My clinical focus is <strong>advanced dental implantology in Kochi</strong>, including complex dental implants, zygomatic implants and craniomaxillofacial implants, alongside advanced non surgical TMJ treatment for jaw pain, clicking and popping, and care for snoring and sleep apnea. <strong>My practice brings together complex surgery, clinical research and patient specific medical innovation.</strong>';

  const ranks=home.querySelector('.h-ranks');
  if(ranks){
    ranks.innerHTML='\n      <span class="h-rank rank-aiims"><span class="rank-kicker">AIIMS · NEW DELHI</span><strong>AIR 1</strong><span class="rank-detail">PhD Entrance Examination · Oral &amp; Maxillofacial Surgery · 2025</span></span>\n      <span class="h-rank rank-pgi"><span class="rank-kicker">P.G.I.</span><strong>Premier Government Institute</strong><span class="rank-detail">MDS · Oral &amp; Maxillofacial Surgery · Gold Medalist</span></span>\n      <span class="h-rank rank-tmc"><span class="rank-kicker">TATA MEMORIAL CENTRE</span><strong>Government of India</strong><span class="rank-detail">Homi Bhabha Cancer Hospital &amp; Research Centre · Head &amp; Neck Surgical Oncology</span></span>';
  }

  const bridgeLead=home.querySelector('.bridge-lead');
  if(bridgeLead) bridgeLead.textContent='A focused surgical practice in Kochi spanning advanced dental implantology, complex jaw reconstruction, non surgical TMJ care, and sleep related breathing concerns, supported by academic training, oncology experience and clinical innovation.';

  const tmjCard=home.querySelector('a[href="/clinical/tmj-disorders.html"] .bridge-p');
  if(tmjCard) tmjCard.textContent='Advanced non surgical TMJ treatment for jaw pain, joint clicking, popping, locking and related orofacial pain, with conservative care at the centre of treatment planning.';

  const implantCard=home.querySelector('a[href="/clinical/dental-implants.html"] .bridge-p');
  if(implantCard) implantCard.textContent='Advanced dental implants, complex implant rehabilitation, zygomatic implants and craniomaxillofacial implant planning for carefully selected patients.';

  const logo=home.querySelector('.h-founder-img');
  if(logo){logo.setAttribute('alt','SketchRoot dental education platform');}
}

document.addEventListener('DOMContentLoaded',()=>{
  const css=document.createElement('link');
  css.rel='stylesheet';
  css.href='/assets/hero-seo-overrides.css';
  document.head.appendChild(css);
  enhanceHomepageSEO();
  setTimeout(initRv,200);
});
