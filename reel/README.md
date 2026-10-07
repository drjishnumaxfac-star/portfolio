# SketchRoot launch reel

The early-access launch reel for sketchroot.com: 1080×1920 at 30 fps, 56.7 s, built in
[Remotion](https://www.remotion.dev). Scene cuts are synced to a beat map produced by
[HyperFrames](https://hyperframes.heygen.com). The shot-by-shot script, caption and
hashtags are in [SCRIPT.md](SCRIPT.md).

This folder is excluded from the Eleventy site build (`.eleventyignore`).

```
npm install
npm run studio        # live preview / scrub the timeline
npm run render        # -> out/sketchroot-launch-reel.mp4
```

In a sandbox without Remotion's own Chrome download, point it at an installed headless shell:

```
npx remotion render src/index.ts SketchRootLaunch out/sketchroot-launch-reel.mp4 \
  --browser-executable=/path/to/headless_shell
```

## Layout

| Path | What |
|---|---|
| `src/SketchRootLaunch.tsx` | Main composition: background, 10 scene sequences, cut flashes, music |
| `src/scenes/Act1.tsx` | Hook (ranks) · open loop · problem · forgetting curve · logo reveal |
| `src/scenes/Act2.tsx` | Memory palace · one scene · one platform · website demo · CTA |
| `src/components.tsx` | Background, sparkles, kinetic words, animated SketchRoot wordmark |
| `src/anim.ts` | Springs plus Disney-style helpers: squash & stretch, anticipation, shake |
| `src/timing.ts` | Scene boundaries on phrase downbeats, and the beat pulse |
| `src/beats.json` | Beat map from `npx hyperframes beats beatmap` |
| `src/logoData.ts` | SketchRoot wordmark glyphs, extracted from `content/index.html` |
| `beatmap/` | Minimal HyperFrames project used only to detect the beats in the music |
| `public/img/` | Founder portrait and SketchRoot illustration stills |
| `public/music.m4a` | Soundtrack (rights held by the owner) |

## Re-syncing to a different track
1. Replace `public/music.m4a`.
2. Run `npx hyperframes beats beatmap` and copy `beatmap/beats/music.m4a.json` to `src/beats.json`.
3. Adjust the phrase times in `src/timing.ts` (`sec`) and `MUSIC_SECONDS`.
