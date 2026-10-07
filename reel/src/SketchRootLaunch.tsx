import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {Background, CutFlash} from './components';
import {OneScene, Palace, Platform, Website} from './scenes/Act2';
import {Follow, Spots, Verify} from './scenes/Act3';
import {Forgetting, Hook, OpenLoop, Problem, Reveal} from './scenes/Act1';
import {loadFonts} from './theme';
import {SceneKey, sceneFrames, TOTAL_FRAMES} from './timing';

loadFonts();

const ORDER: [SceneKey, React.FC<{duration: number}>][] = [
  ['hook', Hook],
  ['openLoop', OpenLoop],
  ['problem', Problem],
  ['forgetting', Forgetting],
  ['reveal', Reveal],
  ['palace', Palace],
  ['oneScene', OneScene],
  ['platform', Platform],
  ['follow', Follow],
  ['website', Website],
  ['spots', Spots],
  ['verify', Verify],
];

export const SketchRootLaunch: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#0d0c0b'}}>
    <Background />
    {ORDER.map(([key, Scene]) => {
      const {from, duration} = sceneFrames(key);
      return (
        <Sequence key={key} from={from} durationInFrames={duration} name={key}>
          <Scene duration={duration} />
        </Sequence>
      );
    })}
    {ORDER.slice(1).map(([key]) => (
      <CutFlash key={key} at={sceneFrames(key).from} />
    ))}
    <Audio
      src={staticFile('music-launch.m4a')}
      volume={(f) => interpolate(f, [TOTAL_FRAMES - 20, TOTAL_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
    />
  </AbsoluteFill>
);
