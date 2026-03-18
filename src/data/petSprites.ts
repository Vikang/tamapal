import { PixelFrame } from '../types';

// Color palette
const B = '#222222'; // black outline
const W = '#FFFFFF'; // white
const S = '#F5C89A'; // skin/body
const P = '#FF8FA8'; // pink cheeks
const E = '#222222'; // eyes (same as black)
const M = '#CC5555'; // mouth
const T = '#8ED8F0'; // tub/water
const Z = '#AAAAAA'; // zzz gray
const G = '#88CC88'; // green (stink)
const Y = '#FFD700'; // yellow (milk cap)
const L = '#B8D8F0'; // light blue (milk)
const _ = null;      // transparent

// ===== IDLE FRAME 1 (standing) =====
export const idleFrame1: PixelFrame = [
  [_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,_,B,S,S,S,S,S,S,B,_,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,P,S,S,S,S,S,S,S,S,P,B,_,_],
  [_,_,B,S,S,S,S,M,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,_,_,B,B,S,S,S,S,B,B,_,_,_,_],
  [_,_,_,_,B,B,_,_,_,_,B,B,_,_,_,_],
];

// ===== IDLE FRAME 2 (bounce up) =====
export const idleFrame2: PixelFrame = [
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,_,B,S,S,S,S,S,S,B,_,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,P,S,S,S,S,S,S,S,S,P,B,_,_],
  [_,_,B,S,S,S,S,M,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,_,_,B,B,S,S,S,S,B,B,_,_,_,_],
  [_,_,_,_,B,B,_,_,_,_,B,B,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// ===== EATING FRAME 1 (mouth closed) =====
export const eatingFrame1: PixelFrame = [
  [_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,_,B,S,S,S,S,S,S,B,_,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,P,S,S,S,S,S,S,S,S,P,B,_,_],
  [_,_,B,S,S,S,S,B,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,_,_,B,B,S,S,S,S,B,B,_,_,_,_],
  [_,_,_,_,B,B,_,_,_,_,B,B,_,_,_,_],
];

// ===== EATING FRAME 2 (mouth open) =====
export const eatingFrame2: PixelFrame = [
  [_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,_,B,S,S,S,S,S,S,B,_,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,P,S,S,S,S,S,S,S,S,P,B,_,_],
  [_,_,B,S,S,S,B,M,M,B,S,S,S,B,_,_],
  [_,_,B,S,S,S,B,M,M,B,S,S,S,B,_,_],
  [_,_,_,B,S,S,S,B,B,S,S,S,B,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,_,_,B,B,S,S,S,S,B,B,_,_,_,_],
  [_,_,_,_,B,B,_,_,_,_,B,B,_,_,_,_],
];

// ===== BATHING FRAME 1 =====
export const bathFrame1: PixelFrame = [
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,_,B,S,S,S,S,S,S,B,_,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,P,S,S,S,S,S,S,S,S,P,B,_,_],
  [_,_,B,S,S,S,S,M,S,S,S,S,S,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,B,T,T,T,T,T,T,T,T,T,T,T,T,B,_],
  [_,B,T,T,T,T,T,T,T,T,T,T,T,T,B,_],
  [_,B,T,T,T,T,T,T,T,T,T,T,T,T,B,_],
  [_,B,T,T,T,T,T,T,T,T,T,T,T,T,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// ===== BATHING FRAME 2 (with bubbles) =====
export const bathFrame2: PixelFrame = [
  [_,_,_,W,_,_,_,_,_,_,_,_,W,_,_,_],
  [_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_],
  [_,W,_,_,B,S,S,S,S,S,S,B,_,_,W,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,P,S,S,S,S,S,S,S,S,P,B,_,_],
  [_,_,B,S,S,S,S,M,S,S,S,S,S,B,_,_],
  [_,B,B,B,B,B,B,B,B,B,B,B,B,B,B,_],
  [_,B,T,T,W,T,T,T,T,T,W,T,T,T,B,_],
  [_,B,T,T,T,T,W,T,T,T,T,T,W,T,B,_],
  [_,B,T,W,T,T,T,T,W,T,T,T,T,T,B,_],
  [_,B,T,T,T,W,T,T,T,T,T,W,T,T,B,_],
  [_,_,B,B,B,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// ===== SLEEPING FRAME 1 =====
export const sleepFrame1: PixelFrame = [
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,Z,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,Z,_,_,_,_],
  [_,_,_,_,_,B,B,B,B,B,B,_,Z,_,_,_],
  [_,_,_,_,B,S,S,S,S,S,S,B,_,_,_,_],
  [_,_,_,B,S,B,S,S,S,B,S,S,B,_,_,_],
  [_,_,B,S,S,B,S,S,S,B,S,S,S,B,_,_],
  [_,_,B,P,S,S,S,S,S,S,S,S,P,B,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// ===== SLEEPING FRAME 2 (Zs shifted) =====
export const sleepFrame2: PixelFrame = [
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,Z,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,Z,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,Z,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,_,B,S,S,S,S,S,S,B,_,_,_,_],
  [_,_,_,B,S,B,S,S,S,B,S,S,B,_,_,_],
  [_,_,B,S,S,B,S,S,S,B,S,S,S,B,_,_],
  [_,_,B,P,S,S,S,S,S,S,S,S,P,B,_,_],
  [_,_,B,B,B,B,B,B,B,B,B,B,B,B,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// ===== HAPPY FRAME 1 (jumping up) =====
export const happyFrame1: PixelFrame = [
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,_,B,S,S,S,S,S,S,B,_,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,P,S,S,S,S,S,S,S,S,P,B,_,_],
  [_,_,B,S,S,S,M,M,M,M,S,S,S,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,B,S,B,S,S,S,S,S,S,S,S,B,S,B,_],
  [_,_,_,_,B,S,S,S,S,S,S,B,_,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,_,_,B,S,S,S,S,S,S,B,_,_,_,_],
  [_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

// ===== HAPPY FRAME 2 (landing) =====
export const happyFrame2: PixelFrame = [
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,_,B,S,S,S,S,S,S,B,_,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,P,S,S,S,S,S,S,S,S,P,B,_,_],
  [_,_,B,S,S,S,M,M,M,M,S,S,S,B,_,_],
  [_,B,S,B,S,S,S,S,S,S,S,S,B,S,B,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,_,_,B,B,S,S,S,S,B,B,_,_,_,_],
  [_,_,_,_,B,B,_,_,_,_,B,B,_,_,_,_],
];

// ===== SAD FRAME =====
export const sadFrame1: PixelFrame = [
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  [_,_,_,_,_,B,B,B,B,B,B,_,_,_,_,_],
  [_,_,_,_,B,S,S,S,S,S,S,B,_,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,P,S,S,S,S,S,S,S,S,P,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,_,B,S,S,S,M,M,S,S,S,B,_,_,_],
  [_,_,_,B,S,S,M,S,S,M,S,S,B,_,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,_,_,B,B,S,S,S,S,B,B,_,_,_,_],
  [_,_,_,_,B,B,_,_,_,_,B,B,_,_,_,_],
];

// ===== DIRTY FRAME (stink lines) =====
export const dirtyFrame1: PixelFrame = [
  [_,_,G,_,_,_,_,_,_,_,_,_,_,G,_,_],
  [_,_,_,G,_,B,B,B,B,B,B,_,G,_,_,_],
  [_,_,G,_,B,S,S,S,S,S,S,B,_,G,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,P,S,S,S,S,S,S,S,S,P,B,_,_],
  [_,_,B,S,S,S,S,M,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,G,_,B,S,S,S,S,S,S,S,S,B,_,G,_],
  [_,_,G,B,S,S,S,S,S,S,S,S,B,G,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,_,_,B,B,S,S,S,S,B,B,_,_,_,_],
  [_,_,_,_,B,B,_,_,_,_,B,B,_,_,_,_],
];

export const dirtyFrame2: PixelFrame = [
  [_,_,_,G,_,_,_,_,_,_,_,_,G,_,_,_],
  [_,_,G,_,_,B,B,B,B,B,B,_,_,G,_,_],
  [_,_,_,G,B,S,S,S,S,S,S,B,G,_,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,S,S,E,S,S,S,S,E,S,S,B,_,_],
  [_,_,B,P,S,S,S,S,S,S,S,S,P,B,_,_],
  [_,_,B,S,S,S,S,M,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,G,B,S,S,S,S,S,S,S,S,B,G,_,_],
  [_,G,_,B,S,S,S,S,S,S,S,S,B,_,G,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,B,S,S,S,S,S,S,S,S,S,S,B,_,_],
  [_,_,_,B,S,S,S,S,S,S,S,S,B,_,_,_],
  [_,_,_,_,B,B,S,S,S,S,B,B,_,_,_,_],
  [_,_,_,_,B,B,_,_,_,_,B,B,_,_,_,_],
];

// Food sprites (8x8)
export const riceBallSprite: PixelFrame = [
  [_,_,_,B,B,_,_,_],
  [_,_,B,W,W,B,_,_],
  [_,B,W,W,W,W,B,_],
  [B,W,W,B,B,W,W,B],
  [B,W,B,B,B,B,W,B],
  [_,B,W,B,B,W,B,_],
  [_,_,B,W,W,B,_,_],
  [_,_,_,B,B,_,_,_],
];

export const appleSprite: PixelFrame = [
  [_,_,_,B,_,_,_,_],
  [_,_,B,G,B,_,_,_],
  [_,B,M,M,M,B,_,_],
  [B,M,M,W,M,M,B,_],
  [B,M,M,M,M,M,B,_],
  [B,M,M,M,M,M,B,_],
  [_,B,M,M,M,B,_,_],
  [_,_,B,B,B,_,_,_],
];

export const cookieSprite: PixelFrame = [
  [_,_,B,B,B,_,_,_],
  [_,B,S,S,S,B,_,_],
  [B,S,B,S,S,S,B,_],
  [B,S,S,S,B,S,B,_],
  [B,S,S,S,S,S,B,_],
  [B,S,B,S,S,B,B,_],
  [_,B,S,S,B,S,B,_],
  [_,_,B,B,B,B,_,_],
];

export const milkSprite: PixelFrame = [
  [_,_,B,B,B,_,_,_],
  [_,_,B,Y,B,_,_,_],
  [_,B,B,Y,B,B,_,_],
  [_,B,W,W,W,B,_,_],
  [_,B,W,L,W,B,_,_],
  [_,B,L,L,L,B,_,_],
  [_,B,L,L,L,B,_,_],
  [_,_,B,B,B,_,_,_],
];
