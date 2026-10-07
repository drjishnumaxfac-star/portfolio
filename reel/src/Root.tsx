import React from 'react';
import {Composition} from 'remotion';
import {EXPLAINER_FRAMES, LociExplainer} from './explainer/LociExplainer';
import {SketchRootLaunch} from './SketchRootLaunch';
import {FPS, HEIGHT, WIDTH} from './theme';
import {TOTAL_FRAMES} from './timing';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="SketchRootLaunch" component={SketchRootLaunch} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="LociExplainer" component={LociExplainer} durationInFrames={EXPLAINER_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
  </>
);
