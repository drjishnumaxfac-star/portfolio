/* Vertical (9:16) reel renderer: window.render(t) */
(function () {
  const FPS = TL.fps;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const P = (t, a, d) => clamp((t - a) / d);
  const lerp = (a, b, t) => a + (b - a) * t;
  const out3 = t => 1 - Math.pow(1 - t, 3), out4 = t => 1 - Math.pow(1 - t, 4);
  const io = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const back = t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const el = (tag, cls, html, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
  const show = (e, on) => { const d = on ? 'block' : 'none'; if (e.style.display !== d) e.style.display = d; };
  const stage = document.getElementById('stage');
  const pop = (e, p, rise = 18) => { e.style.opacity = clamp(p * 1.6).toFixed(3); e.style.transform = `translateY(${((1 - p) * rise).toFixed(1)}px) scale(${(.88 + .12 * p).toFixed(3)})`; };

  /* ---------- background sparkles */
  const SP = '<svg viewBox="0 0 40 40"><path fill="#e2b6ff" d="M20 0C22 12 28 18 40 20C28 22 22 28 20 40C18 28 12 22 0 20C12 18 18 12 20 0Z"/></svg>';
  const sparks = [[110, 330], [980, 250], [960, 1000], [90, 1720], [880, 1790], [540, 120]].map((p, i) => { const e = el('div', 'spark', SP, stage); e.style.left = p[0] + 'px'; e.style.top = p[1] + 'px'; e.dataset.i = i; return e; });
  const blobs = document.querySelectorAll('.blob'), arcs = document.getElementById('arcs');
  function bg(t) {
    blobs[0].style.transform = `translate(${Math.sin(t * .3) * 60}px,${Math.cos(t * .25) * 50}px)`;
    blobs[1].style.transform = `translate(${Math.cos(t * .22) * 70}px,${Math.sin(t * .27) * 60}px)`;
    blobs[2].style.transform = `translate(${Math.sin(t * .35) * 50}px,${Math.cos(t * .3) * 60}px)`;
    arcs.style.transform = `rotate(${t * 1.2}deg)`;
    sparks.forEach(s => { const i = +s.dataset.i, a = .5 + .5 * Math.sin(t * 1.6 + i * 1.9); s.style.opacity = (.25 + .6 * a).toFixed(2); s.style.transform = `scale(${.5 + .6 * a}) rotate(${t * 20 + i * 40}deg)`; });
  }

  /* ---------- words */
  function makeWords(parent, html) {
    const spans = []; let em = false;
    html.split(/(<\/?em>)/).forEach(seg => {
      if (seg === '<em>') em = true; else if (seg === '</em>') em = false;
      else seg.split(/\s+/).filter(Boolean).forEach(w => { const s = el('span', 'word', w + ' ', parent); if (em) { s.style.background = 'var(--grad)'; s.style.webkitBackgroundClip = 'text'; s.style.backgroundClip = 'text'; s.style.webkitTextFillColor = 'transparent'; } spans.push(s); });
    });
    return spans;
  }
  function animWords(sp, lt, step = .09) { sp.forEach((s, i) => { const p = P(lt, i * step, .5), e = out3(p); s.style.opacity = p.toFixed(3); s.style.transform = `translateY(${((1 - e) * 40).toFixed(1)}px)`; s.style.filter = p < 1 ? `blur(${((1 - e) * 12).toFixed(1)}px)` : 'none'; }); }

  /* ---------- paper card */
  const PAGE_H = 1535, PITCH = { p1: 27.65, p2: 26.6 };
  const COLS = { p1L: [95, 578], p1R: [638, 1122], p2L: [105, 570], p2R: [628, 1092] };
  function linesOf(regions) {
    const lines = [], spans = [];
    regions.forEach(r => {
      const [cl, cr] = COLS[r.page + r.col]; const n = Math.max(1, Math.round((r.y1 - r.y0) / PITCH[r.page])), h = (r.y1 - r.y0) / n; const st = lines.length; let len = 0;
      for (let i = 0; i < n; i++) { const x0 = (i === 0 && r.s != null) ? r.s : cl, x1 = (i === n - 1 && r.e != null) ? r.e : cr; const l = { x0: Math.min(x0, x1 - 20), x1, y: r.y0 + i * h, h }; lines.push(l); len += l.x1 - l.x0; }
      const ls = lines.slice(st); spans.push({ len, bbox: { x0: Math.min(...ls.map(l => l.x0)), x1: Math.max(...ls.map(l => l.x1)), y0: r.y0, y1: r.y1 } });
    });
    const total = spans.reduce((a, s) => a + s.len, 0); let c = 0; spans.forEach(s => { c += s.len; s.f = c / total; });
    return { lines, spans, total };
  }
  const CARD = { x: 50, y: 210, w: 980, h: 800 };
  function camFor(regs) {
    const r0 = regs[0], [cl, cr] = COLS[r0.page + r0.col];
    const y0 = Math.min(...regs.map(r => r.y0)), y1 = Math.max(...regs.map(r => r.y1));
    const s = Math.min(CARD.w * .9 / (cr - cl + 20), CARD.h * .72 / (y1 - y0 + 50), 1.75);
    return { page: r0.page, cx: (cl + cr) / 2, cy: clamp((y0 + y1) / 2, CARD.h / 2 / s, PAGE_H - CARD.h / 2 / s), s };
  }
  const card = el('div', 'card', null, stage); Object.assign(card.style, { left: CARD.x + 'px', top: CARD.y + 'px', width: CARD.w + 'px', height: CARD.h + 'px', display: 'none' });
  const pg = el('div', 'pg', null, card); const imgs = {};
  ['p1', 'p2'].forEach(k => { const im = el('img', null, null, pg); im.src = `assets/${k}.jpg`; im.style.display = 'none'; imgs[k] = im; });
  const spot = el('div', 'spot', null, pg); const mks = []; for (let i = 0; i < 10; i++) mks.push(el('div', 'mk', null, pg)); const cur = el('div', 'cur', null, pg);
  let curPage = null;
  function setCam(page, cx, cy, s) { if (page !== curPage) { Object.keys(imgs).forEach(k => imgs[k].style.display = k === page ? 'block' : 'none'); curPage = page; } pg.style.transform = `translate(${(CARD.w / 2 - cx * s).toFixed(2)}px,${(CARD.h / 2 - cy * s).toFixed(2)}px) scale(${s.toFixed(4)})`; }
  function setSpot(b) { const pd = 9; Object.assign(spot.style, { left: (b.x0 - pd) + 'px', top: (b.y0 - pd + 2) + 'px', width: (b.x1 - b.x0 + 2 * pd) + 'px', height: (b.y1 - b.y0 + 2 * pd - 4) + 'px' }); }
  function setMarks(L, p, fade) {
    let target = p * L.total, cum = 0, last = -1, lx = 0;
    mks.forEach((m, i) => { const l = L.lines[i]; if (!l) { show(m, false); return; } const len = l.x1 - l.x0, cov = clamp((target - cum) / len); cum += len; if (cov <= 0) { show(m, false); return; } show(m, true); Object.assign(m.style, { left: l.x0 + 'px', top: (l.y + l.h * .07) + 'px', width: len + 'px', height: (l.h * .86) + 'px', transform: `scaleX(${cov.toFixed(4)})`, opacity: (.8 * fade).toFixed(3) }); last = i; lx = l.x0 + len * cov; });
    if (last >= 0 && p < .995 && p > 0) { const l = L.lines[last]; show(cur, true); Object.assign(cur.style, { left: (lx - 2) + 'px', top: (l.y + l.h * .02) + 'px', height: (l.h * .96) + 'px' }); } else show(cur, false);
  }

  /* ---------- visuals (compact, vertical) */
  const ARROW = '<svg viewBox="0 0 30 28" width="30" height="28"><path d="M15 1V19M5 11L15 22L25 11" stroke="#ff8ccb" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const BASE = .35, stag = (n, d, mx = .5) => clamp(d * .55 / Math.max(n, 1), .15, mx);
  function buildVis(parent, v) {
    const box = el('div', null, null, parent); box.style.marginBottom = '14px';
    if (v.t === 'chips') { box.className = 'chips'; const cs = v.items.map(t => el('div', 'chip2' + (v.tone === 'bad' ? ' bad' : ''), t, box)); return { update(lt, d) { const st = stag(cs.length, d); cs.forEach((c, i) => pop(c, back(P(lt, BASE + i * st, .45)), 14)); } }; }
    if (v.t === 'stats') { box.className = 'stats'; const ss = v.items.map(it => { const s = el('div', 'stat', null, box); const b = el('div', 'big', it.big || '0', s); el('div', 'l', it.l, s); s._b = b; s._it = it; return s; }); return { update(lt, d) { ss.forEach((s, i) => { const t0 = BASE + i * .2; pop(s, back(P(lt, t0, .5)), 22); if (s._it.num != null) s._b.textContent = Math.round(s._it.num * out3(P(lt, t0 + .1, 1.1))) + (s._it.suf || ''); }); } }; }
    if (v.t === 'cols') { box.className = 'cols'; const cs = v.items.map(it => { const c = el('div', 'colc', null, box); el('div', 'h', it.h, c); el('div', 'b', it.b, c); return c; }); return { update(lt, d) { const st = stag(cs.length, d, .9); cs.forEach((c, i) => pop(c, back(P(lt, BASE + i * Math.max(st, .5), .5)), 20)); } }; }
    if (v.t === 'flow') { box.className = 'flow'; const ns = [], ar = []; v.items.forEach((t, i) => { ns.push(el('div', 'node', t, box)); if (i < v.items.length - 1) ar.push(el('div', 'arrow', ARROW, box)); }); return { update(lt, d) { const st = stag(ns.length, d, .6); ns.forEach((n, i) => { pop(n, back(P(lt, BASE + i * st, .45)), 16); if (ar[i]) pop(ar[i], P(lt, BASE + i * st + st * .5, .3), 8); }); } }; }
    if (v.t === 'steps') {
      box.className = 'steps'; const ss = v.items.map((it, i) => { const s = el('div', 'step', null, box); el('div', 'badge ' + it.tone, it.when, s); el('div', 'w', it.what, s); s._rev = it.rev; return s; });
      return { update(lt, d) { ss.forEach(s => { if (s._rev < v.upto) { s.style.opacity = (.55 * P(lt, .05, .25)).toFixed(3); s.style.transform = 'none'; } else if (s._rev === v.upto) pop(s, back(P(lt, BASE, .5)), 24); else { s.style.opacity = (.14 * P(lt, .05, .25)).toFixed(3); s.style.transform = 'none'; } }); } };
    }
    if (v.t === 'scale') {
      box.className = 'scale'; const W = 880, X = x => x / v.max * W;
      el('div', 'track', null, box); [0, v.max].forEach(x => { const t = el('div', 'tick', String(x), box); t.style.left = X(x) + 'px'; });
      const mk = el('div', 'mark', null, box); mk.style.left = (X(v.mark) - 2) + 'px'; const ml = el('div', 'mlab', v.note, box); ml.style.left = X(v.mark) + 'px';
      const ind = el('div', 'ind', null, box), val = el('div', 'val', '', box);
      return { update(lt, d) { pop(mk, P(lt, .2, .4), 0); mk.style.transform = 'none'; pop(ml, P(lt, .3, .4), 10); const q = out3(P(lt, BASE, 1.3)), value = v.fill * q, x = X(value); ind.style.left = x + 'px'; val.style.left = clamp(x, 120, 760) + 'px'; const bad = v.tone === 'ok' ? value > v.mark : value >= v.mark; val.style.color = bad ? '#ff5a7a' : '#3be8a8'; val.textContent = Math.round(value) + ' ' + v.unit; ind.style.opacity = val.style.opacity = clamp(q * 4).toFixed(2); } };
    }
    return { update() {} };
  }
  const visBox = el('div', null, null, stage); visBox.id = 'vis'; visBox.style.display = 'none';
  const capBox = el('div', null, null, stage); capBox.id = 'cap'; const capIn = el('div', null, '', capBox); capBox.style.display = 'none';
  const src = el('div', null, 'Source: Yoo &amp; Serafin · Oral Maxillofac Surg Clin N Am 2006;18:255–260', stage); src.id = 'src'; src.style.display = 'none';
  const hdr = el('div', 'hdr', '<b>EP 01</b>DIABETES &amp; SURGERY', stage); hdr.style.display = 'none';

  const S = Object.fromEntries(TL.scenes.map(s => [s.type, s]));
  const beatData = S.beats.chunks.map((ck, i) => {
    const d = PLAN.beats[i], L = linesOf(d.regions), root = el('div', null, null, visBox); root.style.cssText = 'position:absolute;inset:0;display:none';
    return { ck, d, L, root, vis: d.vis.map(v => buildVis(root, v)), cam: camFor(d.regions) };
  });

  /* ---------- hook */
  const hookEl = el('div', 'scene', null, stage); hookEl.id = 'hook'; const hookT = el('div', 't', null, hookEl);
  const hookW = makeWords(hookT, 'A diabetic patient is coming for <em>surgery.</em> What do you <em>check?</em>');
  const hookT0 = S.hook.chunks[0];
  function updHook(t) { const lt = t - hookT0.start; animWords(hookW, lt, .2); hookT.style.transform = `scale(${1 + .03 * P(lt, 0, 4)})`; }

  /* ---------- outro */
  const ouEl = el('div', 'scene', null, stage); ouEl.id = 'outro';
  const ouH = el('div', 'h', null, ouEl); const ouW = makeWords(ouH, 'Diabetes &amp; surgery: <em>the checklist</em>');
  const grid = el('div', 'grid', null, ouEl); const tks = PLAN.take.map((t, i) => el('div', 'tk', `<s>${i + 1}</s><span>${t}</span>`, grid));
  const cta = el('div', 'cta', '<span>SAVE · SHARE</span>', ouEl);
  el('div', 'ref', 'Yoo HK, Serafin BL. Perioperative management of the diabetic patient.<br>Oral Maxillofac Surg Clin N Am 2006;18:255–260 · For education only', ouEl);

  /* ---------- frame */
  const prog = document.getElementById('prog');
  window.render = function (t) {
    bg(t);
    const hk = t < S.hook.end, bt = t >= S.beats.start && t < S.beats.end, ou = t >= S.outro.start;
    show(hookEl, hk); show(ouEl, ou);
    const fadeIn = P(t, 0, .01);
    if (hk) { hookEl.style.opacity = (1 - P(t, S.hook.end - .3, .3)).toFixed(3); updHook(t); }
    [card, visBox, capBox, src, hdr].forEach(e => show(e, bt));
    if (bt) {
      const sc = S.beats, lt = t - sc.start; let i = 0; beatData.forEach((b, k) => { if (t >= b.ck.start) i = k; });
      const cu = beatData[i], pr = beatData[i - 1], cl = t - cu.ck.start;
      const ce = out4(P(lt, 0, .8)), ex = P(t, sc.end - .3, .3);
      card.style.opacity = (ce * (1 - ex)).toFixed(3); card.style.transform = `translateY(${(1 - ce) * 120}px) scale(${.94 + .06 * ce})`;
      hdr.style.opacity = capBox.style.opacity = src.style.opacity = visBox.style.opacity = (P(lt, .3, .4) * (1 - ex)).toFixed(3);
      const q = i === 0 ? out4(P(lt, .2, 1.0)) : io(P(cl, 0, .75));
      const from = pr ? pr.cam : { cx: cu.cam.cx, cy: cu.cam.cy + 110, s: cu.cam.s * .85 };
      const dr = 1 + .03 * P(cl, 0, cu.ck.dur);
      setCam(cu.cam.page, lerp(from.cx, cu.cam.cx, q), lerp(from.cy, cu.cam.cy, q), lerp(from.s, cu.cam.s, q) * dr);
      const p = clamp((t - cu.ck.voiceAt + .05) / (cu.ck.voice * .95)), sp = cu.L.spans; let si = 0; while (si < sp.length - 1 && p > sp[si].f) si++;
      let b = sp[si].bbox;
      if (si < sp.length - 1) { const bl = io(P(p, sp[si].f - .02, .05)), nb = sp[si + 1].bbox; b = {}; ['x0', 'x1', 'y0', 'y1'].forEach(k => b[k] = lerp(sp[si].bbox[k], nb[k], bl)); }
      if (pr && si === 0) { const pb = pr.L.spans[pr.L.spans.length - 1].bbox, bq = io(P(cl, 0, .6)), cb = sp[0].bbox; b = {}; ['x0', 'x1', 'y0', 'y1'].forEach(k => b[k] = lerp(pb[k], cb[k], bq)); }
      if (!pr) { const cb = sp[0].bbox, mx = (cb.x0 + cb.x1) / 2, my = (cb.y0 + cb.y1) / 2, e = out4(P(lt, .5, .8)); b = { x0: lerp(mx, b.x0, e), x1: lerp(mx, b.x1, e), y0: lerp(my, b.y0, e), y1: lerp(my, b.y1, e) }; }
      setSpot(b); setMarks(cu.L, p, 1);
      // captions: phrase currently spoken
      let ph = null; cu.ck.phr.forEach(x => { if (t >= x.at - .05) ph = x; });
      if (ph && t < cu.ck.voiceAt + cu.ck.voice + .3) { capIn.textContent = ph.t; const pp = back(P(t, ph.at - .05, .22)); capIn.style.opacity = clamp(pp * 2).toFixed(2); capIn.style.transform = `scale(${(.8 + .2 * pp).toFixed(3)}) rotate(${((1 - pp) * -2).toFixed(2)}deg)`; capIn.style.display = 'inline-block'; } else capIn.style.display = 'none';
      beatData.forEach((b2, k) => { const on = k === i && t < sc.end; show(b2.root, on); if (on) b2.vis.forEach(v => v.update(cl, cu.ck.dur)); });
    }
    if (ou) {
      const o = S.outro.chunks[0], lt = t - S.outro.start; ouEl.style.opacity = P(t, S.outro.start, .4).toFixed(3);
      animWords(ouW, lt - .3, .12);
      tks.forEach((k, i) => pop(k, back(P(t, o.voiceAt + .15 + i * o.voice * .2, .5)), 30));
      pop(cta, back(P(t, o.voiceAt + o.voice * .8, .5)), 30);
    }
    prog.style.width = (t / TL.duration * 100).toFixed(3) + '%';
    stage.style.opacity = (1 - P(t, TL.duration - .5, .5)).toFixed(3);
  };
  window.ready = true;
})();
