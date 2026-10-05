"""Generate the voice-over with Kokoro (deep male voice) -> audio/*.wav + durations.json"""
import json, sys, os, numpy as np, soundfile as sf
sys.path.insert(0, os.path.dirname(__file__))
import plan
from kokoro_onnx import Kokoro

SCR = "/tmp/claude-0/-home-user-portfolio/1dff1b0e-11c5-51c5-86b5-b9c56c11cc3f/scratchpad/tts"
OUT = os.path.join(os.path.dirname(__file__), "audio"); os.makedirs(OUT, exist_ok=True)
VOICE = os.environ.get("VOICE", "am_onyx"); SPEED = float(os.environ.get("SPEED", "0.96"))

items = [(f"intro{i}", t) for i, t in enumerate(plan.INTRO)]
items += [(c["id"], c["text"]) for c in plan.CHAPTERS]
items += [(c["id"], c["text"]) for c in plan.CHUNKS]
items += [(f"outro{i}", t) for i, t in enumerate(plan.OUTRO)]

k = Kokoro(f"{SCR}/kokoro.onnx", f"{SCR}/voices.bin")
dur = {}
for id_, text in items:
    samples, sr = k.create(text, voice=VOICE, speed=SPEED, lang="en-us")
    # trim leading/trailing near-silence, keep a natural 80ms tail
    a = np.abs(samples); idx = np.where(a > 0.01)[0]
    if len(idx): samples = samples[max(0, idx[0] - int(.03 * sr)): idx[-1] + int(.08 * sr)]
    sf.write(f"{OUT}/{id_}.wav", samples, sr)
    dur[id_] = len(samples) / sr
    print(id_, round(dur[id_], 2), len(text.split()), flush=True)
json.dump(dur, open(f"{OUT}/durations.json", "w"), indent=1)
print("total narration", round(sum(dur.values()), 1))
