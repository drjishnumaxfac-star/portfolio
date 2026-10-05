import json, os, sys
H=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,H); import plan
dur=json.load(open(f"{H}/audio/durations.json"))
narr=[]; scenes=[]
def ph(text,at,d):
    ps=[p.strip() for p in text.split("|") if p.strip()]; w=[len(p)+3 for p in ps]; tot=sum(w); c=0; out=[]
    for p,x in zip(ps,w): out.append(dict(t=p,at=round(at+d*c/tot,3),end=round(at+d*(c+x)/tot,3))); c+=x
    return out
t=0.0
h=dict(id="hook",start=0.2,voiceAt=0.5,voice=dur["hook"]); h["phr"]=ph(plan.HOOK,h["voiceAt"],h["voice"]); h["dur"]=0.3+h["voice"]+0.45
narr.append(("hook",h["voiceAt"],h["voice"])); scenes.append(dict(type="hook",start=0,end=round(0.2+h["dur"]+0.1,3),chunks=[h])); t=scenes[-1]["end"]
cur=t+0.9; ch=[]
for b in plan.BEATS:
    d=dur[b["id"]]; c=dict(id=b["id"],start=round(cur,3),voiceAt=round(cur+0.18,3),voice=round(d,3),dur=round(0.18+d+0.22,3))
    c["phr"]=ph(b["text"],c["voiceAt"],d); ch.append(c); narr.append((b["id"],c["voiceAt"],d)); cur+=c["dur"]
scenes.append(dict(type="beats",start=round(t,3),end=round(cur+0.15,3),chunks=ch)); t=scenes[-1]["end"]
d=dur["outro"]; o=dict(id="outro",start=round(t+0.3,3),voiceAt=round(t+0.6,3),voice=round(d,3),dur=round(0.3+d+1.8,3)); o["phr"]=ph(plan.OUTRO,o["voiceAt"],d); narr.append(("outro",o["voiceAt"],d))
scenes.append(dict(type="outro",start=round(t,3),end=round(t+0.3+o["dur"],3),chunks=[o])); total=scenes[-1]["end"]
TL=dict(fps=30,duration=total,scenes=scenes)
PL=dict(beats=[{k:v for k,v in b.items() if k!="text"} for b in plan.BEATS],take=plan.TAKE)
open(f"{H}/../src/timeline.js","w").write("window.TL="+json.dumps(TL)+";\nwindow.PLAN="+json.dumps(PL)+";\n")
json.dump(dict(narr=narr,total=total,scenes=[(s["type"],s["start"],s["end"]) for s in scenes],phr=[(p["at"]) for s in scenes for c in s["chunks"] for p in c["phr"]]),open(f"{H}/narr.json","w"))
def ts(x): ms=int(round(x*1000)); return f"{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}"
texts={"hook":plan.HOOK,"outro":plan.OUTRO,**{b["id"]:b["text"] for b in plan.BEATS}}
srt=[f"{i}\n{ts(a)} --> {ts(a+d)}\n{texts[k].replace('|','').replace('E.K.G.','EKG')}\n" for i,(k,a,d) in enumerate(narr,1)]
open(f"{H}/../captions.srt","w").write("\n".join(srt)); print("duration",round(total,1),"frames",int(total*30))
