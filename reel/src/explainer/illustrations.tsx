/**
 * Original flat illustrations for the method-of-loci explainer (SVG, SketchRoot palette).
 * Ink outlines + flat fills + one amber accent, so they sit naturally on the paper ground.
 */
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {clamp01, ease, rand, sp, BOUNCE} from '../anim';
import {P} from '../theme';

const ink = P.ink;
const sw = 5;

/* ---------------- House cutaway (4 rooms) ---------------- */
export const House: React.FC<{w?: number; glow?: number}> = ({w = 860, glow = 0}) => (
  <svg width={w} height={(w / 860) * 780} viewBox="0 0 860 780">
    {/* roof */}
    <path d="M40 300 L430 40 L820 300 Z" fill={P.terracotta} stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
    <path d="M110 290 L430 80 L750 290" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={4} />
    <rect x={610} y={110} width={60} height={120} fill={P.ink2} stroke={ink} strokeWidth={sw} />
    {/* walls */}
    <rect x={80} y={300} width={700} height={460} fill={P.white} stroke={ink} strokeWidth={sw} />
    <line x1={430} y1={300} x2={430} y2={760} stroke={ink} strokeWidth={sw} />
    <line x1={80} y1={530} x2={780} y2={530} stroke={ink} strokeWidth={sw} />
    {/* room tints */}
    <rect x={83} y={303} width={344} height={224} fill="#f3e7d2" />
    <rect x={433} y={303} width={344} height={224} fill="#e9eef0" />
    <rect x={83} y={533} width={344} height={224} fill="#f6ecd9" />
    <rect x={433} y={533} width={344} height={224} fill="#efe6dc" />
    {/* bedroom (top-left): bed */}
    <rect x={130} y={430} width={230} height={60} rx={10} fill={P.sea} stroke={ink} strokeWidth={4} />
    <rect x={130} y={400} width={70} height={40} rx={10} fill={P.white} stroke={ink} strokeWidth={4} />
    <rect x={120} y={380} width={16} height={115} fill={P.ink2} />
    {/* kitchen (top-right): stove + pot */}
    <rect x={480} y={420} width={140} height={100} fill={P.dim} stroke={ink} strokeWidth={4} />
    <rect x={505} y={385} width={70} height={40} rx={8} fill={P.amber} stroke={ink} strokeWidth={4} />
    <path d="M520 370 q8 -18 0 -30 M545 370 q8 -18 0 -30" stroke={P.dim} strokeWidth={4} fill="none" />
    <rect x={650} y={340} width={100} height={80} fill={P.white} stroke={ink} strokeWidth={4} />
    {/* living room (bottom-left): sofa + lamp */}
    <rect x={130} y={660} width={250} height={70} rx={16} fill={P.amber} stroke={ink} strokeWidth={4} />
    <rect x={130} y={620} width={250} height={50} rx={16} fill={P.amberDeep} stroke={ink} strokeWidth={4} />
    <line x1={395} y1={590} x2={395} y2={730} stroke={ink} strokeWidth={4} />
    <path d="M375 590 h40 l-10 -30 h-20 z" fill={P.white} stroke={ink} strokeWidth={4} />
    {/* entrance (bottom-right): door */}
    <rect x={560} y={590} width={110} height={170} rx={6} fill={P.terracotta} stroke={ink} strokeWidth={sw} />
    <circle cx={650} cy={680} r={7} fill={P.amber} stroke={ink} strokeWidth={3} />
    <rect x={700} y={600} width={60} height={60} fill="#e9eef0" stroke={ink} strokeWidth={4} />
    {/* warm "you know this place" glow */}
    <rect x={80} y={300} width={700} height={460} fill={P.amber} opacity={glow * 0.18} />
  </svg>
);
/** room anchor points inside House (in its 860x780 viewBox) */
export const HOUSE_SPOTS = {door: [615, 600], sofa: [255, 640], kitchen: [540, 390], bed: [245, 420]} as const;

/* ---------------- Greek banquet hall (roof can collapse) ---------------- */
export const BanquetHall: React.FC<{w?: number; collapse?: number}> = ({w = 900, collapse = 0}) => {
  const f = useCurrentFrame();
  const fall = collapse * collapse;
  return (
    <svg width={w} height={(w / 900) * 640} viewBox="0 0 900 640" style={{overflow: 'visible'}}>
      {/* floor + steps */}
      <rect x={40} y={560} width={820} height={30} fill="#ddd2bf" stroke={ink} strokeWidth={sw} />
      <rect x={20} y={590} width={860} height={34} fill="#d2c5ad" stroke={ink} strokeWidth={sw} />
      {/* banquet table + guests (dots) */}
      <rect x={210} y={470} width={480} height={26} fill={P.terracotta} stroke={ink} strokeWidth={4} />
      {new Array(8).fill(0).map((_, i) => (
        <g key={i} transform={`translate(${240 + i * 60} ${445 + Math.sin(f / 6 + i) * (collapse > 0 ? 0 : 1.5)})`}>
          <circle r={18} fill={['#e6b98a', '#c98d5f', '#a86f45', '#e0a878'][i % 4]} stroke={ink} strokeWidth={3} />
          <rect x={-20} y={18} width={40} height={50} rx={10} fill={[P.sea, P.amber, P.sage, P.white][i % 4]} stroke={ink} strokeWidth={3} />
        </g>
      ))}
      {/* columns (topple with the roof) */}
      {new Array(6).fill(0).map((_, i) => (
        <g key={i} transform={`translate(${95 + i * 142} 560) rotate(${fall * (i % 2 ? 24 : -20) * (0.6 + rand(i) * 0.6)})`}>
          <rect x={-26} y={-330} width={52} height={330} fill={P.white} stroke={ink} strokeWidth={sw} />
          <line x1={-10} y1={-320} x2={-10} y2={-10} stroke="rgba(0,0,0,0.15)" strokeWidth={4} />
          <line x1={10} y1={-320} x2={10} y2={-10} stroke="rgba(0,0,0,0.15)" strokeWidth={4} />
          <rect x={-36} y={-350} width={72} height={22} fill={P.paper2} stroke={ink} strokeWidth={4} />
        </g>
      ))}
      {/* pediment / roof */}
      <g transform={`translate(${fall * 30} ${fall * 380}) rotate(${fall * 9} 450 150)`}>
        <rect x={30} y={180} width={840} height={34} fill={P.paper2} stroke={ink} strokeWidth={sw} />
        <path d="M30 180 L450 40 L870 180 Z" fill={P.white} stroke={ink} strokeWidth={sw} strokeLinejoin="round" />
        <path d="M120 165 L450 65 L780 165 Z" fill="#efe3cc" stroke={ink} strokeWidth={3} />
      </g>
      {/* dust */}
      {collapse > 0.6
        ? new Array(14).fill(0).map((_, i) => (
            <circle
              key={i}
              cx={60 + rand(i) * 780}
              cy={520 - rand(i + 4) * 220 * collapse}
              r={20 + rand(i + 8) * 50 * collapse}
              fill="#cbbfa9"
              opacity={0.55 * clamp01((collapse - 0.6) * 3)}
            />
          ))
        : null}
    </svg>
  );
};

/* ---------------- Top-down seating plan ---------------- */
export const SEATS = new Array(8).fill(0).map((_, i) => {
  const side = i < 4 ? -1 : 1;
  const k = i % 4;
  return [180 + k * 180, 300 + side * 150] as const;
});

export const SeatingPlan: React.FC<{lit: number}> = ({lit}) => (
  <svg width={900} height={600} viewBox="0 0 900 600">
    <rect x={20} y={20} width={860} height={560} rx={30} fill="#efe3cc" stroke={ink} strokeWidth={sw} />
    {/* floor tiles */}
    {new Array(7).fill(0).map((_, i) => (
      <line key={i} x1={20 + i * 123} y1={20} x2={20 + i * 123} y2={580} stroke="rgba(0,0,0,0.06)" strokeWidth={3} />
    ))}
    <rect x={120} y={240} width={660} height={120} rx={14} fill={P.terracotta} stroke={ink} strokeWidth={sw} />
    {SEATS.map(([x, y], i) => {
      const on = lit > i;
      return (
        <g key={i}>
          <circle cx={x} cy={y} r={52} fill={on ? P.amber : P.white} stroke={ink} strokeWidth={sw} />
          <text x={x} y={y + 14} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={40} fill={ink}>
            {on ? i + 1 : '?'}
          </text>
        </g>
      );
    })}
  </svg>
);

/* ---------------- Roman orator bust (Cicero-style, generic) ---------------- */
export const Bust: React.FC<{w?: number}> = ({w = 420}) => (
  <svg width={w} height={(w / 420) * 520} viewBox="0 0 420 520">
    <rect x={110} y={430} width={200} height={70} fill="#d9d2c5" stroke={ink} strokeWidth={sw} />
    <path d="M70 430 Q90 330 210 320 Q330 330 350 430 Z" fill="#e8e2d6" stroke={ink} strokeWidth={sw} />
    <path d="M120 400 Q200 350 300 410" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={5} />
    <rect x={175} y={270} width={70} height={70} fill="#e8e2d6" stroke={ink} strokeWidth={sw} />
    <ellipse cx={210} cy={190} rx={95} ry={115} fill="#efe9de" stroke={ink} strokeWidth={sw} />
    <path d="M120 150 Q130 70 210 70 Q300 70 302 150 Q280 110 210 112 Q150 110 120 150Z" fill="#d9d2c5" stroke={ink} strokeWidth={4} />
    <path d="M170 185 q14 -10 28 0 M222 185 q14 -10 28 0" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M210 195 L198 240 L222 240" stroke={ink} strokeWidth={4} fill="none" strokeLinejoin="round" />
    <path d="M185 268 q25 10 50 0" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M300 200 q20 0 16 30 q-6 18 -18 10" fill="#efe9de" stroke={ink} strokeWidth={4} />
  </svg>
);

/* ---------------- Brain (side view) with hippocampus ---------------- */
export const Brain: React.FC<{w?: number; pulse?: number}> = ({w = 760, pulse = 0}) => (
  <svg width={w} height={(w / 760) * 560} viewBox="0 0 760 560">
    <path
      d="M120 300 C80 180 180 70 320 70 C400 30 520 50 580 110 C680 140 720 240 690 320 C700 390 640 430 580 420 C540 470 450 470 400 440 C330 470 240 450 210 410 C140 410 100 360 120 300Z"
      fill="#f2c9c0"
      stroke={ink}
      strokeWidth={sw}
    />
    {/* gyri squiggles */}
    {[
      'M190 200 q40 -40 80 0 t80 0',
      'M330 130 q30 40 70 10 t70 20',
      'M480 150 q40 40 80 10',
      'M170 300 q40 -30 80 0 t80 0 t80 -10',
      'M470 260 q40 -40 90 -10 t60 40',
      'M260 380 q40 -30 90 0',
      'M420 360 q40 30 90 0',
    ].map((d, i) => (
      <path key={i} d={d} fill="none" stroke="rgba(120,40,40,0.45)" strokeWidth={6} strokeLinecap="round" />
    ))}
    {/* cerebellum + stem */}
    <path d="M560 420 C610 440 660 420 670 380 C640 400 600 400 560 400Z" fill="#e7b3a8" stroke={ink} strokeWidth={4} />
    <path d="M470 440 C480 490 470 520 450 545 L500 545 C520 510 520 470 520 440Z" fill="#e7b3a8" stroke={ink} strokeWidth={4} />
    {/* hippocampus (seahorse curl, deep in the temporal lobe) */}
    <g>
      <circle cx={430} cy={340} r={60 + pulse * 30} fill={P.amber} opacity={0.25 * (1 - pulse * 0.5)} />
      <path d="M380 330 C390 300 440 300 460 320 C480 345 470 375 445 375 C425 375 420 355 435 350" fill="none" stroke={P.amberDeep} strokeWidth={16} strokeLinecap="round" />
    </g>
  </svg>
);

/* ---------------- tiny object icons (visual memory grid) ---------------- */
const OBJ = [
  (c: string) => <path d="M10 30 h40 v20 h-40z M18 30 v-10 h24 v10" fill={c} stroke={ink} strokeWidth={3} />, // bag
  (c: string) => <circle cx={30} cy={30} r={20} fill={c} stroke={ink} strokeWidth={3} />, // ball
  (c: string) => <path d="M30 8 L52 50 H8Z" fill={c} stroke={ink} strokeWidth={3} strokeLinejoin="round" />, // cone
  (c: string) => <path d="M14 12 h32 v38 h-32z M20 12 v-6 h20 v6" fill={c} stroke={ink} strokeWidth={3} />, // jar
  (c: string) => <path d="M10 40 q20 -40 40 0 z M28 40 v14" fill={c} stroke={ink} strokeWidth={3} />, // umbrella
  (c: string) => <path d="M30 6 l7 15 16 2 -12 11 3 16 -14 -8 -14 8 3 -16 -12 -11 16 -2z" fill={c} stroke={ink} strokeWidth={3} strokeLinejoin="round" />, // star
  (c: string) => <path d="M12 20 h36 v26 a6 6 0 0 1 -6 6 h-24 a6 6 0 0 1 -6 -6z M48 26 h6 v12 h-6" fill={c} stroke={ink} strokeWidth={3} />, // mug
  (c: string) => <path d="M30 6 c10 10 18 18 18 28 a18 18 0 0 1 -36 0 c0 -10 8 -18 18 -28z" fill={c} stroke={ink} strokeWidth={3} />, // drop
];
const OBJ_COL = [P.amber, P.terracotta, P.sea, P.sage, P.white, '#e7b3a8'];
export const ObjectIcon: React.FC<{i: number; size?: number}> = ({i, size = 60}) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    {OBJ[i % OBJ.length](OBJ_COL[(i * 7) % OBJ_COL.length])}
  </svg>
);

/* ---------------- stylised Aegean map ---------------- */
export const AegeanMap: React.FC<{w?: number}> = ({w = 820}) => (
  <svg width={w} height={(w / 820) * 560} viewBox="0 0 820 560">
    <rect width={820} height={560} fill={P.sea} />
    {/* sea texture lines */}
    {new Array(10).fill(0).map((_, i) => (
      <path key={i} d={`M${20 + (i % 3) * 260} ${40 + i * 52} q20 -10 40 0 t40 0`} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
    ))}
    {/* mainland Greece (stylised) */}
    <path
      d="M0 0 H330 C320 60 300 90 260 120 C300 150 280 190 240 200 C270 240 250 300 200 300 C230 340 210 400 160 420 C180 470 140 520 90 560 H0Z"
      fill="#e9dcc0"
      stroke={ink}
      strokeWidth={4}
    />
    {/* Attica peninsula */}
    <path d="M240 200 C300 210 330 240 340 270 C310 270 280 260 250 250Z" fill="#e9dcc0" stroke={ink} strokeWidth={4} />
    {/* Asia Minor coast */}
    <path d="M820 0 H640 C660 80 610 120 650 170 C620 230 680 270 640 330 C690 380 650 450 700 560 H820Z" fill="#e9dcc0" stroke={ink} strokeWidth={4} />
    {/* Cyclades */}
    {[
      [380, 300, 18],
      [420, 360, 24],
      [470, 330, 16],
      [450, 420, 20],
      [520, 390, 14],
      [400, 440, 12],
    ].map(([x, y, r], i) => (
      <ellipse key={i} cx={x} cy={y} rx={r * 1.3} ry={r} fill="#e9dcc0" stroke={ink} strokeWidth={3} />
    ))}
    {/* Ceos (Kea), just off Attica */}
    <ellipse cx={345} cy={300} rx={26} ry={18} fill={P.amber} stroke={ink} strokeWidth={4} />
    <text x={150} y={110} fontFamily="Caveat" fontWeight={700} fontSize={44} fill={ink} opacity={0.75}>
      Greece
    </text>
    <text x={560} y={520} fontFamily="Caveat" fontWeight={700} fontSize={40} fill="#ffffff" opacity={0.8}>
      Aegean Sea
    </text>
  </svg>
);
export const CEOS_ON_MAP = [345, 300] as const;

/* ---------------- step icons ---------------- */
export const StepIcon: React.FC<{kind: 'place' | 'image' | 'walk'; size?: number}> = ({kind, size = 150}) => {
  const f = useCurrentFrame();
  return (
    <svg width={size} height={size} viewBox="0 0 150 150">
      <circle cx={75} cy={75} r={70} fill={P.paper2} stroke={ink} strokeWidth={5} />
      {kind === 'place' ? (
        <g>
          <path d="M30 75 L75 38 L120 75" fill={P.terracotta} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
          <rect x={42} y={72} width={66} height={46} fill={P.white} stroke={ink} strokeWidth={5} />
          <rect x={66} y={88} width={18} height={30} fill={P.amber} stroke={ink} strokeWidth={4} />
        </g>
      ) : kind === 'image' ? (
        <g transform={`rotate(${Math.sin(f / 5) * 8} 75 75)`}>
          <path d="M75 22 l11 30 32 2 -25 20 9 31 -27 -18 -27 18 9 -31 -25 -20 32 -2z" fill={P.amber} stroke={ink} strokeWidth={5} strokeLinejoin="round" />
          <circle cx={66} cy={70} r={5} fill={ink} />
          <circle cx={84} cy={70} r={5} fill={ink} />
          <path d="M64 84 q11 10 22 0" stroke={ink} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <path d="M28 112 C50 90 60 110 80 84 S112 60 122 40" fill="none" stroke={ink} strokeWidth={4} strokeDasharray="8 10" />
          {[
            [40, 104],
            [68, 96],
            [92, 74],
            [112, 52],
          ].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx={8} ry={12} fill={P.terracotta} transform={`rotate(${30 + i * 8} ${x} ${y})`} opacity={clamp01(((f / 6) % 5) - i)} />
          ))}
        </g>
      )}
    </svg>
  );
};

/* ---------------- popping counter grid ---------------- */
export const ObjectRain: React.FC<{at: number; cols?: number; rows?: number; size?: number}> = ({at, cols = 9, rows = 7, size = 92}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: 10}}>
      {new Array(cols * rows).fill(0).map((_, i) => {
        const d = at + rand(i * 3) * 45;
        const p = sp(f, d, BOUNCE);
        return (
          <div key={i} style={{transform: `scale(${p}) rotate(${(1 - p) * 40}deg)`, opacity: clamp01((f - d) / 2)}}>
            <ObjectIcon i={i} size={size} />
          </div>
        );
      })}
    </div>
  );
};

export const useProgress = (at: number, len: number) => ease(useCurrentFrame(), at, at + len);
