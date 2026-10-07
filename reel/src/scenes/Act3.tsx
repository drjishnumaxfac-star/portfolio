import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {BOUNCE, GLIDE, POP, clamp01, ease, rand, shake, sp, squash} from '../anim';
import {Burst, Check, Kicker, Logo, Sparkle, Words} from '../components';
import {C, FONT} from '../theme';

const IG = {bg: '#0c1014', card: '#1c2128', blue: '#4a5df9', text: '#f5f5f5', sub: '#a8a8a8'};
const handle = 'doctorj.in';

/** Fingertip that glides on arcs (slow-in/out) and compresses on each tap. */
const Finger: React.FC<{path: {f: number; x: number; y: number}[]; taps: number[]; from: number; to: number}> = ({path, taps, from, to}) => {
  const f = useCurrentFrame();
  if (f < from || f > to) return null;
  const o = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const, easing: (t: number) => t * t * (3 - 2 * t)};
  const x = interpolate(f, path.map((p) => p.f), path.map((p) => p.x), o);
  const y = interpolate(f, path.map((p) => p.f), path.map((p) => p.y), o);
  const press = taps.reduce((m, t) => (Math.abs(f - t) < 4 ? Math.min(m, 0.78 + 0.22 * (Math.abs(f - t) / 4)) : m), 1);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 40,
        top: y - 40,
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'rgba(245,245,245,0.32)',
        border: '3px solid rgba(245,245,245,0.9)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
        transform: `scale(${press})`,
        opacity: interpolate(f, [from, from + 6, to - 6, to], [0, 1, 1, 0]),
      }}
    />
  );
};

/* ================================================================== */
/* 10. FOLLOW + DM (51.12 – 57.17 s): an Instagram profile mock.        */
/* ================================================================== */
export const Follow: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const phone = sp(f, 0, GLIDE);
  const followTap = 40;
  const following = f >= followTap + 1;
  const fb = squash(f, followTap + 1, BOUNCE, 3);
  const msgTap = 80;
  const dm = ease(f, msgTap + 2, msgTap + 14, 0, 1, (t) => 1 - Math.pow(1 - t, 3));
  const typed = 'EARLY ACCESS';
  const n = Math.floor(ease(f, 100, 124, 0, 1, (t) => t) * typed.length);
  const sendTap = 128;
  const sent = f >= sendTap + 1;
  const reply = f >= 148;
  const out = interpolate(f, [duration - 6, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const floatY = Math.sin(f / 14) * 6;
  // phone geometry on canvas
  const PX = 240;
  const PY = 420;
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: 'absolute', top: 190, width: '100%'}}>
        <Words words={['Follow', {t: '@doctorj.in', em: true}]} size={92} />
      </div>
      <div style={{position: 'absolute', top: 318, width: '100%', display: 'flex', justifyContent: 'center', gap: 16, fontFamily: FONT.sans, fontWeight: 800, fontSize: 32}}>
        {[
          {t: '1  Follow', at: 6, on: following},
          {t: '2  DM “EARLY ACCESS”', at: 12, on: sent},
        ].map((s) => (
          <div
            key={s.t}
            style={{
              padding: '10px 24px',
              borderRadius: 999,
              border: `2px solid ${s.on ? C.amber : 'rgba(243,238,228,0.25)'}`,
              background: s.on ? `${C.amber}22` : 'transparent',
              color: s.on ? C.amber : C.cream,
              transform: `scale(${sp(f, s.at, POP)})`,
            }}
          >
            {s.t}
          </div>
        ))}
      </div>
      {/* phone */}
      <div
        style={{
          position: 'absolute',
          left: PX,
          top: PY + floatY,
          width: 600,
          height: 1100,
          borderRadius: 70,
          background: '#000',
          border: '10px solid #2b2724',
          boxShadow: `0 60px 140px rgba(0,0,0,0.8), 0 0 90px ${C.amber}22`,
          overflow: 'hidden',
          transform: `perspective(1800px) translateY(${(1 - phone) * 900}px) rotateY(${(1 - phone) * -30 + 3}deg)`,
        }}
      >
        {/* profile screen */}
        <div style={{position: 'absolute', inset: 0, background: IG.bg, fontFamily: FONT.sans, color: IG.text, padding: '70px 30px 0'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 36, gap: 10}}>
            {handle} <span style={{fontSize: 22}}>⌄</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 30}}>
            <div style={{width: 150, height: 150, borderRadius: '50%', padding: 6, background: `conic-gradient(from ${f * 4}deg, #f9b930, #e1306c, #833ab4, #f9b930)`, flexShrink: 0}}>
              <Img src={staticFile('img/founder.jpg')} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: `5px solid ${IG.bg}`}} />
            </div>
            <div style={{fontWeight: 800, fontSize: 27, lineHeight: 1.25}}>
              Dr. Jishnu Mohan |<br />
              Maxillofacial Surgeon
            </div>
          </div>
          <div style={{fontSize: 23, lineHeight: 1.45, marginTop: 22}}>
            <div>🥇 AIR 1 AIIMS PhD 🏆 AIR 37 NEET MDS 🎯 AIR 91 INI-CET</div>
            <div>OMFS Surgeon (PGI) | Founder SketchRoot™ 🎨</div>
            <div>Patient referrals: doctorj.in 👇</div>
            <div style={{fontWeight: 700, marginTop: 4}}>🔗 sketchroot.com and 1 more</div>
          </div>
          {/* in place of the follower count: the early-access offer */}
          <div
            style={{
              marginTop: 22,
              padding: '14px 18px',
              borderRadius: 16,
              border: `2px solid ${C.amber}`,
              background: `${C.amber}1a`,
              color: C.amber,
              fontWeight: 800,
              fontSize: 25,
              textAlign: 'center',
              transform: `scale(${following ? 1 + 0.05 * Math.max(0, 1 - (f - followTap) / 12) : 1})`,
            }}
          >
            🎟 Early access · first 5,000 followers
          </div>
          <div style={{display: 'flex', gap: 12, marginTop: 22}}>
            <div
              style={{
                flex: 1,
                height: 66,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 27,
                background: following ? IG.card : IG.blue,
                transform: following ? `scale(${fb.sx}, ${fb.sy})` : undefined,
              }}
            >
              {following ? 'Following ⌄' : 'Follow'}
            </div>
            <div style={{flex: 1, height: 66, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 27, background: IG.card}}>
              Message
            </div>
          </div>
          {/* empty grid placeholder, like a brand-new account */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginTop: 30}}>
            {new Array(6).fill(0).map((_, i) => (
              <div key={i} style={{aspectRatio: '1', background: i === 0 ? `linear-gradient(135deg, ${C.amber}55, ${C.rust}55)` : '#161b21', borderRadius: 4}} />
            ))}
          </div>
        </div>
        {/* DM screen slides over */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: IG.bg,
            transform: `translateX(${(1 - dm) * 100}%)`,
            fontFamily: FONT.sans,
            color: IG.text,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '70px 30px 20px', borderBottom: '1px solid #262a30'}}>
            <span style={{fontSize: 34}}>‹</span>
            <Img src={staticFile('img/founder.jpg')} style={{width: 70, height: 70, borderRadius: '50%', objectFit: 'cover'}} />
            <div>
              <div style={{fontWeight: 800, fontSize: 28}}>Dr. Jishnu Mohan</div>
              <div style={{fontSize: 22, color: IG.sub}}>{handle}</div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 30, right: 30, top: 230, display: 'flex', flexDirection: 'column', gap: 16}}>
            {sent ? (
              <div
                style={{
                  alignSelf: 'flex-end',
                  background: 'linear-gradient(135deg, #6b4dff, #4a5df9)',
                  padding: '18px 26px',
                  borderRadius: 30,
                  fontWeight: 800,
                  fontSize: 30,
                  transform: `scale(${sp(f, sendTap + 1, BOUNCE)})`,
                  transformOrigin: '100% 100%',
                }}
              >
                EARLY ACCESS 🦷
              </div>
            ) : null}
            {reply ? (
              <div
                style={{
                  alignSelf: 'flex-start',
                  maxWidth: 440,
                  background: IG.card,
                  padding: '18px 24px',
                  borderRadius: 30,
                  fontSize: 26,
                  lineHeight: 1.3,
                  transform: `scale(${sp(f, 148, BOUNCE)})`,
                  transformOrigin: '0 100%',
                }}
              >
                Got it 👋 Early-access updates will come right here.
              </div>
            ) : null}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 24,
              right: 24,
              bottom: 40,
              height: 80,
              borderRadius: 40,
              background: IG.card,
              display: 'flex',
              alignItems: 'center',
              padding: '0 28px',
              fontSize: 28,
              color: n && !sent ? IG.text : IG.sub,
            }}
          >
            {n && !sent ? typed.slice(0, n) : 'Message…'}
            {!sent && f > 96 && f % 16 < 8 ? <span style={{color: IG.blue}}>|</span> : null}
            <span style={{marginLeft: 'auto', color: IG.blue, fontWeight: 800}}>Send</span>
          </div>
        </div>
      </div>
      <Finger
        from={24}
        to={sendTap + 12}
        taps={[followTap, msgTap, sendTap]}
        path={[
          {f: 24, x: 900, y: 1500},
          {f: 38, x: PX + 165, y: PY + 640},
          {f: 60, x: PX + 165, y: PY + 640},
          {f: 78, x: PX + 430, y: PY + 640},
          {f: 96, x: PX + 430, y: PY + 640},
          {f: 126, x: PX + 500, y: PY + 1005},
        ]}
      />
      {following ? <Burst x={PX + 165} y={PY + 640} delay={followTap + 1} radius={240} count={10} /> : null}
      {sent ? <Burst x={PX + 420} y={PY + 260} delay={sendTap + 1} radius={200} count={8} /> : null}
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 11. FIRST 5,000 (57.17 – 63.17 s): scarcity + a golden pass.        */
/* ================================================================== */
export const Spots: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const out = interpolate(f, [duration - 6, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const num = Math.round(ease(f, 4, 40, 0, 1, (t) => 1 - Math.pow(1 - t, 3)) * 5000);
  const pass = squash(f, 30, BOUNCE, 3);
  const tilt = Math.sin(f / 18) * 8;
  const shine = ((f * 14) % 1600) - 400;
  const sh = shake(f, 30, 16);
  // the pass number spins like a slot machine, then lands on blanks: "this one could be yours"
  const spin = f < 90 ? String(Math.floor(rand(Math.floor(f / 2)) * 4999) + 1).padStart(4, '0') : '____';
  return (
    <AbsoluteFill style={{opacity: out, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      <div style={{position: 'absolute', top: 200, width: '100%'}}>
        <Kicker text="limited early access" delay={0} />
      </div>
      <div style={{position: 'absolute', top: 270, width: '100%', textAlign: 'center', fontFamily: FONT.sans, color: C.cream}}>
        <div style={{fontWeight: 800, fontSize: 56}}>Only the first</div>
        <div
          style={{
            fontWeight: 900,
            fontSize: 250,
            lineHeight: 0.95,
            letterSpacing: '-0.06em',
            background: `linear-gradient(180deg, #ffe08a, ${C.amber} 50%, ${C.amberDeep})`,
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            filter: `drop-shadow(0 16px 40px ${C.amber}55)`,
          }}
        >
          {num.toLocaleString('en-US')}
        </div>
        <div style={{fontWeight: 800, fontSize: 64}}>
          followers get <span style={{fontFamily: FONT.serif, fontStyle: 'italic', color: C.amber}}>early access.</span>
        </div>
      </div>
      {/* fanned passes behind (depth) */}
      {[-2, -1, 1, 2].map((k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            left: 540 - 380 + k * 40,
            top: 900 + Math.abs(k) * 14,
            width: 760,
            height: 400,
            borderRadius: 34,
            background: '#3a2d16',
            border: `2px solid ${C.amber}55`,
            transform: `rotate(${k * 6}deg) scale(${pass.p * 0.95})`,
            opacity: 0.55,
          }}
        />
      ))}
      {/* the golden pass */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 380,
          top: 890,
          width: 760,
          height: 420,
          borderRadius: 34,
          overflow: 'hidden',
          background: `linear-gradient(135deg, #ffe08a, ${C.amber} 45%, ${C.amberDeep})`,
          boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 80px ${C.amber}55`,
          transform: `perspective(1400px) rotateY(${tilt}deg) rotateX(${-tilt / 3}deg) scale(${pass.p * pass.sx}, ${pass.p * pass.sy})`,
          color: C.ink,
          fontFamily: FONT.sans,
        }}
      >
        <div style={{position: 'absolute', left: shine, top: -100, width: 160, height: 700, transform: 'rotate(20deg)', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)'}} />
        <div style={{position: 'absolute', left: 560, top: 0, bottom: 0, borderLeft: `4px dashed ${C.ink}55`}} />
        <div style={{position: 'absolute', left: 40, top: 34, fontFamily: FONT.mono, fontSize: 24, letterSpacing: '0.2em'}}>SKETCHROOT · EARLY ACCESS</div>
        <div style={{position: 'absolute', left: 36, top: 80, padding: '6px 18px 0', borderRadius: 18, background: '#15120f'}}>
          <Logo width={430} still />
        </div>
        <div style={{position: 'absolute', left: 40, top: 270, fontWeight: 900, fontSize: 52}}>PRIORITY PASS</div>
        <div style={{position: 'absolute', left: 40, top: 336, fontFamily: FONT.mono, fontSize: 26}}>DENTAL STUDENTS & ASPIRANTS</div>
        <div style={{position: 'absolute', left: 580, top: 60, width: 160, textAlign: 'center'}}>
          <div style={{fontFamily: FONT.mono, fontSize: 22}}>No.</div>
          <div style={{fontWeight: 900, fontSize: 52, letterSpacing: '-0.02em'}}>{spin}</div>
          <div style={{fontFamily: FONT.mono, fontSize: 22}}>/ 5,000</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 800, top: 1300, fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: 56, color: C.amber, transform: 'rotate(-6deg)', opacity: ease(f, 92, 100)}}>
        ← yours?
      </div>
      <div style={{position: 'absolute', top: 1420, width: '100%'}}>
        {f >= 110 ? <Words words={["Don't", 'scroll', 'past', 'your', {t: 'spot.', em: true}]} delay={110} size={70} /> : null}
      </div>
      <Sparkle x={150} y={900} delay={34} size={54} />
      <Sparkle x={940} y={1290} delay={44} size={44} color={C.cream} />
      <Sparkle x={930} y={420} delay={20} size={40} />
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* 12. ATTENTION + CTA (63.17 s – end)                                 */
/* ================================================================== */
const STEPS3 = [
  {t: 'Follow @doctorj.in', at: 64},
  {t: 'DM “EARLY ACCESS”', at: 80},
  {t: 'Get verified → priority access', at: 96},
];

export const Verify: React.FC<{duration: number}> = ({duration}) => {
  const f = useCurrentFrame();
  const card = squash(f, 0, BOUNCE, 3);
  const sh = shake(f, 2, 22);
  const fade = interpolate(f, [duration - 18, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const stripe = `repeating-linear-gradient(-45deg, ${C.amber} 0 26px, ${C.ink} 26px 52px)`;
  return (
    <AbsoluteFill style={{opacity: fade, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
      {/* hazard-striped notice */}
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: 200,
          padding: 14,
          borderRadius: 34,
          background: stripe,
          backgroundPosition: `${f * 2}px 0`,
          transform: `scale(${card.p * card.sx}, ${card.p * card.sy})`,
          boxShadow: `0 30px 80px rgba(0,0,0,0.6)`,
        }}
      >
        <div style={{borderRadius: 24, background: '#15120f', padding: '30px 36px', fontFamily: FONT.sans, color: C.cream}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, fontWeight: 900, fontSize: 64, color: C.amber, letterSpacing: '0.02em'}}>
            <svg width={66} height={60} viewBox="0 0 66 60">
              <path d="M33 3 L63 57 H3 Z" fill={C.amber} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
              <rect x={30} y={20} width={6} height={22} rx={3} fill={C.ink} />
              <circle cx={33} cy={49} r={3.6} fill={C.ink} />
            </svg>
            ATTENTION
          </div>
          <div style={{fontWeight: 800, fontSize: 46, lineHeight: 1.15, marginTop: 18}}>Every profile is verified before early access.</div>
          <div style={{fontWeight: 600, fontSize: 38, lineHeight: 1.25, marginTop: 14, color: C.dim}}>
            Benefits go to <span style={{color: C.amber, fontWeight: 900}}>dental students & aspirants</span> on priority.
          </div>
        </div>
      </div>
      {/* the 3-step funnel */}
      <div style={{position: 'absolute', left: 90, right: 90, top: 780, display: 'flex', flexDirection: 'column', gap: 22}}>
        {STEPS3.map((s, i) => {
          const p = sp(f, s.at, POP);
          const tick = ease(f, s.at + 6, s.at + 16);
          return (
            <div
              key={s.t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                padding: '24px 30px',
                borderRadius: 28,
                background: 'rgba(29,26,23,0.92)',
                border: `3px solid ${tick > 0.5 ? C.amber : 'rgba(243,238,228,0.12)'}`,
                transform: `translateX(${(1 - p) * (i % 2 ? 400 : -400)}px)`,
                opacity: clamp01(p * 2),
                fontFamily: FONT.sans,
                fontWeight: 800,
                fontSize: 44,
                color: C.cream,
              }}
            >
              <div style={{fontWeight: 900, fontSize: 56, color: C.amber, width: 50}}>{i + 1}</div>
              <div style={{flex: 1}}>{s.t}</div>
              <Check size={52} progress={tick} />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 230, top: 1290, opacity: ease(f, 112, 120)}}>
        <Logo delay={112} width={620} stagger={2} />
      </div>
      <div style={{position: 'absolute', top: 1520, width: '100%', textAlign: 'center', fontFamily: FONT.sans, opacity: ease(f, 128, 140)}}>
        <div style={{fontSize: 34, color: C.cream, fontWeight: 700}}>
          sketchroot.com <span style={{color: C.dim}}>·</span> Patient referrals → <span style={{color: C.terracotta, fontWeight: 900}}>doctorj.in</span>
        </div>
      </div>
      <Sparkle x={120} y={760} delay={66} size={46} />
      <Sparkle x={960} y={1180} delay={98} size={40} color={C.cream} />
    </AbsoluteFill>
  );
};
