import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {BOUNCE, POP, clamp01, ease, rand, shake, sp} from '../anim';
import {Logo} from '../components';
import {FONT, P} from '../theme';
import {AegeanMap, BanquetHall, Brain, Bust, CEOS_ON_MAP, House, HOUSE_SPOTS, ObjectRain, SeatingPlan, StepIcon} from './illustrations';
import {Arrow, Cutout, Dateline, Depth, Headline, Note, Pin, Scribble, Stage} from './vox';

type S = React.FC<{duration: number}>;
const abs = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', top, left: 0, right: 0, ...extra});
const count = (f: number, a: number, b: number, to: number) => Math.round(ease(f, a, b, 0, 1, (t) => 1 - Math.pow(1 - t, 3)) * to);

/* 00 · HOOK ---------------------------------------------------------- */
const LIST = ['Pharmacology', 'β-blockers', 'Class II', 'Propranolol', 'Metoprolol', 'Atenolol'];
export const Hook: S = ({duration}) => {
  const f = useCurrentFrame();
  const swap = 44;
  const padOut = ease(f, swap - 4, swap + 6, 0, 1, (t) => t * t);
  return (
    <Stage keys={[{f: 0, z: 0}, {f: duration, z: 140}]} exitAt={duration}>
      <Depth z={60}>
        <div style={abs(250)}>
          <Headline segs={['Your', 'brain', 'forgets', {t: 'lists.', em: true}]} at={0} size={96} stagger={2} />
        </div>
      </Depth>
      <Depth z={0}>
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${padOut * -1300}px) rotate(${padOut * -14}deg)`}}>
          <Cutout x={200} y={480} w={680} h={720} at={0} rot={-3} tape bg="#fffdf6">
            <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(transparent 0 78px, #b9cbd6 78px 81px)', top: 30}} />
            <div style={{position: 'absolute', left: 60, top: 0, bottom: 0, width: 3, background: '#e7a3a3'}} />
            {LIST.map((w, i) => {
              const d = 10 + i * 4;
              const fall = clamp01((f - d) / 22);
              return (
                <div
                  key={w}
                  style={{
                    position: 'absolute',
                    left: 90,
                    top: 40 + i * 81,
                    fontFamily: FONT.hand,
                    fontWeight: 700,
                    fontSize: 64,
                    color: P.ink,
                    transform: `translate(${fall * (rand(i) - 0.3) * 200}px, ${fall * fall * 900}px) rotate(${fall * (rand(i + 3) - 0.5) * 120}deg)`,
                    opacity: 1 - fall * 0.6,
                  }}
                >
                  {i + 1}. {w}
                </div>
              );
            })}
          </Cutout>
        </div>
        {f >= swap ? (
          <div style={{position: 'absolute', left: 110, top: 470, transform: `scale(${sp(f, swap, BOUNCE)})`, transformOrigin: '50% 80%'}}>
            <House w={860} glow={ease(f, swap + 6, swap + 20)} />
          </div>
        ) : null}
      </Depth>
      <Depth z={90}>
        <div style={abs(1340)}>{f >= swap + 2 ? <Headline segs={['It', 'never', 'forgets', {t: 'places.', hl: true}]} at={swap + 2} size={96} stagger={2} /> : null}</div>
      </Depth>
    </Stage>
  );
};

/* 01 · YOUR HOME ------------------------------------------------------ */
export const Home: S = ({duration}) => {
  const f = useCurrentFrame();
  const hx = 110;
  const hy = 470;
  const pts: [number, number, string, number, 'left' | 'right'][] = [
    [HOUSE_SPOTS.door[0], HOUSE_SPOTS.door[1], 'front door', 26, 'right'],
    [HOUSE_SPOTS.sofa[0], HOUSE_SPOTS.sofa[1], 'sofa', 54, 'right'],
    [HOUSE_SPOTS.kitchen[0], HOUSE_SPOTS.kitchen[1], 'kitchen', 82, 'right'],
    [HOUSE_SPOTS.bed[0], HOUSE_SPOTS.bed[1], 'bed', 110, 'right'],
  ];
  const route = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${hx + x} ${hy + y - 40}`).join(' ');
  const draw = ease(f, 30, 125);
  return (
    <Stage keys={[{f: 0, z: 0, ry: 0}, {f: duration, z: 170, ry: -5, y: 40}]} exitAt={duration}>
      <Depth z={50}>
        <div style={abs(230)}>
          <Headline segs={['Picture', 'your', {t: 'home.', hl: true}]} at={0} size={100} />
        </div>
      </Depth>
      <Depth z={0}>
        <div style={{position: 'absolute', left: hx, top: hy}}>
          <House w={860} />
        </div>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <path d={route} fill="none" stroke={P.ink} strokeWidth={7} strokeDasharray="4 16" strokeLinecap="round" opacity={0.9} style={{clipPath: `inset(0 ${100 - draw * 100}% 0 0)`}} />
        </svg>
      </Depth>
      <Depth z={40}>
        {pts.map(([x, y, label, at, side], i) => (
          <Pin key={label} x={hx + x} y={hy + y - 30} at={at} n={i + 1} label={label} labelSide={side} />
        ))}
      </Depth>
      <Depth z={80}>
        <div style={abs(1330)}>{f >= 128 ? <Headline segs={['You', 'can', 'walk', 'it', '\n', {t: 'with your eyes closed.', em: true}]} at={128} size={66} stagger={2} /> : null}</div>
      </Depth>
    </Stage>
  );
};

/* 02 · GREECE, 500 BC --------------------------------------------------- */
export const Greece: S = ({duration}) => {
  const f = useCurrentFrame();
  const hallAt = 70;
  const collapse = ease(f, 122, 146, 0, 1, (t) => t * t);
  const sh = shake(f, 140, 26);
  const mapOut = ease(f, hallAt - 8, hallAt + 4);
  const sc = 796 / 820;
  return (
    <Stage keys={[{f: 0, z: 0}, {f: 70, z: 60}, {f: duration, z: 120, ry: 3}]} exitAt={duration}>
      <div style={{position: 'absolute', inset: 0, transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        <Depth z={40}>
          <div style={abs(215, {paddingLeft: 70})}>
            <Dateline text="c. 500 BC · Ceos, Greece" at={0} />
          </div>
          <div style={abs(290)}>
            <Headline segs={['The', 'poet', {t: 'Simonides', em: true}, '\n', 'is', 'at', 'a', 'banquet.']} at={6} size={74} stagger={2} />
          </div>
        </Depth>
        <Depth z={0}>
          <div style={{position: 'absolute', inset: 0, transform: `translate(${mapOut * 520}px, ${mapOut * -260}px) scale(${1 - mapOut * 0.6})`, transformOrigin: '540px 800px', opacity: 1 - mapOut * 0.15}}>
            <Cutout x={130} y={540} w={820} h={584} at={4} rot={-2} tape halftone>
              <AegeanMap w={796} />
            </Cutout>
            <Pin x={130 + 12 + CEOS_ON_MAP[0] * sc} y={540 + 12 + CEOS_ON_MAP[1] * sc} at={22} label="Ceos" />
          </div>
          {f >= hallAt ? (
            <Cutout x={90} y={600} w={900} h={664} at={hallAt} rot={1.5} bg="#f6efe2">
              <div style={{position: 'absolute', left: 0, top: 10}}>
                <BanquetHall w={876} collapse={collapse} />
              </div>
            </Cutout>
          ) : null}
        </Depth>
        <Depth z={80}>
          <div style={abs(1320)}>
            {f >= 96 ? <Headline segs={['He', 'steps', 'outside.', '\n', 'The', 'roof', {t: 'collapses.', em: true}]} at={96} size={70} stagger={3} /> : null}
          </div>
        </Depth>
      </div>
    </Stage>
  );
};

/* 03 · WHERE THEY SAT ---------------------------------------------------- */
export const Seats: S = ({duration}) => {
  const f = useCurrentFrame();
  const lit = Math.floor(ease(f, 40, 118, 0, 8.99, (t) => t));
  return (
    <Stage keys={[{f: 0, z: 0, rx: 0}, {f: 50, z: 0, rx: 0}, {f: duration, z: -40, rx: 26, y: -60}]} exitAt={duration}>
      <Depth z={60}>
        <div style={abs(225)}>
          <Headline segs={['No', 'guest', 'can', 'be', '\n', {t: 'recognised.', em: true}]} at={0} size={84} stagger={2} />
        </div>
      </Depth>
      <Depth z={0}>
        <Cutout x={90} y={540} w={900} h={600} at={2} rot={-1} border={0} bg="transparent">
          <SeatingPlan lit={lit} />
        </Cutout>
      </Depth>
      <Depth z={70}>
        <div style={{position: 'absolute', left: 120, top: 1175}}>
          <Note text="…so he walks the room in his mind" at={36} size={56} color={P.terracotta} />
        </div>
        <div style={abs(1300)}>
          {f >= 112 ? <Headline segs={['He', 'names', 'every', 'one', '—', '\n', 'by', {t: 'where they sat.', hl: true}]} at={112} size={74} stagger={2} /> : null}
        </div>
      </Depth>
    </Stage>
  );
};

/* 04 · THE METHOD OF LOCI ----------------------------------------------- */
export const Method: S = ({duration}) => {
  const f = useCurrentFrame();
  return (
    <Stage keys={[{f: 0, z: 0}, {f: duration, z: 150, ry: 4}]} exitAt={duration}>
      <Depth z={70}>
        <div style={abs(250)}>
          <Headline segs={['The', 'Method', '\n', 'of', {t: 'Loci', em: true, color: P.ink}]} at={0} size={150} stagger={4} />
        </div>
        <div style={{position: 'absolute', left: 0, top: 0}}>
          <Scribble cx={655} cy={470} rx={175} ry={92} at={20} color={P.amber} width={9} />
        </div>
      </Depth>
      <Depth z={20}>
        <Cutout x={150} y={680} w={780} h={250} at={30} rot={-2} tape bg="#fffaf0">
          <div style={{padding: '24px 34px'}}>
            <div style={{fontFamily: FONT.serif, fontWeight: 800, fontSize: 64, color: P.ink}}>
              lo·cus <span style={{fontFamily: FONT.mono, fontSize: 30, color: P.dim}}>/ˈlō-kəs/ · Latin</span>
            </div>
            <div style={{fontFamily: FONT.sans, fontWeight: 600, fontSize: 40, color: P.ink2, marginTop: 10}}>
              noun: <b style={{color: P.terracotta}}>place</b> · plural: <b style={{color: P.terracotta}}>loci</b>
            </div>
          </div>
        </Cutout>
      </Depth>
      <Depth z={0}>
        <Cutout x={70} y={1000} w={370} h={460} at={78} rot={-3} halftone bg="#ede6d8">
          <div style={{position: 'absolute', left: 0, top: 10}}>
            <Bust w={346} />
          </div>
        </Cutout>
      </Depth>
      <Depth z={50}>
        <div style={{position: 'absolute', left: 480, top: 1030}}>
          {f >= 92 ? (
            <Headline
              segs={['Roman', 'orators', 'like', {t: 'Cicero', em: true}, 'gave', 'long', 'speeches', '\n', {t: 'without notes.', hl: true}]}
              at={92}
              size={54}
              width={540}
              align="left"
              stagger={2}
            />
          ) : null}
        </div>
      </Depth>
    </Stage>
  );
};

/* 05 · BUILT-IN GPS ------------------------------------------------------ */
export const Gps: S = ({duration}) => {
  const f = useCurrentFrame();
  const pulse = (Math.sin(f / 5) + 1) / 2;
  return (
    <Stage keys={[{f: 0, z: 0}, {f: duration, z: 130, ry: -4}]} exitAt={duration}>
      <Depth z={60}>
        <div style={abs(215, {paddingLeft: 70})}>
          <Dateline text="Why it works" at={0} />
        </div>
        <div style={abs(290)}>
          <Headline segs={['Your', 'brain', 'has', 'a', '\n', 'built-in', {t: 'GPS.', hl: true}]} at={4} size={90} stagger={2} />
        </div>
      </Depth>
      <Depth z={0}>
        <div style={{position: 'absolute', left: 160, top: 540, transform: `scale(${sp(f, 8, BOUNCE)})`}}>
          <Brain w={760} pulse={pulse} />
        </div>
      </Depth>
      <Depth z={40}>
        <div style={{position: 'absolute', left: 90, top: 1120}}>
          <Note text="hippocampus" at={44} size={64} color={P.terracotta} />
        </div>
        <Arrow x1={260} y1={1120} x2={560} y2={920} at={50} bend={-0.25} color={P.terracotta} />
        <Cutout x={500} y={1130} w={500} h={300} at={88} rot={3} tape bg="#fffaf0">
          <div style={{padding: '22px 28px', fontFamily: FONT.sans}}>
            <div style={{fontWeight: 900, fontSize: 44, color: P.ink, lineHeight: 1.05}}>Place cells & grid cells</div>
            <div style={{fontWeight: 600, fontSize: 32, color: P.ink2, marginTop: 10}}>map where you are</div>
            <div style={{fontFamily: FONT.mono, fontSize: 24, color: P.terracotta, marginTop: 16, letterSpacing: '0.08em'}}>NOBEL PRIZE · MEDICINE · 2014</div>
          </div>
        </Cutout>
      </Depth>
      <Depth z={80}>
        <div style={abs(1480)}>{f >= 136 ? <Headline segs={['Memory', 'sticks', 'to', {t: 'places.', em: true}]} at={136} size={64} stagger={2} /> : null}</div>
      </Depth>
    </Stage>
  );
};

/* 06 · VISUAL MEMORY ------------------------------------------------------ */
export const Visual: S = ({duration}) => {
  const f = useCurrentFrame();
  const n = count(f, 8, 70, 2500);
  return (
    <Stage keys={[{f: 0, z: 0}, {f: duration, z: 120, rx: 4}]} exitAt={duration}>
      <Depth z={60}>
        <div style={abs(225)}>
          <Headline segs={['And', 'a', {t: 'massive', hl: true}, '\n', 'visual', 'memory.']} at={0} size={90} stagger={2} />
        </div>
      </Depth>
      <Depth z={-40}>
        <div style={{position: 'absolute', left: 64, top: 500}}>
          <ObjectRain at={6} cols={9} rows={6} size={92} />
        </div>
      </Depth>
      <Depth z={50}>
        <Cutout x={90} y={1070} w={900} h={470} at={64} rot={-1.5} tape bg="#fffaf0">
          <div style={{padding: '28px 40px', fontFamily: FONT.sans, color: P.ink}}>
            <div style={{fontFamily: FONT.mono, fontSize: 26, color: P.terracotta, letterSpacing: '0.12em'}}>BRADY ET AL. · PNAS · 2008</div>
            <div style={{fontWeight: 800, fontSize: 50, lineHeight: 1.12, marginTop: 14}}>
              People viewed <span style={{color: P.terracotta}}>{n.toLocaleString('en-US')}</span> objects, once.
            </div>
            <div style={{fontWeight: 600, fontSize: 40, lineHeight: 1.2, marginTop: 16, color: P.ink2}}>Then picked them out of pairs with</div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 6}}>
              <span
                style={{
                  fontWeight: 900,
                  fontSize: 104,
                  letterSpacing: '-0.04em',
                  background: `linear-gradient(transparent 55%, ${P.amber} 55%)`,
                  backgroundSize: `${ease(f, 96, 110) * 100}% 100%`,
                  backgroundRepeat: 'no-repeat',
                  padding: '0 6px',
                  opacity: ease(f, 82, 88),
                }}
              >
                {count(f, 84, 104, 87)}–{count(f, 84, 104, 92)}%
              </span>
              <span style={{fontWeight: 800, fontSize: 44}}>accuracy.</span>
            </div>
          </div>
        </Cutout>
      </Depth>
    </Stage>
  );
};

/* 07 · TRAINED, NOT BORN --------------------------------------------------- */
export const Trained: S = ({duration}) => {
  const f = useCurrentFrame();
  const b1 = sp(f, 48, POP);
  const b2 = sp(f, 88, BOUNCE);
  const H = 520;
  const bar = (v: number, p: number, color: string, label: string, x: number, numAt: number) => (
    <div style={{position: 'absolute', left: x, bottom: 90, width: 230}}>
      <div style={{fontFamily: FONT.sans, fontWeight: 900, fontSize: 80, color: P.ink, textAlign: 'center', letterSpacing: '-0.04em', opacity: ease(f, numAt, numAt + 4)}}>{count(f, numAt, numAt + 18, v)}</div>
      <div style={{height: (v / 72) * H * p, background: color, border: `5px solid ${P.ink}`, borderBottom: 'none', transformOrigin: 'bottom'}} />
      <div style={{position: 'absolute', top: '100%', left: -30, right: -30, textAlign: 'center', fontFamily: FONT.hand, fontWeight: 700, fontSize: 46, color: P.ink, marginTop: 10}}>
        {label}
      </div>
    </div>
  );
  return (
    <Stage keys={[{f: 0, z: 0}, {f: duration, z: 120, ry: 3}]} exitAt={duration}>
      <Depth z={60}>
        <div style={abs(215)}>
          <Headline segs={['Memory', 'champions', '\n', "aren't", {t: 'born.', em: true}]} at={0} size={84} stagger={2} />
        </div>
        <div style={abs(410)}>{f >= 30 ? <Headline segs={["They're", {t: 'trained.', hl: true}]} at={30} size={84} /> : null}</div>
      </Depth>
      <Depth z={0}>
        <Cutout x={110} y={560} w={860} h={760} at={18} rot={1} bg="#fffaf0">
          <div style={{position: 'absolute', left: 40, top: 30, fontFamily: FONT.mono, fontSize: 24, color: P.dim, letterSpacing: '0.1em'}}>WORDS RECALLED (OF 72)</div>
          <div style={{position: 'absolute', left: 40, right: 40, bottom: 90, height: 4, background: P.ink}} />
          {bar(26, b1, P.sea, 'before', 110, 48)}
          {bar(62, b2, P.amber, 'after 40 days', 470, 88)}
          {f >= 104 ? <Arrow x1={360} y1={440} x2={520} y2={250} at={104} bend={-0.3} color={P.terracotta} width={8} /> : null}
          <div style={{position: 'absolute', left: 300, top: 150, opacity: ease(f, 110, 118)}}>
            <Note text="×2.4" at={110} size={80} color={P.terracotta} rot={-8} />
          </div>
        </Cutout>
      </Depth>
      <Depth z={50}>
        <Cutout x={150} y={1360} w={780} h={190} at={124} rot={-2} tape bg="#fffaf0">
          <div style={{padding: '20px 30px', fontFamily: FONT.sans}}>
            <div style={{fontFamily: FONT.mono, fontSize: 24, color: P.terracotta, letterSpacing: '0.1em'}}>DRESLER ET AL. · NEURON · 2017</div>
            <div style={{fontWeight: 800, fontSize: 40, color: P.ink, marginTop: 10}}>40 days of loci training. Gains still there 4 months later.</div>
          </div>
        </Cutout>
      </Depth>
    </Stage>
  );
};

/* 08 · THREE STEPS ------------------------------------------------------- */
const STEPS: {k: 'place' | 'image' | 'walk'; a: string; b: string; at: number}[] = [
  {k: 'place', a: 'Pick a place', b: 'you know well.', at: 8},
  {k: 'image', a: 'Put a vivid, absurd', b: 'image at each spot.', at: 58},
  {k: 'walk', a: 'Walk the route', b: 'to recall it all.', at: 108},
];
export const Steps: S = ({duration}) => {
  const f = useCurrentFrame();
  return (
    <Stage keys={[{f: 0, z: 0, rx: 6}, {f: duration, z: 110, rx: 0, ry: -4}]} exitAt={duration}>
      <Depth z={60}>
        <div style={abs(215, {paddingLeft: 70})}>
          <Dateline text="The method · 3 steps" at={0} />
        </div>
      </Depth>
      {STEPS.map((s, i) => {
        const flip = sp(f, s.at, POP);
        return (
          <Depth key={s.k} z={i * 30}>
            <div style={{position: 'absolute', inset: 0, transform: `rotateX(${(1 - flip) * -80}deg)`, transformOrigin: `540px ${330 + i * 400}px`}}>
              <Cutout x={80} y={310 + i * 400} w={920} h={350} at={s.at} rot={i % 2 ? 1.5 : -1.5} bg="#fffaf0" tape={i === 1}>
                <div style={{display: 'flex', alignItems: 'center', gap: 34, padding: '30px 36px', height: '100%'}}>
                  <div style={{fontFamily: FONT.sans, fontWeight: 900, fontSize: 150, color: P.amber, WebkitTextStroke: `5px ${P.ink}`, lineHeight: 1}}>{i + 1}</div>
                  <StepIcon kind={s.k} size={170} />
                  <div style={{fontFamily: FONT.sans, fontWeight: 900, fontSize: 48, lineHeight: 1.1, color: P.ink, letterSpacing: '-0.02em'}}>
                    {s.a}
                    <br />
                    <span style={{fontWeight: 600, color: P.ink2}}>{s.b}</span>
                  </div>
                </div>
              </Cutout>
            </div>
          </Depth>
        );
      })}
    </Stage>
  );
};

/* 09 · SKETCHROOT DRAWS THE PALACE ------------------------------------------- */
export const Palace: S = ({duration}) => {
  const f = useCurrentFrame();
  const W = 936;
  const imgH = 816;
  const imgW = (2560 / 1116) * imgH;
  const off = -(imgW - W) * 0.45;
  const toAbs = (x: number, y: number) => [60 + 12 + x * (imgH / 558) + off, 500 + 12 + y * (imgH / 558)] as const;
  const basic = toAbs(410, 240);
  const pre = toAbs(600, 170);
  const summit = toAbs(855, 95);
  return (
    <Stage keys={[{f: 0, z: 0, rx: 0}, {f: 40, z: 20, rx: 0}, {f: duration, z: 90, rx: 14, y: -40}]} exitAt={duration}>
      <Depth z={60}>
        <div style={abs(215)}>
          <Headline segs={[{t: 'SketchRoot', color: P.ink}, '\n', {t: 'draws the palace', hl: true}, 'for', 'you.']} at={0} size={82} stagger={3} />
        </div>
      </Depth>
      <Depth z={0}>
        <Cutout x={60} y={500} w={960} h={840} at={6} rot={-1} tape>
          <Img src={staticFile('img/castle-wide.jpg')} style={{position: 'absolute', left: off, top: 0, width: imgW, height: imgH}} />
        </Cutout>
      </Depth>
      <Depth z={30}>
        <Scribble cx={basic[0]} cy={basic[1]} rx={130} ry={95} at={46} seed={2} />
        <Scribble cx={pre[0]} cy={pre[1]} rx={120} ry={85} at={66} seed={5} />
        <Scribble cx={summit[0]} cy={summit[1]} rx={110} ry={80} at={86} color={P.amber} width={10} seed={8} />
      </Depth>
      <Depth z={70}>
        <div style={{position: 'absolute', left: 90, top: 1370}}>
          <Note text="every subject  →  a castle" at={56} size={64} />
        </div>
        <div style={{position: 'absolute', left: 90, top: 1460}}>
          <Note text="every topic  →  a room" at={96} size={64} color={P.terracotta} />
        </div>
      </Depth>
    </Stage>
  );
};

/* 10 · EXAMPLE: RAMU'S KADA ------------------------------------------------- */
export const Example: S = ({duration}) => {
  const f = useCurrentFrame();
  const pan = ease(f, 70, duration, 0, 1, (t) => t * t * (3 - 2 * t));
  const imgH = 576;
  const imgW = (2560 / 784) * imgH;
  const strike = ease(f, 26, 38);
  return (
    <Stage keys={[{f: 0, z: 0}, {f: duration, z: 100, ry: -3}]} exitAt={duration}>
      <Depth z={60}>
        <div style={abs(215, {paddingLeft: 70})}>
          <Dateline text="Example · OMFS" at={0} />
        </div>
        <div style={abs(290, {textAlign: 'center', fontFamily: FONT.sans, fontWeight: 900, fontSize: 82, letterSpacing: '-0.04em', color: P.ink})}>
          <span>Ramu</span>
          <span style={{position: 'relative', color: strike > 0.5 ? P.dim : P.ink}}>
            s Osteotomies
            <span style={{position: 'absolute', left: -4, right: -4, top: '52%', height: 9, background: P.terracotta, transform: `scaleX(${strike}) rotate(-2deg)`, transformOrigin: 'left'}} />
          </span>
        </div>
        <div style={abs(400)}>{f >= 36 ? <Headline segs={['→', {t: "Ramu's Kada", em: true}]} at={36} size={92} /> : null}</div>
        <div style={{position: 'absolute', left: 700, top: 500}}>
          <Note text="(kada = shop)" at={50} size={48} color={P.terracotta} rot={4} />
        </div>
      </Depth>
      <Depth z={0}>
        <Cutout x={60} y={640} w={960} h={600} at={60} rot={1} halftone>
          <Img src={staticFile('img/ramu-wide.jpg')} style={{position: 'absolute', left: -(imgW - 936) * pan, top: 0, width: imgW, height: imgH}} />
        </Cutout>
      </Depth>
      <Depth z={70}>
        <div style={abs(1300)}>{f >= 120 ? <Headline segs={['One', 'shop.', '\n', 'Every', 'fact', 'on', 'a', {t: 'shelf.', hl: true}]} at={120} size={74} stagger={2} /> : null}</div>
      </Depth>
    </Stage>
  );
};

/* 11 · EVERY CHARACTER IS A FACT -------------------------------------------- */
const MAP: [string, string, string][] = [
  ['Hulligan · 1849', 'Hullihen', 'the first orthognathic surgery'],
  ['Blair the liar · 1907', 'Blair', 'straight ramus cut'],
  ['Step by step · 1942', 'Schuchardt', 'step osteotomy'],
  ['Hugo · 1957', 'Obwegeser', 'sagittal split'],
  ['Dal · 1961', 'Dal Pont', 'advance & bend'],
  ['Short straw · 1968/77', 'Hunsuck & Epker', 'short lingual cut'],
];
export const Mapping: S = ({duration}) => {
  const f = useCurrentFrame();
  return (
    <Stage keys={[{f: 0, z: 0, rx: 0}, {f: duration, z: 90, rx: 5}]} exitAt={duration}>
      <Depth z={60}>
        <div style={abs(215)}>
          <Headline segs={['Every', 'character', '\n', {t: 'is a fact.', hl: true}]} at={0} size={86} stagger={2} />
        </div>
      </Depth>
      {MAP.map(([clue, who, what], i) => {
        const at = 14 + i * 20;
        const y = 440 + i * 180;
        return (
          <Depth key={clue} z={i % 2 ? 10 : 30}>
            <Cutout x={60} y={y} w={960} h={156} at={at} rot={i % 2 ? 0.8 : -0.8} bg="#fffaf0" border={0}>
              <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 26px', gap: 16}}>
                <div style={{width: 360, fontFamily: FONT.hand, fontWeight: 700, fontSize: 50, color: P.terracotta, lineHeight: 1}}>{clue}</div>
                <svg width={70} height={30} viewBox="0 0 70 30">
                  <path d="M2 15 H58 M46 4 L62 15 L46 26" fill="none" stroke={P.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - ease(f, at + 6, at + 14))} />
                </svg>
                <div style={{fontFamily: FONT.sans, lineHeight: 1.05, opacity: ease(f, at + 10, at + 16)}}>
                  <div style={{fontWeight: 900, fontSize: 44, color: P.ink, letterSpacing: '-0.02em'}}>{who}</div>
                  <div style={{fontWeight: 600, fontSize: 30, color: P.ink2}}>{what}</div>
                </div>
              </div>
            </Cutout>
          </Depth>
        );
      })}
    </Stage>
  );
};

/* 12 · EXAM HALL: RETRIEVAL ------------------------------------------------- */
const OPTS = ['Hullihen', 'Blair', 'Dal Pont', 'Epker'];
export const Exam: S = ({duration}) => {
  const f = useCurrentFrame();
  const pick = 112;
  const bub = sp(f, 40, BOUNCE);
  const imgH = 560;
  const imgW = (2560 / 784) * imgH;
  // Dal's spot in ramu-wide.jpg (2560x784): ~(1720, 500)
  const dx = 1720 * (imgH / 784);
  const dy = 500 * (imgH / 784);
  return (
    <Stage keys={[{f: 0, z: 0}, {f: duration, z: 110, ry: 3}]} exitAt={duration}>
      <Depth z={50}>
        <div style={abs(205, {paddingLeft: 70})}>
          <Dateline text="Exam hall · Question 47" at={0} />
        </div>
      </Depth>
      <Depth z={0}>
        <Cutout x={80} y={280} w={920} h={640} at={4} rot={-1} bg="#ffffff">
          <div style={{padding: '30px 38px', fontFamily: FONT.sans}}>
            <div style={{fontWeight: 800, fontSize: 46, lineHeight: 1.15, color: P.ink}}>Who modified the sagittal split ramus osteotomy in 1961?</div>
            <div style={{display: 'grid', gap: 16, marginTop: 28}}>
              {OPTS.map((o, i) => {
                const right = i === 2 && f >= pick;
                const p = sp(f, pick, BOUNCE);
                return (
                  <div
                    key={o}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                      padding: '14px 22px',
                      borderRadius: 14,
                      border: `4px solid ${right ? P.ink : '#d8d2c6'}`,
                      background: right ? P.amber : P.white,
                      fontWeight: 800,
                      fontSize: 40,
                      color: f >= pick && !right ? '#b7b0a5' : P.ink,
                      transform: right ? `scale(${0.94 + p * 0.06})` : undefined,
                    }}
                  >
                    <span style={{fontFamily: FONT.mono, fontSize: 32}}>{String.fromCharCode(65 + i)}</span>
                    {o}
                    {right ? <span style={{marginLeft: 'auto', fontSize: 44}}>✓</span> : null}
                  </div>
                );
              })}
            </div>
          </div>
        </Cutout>
      </Depth>
      <Depth z={60}>
        {/* thought bubble: walk back into the shop */}
        {[0, 1].map((i) => (
          <div key={i} style={{position: 'absolute', left: 250 + i * 40, top: 960 + i * 30, width: 36 - i * 12, height: 36 - i * 12, borderRadius: '50%', background: P.white, border: `4px solid ${P.ink}`, transform: `scale(${bub})`}} />
        ))}
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: 1010,
            width: 440,
            height: 440,
            borderRadius: '50%',
            overflow: 'hidden',
            border: `8px solid ${P.white}`,
            boxShadow: `0 0 0 5px ${P.ink}, 0 25px 50px rgba(0,0,0,0.3)`,
            transform: `scale(${bub})`,
          }}
        >
          <Img
            src={staticFile('img/ramu-wide.jpg')}
            style={{position: 'absolute', width: imgW, height: imgH, left: 220 - dx + (1 - ease(f, 44, 100)) * 500, top: 220 - dy}}
          />
        </div>
        <div style={{position: 'absolute', left: 60, top: 1060}}>
          <Note text={'walk to\nthe counter…'} at={50} size={54} rot={-6} />
        </div>
        <div style={{position: 'absolute', left: 760, top: 1250}}>
          <Note text={'DAL!\n= Dal Pont'} at={92} size={62} color={P.terracotta} rot={5} />
        </div>
      </Depth>
      <Depth z={80}>
        <div style={abs(1480)}>{f >= 130 ? <Headline segs={["Don't", 're-read.', {t: 'Walk the scene.', hl: true}]} at={130} size={62} stagger={2} /> : null}</div>
      </Depth>
    </Stage>
  );
};

/* 13 · LOGO REVEAL + CTA (after the SketchRoot reveal film) ------------------ */
export const Outro: S = ({duration}) => {
  const f = useCurrentFrame();
  const write = ease(f, 46, 80, 0, 1, (t) => t);
  const swoosh = ease(f, 70, 96);
  const fade = interpolate(f, [duration - 14, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pill = sp(f, 100, BOUNCE);
  return (
    <AbsoluteFill style={{opacity: fade}}>
      <div style={{position: 'absolute', left: 90, top: 560}}>
        <Logo delay={0} width={900} stagger={3} ink={P.ink} />
      </div>
      <div style={{position: 'absolute', left: 985, top: 610, fontFamily: FONT.sans, fontWeight: 800, fontSize: 30, color: P.ink, opacity: ease(f, 40, 46)}}>™</div>
      <div
        style={{
          position: 'absolute',
          top: 880,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT.script,
          fontWeight: 600,
          fontSize: 120,
          color: P.ink,
          clipPath: `inset(-30% ${(1 - write) * 100}% -30% 0)`,
        }}
      >
        Memory Redrawn
      </div>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <path
          d="M150 1080 C380 1050 700 1030 960 1010"
          fill="none"
          stroke={P.amber}
          strokeWidth={20}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - swoosh}
        />
        {swoosh > 0.97 ? <circle cx={962} cy={1008} r={18 + Math.sin(f / 3) * 2} fill={P.amber} /> : null}
      </svg>
      <div style={abs(1190, {display: 'flex', justifyContent: 'center'})}>
        <div
          style={{
            transform: `scale(${pill})`,
            background: P.ink,
            color: P.amber,
            borderRadius: 999,
            padding: '26px 52px',
            fontFamily: FONT.sans,
            fontWeight: 900,
            fontSize: 50,
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
          }}
        >
          Early access → <span style={{color: P.white}}>sketchroot.com</span>
        </div>
      </div>
      <div style={abs(1340, {display: 'flex', justifyContent: 'center'})}>
        <Note text="link in bio ↑" at={112} size={64} color={P.terracotta} rot={-3} />
      </div>
      <div style={abs(1470, {textAlign: 'center', fontFamily: FONT.mono, fontSize: 26, letterSpacing: '0.1em', color: P.dim, opacity: ease(f, 124, 136)})}>
        FOUNDED BY DR. JISHNU MOHAN · AIR 1 AIIMS PHD
      </div>
    </AbsoluteFill>
  );
};
