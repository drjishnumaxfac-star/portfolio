import {continueRender, delayRender, staticFile} from 'remotion';

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const C = {
  ink: '#0d0c0b',
  ink2: '#171513',
  card: '#1d1a17',
  cream: '#f3eee4',
  dim: '#958f88',
  amber: '#f9b930',
  amberDeep: '#e08a12',
  terracotta: '#d97850',
  rust: '#c25f38',
  line: 'rgba(243,238,228,0.10)',
};

export const FONT = {
  sans: '"Inter", system-ui, sans-serif',
  serif: '"Playfair Display", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
};

const faces: Array<[string, string, string, string]> = [
  ['Inter', 'inter-latin-400-normal.woff2', '400', 'normal'],
  ['Inter', 'inter-latin-600-normal.woff2', '600', 'normal'],
  ['Inter', 'inter-latin-800-normal.woff2', '800', 'normal'],
  ['Inter', 'inter-latin-900-normal.woff2', '900', 'normal'],
  ['Playfair Display', 'playfair-display-latin-800-normal.woff2', '800', 'normal'],
  ['Playfair Display', 'playfair-display-latin-800-italic.woff2', '800', 'italic'],
  ['Playfair Display', 'playfair-display-latin-900-italic.woff2', '900', 'italic'],
  ['JetBrains Mono', 'jetbrains-mono-latin-500-normal.woff2', '500', 'normal'],
];

let loaded = false;
export const loadFonts = () => {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const handle = delayRender('Loading fonts');
  Promise.all(
    faces.map(([family, file, weight, style]) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('woff2')`, {weight, style});
      return face.load().then((f) => document.fonts.add(f));
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};

/** seconds -> frames */
export const s = (sec: number) => Math.round(sec * FPS);
