import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {BOUNCE, GLIDE, POP, anticipate, clamp01, ease, exitOut, rand, shake, sp, squash} from '../anim';
import {Burst, Kicker, Logo, Pill, Sparkle, Words} from '../components';
import {C, FONT} from '../theme';

/* ================================================================== */
/* 1. HOOK (0 – 3.12 s): three All-India ranks slam in on the beat.     */
/*    No fade-in: frame 0 is already mid-impact (pattern interrupt).   */
/* ================================================================== */
const RANKS = [
  {n: '1', exam: 'AIIMS New Delhi', sub: 'PhD Entrance · 2025', at: 0},
  {n: '37', exam: 'NEET MDS', sub: '2022', at: 43},
  {n: '91', exam: 'INI-CET', sub: '2022', at: 61},
];

export const Hook: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const sh = [shake(f, 2, 26), shake(f, 45, 20), shake(f, 63, 20)].reduce(
    (a, b) => ({x: a.x + b.x, y: a.y + b.y, r: a.r + b.r}),
    {x: 0, y: 0, r: 0},
  );
  const outro = 78;
  const out = exitOut(f, duration, 6);
  return (
    <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg)`, opacity: out}}>
      {/* headline that frames the payoff immediately */}
      <div style={{position: 'absolute', top: 250, width: '100%'}}>
        <Words words={['3', 'All-India', 'Ranks.']} delay={0} stagger={2} size={70} />
        <div style={{height: 10}} />
        {f >= outro - 4 ? <Words words={[{t: 'One', em: true}, {t: 'method.', em: true}]} delay={outro - 4} size={84} /> : null}
      </div>

      {RANKS.map((r, i) => {
        const next = RANKS[i + 1]?.at ?? outro;
        const {p, sx, sy} = squash(f, r.at === 0 ? -6 : r.at, BOUNCE, 2.2);
        // hero -> pill stack
        const toPill = sp(f, next, GLIDE);
        const heroY = interpolate(p, [0, 1], [-500, 0]);
        const scale = interpolate(toPill, [0, 1], [1, 0.36]);
        const y = interpolate(toPill, [0, 1], [880 + heroY, 1320 + i * 116]);
        const labelO = 1 - clamp01(toPill * 2.5);
        return (
          <div key={r.n} style={{position: 'absolute', left: 0, right: 0, top: 0, height: 0}}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: y - 230,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: `scale(${scale * sx}, ${scale * sy})`,
                transformOrigin: '50% 100%',
                opacity: f >= r.at - 6 ? 1 - clamp01((toPill - 0.35) * 3) : 0,
              }}
            >
              <div
                style={{
                  fontFamily: FONT.mono,
                  fontSize: 30,
                  letterSpacing: '0.3em',
                  color: C.dim,
                  opacity: labelO,
                }}
              >
                ALL INDIA RANK
              </div>
              <div
                style={{
                  fontFamily: FONT.sans,
                  fontWeight: 900,
                  fontSize: 310,
                  lineHeight: 0.9,
                  letterSpacing: '-0.06em',
                  background: `linear-gradient(180deg, #ffe08a 0%, ${C.amber} 45%, ${C.amberDeep} 100%)`,
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  filter: `drop-shadow(0 18px 50px ${C.amber}55)`,
                }}
              >
                AIR {r.n}
              </div>
            </div>
            {/* exam label under the hero number */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 1030 + heroY * 0.4,
                textAlign: 'center',
                opacity: labelO * clamp01(p * 2),
                fontFamily: FONT.sans,
                color: C.cream,
              }}
            >
              <div style={{fontWeight: 800, fontSize: 76, letterSpacing: '-0.03em'}}>{r.exam}</div>
              <div style={{fontFamily: FONT.mono, fontSize: 30, color: C.dim, marginTop: 8, letterSpacing: '0.18em'}}>{r.sub}</div>
            </div>
            {/* compact pill once stacked */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 1320 + i * 116 - 46,
                display: 'flex',
                justifyContent: 'center',
                opacity: clamp01((toPill - 0.6) * 3),
                transform: `translateX(${(1 - clamp01(toPill)) * (i % 2 ? 80 : -80)}px)`,
              }}
            >
              <Pill style={{fontSize: 40, padding: '16px 34px'}}>
                <span style={{fontWeight: 900, color: C.amber}}>AIR {r.n}</span>
                <span style={{opacity: 0.5}}>·</span>
                <span>{r.exam}</span>
                <span style={{fontFamily: FONT.mono, fontSize: 26, color: C.dim}}>{r.sub.replace('PhD Entrance · ', '')}</span>
              </Pill>
            </div>
            <Burst x={540} y={760} delay={r.at + 2} radius={330} />
          </div>
        );
      })}
      <Sparkle x={210} y={620} delay={4} size={60} />
      <Sparkle x={880} y={980} delay={46} size={50} />
      <Sparkle x={170} y={1000} delay={64} size={44} color={C.cream} />
      <Sparkle x={900} y={560} delay={outro} size={56} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 2. OPEN LOOP (3.12 – 9.12 s): "I didn't study more than you."         */
/*    The drop (7.2 s) lands on "I remembered better."                 */
/* ================================================================== */
export const OpenLoop: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const drop = 122; // 7.2 s - 3.12 s
  const photo = sp(f, 2, BOUNCE);
  const ring = ease(f, 6, 40);
  const pre = 1 - ease(f, drop - 6, drop + 2);
  const sh = shake(f, drop, 24);
  const out = exitOut(f, duration, 6);
  const zoom = 1 + ease(f, drop, duration) * 0.06;
  return (
    <AbsoluteFill style={{opacity: out, transform: `translate(${sh.x}px, ${sh.y}px) scale(${zoom})`}}>
      {/* portrait medallion */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 230,
          top: 300,
          width: 460,
          height: 460,
          transform: `scale(${photo * anticipate(f, drop, 0.06)}) rotate(${(1 - photo) * -12}deg)`,
        }}
      >
        <svg width={460} height={460} style={{position: 'absolute', inset: 0}}>
          <circle cx={230} cy={230} r={222} fill="none" stroke={C.line} strokeWidth={4} />
          <circle
            cx={230}
            cy={230}
            r={222}
            fill="none"
            stroke={C.amber}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={1395}
            strokeDashoffset={1395 * (1 - ring)}
            transform="rotate(-90 230 230)"
          />
        </svg>
        <Img
          src={staticFile('img/founder.jpg')}
          style={{
            position: 'absolute',
            left: 18,
            top: 18,
            width: 424,
            height: 424,
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: '50% 30%',
          }}
        />
      </div>
      <div style={{position: 'absolute', top: 790, width: '100%', textAlign: 'center', opacity: clamp01(sp(f, 10) * 1.5)}}>
        <div style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 52, color: C.cream, letterSpacing: '-0.02em'}}>Dr. Jishnu Mohan</div>
        <div style={{fontFamily: FONT.mono, fontSize: 25, color: C.dim, letterSpacing: '0.14em', marginTop: 10}}>
          OMFS · PGI ROHTAK · EX TATA MEMORIAL
        </div>
      </div>

      <div style={{position: 'absolute', top: 1010, width: '100%', padding: '0 70px', opacity: pre}}>
        <Words words={['I', "didn't", 'study', '\n', 'more', 'than', 'you.']} delay={18} stagger={4} size={96} />
      </div>
      {f >= drop - 2 ? (
        <div style={{position: 'absolute', top: 990, width: '100%', padding: '0 50px'}}>
          <Words words={['I', 'remembered', '\n', {t: 'better.', em: true}]} delay={drop - 2} stagger={3} size={118} />
        </div>
      ) : null}
      {f >= drop ? <Burst x={540} y={1180} delay={drop} radius={420} count={10} /> : null}
      <div style={{position: 'absolute', top: 1380, width: '100%', opacity: ease(f, drop + 26, drop + 40)}}>
        <Kicker text="here's the method" delay={drop + 26} />
      </div>
      <Sparkle x={300} y={330} delay={14} />
      <Sparkle x={800} y={720} delay={24} size={34} color={C.cream} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 3. PROBLEM (9.12 – 15.13 s): the subject avalanche.                  */
/* ================================================================== */
const SUBJECTS = [
  'Anatomy',
  'Physiology',
  'Biochemistry',
  'Pharmacology',
  'Microbiology',
  'Pathology',
  'Gen. Medicine',
  'Gen. Surgery',
  'Dental Materials',
  'Oral Pathology',
  'Oral Medicine',
  'Radiology',
  'Endodontics',
  'Prosthodontics',
  'Periodontics',
  'Orthodontics',
  'Pedodontics',
  'OMFS',
];

export const Problem: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const count = Math.min(18, Math.floor(ease(f, 4, 70, 0, 18.99, (x) => x)));
  const stats = [
    {t: '× 4 textbooks each', at: 76},
    {t: '+ 3 sets of coaching notes', at: 92},
    {t: '+ PDFs nobody opens twice', at: 108},
  ];
  const stress = shake(f, 130, 14, 0.12);
  const out = exitOut(f, duration, 6);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 250, width: '100%', textAlign: 'center'}}>
        <Kicker text="the problem" delay={0} />
        <div
          style={{
            fontFamily: FONT.sans,
            fontWeight: 900,
            fontSize: 250,
            lineHeight: 1,
            color: C.cream,
            letterSpacing: '-0.06em',
            marginTop: 20,
            transform: `scale(${1 + (count > 0 ? 0.04 * Math.sin(f * 1.4) * (count < 18 ? 1 : 0) : 0)})`,
          }}
        >
          {count}
        </div>
        <div style={{fontFamily: FONT.sans, fontWeight: 800, fontSize: 60, color: C.cream, marginTop: -6}}>subjects.</div>
      </div>
      <div style={{position: 'absolute', top: 690, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
        {stats.map((s, i) => {
          const p = sp(f, s.at, POP);
          return (
            <div
              key={i}
              style={{
                fontFamily: FONT.sans,
                fontWeight: 800,
                fontSize: 54,
                color: i === 2 ? C.terracotta : C.cream,
                transform: `translateX(${(1 - p) * (i % 2 ? 300 : -300)}px) rotate(${(1 - p) * 4}deg)`,
                opacity: clamp01(p * 2),
                letterSpacing: '-0.02em',
              }}
            >
              {s.t}
            </div>
          );
        })}
      </div>
      {/* falling subject blocks pile up (gravity + squash on landing) */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, transform: `translate(${stress.x}px, ${stress.y}px)`}}>
        {SUBJECTS.map((name, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const delay = 4 + i * 3.6;
          const {p, sx, sy} = squash(f, delay, BOUNCE, 3);
          const w = 300;
          const x = 60 + col * 325 + (row % 2 ? 22 : -10) + (rand(i) - 0.5) * 24;
          const yEnd = 1540 - row * 84;
          const y = interpolate(p, [0, 1], [-200, yEnd]);
          const rot = (rand(i * 9) - 0.5) * 10 + (1 - p) * 40 * (rand(i * 5) - 0.5);
          return (
            <div
              key={name}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: w,
                height: 74,
                borderRadius: 14,
                background: i % 4 === 0 ? '#2a2420' : i % 4 === 1 ? '#3a2a20' : i % 4 === 2 ? '#232323' : '#2d261b',
                border: `2px solid ${i % 3 === 0 ? C.amber : C.terracotta}66`,
                boxShadow: '0 12px 30px rgba(0,0,0,0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: FONT.sans,
                fontWeight: 800,
                fontSize: 30,
                color: C.cream,
                transform: `rotate(${rot}deg) scale(${sx}, ${sy})`,
                transformOrigin: '50% 100%',
                opacity: f >= delay ? 1 : 0,
              }}
            >
              {name}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 4. FORGETTING (15.13 – 21.12 s): March -> September, the curve.      */
/* ================================================================== */
const MONTHS = ['MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER'];

export const Forgetting: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const flip = ease(f, 26, 62, 0, MONTHS.length - 1, (x) => x * x * (3 - 2 * x));
  const mi = Math.round(flip);
  const flipPhase = flip - Math.floor(flip);
  const draw = ease(f, 20, 70);
  const note = 'β-blockers · class II antiarrhythmics · propranolol: non-selective · metoprolol: β1';
  const fadeChars = ease(f, 30, 72);
  const lineIn = 112; // ~18.88 s
  const out = exitOut(f, duration, 6);
  // Ebbinghaus-like decay path
  const pts = new Array(41).fill(0).map((_, i) => {
    const x = i / 40;
    const r = 0.22 + 0.78 * Math.exp(-x * 4.2);
    return [80 + x * 760, 60 + (1 - r) * 300] as const;
  });
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 240, width: '100%'}}>
        <Words words={['Read', 'it', 'in', 'March.']} delay={0} size={84} />
      </div>
      {/* flip calendar */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 230,
          top: 380,
          width: 460,
          height: 300,
          borderRadius: 28,
          background: C.cream,
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          transform: `scale(${sp(f, 4, BOUNCE)}) rotate(${-3 + Math.sin(f / 9) * 1.2}deg)`,
          overflow: 'hidden',
          perspective: 900,
        }}
      >
        <div style={{height: 70, background: mi === MONTHS.length - 1 ? C.rust : C.amber, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 120}}>
          <div style={{width: 22, height: 22, borderRadius: 11, background: C.ink}} />
          <div style={{width: 22, height: 22, borderRadius: 11, background: C.ink}} />
        </div>
        <div
          style={{
            height: 230,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: FONT.sans,
            fontWeight: 900,
            fontSize: MONTHS[mi].length > 6 ? 70 : 92,
            color: C.ink,
            letterSpacing: '-0.03em',
            transform: `rotateX(${f > 26 && f < 62 ? (flipPhase - 0.5) * 120 : 0}deg)`,
          }}
        >
          {MONTHS[mi]}
        </div>
      </div>
      {/* the note that evaporates */}
      <div
        style={{
          position: 'absolute',
          top: 730,
          left: 80,
          right: 80,
          fontFamily: FONT.mono,
          fontSize: 32,
          lineHeight: 1.5,
          color: C.cream,
          textAlign: 'center',
        }}
      >
        {note.split('').map((ch, i) => {
          const r = rand(i * 13);
          const gone = clamp01((fadeChars - r * 0.8) * 4);
          return (
            <span
              key={i}
              style={{
                opacity: 1 - gone * 0.92,
                display: 'inline-block',
                whiteSpace: 'pre',
                transform: `translateY(${-gone * 40 * r}px) rotate(${gone * (r - 0.5) * 60}deg)`,
                filter: `blur(${gone * 6}px)`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      {/* forgetting curve */}
      <svg width={920} height={420} style={{position: 'absolute', left: 80, top: 900}}>
        <line x1={80} y1={20} x2={80} y2={370} stroke={C.line} strokeWidth={3} />
        <line x1={80} y1={370} x2={860} y2={370} stroke={C.line} strokeWidth={3} />
        <text x={92} y={40} fill={C.dim} fontFamily="JetBrains Mono" fontSize={24}>
          RECALL
        </text>
        <text x={860} y={405} fill={C.dim} fontFamily="JetBrains Mono" fontSize={24} textAnchor="end">
          MONTHS →
        </text>
        <path d={path} fill="none" stroke={C.terracotta} strokeWidth={8} strokeLinecap="round" strokeDasharray={1400} strokeDashoffset={1400 * (1 - draw)} />
        {draw > 0.98 ? (
          <g transform={`translate(${pts[40][0]} ${pts[40][1]})`}>
            <circle r={14 + Math.sin(f / 3) * 3} fill={C.terracotta} />
          </g>
        ) : null}
      </svg>
      <div style={{position: 'absolute', top: 1270, width: '100%'}}>
        <Words words={['Gone', 'by', {t: 'September.', em: true, color: C.terracotta}]} delay={60} size={84} emColor={C.terracotta} />
      </div>
      <div style={{position: 'absolute', top: 1420, width: '100%', padding: '0 60px'}}>
        {f >= lineIn ? <Words words={['The', 'problem', 'was', {t: 'never', em: true}, {t: 'effort.', em: true}]} delay={lineIn} size={62} weight={600} /> : null}
      </div>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 5. REVEAL (21.12 – 27.12 s): linear text collapses -> SketchRoot.    */
/* ================================================================== */
export const Reveal: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const collapse = ease(f, 26, 44, 0, 1, (x) => x * x * x);
  const logoAt = 46;
  const out = exitOut(f, duration, 6);
  const lines = new Array(9).fill(0);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 260, width: '100%', opacity: 1 - ease(f, 40, 50)}}>
        <Words words={["It's", 'the', {t: 'container.', em: true}]} delay={0} size={92} />
      </div>
      {/* a page of linear text, sucked into a single point */}
      <div
        style={{
          position: 'absolute',
          left: 170,
          top: 520,
          width: 740,
          transform: `translate(0, ${collapse * 260}px) scale(${1 - collapse}) rotate(${collapse * 200}deg)`,
          transformOrigin: '50% 50%',
          opacity: 1 - ease(f, 40, 46),
        }}
      >
        {lines.map((_, i) => (
          <div
            key={i}
            style={{
              height: 22,
              margin: '22px 0',
              borderRadius: 11,
              background: C.dim,
              opacity: 0.35,
              width: `${70 + rand(i) * 30}%`,
              transform: `scaleX(${sp(f, i * 1.5, POP)})`,
              transformOrigin: '0 50%',
            }}
          />
        ))}
      </div>
      {f >= logoAt - 2 ? <Burst x={540} y={900} delay={logoAt - 2} radius={480} count={12} /> : null}
      <div style={{position: 'absolute', top: 470, width: '100%', opacity: ease(f, logoAt, logoAt + 8)}}>
        <Kicker text="introducing" delay={logoAt} />
      </div>
      <div style={{position: 'absolute', left: 60, top: 720}}>{f >= logoAt - 2 ? <Logo delay={logoAt} width={960} /> : null}</div>
      <div style={{position: 'absolute', top: 1150, width: '100%'}}>
        {f >= 96 ? <Words words={['Memory,', {t: 'redrawn.', em: true}]} delay={96} size={80} /> : null}
      </div>
      <div style={{position: 'absolute', top: 1270, width: '100%'}}>
        {f >= 120 ? <Words words={['Dentistry,', {t: 'visualised.', em: true}]} delay={120} size={80} /> : null}
      </div>
      <Sparkle x={150} y={760} delay={logoAt + 30} size={50} />
      <Sparkle x={960} y={1090} delay={logoAt + 40} size={40} color={C.cream} />
    </AbsoluteFill>
  );
};

