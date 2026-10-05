/* Deterministic motion-graphics renderer: window.render(t) draws the frame at time t (seconds). */
(function () {
  const FPS = TL.fps;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const P = (t, a, d) => clamp((t - a) / d);
  const lerp = (a, b, t) => a + (b - a) * t;
  const out3 = t => 1 - Math.pow(1 - t, 3);
  const out4 = t => 1 - Math.pow(1 - t, 4);
  const io = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const back = t => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const tri = u => Math.abs((((u % 2) + 2) % 2) - 1);
  const el = (tag, cls, html, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
  const $ = id => document.getElementById(id);
  const stage = $('stage');

  /* ---------------------------------------------------------------- backgrounds */
  const bgDark = $('bgDark'), bgLight = $('bgLight');
  const sparkSVG = '<svg viewBox="0 0 40 40"><defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd0ec"/><stop offset="1" stop-color="#c58bff"/></linearGradient></defs><path fill="url(#sg)" d="M20 0C22 12 28 18 40 20C28 22 22 28 20 40C18 28 12 22 0 20C12 18 18 12 20 0Z"/></svg>';
  const sparks = [[170, 120, 1], [1790, 90, 1.4], [1500, 980, 1], [260, 940, 1.2], [960, 60, .8], [1840, 560, 1], [70, 560, .9], [1130, 1030, 1.1]].map((p, i) => {
    const e = el('div', 'spark', sparkSVG, stage); e.style.left = p[0] + 'px'; e.style.top = p[1] + 'px'; e.dataset.k = p[2]; e.dataset.i = i; return e;
  });
  const arcs = $('arcs');

  function updateBg(t, mode) {
    bgLight.style.opacity = mode.toFixed(3);
    for (const [bg, k] of [[bgDark, 1], [bgLight, 1]]) {
      const b = bg.children;
      b[0].style.transform = `translate(${Math.sin(t * .23) * 70}px,${Math.cos(t * .19) * 50}px)`;
      b[1].style.transform = `translate(${Math.cos(t * .17) * 80}px,${Math.sin(t * .21) * 60}px)`;
      b[2].style.transform = `translate(${Math.sin(t * .27 + 1) * 60}px,${Math.cos(t * .25) * 70}px)`;
    }
    arcs.style.transform = `rotate(${t * 1.1}deg)`;
    arcs.style.opacity = (0.5 + 0.5 * mode).toFixed(3);
    for (const s of sparks) {
      const i = +s.dataset.i, k = +s.dataset.k, a = .5 + .5 * Math.sin(t * 1.5 + i * 1.9);
      s.style.opacity = (.25 + .6 * a).toFixed(3);
      s.style.transform = `scale(${(.55 + .55 * a) * k}) rotate(${t * 18 + i * 40}deg)`;
    }
  }

  /* ---------------------------------------------------------------- text helpers */
  function wordsOf(html) {
    const out = []; let em = false;
    html.split(/(<\/?em>)/).forEach(seg => {
      if (seg === '<em>') em = true; else if (seg === '</em>') em = false;
      else seg.split(/\s+/).filter(Boolean).forEach(w => out.push({ w, em }));
    });
    return out;
  }
  function makeWords(parent, html) {
    const spans = [];
    wordsOf(html).forEach((o, i) => {
      const s = el('span', 'word', o.w + ' ', parent);
      if (o.em) { s.style.background = 'var(--grad)'; s.style.webkitBackgroundClip = 'text'; s.style.backgroundClip = 'text'; s.style.color = 'transparent'; s.style.webkitTextFillColor = 'transparent'; }
      spans.push(s);
    });
    return spans;
  }
  function animWords(spans, lt, step = .07, dur = .55, rise = 32, blur = 10) {
    spans.forEach((s, i) => {
      const p = P(lt, i * step, dur), e = out3(p);
      s.style.opacity = p.toFixed(3);
      s.style.transform = `translateY(${((1 - e) * rise).toFixed(1)}px)`;
      s.style.filter = p < 1 ? `blur(${((1 - e) * blur).toFixed(1)}px)` : 'none';
    });
  }
  const show = (e, on) => { const d = on ? 'block' : 'none'; if (e.style.display !== d) e.style.display = d; };
  function pop(e, p, rise = 18) { // generic appear: p 0..1 (can overshoot)
    const o = clamp(p * 1.6);
    e.style.opacity = o.toFixed(3);
    e.style.transform = `translateY(${((1 - p) * rise).toFixed(1)}px) scale(${(.9 + .1 * p).toFixed(3)})`;
  }

  /* ---------------------------------------------------------------- paper card */
  const PAGE_H = 1535, PITCH = { p1: 27.65, p2: 26.6 };
  const COLS = { p1L: [95, 578], p1R: [638, 1122], p2L: [105, 570], p2R: [628, 1092] };

  function linesOf(regions) {
    const lines = []; const spans = [];
    regions.forEach(r => {
      const [cl, cr] = COLS[r.page + r.col] || [r.s, r.e];
      const n = r.n || Math.max(1, Math.round((r.y1 - r.y0) / PITCH[r.page]));
      const h = (r.y1 - r.y0) / n; let len = 0; const start = lines.length;
      for (let i = 0; i < n; i++) {
        const x0 = (i === 0 && r.s != null) ? r.s : cl, x1 = (i === n - 1 && r.e != null) ? r.e : cr;
        const l = { x0: Math.min(x0, x1 - 20), x1, y: r.y0 + i * h, h };
        lines.push(l); len += l.x1 - l.x0;
      }
      spans.push({ start, end: lines.length, len, bbox: { x0: Math.min(...lines.slice(start).map(l => l.x0)), x1: Math.max(...lines.slice(start).map(l => l.x1)), y0: r.y0, y1: r.y1 } });
    });
    const total = spans.reduce((a, s) => a + s.len, 0); let cum = 0;
    spans.forEach(s => { cum += s.len; s.f = cum / total; });
    return { lines, spans, total };
  }

  function camFor(ck, cw, ch) {
    if (ck.cam) return ck.cam;
    const r0 = ck.regions[0], [cl, cr] = COLS[r0.page + r0.col];
    const y0 = Math.min(...ck.regions.map(r => r.y0)), y1 = Math.max(...ck.regions.map(r => r.y1));
    let s = Math.min(cw * .9 / (cr - cl + 20), ch * .7 / (y1 - y0 + 60), 1.6);
    let cy = (y0 + y1) / 2; cy = clamp(cy, ch / 2 / s, PAGE_H - ch / 2 / s);
    return { page: r0.page, cx: (cl + cr) / 2, cy, s };
  }

  class Card {
    constructor(parent, x, y, w, h, label) {
      this.w = w; this.h = h;
      this.root = el('div', 'card', null, parent);
      Object.assign(this.root.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
      this.pg = el('div', 'pg', null, this.root);
      this.imgs = {};
      ['p1', 'p2'].forEach(k => { const im = el('img', null, null, this.pg); im.src = `assets/${k}.jpg`; im.style.display = 'none'; this.imgs[k] = im; });
      this.spot = el('div', 'spot', null, this.pg);
      this.mks = []; for (let i = 0; i < 12; i++) this.mks.push(el('div', 'mk', null, this.pg));
      this.cur = el('div', 'cur', null, this.pg);
      this.chip = el('div', 'chip', '<i></i>' + label, this.root);
      this.page = null;
    }
    cam(page, cx, cy, s) {
      if (page !== this.page) { Object.keys(this.imgs).forEach(k => this.imgs[k].style.display = k === page ? 'block' : 'none'); this.page = page; }
      this.pg.style.transform = `translate(${(this.w / 2 - cx * s).toFixed(2)}px,${(this.h / 2 - cy * s).toFixed(2)}px) scale(${s.toFixed(4)})`;
    }
    setSpot(b, k) {
      const pad = 9;
      Object.assign(this.spot.style, { left: (b.x0 - pad) + 'px', top: (b.y0 - pad + 2) + 'px', width: (b.x1 - b.x0 + 2 * pad) + 'px', height: (b.y1 - b.y0 + 2 * pad - 4) + 'px', opacity: k.toFixed(3) });
    }
    setMarks(L, p, fade) {
      let target = p * L.total, cum = 0, last = -1, lastX = 0;
      this.mks.forEach((m, i) => {
        const l = L.lines[i];
        if (!l) { show(m, false); return; }
        const len = l.x1 - l.x0, cov = clamp((target - cum) / len); cum += len;
        if (cov <= 0) { show(m, false); return; }
        show(m, true);
        Object.assign(m.style, { left: l.x0 + 'px', top: (l.y + l.h * .07) + 'px', width: len + 'px', height: (l.h * .86) + 'px', transform: `scaleX(${cov.toFixed(4)})`, opacity: (.78 * fade).toFixed(3) });
        last = i; lastX = l.x0 + len * cov;
      });
      if (last >= 0 && p < .995 && p > 0) {
        const l = L.lines[last]; show(this.cur, true);
        Object.assign(this.cur.style, { left: (lastX - 2) + 'px', top: (l.y + l.h * .02) + 'px', height: (l.h * .96) + 'px' });
      } else show(this.cur, false);
    }
  }

  /* ---------------------------------------------------------------- explanation visuals */
  const ARROW = '<svg viewBox="0 0 38 34" width="38" height="34"><path d="M19 1V24M7 14L19 27L31 14" stroke="#ff8ccb" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const BASE = .8;
  const stag = (n, ck, max = .8) => clamp(ck.voice * .62 / Math.max(n, 1), .2, max);

  function buildVis(parent, v) {
    const box = el('div', null, null, parent); box.style.marginBottom = '26px';
    if (v.t === 'chips') {
      box.className = 'chips';
      const cs = v.items.map(t => el('div', 'chip2' + (v.tone === 'bad' ? ' bad' : ''), t, box));
      return { update(lt, ck) { const st = stag(cs.length, ck, .5); cs.forEach((c, i) => pop(c, back(P(lt, BASE + i * st, .55)), 16)); } };
    }
    if (v.t === 'stats') {
      box.className = 'stats';
      const ss = v.items.map(it => { const s = el('div', 'stat', null, box); const b = el('div', 'big', it.big || '0', s); el('div', 'l', it.l, s); s._b = b; s._it = it; return s; });
      return { update(lt, ck) { const st = stag(ss.length, ck, .9); ss.forEach((s, i) => { const t0 = BASE + i * st; pop(s, back(P(lt, t0, .6)), 22); if (s._it.num != null) s._b.textContent = Math.round(s._it.num * out3(P(lt, t0 + .15, 1.3))) + (s._it.suf || ''); }); } };
    }
    if (v.t === 'cols') {
      box.className = 'cols';
      const cs = v.items.map(it => { const c = el('div', 'colc', null, box); el('div', 'h', it.h, c); el('div', 'b', it.b, c); return c; });
      return { update(lt, ck) { const st = stag(cs.length, ck, .9); cs.forEach((c, i) => pop(c, back(P(lt, BASE + i * st, .6)), 24)); } };
    }
    if (v.t === 'flow') {
      box.className = 'flow';
      const ns = [], ars = [];
      v.items.forEach((t, i) => { const n = el('div', 'node', `<s>${i + 1}</s>${t}`, box); ns.push(n); if (i < v.items.length - 1) ars.push(el('div', 'arrow', ARROW, box)); });
      return { update(lt, ck) { const st = stag(ns.length, ck, .9); ns.forEach((n, i) => { pop(n, back(P(lt, BASE + i * st, .55)), 20); if (ars[i]) pop(ars[i], P(lt, BASE + i * st + st * .55, .35), 10); }); } };
    }
    if (v.t === 'rows') {
      box.className = 'rows';
      const rs = v.items.map(it => { const r = el('div', 'row', null, box); el('div', 'k', it.k, r); const tr = el('div', 'track', null, r); const f = el('div', 'fill', null, tr); el('div', 'v', it.v, tr); r._f = f; r._w = it.w; return r; });
      if (v.note) el('div', 'note', v.note, box);
      return { update(lt, ck) { const st = stag(rs.length, ck, .8); rs.forEach((r, i) => { const t0 = BASE + i * st; pop(r, out3(P(lt, t0, .5)), 14); r._f.style.width = (r._w * 100 * out3(P(lt, t0 + .1, 1.0))).toFixed(1) + '%'; }); } };
    }
    if (v.t === 'steps') {
      box.className = 'steps';
      const ss = v.items.map((it, idx) => {
        const s = el('div', 'step', null, box);
        el('div', 'badge ' + it.tone, it.when, s);
        const d = el('div', null, null, s); el('div', 'w', it.what, d); if (it.sub) el('div', 'sub', it.sub, d);
        s._rev = it.rev != null ? it.rev : idx + 1; return s;
      });
      return { update(lt, ck) {
        const st = stag(ss.length, ck, .8);
        ss.forEach((s, i) => {
          if (v.upto == null) { pop(s, back(P(lt, BASE + i * st, .55)), 20); return; }
          if (s._rev < v.upto) { const p = P(lt, .1 + i * .06, .35); s.style.opacity = (.6 * p).toFixed(3); s.style.transform = 'none'; }
          else if (s._rev === v.upto) pop(s, back(P(lt, BASE - .1, .6)), 26);
          else { const p = P(lt, .1, .4); s.style.opacity = (v.ghost ? .16 * p : 0).toFixed(3); s.style.transform = 'none'; }
        });
      } };
    }
    if (v.t === 'scale') {
      box.className = 'scale';
      const X = x => (x / v.max * 820);
      el('div', 'lab', v.label, box);
      el('div', 'track', null, box);
      [0, v.max].forEach(x => { const t = el('div', 'tick', String(x), box); t.style.left = X(x) + 'px'; });
      const mk = el('div', 'mark', null, box); mk.style.left = (X(v.mark) - 1) + 'px';
      const ml = el('div', 'mlab', v.note || (v.mark + ' ' + v.unit), box); ml.style.left = X(v.mark) + 'px';
      let band = null; if (v.band) { band = el('div', 'band', null, box); band.style.left = X(v.band[0]) + 'px'; band.style.width = (X(v.band[1]) - X(v.band[0])) + 'px'; }
      const ind = el('div', 'ind', null, box); const val = el('div', 'val', '', box);
      return { update(lt, ck) {
        pop(mk, P(lt, .5, .5), 0); pop(ml, P(lt, .6, .5), 10); mk.style.transform = 'none';
        if (band) band.style.opacity = P(lt, 1.2, .5).toFixed(3);
        const q = out3(P(lt, BASE, 1.6)), value = v.fill * q, x = X(value);
        ind.style.left = x + 'px'; val.style.left = clamp(x, 90, 730) + 'px';
        const col = (v.tone === 'ok') ? (value <= v.mark ? '#3be8a8' : '#ff5a7a') : (value >= v.mark ? '#ff5a7a' : '#3be8a8');
        val.style.color = col; val.textContent = Math.round(value) + ' ' + v.unit;
        ind.style.opacity = clamp(q * 4).toFixed(2); val.style.opacity = clamp(q * 4).toFixed(2);
      } };
    }
    if (v.t === 'cell') {
      const NS = 'http://www.w3.org/2000/svg';
      box.innerHTML = `<svg id="cellsvg" width="850" height="340" viewBox="0 0 850 340">
        <rect x="2" y="12" width="446" height="316" rx="28" fill="rgba(255,95,176,.08)" stroke="rgba(255,255,255,.25)" stroke-width="2"/>
        <text x="24" y="46" fill="rgba(255,255,255,.75)" font-size="22" font-weight="700" font-family="PJS">BLOOD</text>
        <rect x="560" y="12" width="288" height="316" rx="28" fill="rgba(155,107,255,.14)" stroke="rgba(255,255,255,.25)" stroke-width="2"/>
        <text x="584" y="46" fill="rgba(255,255,255,.75)" font-size="22" font-weight="700" font-family="PJS">CELL · FAT TISSUE</text>
        <rect x="486" y="12" width="40" height="316" rx="20" fill="#7a55d8"/>
        <g transform="translate(506 150)"><rect x="-30" y="-6" width="60" height="46" rx="10" fill="#fff"/><path d="M-16 -6 V-22 a16 16 0 0 1 32 0 V-6" fill="none" stroke="#fff" stroke-width="8"/><circle cx="0" cy="16" r="6" fill="#7a55d8"/></g>
        <g id="noins" transform="translate(506 238)"><text text-anchor="middle" y="0" fill="#ff5a7a" font-size="24" font-weight="800" font-family="PJS">NO INSULIN</text></g>
        <g id="dots"></g>
        <text id="hyper" x="24" y="316" fill="#ffd34d" font-size="25" font-weight="800" font-family="PJS" opacity="0">Glucose piles up: hyperglycemia</text>
      </svg>`;
      const dots = box.querySelector('#dots'), noins = box.querySelector('#noins'), hyper = box.querySelector('#hyper');
      const D = []; for (let i = 0; i < 28; i++) { const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', 10); c.setAttribute('fill', '#ffc83d'); c.setAttribute('stroke', '#fff3c9'); c.setAttribute('stroke-width', 2); dots.appendChild(c); D.push({ c, fx: .16 + (i * 37 % 17) / 60, fy: .13 + (i * 53 % 19) / 70, ox: i * .37, oy: i * .61 }); }
      return { update(lt, ck) {
        const n = Math.round(7 + 21 * P(lt, 1.0, Math.max(ck.voice * .85, 2)));
        D.forEach((d, i) => { if (i >= n) { d.c.setAttribute('opacity', 0); return; } d.c.setAttribute('opacity', clamp((P(lt, .5 + i * .02, .3)) * 1).toFixed(2)); d.c.setAttribute('cx', (26 + 398 * tri(d.fx * lt + d.ox)).toFixed(1)); d.c.setAttribute('cy', (66 + 214 * tri(d.fy * lt + d.oy)).toFixed(1)); });
        noins.setAttribute('opacity', P(lt, .7, .5).toFixed(2));
        hyper.setAttribute('opacity', P(lt, ck.voice * .7, .6).toFixed(2));
      } };
    }
    return { update() {} };
  }

  /* ---------------------------------------------------------------- scenes */
  const chapterIdx = {}; PLAN.chapters.forEach((c, i) => chapterIdx[c.id] = i);
  const chunkById = {}; PLAN.chunks.forEach(c => chunkById[c.id] = c);

  function sceneFade(t, sc) { return P(t, sc.start, .4) * (1 - P(t, sc.end - .45, .45)); }

  /* ---- intro */
  const introEl = el('div', 'scene', null, stage); introEl.id = 'intro';
  const iKick = el('div', 'kick', '<i></i>EPISODE 01 · PAPER EXPLAINED', introEl);
  const iTitle = el('div', 'ttl', null, introEl); const iWords = makeWords(iTitle, 'Perioperative Management of the <em>Diabetic Patient</em>');
  const iBy = el('div', 'by', null, introEl);
  const iA = [el('div', 'a', 'Hyon K. Yoo, DDS', iBy), el('div', 'a', 'Bethany L. Serafin, DMD', iBy)];
  const iJ = el('div', 'j', '<b>Oral and Maxillofacial Surgery Clinics of North America</b><br>2006;18:255–260', iBy);
  const iCard = new Card(introEl, 1090, 75, 740, 930, 'THE PAPER');
  const introSc = TL.scenes.find(s => s.type === 'intro');
  const WHOLE = { page: 'p1', cx: 610, cy: 767, s: 740 / 1220 }, TITLECAM = { page: 'p1', cx: 607, cy: 640, s: .78 };
  const INTRO_REG = [
    [{ page: 'p1', col: 'L', y0: 262, y1: 318, s: 175, e: 1042, n: 1 }],
    [{ page: 'p1', col: 'L', y0: 343, y1: 372, s: 268, e: 950, n: 1 }, { page: 'p1', col: 'L', y0: 169, y1: 197, s: 375, e: 842, n: 1 }],
  ];
  const INTRO_L = INTRO_REG.map(linesOf);
  function updateIntro(t, sc) {
    const lt = t - sc.start;
    iKick.style.opacity = P(lt, .15, .6).toFixed(3); iKick.style.transform = `translateX(${(1 - out3(P(lt, .15, .6))) * -30}px)`;
    animWords(iWords, t - sc.chunks[0].start, .09, .6, 40, 12);
    const c1 = sc.chunks[1];
    iA.forEach((a, i) => pop(a, back(P(t, c1.start + i * .25, .6)), 20));
    pop(iJ, P(t, c1.start + 1.6, .7), 14);
    const ce = out4(P(lt, .1, 1.1)); iCard.root.style.opacity = ce.toFixed(3);
    iCard.root.style.transform = `perspective(1800px) translateX(${(1 - ce) * 140}px) rotateY(${(1 - ce) * -12}deg)`;
    const z = io(P(t, sc.chunks[0].start + .2, 1.8));
    iCard.cam('p1', lerp(WHOLE.cx, TITLECAM.cx, z), lerp(WHOLE.cy, TITLECAM.cy, z), lerp(WHOLE.s, TITLECAM.s, z));
    // spotlight + marker for the active narration beat
    const k = t < c1.start ? 0 : 1, ck = sc.chunks[k], L = INTRO_L[k];
    const p = clamp((t - ck.voiceAt + .05) / (ck.voice * .96));
    const sp = L.spans; let si = 0; while (si < sp.length - 1 && p > sp[si].f) si++;
    const tz = P(t, sc.chunks[0].voiceAt - .2, .6);
    iCard.setSpot(sp[si].bbox, tz * (t > c1.start + c1.dur - .3 ? 1 - P(t, c1.start + c1.dur - .3, .3) : 1));
    iCard.setMarks(L, p, 1);
  }

  /* ---- chapter */
  const chEl = el('div', 'scene', null, stage); chEl.id = 'chapter';
  const chRings = [0, 1, 2].map(() => el('div', 'ring', null, chEl));
  const chNum = el('div', 'num', '', chEl); const chBig = el('div', 'big', null, chEl); const chDots = el('div', 'dots', null, chEl);
  const dotEls = PLAN.chapters.map(() => el('i', null, null, chDots));
  let chBuilt = null, chWords = null;
  function updateChapter(t, sc) {
    const lt = t - sc.start, c = PLAN.chapters[chapterIdx[sc.ch]];
    if (chBuilt !== sc.ch) {
      chBuilt = sc.ch; chBig.innerHTML = ''; chWords = makeWords(chBig, c.title);
      chNum.textContent = 'CHAPTER ' + c.n;
    }
    chRings.forEach((r, i) => { const p = out3(P(lt, i * .22, 1.7)), d = 120 + 1500 * p; Object.assign(r.style, { width: d + 'px', height: d + 'px', opacity: ((1 - p) * .8).toFixed(3) }); });
    chNum.style.opacity = P(lt, .15, .5).toFixed(3); chNum.style.transform = `translateY(${(1 - out3(P(lt, .15, .5))) * 20}px)`;
    animWords(chWords, lt - .3, .1, .65, 44, 14);
    const ci = chapterIdx[sc.ch];
    dotEls.forEach((d, i) => { d.className = i <= ci ? 'on' : ''; d.style.width = (i === ci ? 56 : 12) + 'px'; });
    chDots.style.opacity = P(lt, .5, .5).toFixed(3);
  }

  /* ---- explain */
  const exEl = el('div', 'scene', null, stage); exEl.id = 'explain';
  const CARD = { x: 70, y: 70, w: 840, h: 940 };
  const exCard = new Card(exEl, CARD.x, CARD.y, CARD.w, CARD.h, 'HIGHLIGHTED IN THE PAPER');
  const kicker = el('div', 'kicker', '', exEl);
  const panel = el('div', 'panel', null, exEl);
  const voiceEl = el('div', null, null, exEl); voiceEl.id = 'voice';
  const bars = []; for (let i = 0; i < 34; i++) bars.push(el('i', null, null, voiceEl));
  const srcEl = el('div', null, 'Yoo &amp; Serafin · Oral Maxillofac Surg Clin N Am 2006;18:255–260', exEl); srcEl.id = 'src';
  

  const exScenes = TL.scenes.filter(s => s.type === 'explain');
  const exData = new Map(); // scene -> prepared per-chunk data
  exScenes.forEach(sc => {
    const chunks = sc.chunks.map(ck => {
      const d = chunkById[ck.id]; const L = linesOf(d.regions);
      const root = el('div', 'chunk', null, panel);
      const title = el('div', 'title', null, root); const words = makeWords(title, d.title);
      const body = el('div', 'body', d.body, root);
      const visBox = el('div', 'vis', null, root);
      const vis = d.vis.map(v => buildVis(visBox, v));
      return { ck, d, L, root, words, body, vis, cam: camFor(d, CARD.w, CARD.h) };
    });
    exData.set(sc, chunks);
  });
  let kickBuilt = null, ENV = window.ENV || [];

  function updateExplain(t, sc, frame) {
    const chs = exData.get(sc), lt = t - sc.start, c = PLAN.chapters[chapterIdx[sc.ch]];
    exData.forEach((arr, s) => { if (s !== sc) arr.forEach(k => { if (k._on) { show(k.root, false); k._on = false; } }); });
    if (kickBuilt !== sc.ch) { kickBuilt = sc.ch; kicker.innerHTML = `<b>${c.n}</b>${c.label}`; }
    kicker.style.opacity = P(lt, .35, .5).toFixed(3); kicker.style.transform = `translateX(${(1 - out3(P(lt, .35, .5))) * 40}px)`;
    // active chunk
    let i = 0; for (let k = 0; k < chs.length; k++) if (t >= chs[k].ck.start) i = k;
    // card entrance
    const ce = out4(P(lt, 0, .95)), cx = 1 - P(t, sc.end - .45, .45);
    exCard.root.style.opacity = (ce * cx).toFixed(3);
    exCard.root.style.transform = `perspective(1800px) translateX(${((1 - ce) * -150 + (1 - cx) * -40).toFixed(1)}px) rotateY(${((1 - ce) * 12).toFixed(2)}deg)`;
    // camera + spotlight
    const cur = chs[i], prev = chs[i - 1], ckLt = t - cur.ck.start;
    const q = i === 0 ? out4(P(lt, .15, 1.3)) : io(P(ckLt, 0, .95));
    const from = prev ? prev.cam : { cx: cur.cam.cx, cy: cur.cam.cy + 110, s: cur.cam.s * .8 };
    const drift = 1 + .035 * P(ckLt, 0, cur.ck.dur);
    exCard.cam(cur.cam.page, lerp(from.cx, cur.cam.cx, q), lerp(from.cy, cur.cam.cy, q), lerp(from.s, cur.cam.s, q) * drift);
    const p = clamp((t - cur.ck.voiceAt + .05) / (cur.ck.voice * .96));
    const sp = cur.L.spans; let si = 0; while (si < sp.length - 1 && p > sp[si].f) si++;
    let b = sp[si].bbox;
    if (si < sp.length - 1) { const bl = P(p, sp[si].f - .02, .05), nb = sp[si + 1].bbox; b = {}; for (const k of ['x0', 'x1', 'y0', 'y1']) b[k] = lerp(sp[si].bbox[k], nb[k], io(bl)); if (bl > .999) b = nb; }
    if (prev) { const pb = prev.L.spans[prev.L.spans.length - 1].bbox, bq = io(P(ckLt, 0, .7)), cb = sp[0].bbox; if (si === 0 && bq < 1) { b = {}; for (const k of ['x0', 'x1', 'y0', 'y1']) b[k] = lerp(pb[k], cb[k], bq); } }
    else { const cb = sp[0].bbox, mx = (cb.x0 + cb.x1) / 2, my = (cb.y0 + cb.y1) / 2, e = out4(P(lt, .5, .9)); b = { x0: lerp(mx, b.x0, e), x1: lerp(mx, b.x1, e), y0: lerp(my, b.y0, e), y1: lerp(my, b.y1, e) }; }
    exCard.setSpot(b, 1);
    exCard.setMarks(cur.L, p, 1 - P(t, cur.ck.start + cur.ck.dur - .25, .25) * (i < chs.length - 1 ? 1 : 0));
    // panel chunks
    chs.forEach((c, k) => {
      const l = t - c.ck.start, on = l >= -.02 && l <= c.ck.dur + .02;
      show(c.root, on); c._on = on; if (!on) return;
      const last = k === chs.length - 1, ex = last ? 0 : P(l, c.ck.dur - .32, .32);
      c.root.style.opacity = (1 - ex).toFixed(3); c.root.style.transform = `translateY(${(-ex * 26).toFixed(1)}px)`;
      animWords(c.words, l, .075, .55, 34, 10);
      pop(c.body, out3(P(l, .42, .55)), 18);
      c.vis.forEach(v => v.update(l, c.ck));
    });
    // voice bars
    const e = ENV[frame] || 0;
    bars.forEach((bar, k) => { const h = 8 + 44 * e * (.35 + .65 * Math.abs(Math.sin(k * 1.7 + t * 9.5 + Math.sin(k * .8 + t * 3) * 2))); bar.style.height = h.toFixed(1) + 'px'; bar.style.opacity = (.4 + .6 * clamp(e * 2.2)).toFixed(2); });
    voiceEl.style.opacity = P(lt, .8, .5).toFixed(3); srcEl.style.opacity = P(lt, .8, .5).toFixed(3);
  }

  /* ---- outro */
  const ouEl = el('div', 'scene', null, stage); ouEl.id = 'outro';
  const ouH = el('div', 'h', null, ouEl); const ouWords = makeWords(ouH, 'Key <em>takeaways</em>');
  const grid = el('div', 'grid', null, ouEl);
  const TAKE = ['Assess diabetes control and its complications', 'Screen the heart, kidneys and autonomic function', 'Hold oral agents according to their class', 'Monitor glucose closely; be ready to convert to insulin'];
  const tks = TAKE.map((t, i) => el('div', 'tk', `<s>${i + 1}</s><span>${t}</span>`, grid));
  const ouEnd = el('div', 'end', '<div class="t">Perioperative Management of the <em>Diabetic Patient</em></div><div class="c">Hyon K. Yoo, DDS · Bethany L. Serafin, DMD<br>Oral Maxillofac Surg Clin N Am 2006;18:255–260 · doi:10.1016/j.coms.2005.12.003</div><div class="d">Episode 01 · For education only</div>', ouEl);
  function updateOutro(t, sc) {
    const lt = t - sc.start, c0 = sc.chunks[0], c1 = sc.chunks[1];
    animWords(ouWords, lt - .2, .1, .6, 36, 12);
    tks.forEach((k, i) => pop(k, back(P(t, c0.voiceAt + .2 + i * c0.voice * .22, .6)), 26));
    const e = P(t, c1.start, .8);
    ouEnd.style.opacity = out3(e).toFixed(3); ouEnd.style.transform = `translateY(${(1 - out3(e)) * 30}px)`;
    const g = 1 - P(t, c1.start - .1, .6); grid.style.opacity = (.35 + .65 * g).toFixed(3);
  }

  /* ---------------------------------------------------------------- frame */
  const prog = $('prog');
  const chapterScenes = TL.scenes.filter(s => s.type === 'chapter');
  window.render = function (t) {
    const frame = Math.round(t * FPS);
    let mode = 0; chapterScenes.forEach(s => { mode = Math.max(mode, P(t, s.start - .12, .45) * (1 - P(t, s.end - .38, .45))); });
    updateBg(t, mode);
    TL.scenes.forEach(sc => {
      const e = sc.type === 'intro' ? introEl : sc.type === 'chapter' ? chEl : sc.type === 'explain' ? exEl : ouEl;
      const on = t >= sc.start - .01 && t < sc.end + .01;
      if (!on) { if (sc._on) { show(e, false); sc._on = false; } return; }
      sc._on = true; show(e, true);
      e.style.opacity = (sc.type === 'outro' ? P(t, sc.start, .5) : sceneFade(t, sc)).toFixed(3);
      if (sc.type === 'intro') updateIntro(t, sc);
      else if (sc.type === 'chapter') updateChapter(t, sc);
      else if (sc.type === 'explain') updateExplain(t, sc, frame);
      else updateOutro(t, sc);
    });
    prog.style.width = (t / TL.duration * 100).toFixed(3) + '%';
    const end = P(t, TL.duration - .6, .6); stage.style.opacity = (1 - end).toFixed(3);
  };
  window.TLDUR = TL.duration;
  window.ready = true;
})();
