/**
 * "Vox-style" 2D-in-3D kit: paper ground, cut-out collage cards with tape and halftone,
 * highlighter swipes, hand-drawn circles/arrows, and a perspective camera rig whose
 * layers sit at different depths so a slow push produces real parallax.
 */
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {BOUNCE, GLIDE, POP, clamp01, ease, rand, sp} from '../anim';
import {FONT, P} from '../theme';

/* ---------------- ground ---------------- */
export const PaperGround: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: P.paper, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 30% 20%, ${P.white} 0%, transparent 60%),
            radial-gradient(ellipse at 80% 90%, ${P.paper2} 0%, transparent 55%)`,
        }}
      />
      {/* paper fibres: static noise so the sheet feels physical, plus a 2-step "boil" */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.32, mixBlendMode: 'multiply'}}>
        <filter id="paperfib">
          <feTurbulence type="fractalNoise" baseFrequency="0.75 0.04" numOctaves="3" seed={3 + (Math.floor(f / 6) % 2)} />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.5  0 0 0 0 0.42  0 0 0 0.35 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paperfib)" />
      </svg>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.18, mixBlendMode: 'multiply'}}>
        <filter id="papergrain">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed={f % 8} />
          <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.28  0 0 0 0 0.25  0 0 0 0.6 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#papergrain)" />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 60%, rgba(60,45,30,0.22) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ---------------- camera rig ---------------- */
type Cam = {f: number; x?: number; y?: number; z?: number; rx?: number; ry?: number; rz?: number};

/** Perspective stage. Keys interpolate with smoothstep (slow-in/slow-out). Children use <Depth z>. */
export const Stage: React.FC<{keys: Cam[]; children: React.ReactNode; enter?: number; exitAt?: number}> = ({keys, children, enter = 0, exitAt}) => {
  const f = useCurrentFrame();
  const fr = keys.map((k) => k.f);
  const o = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: (t: number) => t * t * (3 - 2 * t)};
  const g = (key: keyof Omit<Cam, 'f'>) => (keys.length > 1 ? interpolate(f, fr, keys.map((k) => k[key] ?? 0), o) : keys[0][key] ?? 0);
  // fly in from behind the lens, fly out through it (Vox "push-through" cut)
  const inP = sp(f, enter, GLIDE);
  const outP = exitAt === undefined ? 0 : ease(f, exitAt - 9, exitAt, 0, 1, (t) => t * t);
  const z = g('z') + (1 - inP) * -700 + outP * 900;
  return (
    <AbsoluteFill style={{perspective: 1700, perspectiveOrigin: '50% 45%', opacity: clamp01(inP * 3) * (1 - outP * 0.9)}}>
      <AbsoluteFill
        style={{
          transformStyle: 'preserve-3d',
          transform: `translate3d(${-g('x')}px, ${-g('y')}px, ${z}px) rotateX(${g('rx')}deg) rotateY(${g('ry')}deg) rotateZ(${g('rz')}deg)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Depth: React.FC<{z: number; children: React.ReactNode; style?: React.CSSProperties}> = ({z, children, style}) => (
  <AbsoluteFill style={{transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d', ...style}}>{children}</AbsoluteFill>
);

/* ---------------- collage pieces ---------------- */
export const Tape: React.FC<{x: number; y: number; rot?: number; w?: number}> = ({x, y, rot = -6, w = 150}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - 22,
      width: w,
      height: 44,
      background: 'rgba(249,185,48,0.55)',
      transform: `rotate(${rot}deg)`,
      boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
      clipPath: 'polygon(2% 0, 98% 6%, 100% 94%, 0 100%, 3% 50%)',
    }}
  />
);

/** Cut-out card that "drops" onto the table: white border, shadow, tilt, optional tape + halftone. */
export const Cutout: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at: number;
  rot?: number;
  tape?: boolean;
  halftone?: boolean;
  border?: number;
  bg?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x, y, w, h, at, rot = 0, tape = false, halftone = false, border = 12, bg = P.white, children, style}) => {
  const f = useCurrentFrame();
  const p = sp(f, at, BOUNCE);
  // lifts toward camera then settles: overshoot in scale + a little extra rotation (follow-through)
  const lift = Math.sin(clamp01(p) * Math.PI) * 0.06;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: clamp01((f - at) / 3),
        transform: `translateY(${(1 - p) * 140}px) rotate(${rot + (1 - p) * 10}deg) scale(${0.7 + p * 0.3 + lift})`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: bg,
          padding: border,
          boxShadow: '0 22px 45px rgba(50,35,20,0.28), 0 3px 8px rgba(50,35,20,0.18)',
          overflow: 'hidden',
        }}
      >
        <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
          {children}
          {halftone ? <Halftone /> : null}
        </div>
      </div>
      {tape ? <Tape x={w / 2} y={0} rot={rand(x + y) * 8 - 4} /> : null}
    </div>
  );
};

export const Halftone: React.FC<{opacity?: number; size?: number}> = ({opacity = 0.16, size = 7}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage: `radial-gradient(${P.ink} 1.2px, transparent 1.6px)`,
      backgroundSize: `${size}px ${size}px`,
      mixBlendMode: 'multiply',
      opacity,
      pointerEvents: 'none',
    }}
  />
);

/* ---------------- type ---------------- */
type Seg = string | {t: string; hl?: boolean; em?: boolean; color?: string};

/** Headline with Vox-style highlighter swipes behind selected words. */
export const Headline: React.FC<{
  segs: Seg[];
  at?: number;
  size?: number;
  color?: string;
  align?: 'center' | 'left';
  width?: number;
  stagger?: number;
  style?: React.CSSProperties;
}> = ({segs, at = 0, size = 78, color = P.ink, align = 'center', width = 960, stagger = 3, style}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        width,
        margin: align === 'center' ? '0 auto' : undefined,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        columnGap: size * 0.24,
        rowGap: size * 0.08,
        fontFamily: FONT.sans,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.06,
        letterSpacing: '-0.035em',
        color,
        ...style,
      }}
    >
      {segs.map((sg, i) => {
        const s = typeof sg === 'string' ? {t: sg} : sg;
        if (s.t === '\n') return <div key={i} style={{flexBasis: '100%', height: 0}} />;
        const d = at + i * stagger;
        const p = sp(f, d, POP);
        const hl = s.hl ? ease(f, d + 6, d + 16) : 0;
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              transform: `translateY(${(1 - p) * size * 0.6}px) rotate(${(1 - p) * -5}deg)`,
              opacity: clamp01(p * 1.8),
              fontFamily: s.em ? FONT.serif : undefined,
              fontStyle: s.em ? 'italic' : undefined,
              letterSpacing: s.em ? '-0.01em' : undefined,
              color: s.color ?? (s.em ? P.terracotta : undefined),
              padding: s.hl ? '0 8px' : undefined,
            }}
          >
            {s.hl ? (
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: size * 0.06,
                  height: size * 0.5,
                  width: `${hl * 100}%`,
                  background: P.amber,
                  zIndex: -1,
                  transform: 'rotate(-1.2deg) skewX(-8deg)',
                  borderRadius: 6,
                  opacity: 0.95,
                }}
              />
            ) : null}
            <span style={{position: 'relative'}}>{s.t}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Handwritten margin note (Caveat), written on left-to-right. */
export const Note: React.FC<{text: string; at: number; size?: number; color?: string; rot?: number; style?: React.CSSProperties}> = ({
  text,
  at,
  size = 54,
  color = P.ink,
  rot = -3,
  style,
}) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + Math.max(8, text.length * 0.9), 0, 1, (t) => t);
  return (
    <div
      style={{
        fontFamily: FONT.hand,
        fontWeight: 700,
        fontSize: size,
        color,
        lineHeight: 1.05,
        transform: `rotate(${rot}deg)`,
        clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Typewriter kicker in mono caps, Vox "dateline" style. */
export const Dateline: React.FC<{text: string; at: number; color?: string; style?: React.CSSProperties}> = ({text, at, color = P.terracotta, style}) => {
  const f = useCurrentFrame();
  const n = Math.floor(ease(f, at, at + text.length * 0.8, 0, 1, (t) => t) * text.length);
  return (
    <div
      style={{
        fontFamily: FONT.mono,
        fontWeight: 500,
        fontSize: 30,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color,
        opacity: f >= at ? 1 : 0,
        ...style,
      }}
    >
      <span style={{background: color, color: P.white, padding: '4px 12px', marginRight: 14}}>■</span>
      {text.slice(0, n)}
    </div>
  );
};

/* ---------------- hand-drawn marks ---------------- */
/** Rough double-loop ellipse, drawn on like a marker. */
export const Scribble: React.FC<{cx: number; cy: number; rx: number; ry: number; at: number; color?: string; width?: number; seed?: number}> = ({
  cx,
  cy,
  rx,
  ry,
  at,
  color = P.terracotta,
  width = 7,
  seed = 1,
}) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 14, 0, 1, (t) => 1 - (1 - t) * (1 - t));
  const pts: string[] = [];
  const turns = 1.15;
  const N = 60;
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2 * turns - 1.9;
    const j = 1 + (rand(seed * 31 + i) - 0.5) * 0.05 + (i / N) * 0.06;
    pts.push(`${(cx + Math.cos(a) * rx * j).toFixed(1)},${(cy + Math.sin(a) * ry * j).toFixed(1)}`);
  }
  const len = Math.PI * (rx + ry) * turns * 1.1;
  return (
    <svg style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}} width={1080} height={1920}>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
        opacity={f >= at ? 0.92 : 0}
      />
    </svg>
  );
};

/** Hand-drawn curved arrow from (x1,y1) to (x2,y2). */
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; at: number; bend?: number; color?: string; width?: number}> = ({
  x1,
  y1,
  x2,
  y2,
  at,
  bend = 0.25,
  color = P.ink,
  width = 6,
}) => {
  const f = useCurrentFrame();
  const p = ease(f, at, at + 12);
  const mx = (x1 + x2) / 2 - (y2 - y1) * bend;
  const my = (y1 + y2) / 2 + (x2 - x1) * bend;
  const d = `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
  const len = Math.hypot(x2 - x1, y2 - y1) * 1.25;
  const ang = Math.atan2(y2 - my, x2 - mx);
  const h = 26;
  const head = `M${x2 - Math.cos(ang - 0.5) * h} ${y2 - Math.sin(ang - 0.5) * h} L${x2} ${y2} L${x2 - Math.cos(ang + 0.5) * h} ${y2 - Math.sin(ang + 0.5) * h}`;
  return (
    <svg style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}} width={1080} height={1920}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} opacity={f >= at ? 1 : 0} />
      <path d={head} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={p > 0.92 ? 1 : 0} />
    </svg>
  );
};

/** Map pin that drops with squash and leaves a pulse ring. */
export const Pin: React.FC<{x: number; y: number; at: number; label?: string; n?: number; color?: string; labelSide?: 'left' | 'right'}> = ({
  x,
  y,
  at,
  label,
  n,
  color = P.terracotta,
  labelSide = 'right',
}) => {
  const f = useCurrentFrame();
  const p = sp(f, at, BOUNCE);
  const v = p - sp(f - 1, at, BOUNCE);
  const st = Math.max(-0.25, Math.min(0.25, v * 3));
  const ring = ease(f, at + 4, at + 30);
  if (f < at) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div
        style={{
          position: 'absolute',
          left: -40,
          top: -12,
          width: 80,
          height: 24,
          borderRadius: '50%',
          border: `3px solid ${color}`,
          transform: `scale(${0.4 + ring * 1.6})`,
          opacity: 1 - ring,
        }}
      />
      <svg
        width={56}
        height={74}
        viewBox="0 0 56 74"
        style={{
          position: 'absolute',
          left: -28,
          top: -74,
          transform: `translateY(${(1 - p) * -220}px) scale(${1 - st * 0.6}, ${1 + st})`,
          transformOrigin: '50% 100%',
          filter: 'drop-shadow(0 6px 6px rgba(0,0,0,0.25))',
        }}
      >
        <path d="M28 2C14 2 3 12.6 3 26c0 18 25 46 25 46s25-28 25-46C53 12.6 42 2 28 2z" fill={color} stroke={P.white} strokeWidth={3} />
        {n !== undefined ? (
          <text x={28} y={35} textAnchor="middle" fontFamily="Inter" fontWeight={900} fontSize={26} fill={P.white}>
            {n}
          </text>
        ) : (
          <circle cx={28} cy={26} r={8} fill={P.white} />
        )}
      </svg>
      {label ? (
        <div
          style={{
            position: 'absolute',
            top: -64,
            left: labelSide === 'right' ? 34 : undefined,
            right: labelSide === 'left' ? 34 : undefined,
            fontFamily: FONT.hand,
            fontWeight: 700,
            fontSize: 50,
            color: P.ink,
            whiteSpace: 'nowrap',
            opacity: ease(f, at + 4, at + 10),
            transform: `rotate(-4deg)`,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** Cut-paper wipe on scene cuts: a torn amber sheet slides across. */
export const PaperWipe: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < -7 || t > 7) return null;
  const x = interpolate(t, [-7, 7], [-1500, 1500], {easing: (v) => v * v * (3 - 2 * v)});
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: -300,
          left: x - 200,
          width: 900,
          height: 2600,
          background: P.amber,
          transform: 'rotate(14deg)',
          boxShadow: '0 0 60px rgba(60,40,10,0.35)',
          clipPath:
            'polygon(6% 0, 100% 0, 96% 8%, 100% 16%, 95% 25%, 100% 34%, 96% 43%, 100% 52%, 95% 61%, 100% 70%, 96% 80%, 100% 90%, 97% 100%, 0 100%, 4% 90%, 0 80%, 5% 70%, 0 60%, 4% 50%, 0 40%, 5% 30%, 0 20%, 4% 10%)',
        }}
      />
    </AbsoluteFill>
  );
};
