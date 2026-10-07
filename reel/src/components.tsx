import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {BOUNCE, POP, clamp01, ease, rand, sp, squash} from './anim';
import {LOGO_GLYPHS} from './logoData';
import {C, FONT} from './theme';
import {beatPulse} from './timing';

/* ------------------------------------------------------------------ */
/* Background: warm ink, drifting light orbs, sweeping arcs, grain.    */
/* ------------------------------------------------------------------ */
export const Background: React.FC<{accent?: string}> = ({accent = C.amber}) => {
  const f = useCurrentFrame();
  const pulse = beatPulse(f);
  const o1x = 540 + Math.sin(f / 70) * 260;
  const o1y = 560 + Math.cos(f / 90) * 180;
  const o2x = 520 + Math.cos(f / 80) * 300;
  const o2y = 1380 + Math.sin(f / 60) * 160;
  const arc = (f * 0.9) % 360;
  return (
    <AbsoluteFill style={{backgroundColor: C.ink, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${o1x}px ${o1y}px, ${accent}38 0px, transparent 520px),
            radial-gradient(circle at ${o2x}px ${o2y}px, ${C.rust}40 0px, transparent 600px),
            radial-gradient(ellipse at 50% 40%, ${C.ink2} 0%, ${C.ink} 70%)`,
          opacity: 0.85 + pulse * 0.15,
        }}
      />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.55}}>
        <defs>
          <linearGradient id="arcg" x1="0" x2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0" />
            <stop offset="0.5" stopColor={accent} stopOpacity="0.55" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        <g transform={`rotate(${arc} 540 960)`}>
          <circle cx={540} cy={960} r={760} fill="none" stroke="url(#arcg)" strokeWidth={2} strokeDasharray="700 4000" />
        </g>
        <g transform={`rotate(${-arc * 0.7 + 120} 540 960)`}>
          <circle cx={540} cy={960} r={980} fill="none" stroke="url(#arcg)" strokeWidth={1.5} strokeDasharray="500 6000" />
        </g>
      </svg>
      {/* film grain */}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: 0.07, mixBlendMode: 'overlay'}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 12} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.65) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Sparkles (four-point stars, SaaS-style secondary action).           */
/* ------------------------------------------------------------------ */
export const Star: React.FC<{size?: number; color?: string; style?: React.CSSProperties}> = ({size = 40, color = C.amber, style}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={style}>
    <path d="M0,-50 C6,-10 10,-6 50,0 C10,6 6,10 0,50 C-6,10 -10,6 -50,0 C-10,-6 -6,-10 0,-50Z" fill={color} />
  </svg>
);

export const Sparkle: React.FC<{x: number; y: number; delay: number; size?: number; color?: string; life?: number}> = ({
  x,
  y,
  delay,
  size = 44,
  color = C.amber,
  life = 40,
}) => {
  const f = useCurrentFrame();
  const t = f - delay;
  if (t < 0 || t > life) return null;
  const grow = sp(f, delay, BOUNCE);
  const fade = interpolate(t, [life * 0.55, life], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Star
      size={size}
      color={color}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        transform: `scale(${grow * fade}) rotate(${t * 4}deg)`,
        filter: `drop-shadow(0 0 ${size / 3}px ${color})`,
      }}
    />
  );
};

/** Radial burst of sparkles + ring shockwave. */
export const Burst: React.FC<{x: number; y: number; delay: number; count?: number; radius?: number; color?: string}> = ({
  x,
  y,
  delay,
  count = 8,
  radius = 220,
  color = C.amber,
}) => {
  const f = useCurrentFrame();
  const t = f - delay;
  if (t < 0 || t > 34) return null;
  const p = ease(f, delay, delay + 22);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - radius,
          top: y - radius,
          width: radius * 2,
          height: radius * 2,
          borderRadius: '50%',
          border: `${6 * (1 - p) + 1}px solid ${color}`,
          transform: `scale(${0.2 + p * 0.9})`,
          opacity: 1 - p,
        }}
      />
      {new Array(count).fill(0).map((_, i) => {
        const a = (i / count) * Math.PI * 2 + rand(i + delay) * 0.5;
        const r = radius * (0.35 + p * (0.75 + rand(i * 3 + delay) * 0.4));
        const sz = 18 + rand(i * 7 + delay) * 26;
        return (
          <Star
            key={i}
            size={sz}
            color={i % 3 === 0 ? C.cream : color}
            style={{
              position: 'absolute',
              left: x + Math.cos(a) * r - sz / 2,
              top: y + Math.sin(a) * r - sz / 2,
              transform: `scale(${(1 - p) * 1.2}) rotate(${t * 8}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Kinetic typography                                                   */
/* ------------------------------------------------------------------ */
type Word = string | {t: string; em?: boolean; color?: string};

/**
 * Words rise in one after another with blur→sharp, overshoot and a little rotation
 * (overlapping action). `em` words switch to italic Playfair in amber.
 */
export const Words: React.FC<{
  words: Word[];
  delay?: number;
  stagger?: number;
  size?: number;
  weight?: number;
  color?: string;
  align?: 'center' | 'left';
  lineHeight?: number;
  style?: React.CSSProperties;
  emColor?: string;
}> = ({words, delay = 0, stagger = 3, size = 84, weight = 800, color = C.cream, align = 'center', lineHeight = 1.08, style, emColor = C.amber}) => {
  const f = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: FONT.sans,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        color,
        letterSpacing: '-0.035em',
        textAlign: align,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        columnGap: size * 0.26,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const word = typeof w === 'string' ? {t: w} : w;
        if (word.t === '\n') return <div key={i} style={{flexBasis: '100%', height: 0}} />;
        const p = sp(f, delay + i * stagger, POP);
        const blur = (1 - clamp01(p)) * 14;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `translateY(${(1 - p) * size * 0.7}px) rotate(${(1 - p) * 6}deg) scale(${0.85 + p * 0.15})`,
              opacity: clamp01(p * 1.6),
              filter: `blur(${blur}px)`,
              fontFamily: word.em ? FONT.serif : undefined,
              fontStyle: word.em ? 'italic' : undefined,
              fontWeight: word.em ? 900 : undefined,
              letterSpacing: word.em ? '-0.01em' : undefined,
              color: word.color ?? (word.em ? emColor : undefined),
              textShadow: word.em ? `0 0 40px ${emColor}55` : undefined,
            }}
          >
            {word.t}
          </span>
        );
      })}
    </div>
  );
};

export const Kicker: React.FC<{text: string; delay?: number; color?: string; style?: React.CSSProperties}> = ({
  text,
  delay = 0,
  color = C.amber,
  style,
}) => {
  const f = useCurrentFrame();
  const n = Math.floor(ease(f, delay, delay + 18) * text.length);
  const p = sp(f, delay);
  return (
    <div
      style={{
        fontFamily: FONT.mono,
        fontWeight: 500,
        fontSize: 26,
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        opacity: clamp01(p * 2),
        ...style,
      }}
    >
      <span style={{width: 44 * p, height: 2, background: color, display: 'inline-block'}} />
      <span>
        {text.slice(0, n)}
        <span style={{opacity: n < text.length ? 1 : 0}}>_</span>
      </span>
      <span style={{width: 44 * p, height: 2, background: color, display: 'inline-block'}} />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* SketchRoot wordmark: letters drop in with squash & stretch,          */
/* the two o's are eyes that blink and look around.                    */
/* ------------------------------------------------------------------ */
const GLYPH_X = [97, 235, 329, 414, 463, 596, 637, 744, 835, 936, 981, 948, 980, 980, 980];

export const Logo: React.FC<{delay?: number; width?: number; stagger?: number; still?: boolean; ink?: string}> = ({
  delay = 0,
  width = 900,
  stagger = 3,
  still = false,
  ink = '#ffffff',
}) => {
  const f = useCurrentFrame();
  const h = (width / 1080) * 390.858;
  const t = f - delay;
  // eye behaviour: look left -> right -> camera, blink twice
  const look = still ? 0 : interpolate(t, [40, 52, 70, 82, 100], [0, -5, -5, 5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lookY = still ? 0 : interpolate(t, [70, 82, 100], [0, -2, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const blinkAt = [58, 112, 170];
  const blink = blinkAt.reduce((acc, b) => {
    const d = Math.abs(t - b);
    return d < 4 ? Math.min(acc, d / 4) : acc;
  }, 1);
  return (
    <svg width={width} height={h} viewBox="0 0 1080 390.858" style={{overflow: 'visible'}}>
      {LOGO_GLYPHS.map((g, i) => {
        const isSparkle = i >= 10;
        const d = delay + (isSparkle ? 10 * stagger + 6 + (i - 10) * 2 : i * stagger);
        const {p, sx, sy} = still ? {p: 1, sx: 1, sy: 1} : squash(f, d, BOUNCE, 5);
        const fall = (1 - p) * -420;
        const cx = GLYPH_X[i];
        const baseY = 250;
        const op = still ? 1 : clamp01((f - d) / 3);
        return (
          <g
            key={i}
            opacity={op}
            transform={`translate(0 ${fall}) translate(${cx} ${baseY}) scale(${sx} ${sy}) translate(${-cx} ${-baseY})${
              isSparkle ? ` rotate(${(f - d) * 3} 981 266)` : ''
            }`}
          >
            {g.paths.map((pth, k) => (
              <path key={k} transform={pth.t} fill={pth.f === '#ffffff' ? ink : pth.f} d={pth.d} />
            ))}
            {g.eye && g.ellipse.length > 0
              ? (() => {
                  const [ex, ey] = g.ellipse[0].map(Number);
                  return (
                    <g transform={`translate(${ex} ${ey}) scale(1 ${Math.max(0.08, blink)}) translate(${-ex} ${-ey})`}>
                      <ellipse cx={ex} cy={ey} rx={15.5} ry={16.5} fill="#f6f1e7" />
                      <circle cx={ex + look} cy={ey + lookY} r={7.5} fill="#191919" />
                    </g>
                  );
                })()
              : null}
          </g>
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Small building blocks                                                */
/* ------------------------------------------------------------------ */
export const Pill: React.FC<{children: React.ReactNode; style?: React.CSSProperties; accent?: string}> = ({children, style, accent = C.amber}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      padding: '18px 30px',
      borderRadius: 999,
      background: 'rgba(29,26,23,0.85)',
      border: `2px solid ${accent}55`,
      boxShadow: `0 10px 40px rgba(0,0,0,0.45), inset 0 0 30px ${accent}12`,
      color: C.cream,
      fontFamily: FONT.sans,
      fontWeight: 600,
      fontSize: 36,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Check: React.FC<{size?: number; progress?: number; color?: string}> = ({size = 44, progress = 1, color = C.amber}) => (
  <svg width={size} height={size} viewBox="0 0 44 44">
    <circle cx={22} cy={22} r={20} fill={color} opacity={0.18 + 0.82 * progress} />
    <path
      d="M12 23 L19 30 L33 15"
      fill="none"
      stroke={C.ink}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={40}
      strokeDashoffset={40 * (1 - progress)}
    />
  </svg>
);

/** Screen-wide light sweep used on cuts (pattern interrupt on every phrase downbeat). */
export const CutFlash: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < -2 || t > 10) return null;
  const o = interpolate(t, [-2, 0, 10], [0, 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x = interpolate(t, [-2, 10], [-600, 1400]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
      <AbsoluteFill style={{background: C.amber, opacity: o * 0.25}} />
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: x,
          width: 380,
          height: 2400,
          transform: 'rotate(18deg)',
          background: `linear-gradient(90deg, transparent, ${C.cream}, transparent)`,
          opacity: o,
          filter: 'blur(20px)',
        }}
      />
    </AbsoluteFill>
  );
};
