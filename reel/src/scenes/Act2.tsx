import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {BOUNCE, GLIDE, POP, clamp01, ease, exitOut, rand, shake, sp, squash} from '../anim';
import {Burst, Check, Kicker, Logo, Pill, Sparkle, Star, Words} from '../components';
import {C, FONT} from '../theme';
import {beatPulse} from '../timing';

/** Camera over a still: keyframed focal point + zoom, clamped so the image always covers the frame. */
const Camera: React.FC<{
  src: string;
  imgW: number;
  imgH: number;
  boxW: number;
  boxH: number;
  keys: {f: number; x: number; y: number; z: number}[];
}> = ({src, imgW, imgH, boxW, boxH, keys}) => {
  const f = useCurrentFrame();
  const frames = keys.map((k) => k.f);
  const opt = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: (t: number) => t * t * (3 - 2 * t)};
  const fx = interpolate(f, frames, keys.map((k) => k.x), opt);
  const fy = interpolate(f, frames, keys.map((k) => k.y), opt);
  const z = interpolate(f, frames, keys.map((k) => k.z), opt);
  const base = boxH / imgH; // fit height
  const scale = base * z;
  const w = imgW * scale;
  const h = imgH * scale;
  const left = Math.min(0, Math.max(boxW - w, boxW / 2 - fx * scale));
  const top = Math.min(0, Math.max(boxH - h, boxH / 2 - fy * scale));
  return <Img src={src} style={{position: 'absolute', left, top, width: w, height: h}} />;
};

const Frame: React.FC<{x: number; y: number; w: number; h: number; enter: number; children: React.ReactNode}> = ({x, y, w, h, enter, children}) => {
  const f = useCurrentFrame();
  const p = sp(f, enter, GLIDE);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 40,
        overflow: 'hidden',
        border: `3px solid ${C.amber}55`,
        boxShadow: `0 40px 120px rgba(0,0,0,0.7), 0 0 80px ${C.amber}22`,
        transform: `perspective(1600px) translateY(${(1 - p) * 500}px) rotateX(${(1 - p) * 30}deg) scale(${0.8 + p * 0.2})`,
        opacity: clamp01(p * 2),
      }}
    >
      {children}
    </div>
  );
};

/* ================================================================== */
/* 6. MEMORY PALACE (27.12 – 33.12 s)                                   */
/* ================================================================== */
const STOPS = [
  {f: 0, label: 'You, at the foot of the syllabus'},
  {f: 34, label: 'Basic Sciences castle'},
  {f: 62, label: 'Preclinical · Oral Medicine'},
  {f: 90, label: 'Conservative & Endo · Prostho'},
  {f: 124, label: 'Summit: INBDE · INI CET · NEET MDS'},
];

export const Palace: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const out = exitOut(f, duration, 6);
  const stop = [...STOPS].reverse().find((s) => f >= s.f) ?? STOPS[0];
  const chip = sp(f, stop.f, BOUNCE);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 230, width: '100%', padding: '0 50px'}}>
        <Words words={['Every', 'subject', 'becomes', '\n', {t: 'a place', em: true}, {t: 'you can see.', em: true}]} size={74} stagger={3} />
      </div>
      <Frame x={60} y={470} w={960} h={1000} enter={4}>
        <Camera
          src={staticFile('img/castle-wide.jpg')}
          imgW={2560}
          imgH={1116}
          boxW={960}
          boxH={1000}
          keys={[
            {f: 0, x: 860, y: 900, z: 1.7},
            {f: 34, x: 830, y: 480, z: 1.55},
            {f: 62, x: 1300, y: 560, z: 1.45},
            {f: 90, x: 1900, y: 520, z: 1.4},
            {f: 124, x: 1760, y: 160, z: 1.6},
            {f: 175, x: 1760, y: 200, z: 1.15},
          ]}
        />
        <div
          style={{
            position: 'absolute',
            left: 28,
            top: 28,
            transform: `scale(${chip})`,
            transformOrigin: '0 50%',
          }}
        >
          <Pill style={{fontSize: 30, padding: '14px 24px', background: 'rgba(13,12,11,0.82)'}}>
            <svg width={26} height={32} viewBox="0 0 26 32">
              <path d="M13 0C6 0 0 5.6 0 12.6 0 22 13 32 13 32s13-10 13-19.4C26 5.6 20 0 13 0z" fill={C.amber} />
              <circle cx={13} cy={12.5} r={5} fill={C.ink} />
            </svg>
            {stop.label}
          </Pill>
        </div>
      </Frame>
      <div style={{position: 'absolute', top: 1500, width: '100%', opacity: ease(f, 40, 56)}}>
        <Kicker text="the memory palace · method of loci" delay={40} />
      </div>
      <Sparkle x={980} y={480} delay={130} size={56} />
      <Sparkle x={110} y={1440} delay={20} size={40} color={C.cream} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 7. ONE SCENE (33.12 – 39.08 s): Ramu's Kada carries everything.       */
/* ================================================================== */
const LAYERS = [
  {t: 'Classification', at: 17},
  {t: 'Mechanism', at: 34},
  {t: 'Clinical features', at: 45},
  {t: 'Investigations', at: 62},
  {t: 'Management', at: 89},
  {t: 'Exam-favourite exceptions', at: 107},
];

export const OneScene: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const out = exitOut(f, duration, 6);
  const sign = squash(f, 8, BOUNCE, 4);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 220, width: '100%'}}>
        <Words words={['One', 'topic.', {t: 'One scene.', em: true}]} size={84} />
      </div>
      <Frame x={60} y={470} w={960} h={600} enter={0}>
        <Camera
          src={staticFile('img/ramu-wide.jpg')}
          imgW={2560}
          imgH={784}
          boxW={960}
          boxH={600}
          keys={[
            {f: 0, x: 420, y: 380, z: 1.25},
            {f: 60, x: 1150, y: 400, z: 1.15},
            {f: 120, x: 1900, y: 380, z: 1.2},
            {f: 178, x: 2150, y: 300, z: 1.35},
          ]}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: '60px 30px 22px',
            background: 'linear-gradient(transparent, rgba(13,12,11,0.85))',
            fontFamily: FONT.mono,
            fontSize: 24,
            letterSpacing: '0.2em',
            color: C.amber,
          }}
        >
          RAMUS OSTEOTOMIES → RAMU'S KADA
        </div>
      </Frame>
      {/* shop sign drops in with squash & stretch */}
      <Img
        src={staticFile('img/ramu-sign.jpg')}
        style={{
          position: 'absolute',
          left: 540 - 300,
          top: 400 + (1 - sign.p) * -500,
          width: 600,
          borderRadius: 18,
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          transform: `scale(${sign.sx}, ${sign.sy}) rotate(${-2 + Math.sin(f / 10) * 1.5}deg)`,
          transformOrigin: '50% 0%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 1110,
          left: 60,
          right: 60,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          rowGap: 22,
          columnGap: 20,
        }}
      >
        {LAYERS.map((l, i) => {
          const p = sp(f, l.at, POP);
          const tick = ease(f, l.at + 2, l.at + 12);
          return (
            <div
              key={l.t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
                borderRadius: 20,
                background: 'rgba(29,26,23,0.9)',
                border: `2px solid ${tick > 0.5 ? C.amber : C.line}`,
                transform: `translateY(${(1 - p) * 60}px) scale(${0.9 + p * 0.1})`,
                opacity: clamp01(p * 2),
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: l.t.length > 18 ? 27 : 32,
                color: C.cream,
                gridColumn: i === 5 ? '1 / span 2' : undefined,
                justifyContent: i === 5 ? 'center' : undefined,
              }}
            >
              <Check size={42} progress={tick} />
              {l.t}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 1470, width: '100%', textAlign: 'center'}}>
        {f >= 122 ? (
          <Words
            words={['Locked', 'by', {t: 'place,', em: true}, {t: 'colour', em: true}, '&', {t: 'absurdity.', em: true}]}
            delay={122}
            size={46}
            weight={600}
            stagger={2}
          />
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 8. ONE PLATFORM (39.08 – 45.13 s): five products collapse into one.  */
/* ================================================================== */
const FIVE = ['NEET MDS coaching', 'INBDE question bank', 'INI-CET test series', "A senior's handwritten notes", 'Flashcard app (quit in week 3)'];
const FEATURES = ['Illustrated topic scenes', 'Question banks', 'Timed mock tests', 'Spaced-repetition revision', 'Analytics: which sketch is fading'];

export const Platform: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const out = exitOut(f, duration, 6);
  const merge = 63;
  const m = ease(f, merge - 10, merge, 0, 1, (x) => x * x);
  const app = squash(f, merge, BOUNCE, 3);
  const sh = shake(f, merge, 18);
  const pulse = beatPulse(f + Math.round(39.08 * 30));
  return (
    <AbsoluteFill style={{opacity: out, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <div style={{position: 'absolute', top: 230, width: '100%', opacity: 1 - ease(f, merge - 6, merge)}}>
        <Words words={['Stop', 'paying', 'for', {t: 'five', em: true, color: C.terracotta}, 'apps.']} size={84} emColor={C.terracotta} />
      </div>
      {f >= merge - 2 ? (
        <div style={{position: 'absolute', top: 230, width: '100%'}}>
          <Words words={['One', {t: 'platform.', em: true}]} delay={merge} size={96} />
        </div>
      ) : null}
      {/* the five, fanned like a hand of cards */}
      {FIVE.map((t, i) => {
        const p = sp(f, 4 + i * 6, POP);
        const a = (i - 2) * 9;
        const y0 = 820 + Math.abs(i - 2) * 26;
        const x = interpolate(m, [0, 1], [(i - 2) * 150, 0]);
        const y = interpolate(m, [0, 1], [y0, 860]);
        const rot = interpolate(m, [0, 1], [a, a * 3]);
        const sc = interpolate(m, [0, 1], [1, 0.2]);
        return (
          <div
            key={t}
            style={{
              position: 'absolute',
              left: 540 - 200 + x,
              top: y - 150 + (1 - p) * 600,
              width: 400,
              height: 300,
              borderRadius: 30,
              padding: 30,
              background: i % 2 ? '#2a2420' : '#241f1b',
              border: `2px solid ${C.terracotta}66`,
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
              transform: `rotate(${rot}deg) scale(${sc})`,
              transformOrigin: '50% 120%',
              opacity: f < merge + 2 ? clamp01(p * 2) : 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{fontFamily: FONT.mono, fontSize: 22, color: C.terracotta, letterSpacing: '0.2em'}}>0{i + 1} / 05</div>
            <div style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 38, color: C.cream, lineHeight: 1.1}}>{t}</div>
            <div style={{height: 6, width: '60%', borderRadius: 3, background: C.terracotta, opacity: 0.6}} />
          </div>
        );
      })}
      {f >= merge - 2 ? <Burst x={540} y={760} delay={merge} radius={420} count={12} /> : null}
      {f >= merge ? (
        <div
          style={{
            position: 'absolute',
            left: 540 - 380,
            top: 480,
            width: 760,
            height: 470,
            borderRadius: 48,
            background: `linear-gradient(160deg, #221d18, ${C.ink})`,
            border: `3px solid ${C.amber}`,
            boxShadow: `0 0 ${80 + pulse * 80}px ${C.amber}55, 0 40px 120px rgba(0,0,0,0.7)`,
            transform: `scale(${app.p * app.sx}, ${app.p * app.sy})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
          }}
        >
          <Logo delay={merge + 2} width={600} stagger={2} />
          <div style={{fontFamily: FONT.sans, fontWeight: 700, fontSize: 38, color: C.cream, opacity: ease(f, merge + 30, merge + 40)}}>
            First year <span style={{color: C.amber}}>→</span> Rank 1
          </div>
        </div>
      ) : null}
      <div style={{position: 'absolute', top: 1010, left: 80, right: 80, display: 'flex', flexDirection: 'column', gap: 18}}>
        {FEATURES.map((t, i) => {
          const at = 88 + i * 9;
          const p = sp(f, at, POP);
          return (
            <div
              key={t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                fontFamily: FONT.sans,
                fontWeight: 700,
                fontSize: 40,
                color: C.cream,
                transform: `translateX(${(1 - p) * 220}px)`,
                opacity: clamp01(p * 2),
              }}
            >
              <Star size={34} color={i === 4 ? C.terracotta : C.amber} style={{transform: `rotate(${(f - at) * 3}deg)`}} />
              {t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 9. WEBSITE (45.13 – 51.12 s): sketchroot.com early-access mock.      */
/* ================================================================== */
const EXAMS = ['NEET MDS', 'INI CET', 'INBDE', 'AIIMS', 'University exams'];

export const Website: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const out = exitOut(f, duration, 6);
  const phone = sp(f, 0, GLIDE);
  const url = 'sketchroot.com';
  const urlN = Math.floor(ease(f, 14, 32) * url.length);
  const email = 'yourname@gmail.com';
  const emN = Math.floor(ease(f, 62, 96, 0, 1, (x) => x) * email.length);
  const tapAt = 107;
  const done = f >= tapAt + 2;
  const btn = squash(f, tapAt + 2, BOUNCE, 3);
  // fingertip path: rest -> email field -> button (arcs, slow-in/out)
  const fx = interpolate(f, [30, 56, 98, 106], [880, 540, 540, 540], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t * t * (3 - 2 * t)});
  const fy = interpolate(f, [30, 56, 98, 106], [1640, 1350, 1350, 1445], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t * t * (3 - 2 * t)});
  const press = (t: number) => (Math.abs(f - t) < 4 ? 0.82 + 0.18 * (Math.abs(f - t) / 4) : 1);
  const tapScale = Math.min(press(58), press(tapAt));
  const floatY = Math.sin(f / 14) * 8;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 200, width: '100%'}}>
        <Words words={['Step 3:', 'join', 'with', 'your', {t: 'Gmail.', em: true}]} size={70} />
      </div>
      <div style={{position: 'absolute', top: 330, left: 40, right: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12}}>
        {EXAMS.map((e, i) => {
          const p = sp(f, 10 + i * 4, POP);
          return (
            <div
              key={e}
              style={{
                padding: '10px 22px',
                borderRadius: 999,
                border: `2px solid ${C.amber}88`,
                fontFamily: FONT.mono,
                fontSize: 24,
                color: C.amber,
                letterSpacing: '0.08em',
                transform: `scale(${p})`,
                opacity: clamp01(p * 2),
              }}
            >
              {e}
            </div>
          );
        })}
      </div>
      {/* phone */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 300,
          top: 470 + floatY,
          width: 600,
          height: 1080,
          borderRadius: 70,
          background: '#050505',
          border: '10px solid #2b2724',
          boxShadow: `0 60px 140px rgba(0,0,0,0.8), 0 0 100px ${C.amber}25`,
          transform: `perspective(1800px) translateY(${(1 - phone) * 900}px) rotateY(${(1 - phone) * 35 - 4 + Math.sin(f / 30) * 2}deg) rotateX(${(1 - phone) * 15 + 4}deg)`,
          overflow: 'hidden',
        }}
      >
        <div style={{position: 'absolute', inset: 0, background: C.ink, padding: '64px 34px 30px'}}>
          {/* notch */}
          <div style={{position: 'absolute', top: 18, left: 210, width: 160, height: 34, borderRadius: 20, background: '#000'}} />
          {/* url bar */}
          <div
            style={{
              height: 52,
              borderRadius: 26,
              background: '#1e1b18',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              fontFamily: FONT.sans,
              fontSize: 24,
              color: C.cream,
            }}
          >
            <svg width={16} height={20} viewBox="0 0 16 20">
              <rect x={1} y={8} width={14} height={11} rx={2} fill={C.dim} />
              <path d="M4 8V5a4 4 0 0 1 8 0v3" stroke={C.dim} strokeWidth={2} fill="none" />
            </svg>
            {url.slice(0, urlN)}
            <span style={{opacity: urlN < url.length && f % 16 < 8 ? 1 : 0}}>|</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22}}>
            <Logo width={230} still />
            <div style={{padding: '8px 16px', borderRadius: 999, background: C.amber, color: C.ink, fontFamily: FONT.sans, fontWeight: 800, fontSize: 17}}>
              Get Early Access
            </div>
          </div>
          <div style={{marginTop: 18, height: 300, borderRadius: 24, overflow: 'hidden', position: 'relative', opacity: ease(f, 20, 34)}}>
            <Img
              src={staticFile('img/castle-wide.jpg')}
              style={{position: 'absolute', height: 300 * 1.25, left: -(f * 1.4) - 300, top: -20}}
            />
          </div>
          <div style={{fontFamily: FONT.mono, fontSize: 17, color: C.amber, letterSpacing: '0.2em', marginTop: 22}}>VISUAL DENTAL EXAM PREP</div>
          <div style={{fontFamily: FONT.sans, fontWeight: 900, fontSize: 54, color: C.cream, letterSpacing: '-0.03em', lineHeight: 1.02, marginTop: 8}}>
            Dentistry,
            <br />
            <span style={{fontFamily: FONT.serif, fontStyle: 'italic', color: C.amber}}>visualised.</span>
          </div>
          <div style={{fontFamily: FONT.sans, fontSize: 22, color: C.dim, marginTop: 12, lineHeight: 1.35}}>
            Visual prep for NEET MDS, INI CET, INBDE and AIIMS. Concepts you can see, remember and apply.
          </div>
          {/* email field */}
          <div
            style={{
              marginTop: 22,
              height: 70,
              borderRadius: 18,
              border: `2px solid ${f >= 58 && !done ? C.amber : '#3a3530'}`,
              background: '#16130f',
              display: 'flex',
              alignItems: 'center',
              padding: '0 22px',
              fontFamily: FONT.sans,
              fontSize: 26,
              color: emN ? C.cream : C.dim,
            }}
          >
            {emN ? email.slice(0, emN) : 'Enter your email'}
            {f >= 58 && !done && f % 16 < 8 ? <span style={{color: C.amber}}>|</span> : null}
          </div>
          {/* CTA button morphs into success */}
          <div
            style={{
              marginTop: 16,
              height: 78,
              borderRadius: 18,
              background: done ? '#2f6b3f' : C.amber,
              color: done ? '#eafbe9' : C.ink,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              fontFamily: FONT.sans,
              fontWeight: 900,
              fontSize: 30,
              transform: `scale(${(done ? btn.sx : 1) * (f >= tapAt - 4 && f < tapAt + 2 ? tapScale : 1)}, ${done ? btn.sy : 1})`,
              boxShadow: `0 0 40px ${C.amber}55`,
            }}
          >
            {done ? (
              <>
                <Check size={36} progress={ease(f, tapAt + 2, tapAt + 14)} color="#eafbe9" /> You're on the list
              </>
            ) : (
              'Get Early Access →'
            )}
          </div>
          <div style={{fontFamily: FONT.mono, fontSize: 16, color: C.dim, marginTop: 18, letterSpacing: '0.06em', textAlign: 'center'}}>
            FOUNDER · DR. JISHNU MOHAN · AIR 1 AIIMS PHD
          </div>
        </div>
        {/* Gmail confirmation drops in */}
        {f >= tapAt + 18 ? (
          <div
            style={{
              position: 'absolute',
              left: 20,
              right: 20,
              top: 20 + (1 - sp(f, tapAt + 18, BOUNCE)) * -200,
              borderRadius: 26,
              background: '#f6f4f1',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              padding: '18px 22px',
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              fontFamily: FONT.sans,
              color: '#202124',
            }}
          >
            <svg width={56} height={42} viewBox="0 0 56 42">
              <path d="M4 42V8l24 18L52 8v34H40V18L28 27 16 18v24z" fill="#ea4335" />
              <path d="M4 8v34h12V18z" fill="#4285f4" />
              <path d="M40 18v24h12V8z" fill="#34a853" />
              <path d="M52 8 40 18V4l6-3a4 4 0 0 1 6 3z" fill="#fbbc04" />
              <path d="M4 8 16 18V4L10 1a4 4 0 0 0-6 3z" fill="#c5221f" />
            </svg>
            <div style={{flex: 1}}>
              <div style={{fontSize: 18, color: '#5f6368'}}>Gmail · now</div>
              <div style={{fontWeight: 800, fontSize: 22}}>SketchRoot</div>
              <div style={{fontSize: 20}}>You're on the early-access list ✓</div>
            </div>
          </div>
        ) : null}
      </div>
      {/* fingertip */}
      {f >= 30 && f < tapAt + 14 ? (
        <div
          style={{
            position: 'absolute',
            left: fx - 38,
            top: fy - 38 + floatY,
            width: 76,
            height: 76,
            borderRadius: '50%',
            background: 'rgba(243,238,228,0.35)',
            border: '3px solid rgba(243,238,228,0.9)',
            transform: `scale(${tapScale})`,
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            opacity: interpolate(f, [30, 36, tapAt + 6, tapAt + 14], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          }}
        />
      ) : null}
      {done ? <Burst x={540} y={1445} delay={tapAt + 2} radius={340} count={12} /> : null}
    </AbsoluteFill>
  );
};
