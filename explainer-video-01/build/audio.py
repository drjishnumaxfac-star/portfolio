"""Voice post-processing + ambient music bed + transition SFX -> out/audio_mix.m4a, src/env.js"""
import json, os, subprocess, numpy as np, soundfile as sf
H = os.path.dirname(os.path.abspath(__file__)); OUT = f"{H}/../out"; os.makedirs(OUT, exist_ok=True)
N = json.load(open(f"{H}/narr.json")); TOTAL = N["total"] + 0.6
SR = 48000; rng = np.random.default_rng(7)

# ---------------------------------------------------------------- narration (24k mono) placed on the timeline
v24 = np.zeros(int(TOTAL * 24000) + 24000, dtype=np.float32)
for id_, at, d, text in N["narr"]:
    w, sr = sf.read(f"{H}/audio/{id_}.wav", dtype="float32"); i = int(at * 24000)
    # tiny fades to avoid clicks
    f = int(.01 * sr); w[:f] *= np.linspace(0, 1, f); w[-f:] *= np.linspace(1, 0, f)
    v24[i:i + len(w)] += w
sf.write(f"{OUT}/voice_raw.wav", v24, 24000)
# deeper, warmer, glued voice
vf = ("rubberband=pitch=0.935:formant=shifted:transients=smooth,"
      "highpass=f=65,equalizer=f=120:t=q:w=0.9:g=4.5,equalizer=f=280:t=q:w=1:g=-1.5,equalizer=f=3200:t=q:w=1.2:g=2,"
      "equalizer=f=8500:t=q:w=1:g=-3,"
      "acompressor=threshold=-21dB:ratio=3.2:attack=8:release=140:makeup=4,"
      "aecho=0.85:0.5:55|110:0.10|0.05,aresample=48000,pan=stereo|c0=c0|c1=c0")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{OUT}/voice_raw.wav", "-af", vf, f"{OUT}/voice.wav"], check=True)
v, _ = sf.read(f"{OUT}/voice.wav", dtype="float32")
L = int(TOTAL * SR); v = np.pad(v, ((0, max(0, L - len(v))), (0, 0)))[:L]

# ---------------------------------------------------------------- envelope for on-screen bars (30 fps)
mono = v[:, 0]; hop = SR // 30
rms = np.array([np.sqrt(np.mean(mono[i:i + hop * 2] ** 2) + 1e-12) for i in range(0, len(mono) - hop * 2, hop)])
env = np.clip(rms / (np.percentile(rms[rms > 1e-3], 92) + 1e-9), 0, 1)
for i in range(1, len(env)): env[i] = max(env[i], env[i - 1] * 0.82)   # fast attack, soft release
open(f"{H}/../src/env.js", "w").write("window.ENV=" + json.dumps([round(float(x), 3) for x in env]) + ";\n")

# ---------------------------------------------------------------- music bed
t = np.arange(L) / SR
def note(m): return 440 * 2 ** ((m - 69) / 12)
BPM = 84; beat = 60 / BPM; bar = 4 * beat
prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]   # Am F C G (triads)
pad = np.zeros(L, dtype=np.float32); bass = np.zeros(L, dtype=np.float32); pluck = np.zeros(L, dtype=np.float32)
nbars = int(TOTAL / bar) + 2
for b in range(nbars):
    s0 = int(b * bar * SR); s1 = min(L, int((b + 1) * bar * SR + 0.8 * SR))
    if s0 >= L: break
    tt = np.arange(s1 - s0) / SR; ch = prog[b % 4]
    env_b = np.minimum(1, tt / 1.2) * np.minimum(1, np.maximum(0, (bar + 0.8 - tt) / 0.8))
    for m in ch:
        for det in (-0.12, 0.0, 0.12):
            f = note(m) * 2 ** (det / 12)
            pad[s0:s1] += (np.sin(2 * np.pi * f * tt) + .35 * np.sin(2 * np.pi * 2 * f * tt)).astype(np.float32) * env_b * .035
    bass[s0:s1] += (np.sin(2 * np.pi * note(ch[0] - 24) * tt) * env_b * .10).astype(np.float32)
    # sparse pentatonic plucks
    scale = [ch[0] + 12 + x for x in (0, 7, 12, 16, 19)] if True else []
    for k in range(8):
        if rng.random() < .55:
            m = scale[(k * 3 + b) % len(scale)] + (12 if k % 4 == 3 else 0)
            st = int((b * bar + k * beat / 2) * SR); n = int(1.4 * SR)
            if st + n > L: continue
            tt2 = np.arange(n) / SR
            pluck[st:st + n] += (np.sin(2 * np.pi * note(m) * tt2) * np.exp(-tt2 * 3.6) * .05 * (.6 + .4 * rng.random())).astype(np.float32)
music = pad + bass + pluck
# slow tremolo on pad for movement, intro swell, outro fade
music *= (0.9 + 0.1 * np.sin(2 * np.pi * t / 9)).astype(np.float32)
music *= np.minimum(1, t / 3.0).astype(np.float32) * np.minimum(1, np.maximum(0, (TOTAL - t) / 4.0)).astype(np.float32)
mus = np.stack([music, np.roll(music, int(.012 * SR))], 1)   # tiny haas width

# ---------------------------------------------------------------- SFX
sfx = np.zeros((L, 2), dtype=np.float32)
def whoosh(at, dur=0.9, gain=.22, up=True):
    n = int(dur * SR); i = int(at * SR)
    if i < 0 or i + n > L: return
    x = rng.standard_normal(n).astype(np.float32); tt = np.linspace(0, 1, n)
    # moving band via cascaded one-pole filters with sweeping coefficient
    y = np.zeros(n, dtype=np.float32); lp = 0; lp2 = 0
    for j in range(n):
        a = (0.02 + 0.5 * (tt[j] if up else 1 - tt[j]) ** 1.5)
        lp += a * (x[j] - lp); lp2 += a * (lp - lp2); y[j] = lp - lp2
    e = np.sin(np.pi * tt) ** 2
    y = y / (np.max(np.abs(y)) + 1e-9) * e * gain
    sfx[i:i + n, 0] += y; sfx[i:i + n, 1] += np.roll(y, 40)
def tick(at, f=1320, gain=.05):
    n = int(.35 * SR); i = int(at * SR)
    if i + n > L: return
    tt = np.arange(n) / SR
    y = (np.sin(2 * np.pi * f * tt) + .4 * np.sin(2 * np.pi * f * 2 * tt)) * np.exp(-tt * 16) * gain
    sfx[i:i + n, 0] += y; sfx[i:i + n, 1] += y
for typ, s0, s1 in N["scenes"]:
    whoosh(s0 + 0.05, 1.0, .24, True)
    if typ in ("explain", "intro", "outro"): tick(s0 + .5, 880, .07)
for id_, at, d, text in N["narr"]:
    if id_.startswith("c") and id_[1:].isdigit(): tick(at - .22, 1568, .045)
whoosh(0.1, 1.4, .2, True)
# closing chord shimmer
for m in (57, 64, 69, 72):
    st = int((TOTAL - 5.2) * SR); n = L - st; tt = np.arange(n) / SR
    y = np.sin(2 * np.pi * note(m) * tt) * np.exp(-tt * .9) * .03 * np.minimum(1, tt / .05)
    sfx[st:, 0] += y; sfx[st:, 1] += y
sf.write(f"{OUT}/music.wav", mus, SR); sf.write(f"{OUT}/sfx.wav", sfx, SR)

# ---------------------------------------------------------------- final mix: duck music under voice, normalise
fc = ("[1:a]volume=1.0[m];[2:a]volume=1.0[x];"
      "[0:a]asplit=2[vo][sc];"
      "[m][sc]sidechaincompress=threshold=0.02:ratio=7:attack=40:release=500:makeup=1[md];"
      "[vo][md][x]amix=inputs=3:normalize=0:duration=first,"
      "equalizer=f=60:t=q:w=1:g=1,alimiter=limit=0.95,loudnorm=I=-16:TP=-1.5:LRA=9[out]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{OUT}/voice.wav", "-i", f"{OUT}/music.wav", "-i", f"{OUT}/sfx.wav",
                "-filter_complex", fc, "-map", "[out]", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", f"{OUT}/audio_mix.m4a"], check=True)
print("ok", round(TOTAL, 1), "env frames", len(env))
