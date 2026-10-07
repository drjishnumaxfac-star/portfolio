import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {FPS, loadFonts} from '../theme';
import {Example, Exam, Greece, Gps, Hook, Home, Mapping, Method, Outro, Palace, Seats, Steps, Trained, Visual} from './Scenes';
import {PaperGround, PaperWipe} from './vox';

loadFonts();

/**
 * Music bed: the launch track extended to 80.7 s (0–51.16 s, then the 27.08 s phrase onward again,
 * crossfaded on a phrase downbeat). Beats re-detected with `npx hyperframes beats beatmap-explainer`.
 * Phrase downbeats every ~6 s from 3.12 s; every scene cut sits on one.
 */
export const EXPLAINER_SECONDS = 80.73;
export const EXPLAINER_FRAMES = Math.round(EXPLAINER_SECONDS * FPS);
const CUTS = [0, 3.12, 9.12, 15.13, 21.12, 27.12, 33.12, 39.08, 45.13, 51.13, 57.12, 63.1, 69.13, 75.13, EXPLAINER_SECONDS];
const SCENES = [Hook, Home, Greece, Seats, Method, Gps, Visual, Trained, Steps, Palace, Example, Mapping, Exam, Outro];

export const LociExplainer: React.FC = () => (
  <AbsoluteFill>
    <PaperGround />
    {SCENES.map((Scene, i) => {
      const from = Math.round(CUTS[i] * FPS);
      const duration = Math.round(CUTS[i + 1] * FPS) - from;
      return (
        <Sequence key={i} from={from} durationInFrames={duration} name={Scene.name || `scene-${i}`}>
          <Scene duration={duration} />
        </Sequence>
      );
    })}
    {CUTS.slice(1, -1).map((c, i) => (
      <PaperWipe key={i} at={Math.round(c * FPS)} />
    ))}
    <Audio
      src={staticFile('music-explainer.m4a')}
      volume={(f) => interpolate(f, [EXPLAINER_FRAMES - 24, EXPLAINER_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
    />
  </AbsoluteFill>
);
