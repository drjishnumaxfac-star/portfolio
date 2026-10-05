"""Combine plan + narration durations into src/timeline.js and captions.srt"""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import plan
H = os.path.dirname(__file__)
dur = json.load(open(f"{H}/audio/durations.json"))
LEAD, POST = 0.30, 0.42           # visual lead before the voice, pause after it
scenes, narr = [], []             # narr: (id, voiceAt, voiceDur, text)

def chunk(id_, start, text, lead=LEAD, post=POST):
    d = dur[id_]
    c = dict(id=id_, start=round(start, 3), voiceAt=round(start + lead, 3), voice=round(d, 3), dur=round(lead + d + post, 3))
    narr.append((id_, c["voiceAt"], d, text)); return c

t = 0.0
# ---- intro
sc = dict(type="intro", start=0.0, chunks=[]); cur = 0.7
for i, txt in enumerate(plan.INTRO):
    c = chunk(f"intro{i}", cur, txt, lead=0.3, post=0.55 if i == 0 else 0.4); sc["chunks"].append(c); cur += c["dur"]
sc["end"] = round(cur + 0.5, 3); scenes.append(sc); t = sc["end"]
# ---- chapters
for ch in plan.CHAPTERS:
    d = dur[ch["id"]]
    sc = dict(type="chapter", ch=ch["id"], start=round(t, 3), chunks=[])
    c = dict(id=ch["id"], start=round(t + 0.65, 3), voiceAt=round(t + 0.65, 3), voice=round(d, 3), dur=round(d, 3)); narr.append((ch["id"], c["voiceAt"], d, ch["text"]))
    sc["chunks"].append(c); sc["end"] = round(t + 0.65 + d + 0.8, 3); scenes.append(sc); t = sc["end"]
    # explain scene for this chapter
    ex = dict(type="explain", ch=ch["id"], start=round(t, 3), chunks=[]); cur = t + 0.9
    for ck in [c for c in plan.CHUNKS if c["ch"] == ch["id"]]:
        c = chunk(ck["id"], cur, ck["text"]); ex["chunks"].append(c); cur += c["dur"]
    ex["end"] = round(cur + 0.25, 3); scenes.append(ex); t = ex["end"]
# ---- outro
sc = dict(type="outro", start=round(t, 3), chunks=[]); cur = t + 0.9
for i, txt in enumerate(plan.OUTRO):
    c = chunk(f"outro{i}", cur, txt, lead=0.3, post=0.6 if i == 0 else 1.6); sc["chunks"].append(c); cur += c["dur"]
sc["end"] = round(cur + 0.3, 3); scenes.append(sc)
total = sc["end"]

TL = dict(fps=30, duration=total, scenes=scenes)
chunks = []
for c in plan.CHUNKS:
    c = dict(c); c.pop("text"); chunks.append(c)
PL = dict(chapters=plan.CHAPTERS, chunks=chunks)
open(f"{H}/../src/timeline.js", "w").write("window.TL=" + json.dumps(TL) + ";\nwindow.PLAN=" + json.dumps(PL) + ";\n")
json.dump(dict(narr=narr, total=total, scenes=[(s["type"], s["start"], s["end"]) for s in scenes]), open(f"{H}/narr.json", "w"))

def ts(x):
    ms = int(round(x * 1000)); return f"{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}"
SUB = {"E.K.G.": "EKG", "D.N.A.": "DNA", "N.P.H.": "NPH", "D.K.A.": "DKA", "H.H.N.K.": "HHNK"}
def clean(x):
    for k, v in SUB.items(): x = x.replace(k, v)
    return x
srt = []
for n, (id_, at, d, text) in enumerate(narr, 1):
    srt.append(f"{n}\n{ts(at)} --> {ts(at + d)}\n{clean(text)}\n")
open(f"{H}/../captions.srt", "w").write("\n".join(srt))
print("duration", round(total, 1), "s =", round(total / 60, 2), "min; frames", int(total * 30))
