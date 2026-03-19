import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import SpriteRenderer from './SpriteRenderer';
import { SpriteFrame } from './SpriteRenderer';
import PixelGrid from './PixelGrid';
import { PetMood, PixelFrame } from '../types';
import {
  idleFrame1, idleFrame2,
  eatingFrame1, eatingFrame2,
  bathFrame1, bathFrame2,
  sleepFrame1, sleepFrame2,
  happyFrame1, happyFrame2,
  sadFrame1,
  dirtyFrame1, dirtyFrame2,
} from '../data/petSprites';

// ── Sprite sheet map — require() needs static paths ─────────
// Metro bundler can't resolve dynamic require(), so we map all available sheets
const SPRITE_SHEETS: Record<string, any> = {
  'chara_1b':  require('../assets/sprites/chara_1b.png'),
  'chara_2b':  require('../assets/sprites/chara_2b.png'),
  'chara_3b':  require('../assets/sprites/chara_3b.png'),
  'chara_4b':  require('../assets/sprites/chara_4b.png'),
  'chara_5b':  require('../assets/sprites/chara_5b.png'),
  'chara_6b':  require('../assets/sprites/chara_6b.png'),
  'chara_7b':  require('../assets/sprites/chara_7b.png'),
  'chara_8b':  require('../assets/sprites/chara_8b.png'),
  'chara_9b':  require('../assets/sprites/chara_9b.png'),
  'chara_10b': require('../assets/sprites/chara_10b.png'),
  'chara_11b': require('../assets/sprites/chara_11b.png'),
  'chara_12b': require('../assets/sprites/chara_12b.png'),
  'chara_13b': require('../assets/sprites/chara_13b.png'),
  'chara_14b': require('../assets/sprites/chara_14b.png'),
  'chara_15b': require('../assets/sprites/chara_15b.png'),
  'chara_16b': require('../assets/sprites/chara_16b.png'),
  // Toddler sprites
  'chara_17b': require('../assets/sprites/chara_17b.png'),
  'chara_18b': require('../assets/sprites/chara_18b.png'),
  'chara_19b': require('../assets/sprites/chara_19b.png'),
  'chara_20b': require('../assets/sprites/chara_20b.png'),
  'chara_21b': require('../assets/sprites/chara_21b.png'),
  'chara_22b': require('../assets/sprites/chara_22b.png'),
  // Teen sprites
  'chara_49b': require('../assets/sprites/chara_49b.png'),
  'chara_50b': require('../assets/sprites/chara_50b.png'),
  'chara_51b': require('../assets/sprites/chara_51b.png'),
  'chara_52b': require('../assets/sprites/chara_52b.png'),
  'chara_53b': require('../assets/sprites/chara_53b.png'),
  'chara_54b': require('../assets/sprites/chara_54b.png'),
  // Adult sprites
  'chara_133b': require('../assets/sprites/chara_133b.png'),
  'chara_134b': require('../assets/sprites/chara_134b.png'),
  'chara_135b': require('../assets/sprites/chara_135b.png'),
  'chara_136b': require('../assets/sprites/chara_136b.png'),
  'chara_137b': require('../assets/sprites/chara_137b.png'),
  'chara_138b': require('../assets/sprites/chara_138b.png'),
};

// Egg sprite — no sprite sheet, handled separately
const EGG_SPRITE_KEY = 'egg';

// Default fallback
const DEFAULT_SPRITE = SPRITE_SHEETS['chara_1b'];

interface PetSpriteProps {
  mood: PetMood;
  pixelSize?: number;
  /** Sprite key from character definition (e.g., 'chara_1b') */
  spriteKey?: string;
}

// Animation config for sprite sheet mode — mapped from TamaWeb PetDefinition.js
// Sprite sheet is a 4×4 grid (16 cells, 1-based numbering → 0-based row/col)
// Cell N → row = floor((N-1)/4), col = (N-1) % 4
// Animation mapping from Tamaweb PetDefinition.js (1-based cellNumber):
// Cell N → row = floor((N-1)/4), col = (N-1) % 4
//
// Cell 1:  row:0,col:0 = idle
// Cell 2:  row:0,col:1 = cheering/happy frame 1
// Cell 3:  row:0,col:2 = cheering/happy frame 2
// Cell 4:  row:0,col:3 = uncomfortable/sad frame 1
// Cell 5:  row:1,col:0 = uncomfortable/sad frame 2
// Cell 6:  row:1,col:1 = angry
// Cell 7:  row:1,col:2 = shocked
// Cell 8:  row:1,col:3 = blush
// Cell 9:  row:2,col:0 = idle side
// Cell 10: row:2,col:1 = moving frame 1
// Cell 11: row:2,col:2 = moving frame 2
// Cell 12: row:2,col:3 = side uncomfortable
// Cell 13: row:3,col:0 = (unused / kissing)
// Cell 14: row:3,col:1 = sitting / eating frame 1
// Cell 15: row:3,col:2 = eating frame 2
// Cell 16: row:3,col:3 = sleeping (single frame)
const SPRITE_ANIMATION: Record<PetMood, { frames: SpriteFrame[]; speed: number }> = {
  // idle: cell 1 (single frame, reference uses pixelBreath for subtle animation)
  idle:     { frames: [{row:0,col:0}],                                         speed: 500 },
  // eating: cells 14-15 (sitting + eating mouth open)
  eating:   { frames: [{row:3,col:1}, {row:3,col:2}],                         speed: 250 },
  // bathing: use cheering animation cells 2-3 (reference has no bath-specific anim)
  bathing:  { frames: [{row:0,col:1}, {row:0,col:2}],                         speed: 300 },
  // sleeping: cell 16 (single frame — reference is static with Z particles)
  sleeping: { frames: [{row:3,col:3}],                                         speed: 1000 },
  // happy/cheering: cells 2-3
  happy:    { frames: [{row:0,col:1}, {row:0,col:2}],                         speed: 250 },
  // uncomfortable/sad: cells 4-5
  sad:      { frames: [{row:0,col:3}, {row:1,col:0}],                         speed: 500 },
  // dirty: same as uncomfortable cells 4-5
  dirty:    { frames: [{row:0,col:3}, {row:1,col:0}],                         speed: 600 },
};

// Fallback pixel-art animation frames (original system)
const PIXEL_ANIMATION_FRAMES: Record<PetMood, PixelFrame[]> = {
  idle: [idleFrame1, idleFrame2],
  eating: [eatingFrame1, eatingFrame2],
  bathing: [bathFrame1, bathFrame2],
  sleeping: [sleepFrame1, sleepFrame2],
  happy: [happyFrame1, happyFrame2],
  sad: [sadFrame1, sadFrame1],
  dirty: [dirtyFrame1, dirtyFrame2],
};

const FRAME_DURATIONS: Record<PetMood, number> = {
  idle: 500,
  eating: 300,
  bathing: 600,
  sleeping: 800,
  happy: 350,
  sad: 1000,
  dirty: 600,
};

// Set to true to use sprite sheets, false for pixel art fallback
const USE_SPRITES = true;

const PetSprite: React.FC<PetSpriteProps> = ({ mood, pixelSize = 7, spriteKey }) => {
  // Resolve sprite sheet from key
  const characterSprite = (spriteKey && SPRITE_SHEETS[spriteKey]) || DEFAULT_SPRITE;
  const [frameIndex, setFrameIndex] = useState(0);

  // Pixel grid fallback animation
  const pixelFrames = PIXEL_ANIMATION_FRAMES[mood];
  const pixelDuration = FRAME_DURATIONS[mood];

  useEffect(() => {
    if (USE_SPRITES) return; // Sprite handles its own animation
    setFrameIndex(0);
    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % pixelFrames.length);
    }, pixelDuration);
    return () => clearInterval(interval);
  }, [mood, pixelFrames.length, pixelDuration]);

  // Egg rendering — simple wobbling egg using pixel art
  if (spriteKey === EGG_SPRITE_KEY) {
    const eggPixels: PixelFrame = [
      [null, null, '#F5E6D0', '#F5E6D0', '#F5E6D0', null, null, null],
      [null, '#F5E6D0', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#F5E6D0', null, null],
      ['#F5E6D0', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#F5E6D0', null],
      ['#F5E6D0', '#FFFFFF', '#FFD700', '#FFFFFF', '#FFD700', '#FFFFFF', '#F5E6D0', null],
      ['#F5E6D0', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#F5E6D0', null],
      ['#F5E6D0', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#F5E6D0', null],
      [null, '#F5E6D0', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#F5E6D0', null, null],
      [null, null, '#F5E6D0', '#F5E6D0', '#F5E6D0', null, null, null],
    ];
    return (
      <View style={styles.container}>
        <PixelGrid data={eggPixels} pixelSize={pixelSize} />
      </View>
    );
  }

  if (USE_SPRITES) {
    const config = SPRITE_ANIMATION[mood];
    return (
      <View style={styles.container}>
        <SpriteRenderer
          spriteSheet={characterSprite}
          frameWidth={16}
          frameHeight={16}
          columns={4}
          rows={4}
          scale={2}
          animationFrames={config.frames}
          animationSpeed={config.speed}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PixelGrid data={pixelFrames[frameIndex]} pixelSize={pixelSize} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PetSprite;
