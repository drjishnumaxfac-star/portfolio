import json, os, sys, numpy as np, soundfile as sf
sys.path.insert(0, os.path.dirname(__file__)); import plan
from kokoro_onnx import Kokoro
SCR="/tmp/claude-0/-home-user-portfolio/1dff1b0e-11c5-51c5-86b5-b9c56c11cc3f/scratchpad/tts"
OUT=os.path.join(os.path.dirname(__file__),"audio"); os.makedirs(OUT,exist_ok=True)
items=[("hook",plan.HOOK)]+[(b["id"],b["text"]) for b in plan.BEATS]+[("outro",plan.OUTRO)]
k=Kokoro(f"{SCR}/kokoro.onnx",f"{SCR}/voices.bin"); dur={}
for i,t in items:
    s,sr=k.create(t.replace("|",","),voice="am_onyx",speed=1.1,lang="en-us")
    a=np.abs(s); idx=np.where(a>0.01)[0]; s=s[max(0,idx[0]-720):idx[-1]+1900]
    sf.write(f"{OUT}/{i}.wav",s,sr); dur[i]=len(s)/sr; print(i,round(dur[i],2),flush=True)
json.dump(dur,open(f"{OUT}/durations.json","w")); print("total",sum(dur.values()))
