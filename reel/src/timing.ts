import beatsJson from './beats-launch.json';
import {FPS} from './theme';

/**
 * Beat map produced by `npx hyperframes beats beatmap-launch` for public/music-launch.m4a:
 * the original track (0–51.16 s) followed by its 39.04 s phrase again, crossfaded on the downbeat.
 * Phrase downbeats land at ~3.12 + 6n s, with the drop at ~7.2 s. Every scene cut sits on one.
 */
export const BEATS: {time: number; strength: number}[] = beatsJson.beats;

export const MUSIC_SECONDS = 68.77;
export const TOTAL_FRAMES = Math.round(MUSIC_SECONDS * FPS);

const sec = [0, 3.12, 9.12, 15.13, 21.12, 27.12, 33.12, 39.08, 45.13, 51.12, 57.17, 63.17, MUSIC_SECONDS];

export const SCENES = {
  hook: [sec[0], sec[1]],
  openLoop: [sec[1], sec[2]],
  problem: [sec[2], sec[3]],
  forgetting: [sec[3], sec[4]],
  reveal: [sec[4], sec[5]],
  palace: [sec[5], sec[6]],
  oneScene: [sec[6], sec[7]],
  platform: [sec[7], sec[8]],
  website: [sec[8], sec[9]],
  follow: [sec[9], sec[10]],
  spots: [sec[10], sec[11]],
  verify: [sec[11], sec[12]],
} as const;

export type SceneKey = keyof typeof SCENES;

export const sceneFrames = (k: SceneKey) => {
  const [a, b] = SCENES[k];
  const from = Math.round(a * FPS);
  return {from, duration: Math.round(b * FPS) - from};
};

/** Frames (relative to scene start) of the strong beats that fall inside a scene. */
export const beatsIn = (k: SceneKey, minStrength = 0.75) => {
  const [a, b] = SCENES[k];
  return BEATS.filter((x) => x.time >= a && x.time < b && x.strength >= minStrength).map((x) =>
    Math.round((x.time - a) * FPS),
  );
};

/** 0..1 pulse that spikes on every strong beat and decays — drives subtle "breathing" accents. */
export const beatPulse = (frame: number, minStrength = 0.8) => {
  const t = frame / FPS;
  let v = 0;
  for (const b of BEATS) {
    if (b.strength < minStrength) continue;
    const dt = t - b.time;
    if (dt >= 0 && dt < 0.4) v = Math.max(v, Math.exp(-dt * 9) * b.strength);
  }
  return v;
};
