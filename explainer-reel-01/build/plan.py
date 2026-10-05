"""Reel script: only the clinically relevant beats. '|' marks caption phrase breaks."""
def R(page, col, y0, y1, s=None, e=None): return dict(page=page, col=col, y0=y0, y1=y1, s=s, e=e)
HOOK = "A diabetic patient | is coming for surgery. | What do you check?"
BEATS = [
 dict(id="b1", text="Half of all diabetic patients | will need surgery | in their lifetime.",
      regions=[R("p1","L",897,1035,365,250)], vis=[dict(t="stats", items=[dict(num=50, suf="%", l="lifetime chance of a surgical procedure")])]),
 dict(id="b2", text="Type one | makes no insulin. | Type two | resists it.",
      regions=[R("p1","L",648,758,262,358), R("p1","L",730,841,368,155)],
      vis=[dict(t="cols", items=[dict(h="Type 1", b="Autoimmune β-cell loss"), dict(h="Type 2", b="Insulin resistance")])]),
 dict(id="b3", text="Fasting glucose | above one hundred twenty-six | is hyperglycemia, | risking ketoacidosis.",
      regions=[R("p1","R",620,731,1010,900)],
      vis=[dict(t="scale", max=300, mark=126, fill=235, unit="mg/dL", tone="bad", note="126 mg/dL")]),
 dict(id="b4", text="Before surgery, | call the physician: | how well controlled, | and any complications?",
      regions=[R("p2","L",98,258,105,215)],
      vis=[dict(t="chips", items=["Renal function","Heart disease","Autonomic neuropathy","DKA / HHNK history"])]),
 dict(id="b5", text="Screen the heart | with an E.K.G. | The risk of silent ischemia | is higher.",
      regions=[R("p2","L",390,524,135,350)], vis=[dict(t="stats", items=[dict(big="EKG", l="higher risk of silent ischemia")])]),
 dict(id="b6", text="Autonomic neuropathy | links to silent heart attacks | and sudden death.",
      regions=[R("p2","L",867,1080,135,345)], vis=[dict(t="chips", tone="bad", items=["Silent MI","Dysrhythmias","Sudden death"])]),
 dict(id="b7", text="Gastroparesis | delays stomach emptying, | raising the risk | of aspiration.",
      regions=[R("p2","L",1185,1345,135,568)], vis=[dict(t="flow", items=["Reflux lying supine","Delayed gastric emptying","Aspiration risk"])]),
 dict(id="b8", text="Diet-controlled, | minor procedure? | Glucose under two hundred | needs no change.",
      regions=[R("p2","R",337,470,890,725)],
      vis=[dict(t="scale", max=300, mark=200, fill=150, unit="mg/dL", tone="ok", note="≤ 200 mg/dL")]),
 dict(id="b9", text="Major surgery | means over one hour of anesthesia, | or glucose above two hundred. | Monitor hourly, | and give insulin.",
      regions=[R("p2","R",443,602,735,982)],
      vis=[dict(t="cols", items=[dict(h="Major =", b="GA > 1 hour or glucose > 200"), dict(h="Then", b="Hourly glucose + insulin")])]),
 dict(id="b10", text="Surgical stress | can tip stable patients | onto insulin. | Then manage them | as type one.",
      regions=[R("p2","R",602,682,658,1090), R("p2","R",682,841,628,795)],
      vis=[dict(t="flow", items=["Surgery stress","Hyperglycemia → insulin","Type 1 protocol"])]),
]
OR = [dict(when="3 days before", rev=1, what="1st-gen sulfonylureas", tone="stop"),
      dict(when="Night before", rev=3, what="Metformin + glitazones", tone="stop"),
      dict(when="Morning of surgery", rev=2, what="2nd-gen sulfonylureas", tone="ok")]
BEATS += [
 dict(id="b11", text="Oral drugs: | first-generation sulfonylureas | stop three days before.",
      regions=[R("p2","R",1052,1158,710,905)], vis=[dict(t="steps", items=OR, upto=1)]),
 dict(id="b12", text="Second-generation | can continue | until the morning of surgery.",
      regions=[R("p2","R",1132,1212,915,1088)], vis=[dict(t="steps", items=OR, upto=2)]),
 dict(id="b13", text="Metformin and glitazones | stop the night before, | for lactic acidosis risk.",
      regions=[R("p2","R",1211,1291,628,830)], vis=[dict(t="steps", items=OR, upto=3)]),
]
OUTRO = "Assess control. | Screen the heart. | Time the drugs by class. | Save this for your next surgical case."
TAKE = ["Assess control + complications", "Screen the heart (EKG)", "Time oral drugs by class", "Glucose ≤ 200 → no change; major → hourly + insulin"]
