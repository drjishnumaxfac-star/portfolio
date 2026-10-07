# "Why SketchRoot works": method of loci explainer

**Composition:** `LociExplainer`, 1080×1920 at 30 fps, 80.7 s
**Look:** a Vox-style paper collage, 2D artwork staged in 3D. The palette matches the SketchRoot
logo reveal: paper white, ink `#211f20` and amber `#f9b930`, with terracotta `#c25f38` as the
second accent.
**Music:** the launch track, extended to 80.7 s by repeating its 27 s phrase on a downbeat. Beats
were re-detected with `npx hyperframes beats beatmap-explainer`, and every scene cuts on a phrase
downbeat.
**Originality:** the history and research below are public knowledge, told in our own words with
original illustrations and SketchRoot's own scenes. Nothing in it reuses another company's
footage, wording or statistics.

## Style system (Vox "2D in 3D")
| Device | How it's built |
|---|---|
| Paper ground | Warm off-white with turbulence fibre noise, a 2-frame "boil" and a soft vignette |
| 2.5D camera | `Stage` uses CSS perspective, with layers (`Depth z`) at different depths. A slow push or tilt per scene gives real parallax |
| Cut-out collage | White-bordered cards that drop in with overshoot, slight tilt, amber tape and optional halftone |
| Highlighter | Amber marker swipes behind key words, slightly skewed |
| Hand annotations | Caveat notes written on left to right, marker circles, curved arrows |
| Datelines | Mono, typewriter-style captions ("c. 500 BC · Ceos, Greece") |
| Research clippings | Paper cards citing the study (journal and year) with the key number highlighted |
| Transitions | A push-through camera move on every cut, plus a torn amber paper wipe |
| Animation principles | Anticipation and overshoot on every pop, squash and stretch on pins and logo letters, follow-through rotation on cards, secondary action (eyes blink, steam, footsteps) |

## Shot list
| # | Time | On screen | Teaching job |
|---|---|---|---|
| 1 | 0–3.1 s | "Your brain forgets *lists.*" A handwritten list's words fall off the page. "It never forgets **places.**" A house pops in. | Hook: the claim in outcome language |
| 2 | 3.1–9.1 s | "Picture your **home.**" Numbered pins drop on the front door, sofa, kitchen and bed, and a dotted route draws between them. "You can walk it *with your eyes closed.*" | Lets the viewer feel spatial memory |
| 3 | 9.1–15.1 s | Dateline: c. 500 BC · Ceos, Greece. Map with a Ceos pin. "The poet *Simonides* is at a banquet." The banquet hall, then "He steps outside. The roof *collapses.*" (camera shake, dust) | Origin story |
| 4 | 15.1–21.1 s | "No guest can be *recognised.*" A top-down seating plan tilts into 3D. "…so he walks the room in his mind." Seats light up 1 to 8. "He names every one, by **where they sat.**" | The insight |
| 5 | 21.1–27.1 s | "The Method of *Loci*", circled in amber. Dictionary card: *locus*, Latin for place, plural *loci*. A Roman bust: "Roman orators like *Cicero* gave long speeches **without notes.**" | Names the method |
| 6 | 27.1–33.1 s | "Your brain has a built-in **GPS.**" A brain with the hippocampus pulsing. Clipping: place cells and grid cells, Nobel Prize in Medicine 2014. "Memory sticks to *places.*" | Mechanism 1: spatial memory |
| 7 | 33.1–39.1 s | "And a **massive** visual memory." A grid of objects pops in. Clipping: Brady et al., PNAS 2008. People viewed 2,500 objects once, then picked them out of pairs with **87–92%** accuracy. | Mechanism 2: visual memory |
| 8 | 39.1–45.1 s | "Memory champions aren't *born.* They're **trained.**" Bar chart: 26 → 62 words recalled out of 72, "×2.4". Clipping: Dresler et al., Neuron 2017. 40 days of loci training, with the gains still there 4 months later. | Proof it's trainable |
| 9 | 45.1–51.1 s | The method in 3 steps, on cards that flip in: 1 Pick a place you know well. 2 Put a vivid, absurd image at each spot. 3 Walk the route to recall it all. | How to use it |
| 10 | 51.1–57.1 s | "SketchRoot **draws the palace** for you." Castle mountain, with circles on Basic Sciences, Preclinical and the AIR 1 summit. "every subject → a castle", "every topic → a room" | Bridge to the product |
| 11 | 57.1–63.1 s | Dateline: Example · OMFS. "Ramu~~s Osteotomies~~" becomes "*Ramu's Kada*" (kada = shop), and the camera pans across the shop. "One shop. Every fact on a **shelf.**" | A worked example |
| 12 | 63.1–69.1 s | "Every character **is a fact.**" Hulligan 1849 → Hullihen · Blair the liar 1907 → Blair · Step by step 1942 → Schuchardt · Hugo 1957 → Obwegeser, sagittal split · Dal 1961 → Dal Pont · Short straw 1968/77 → Hunsuck & Epker | Decoding the scene |
| 13 | 69.1–75.1 s | Exam hall, Question 47: "Who modified the sagittal split ramus osteotomy in 1961?" A thought bubble walks back into the shop and finds DAL, so the answer is C, Dal Pont ✓. "Don't re-read. **Walk the scene.**" | Retrieval payoff |
| 14 | 75.1–80.7 s | Logo reveal in the style of the SketchRoot reveal film: ink "Sketch", amber "Root" with blinking eyes, ™, "Memory Redrawn" written out over an amber brush underline. "Early access → sketchroot.com", "link in bio ↑", "Founded by Dr. Jishnu Mohan · AIR 1 AIIMS PhD" | CTA |

## Facts to double-check before posting
- **Scene 12 attributions:** Hullihen 1849, Blair 1907, Schuchardt 1942, Obwegeser 1957, Dal Pont 1961, and Hunsuck 1968 / Epker 1977. These follow the years on the Ramu's Kada artwork. Please confirm the one-line descriptions match how SketchRoot teaches them.
- **Brady, Konkle, Alvarez & Oliva (2008), PNAS,** "Visual long-term memory has a massive storage capacity for object details": 2,500 objects, with 92%, 88% and 87% two-alternative recognition.
- **Dresler et al. (2017), Neuron:** 40 days of method-of-loci training raised recall from 26 to 62 words out of 72, with gains persisting at 4 months.
- **Place and grid cells:** Nobel Prize in Physiology or Medicine 2014 (O'Keefe, May-Britt Moser, Edvard Moser).
- **Simonides and the banquet hall:** the classical story as recorded by Cicero (*De Oratore*).

## Caption
> Why do you forget pharmacology by September, yet never forget your way home? 🏠
> Your brain is built to remember **places**. That's the method of loci, the 2,500-year-old trick memory champions use.
> SketchRoot turns every dental topic into a place you can walk through. Ramus osteotomies → Ramu's Kada. 🦷
> Early access: sketchroot.com (link in bio)
> #methodofloci #memorypalace #NEETMDS #INICET #INBDE #dentalstudent #studytips #SketchRoot
