import React from 'react';
import {Composition} from 'remotion';
import {SketchRootLaunch} from './SketchRootLaunch';
import {FPS, HEIGHT, WIDTH} from './theme';
import {TOTAL_FRAMES} from './timing';

export const RemotionRoot: React.FC = () => (
  <Composition id="SketchRootLaunch" component={SketchRootLaunch} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
);
