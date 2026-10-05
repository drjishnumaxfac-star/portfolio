# Episode 01 · Perioperative Management of the Diabetic Patient

Motion-graphics explainer of *Yoo HK, Serafin BL. Perioperative management of the diabetic patient.
Oral Maxillofac Surg Clin N Am 2006;18:255–260* (pages 1–2 supplied as screenshots).

For every narrated sentence the video does three things at once:

1. **Highlights the exact passage** on the paper (camera push-in, spotlight, marker that sweeps in time with the voice).
2. **Explains it in plain language** next to it (kinetic title, one-line explanation).
3. **Visualises the key fact** (stat counters, glucose scales, insulin-type bars, drug-hold timeline, flow diagrams…).

Output: `episode-01-perioperative-management-diabetic-patient.mp4` (1920×1080, 30 fps) + `captions.srt`.

## Rebuild

```bash
pip install kokoro-onnx soundfile pillow numpy playwright     # + ffmpeg, chromium
# Kokoro model files -> $SCR/kokoro.onnx, $SCR/voices.bin (github.com/thewh1teagle/kokoro-onnx, model-files-v1.0)
cd build
SPEED=1.05 python3 tts.py        # voice-over (am_onyx, deep male) -> build/audio/*.wav
python3 timeline.py              # narration timings -> src/timeline.js, captions.srt
python3 audio.py                 # voice processing + music + SFX -> out/audio_mix.m4a, src/env.js
python3 render_seg.py out/s0.mp4 0 3299   # … render frame ranges in parallel (4 segments), then concat + mux
```

* `build/plan.py` – the script: narration text, highlight regions (page pixel coordinates), explanation + visuals.
* `src/` – the deterministic HTML/CSS/JS scene renderer (`window.render(t)`), fonts (Plus Jakarta Sans, OFL), page images.
* The reading time of each highlighted passage is driven by the length of the generated narration, so changing the script re-times everything.

Education only – not clinical advice. The paper is © 2006 Elsevier; page images are used for commentary/education.
