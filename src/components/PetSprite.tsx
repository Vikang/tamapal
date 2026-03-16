import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import SpriteRenderer from './SpriteRenderer';
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

// Baby character sprite sheet from TamaWeb (64x64 → 4x4 grid of 16x16 cells)
const characterSprite = require('../assets/sprites/chara_1b.png');

interface PetSpriteProps {
  mood: PetMood;
  pixelSize?: number;
}

// Animation config for sprite sheet mode
// The TamaWeb sprite sheets are 4x4 grids (32x32 per cell)
// Row 0 = idle/walk frames, we cycle through columns
const SPRITE_ANIMATION: Record<PetMood, { row: number; frames: number[]; speed: number }> = {
  idle:     { row: 0, frames: [0, 1, 2, 1],    speed: 500 },
  eating:   { row: 1, frames: [0, 1],           speed: 300 },
  bathing:  { row: 2, frames: [0, 1],           speed: 600 },
  sleeping: { row: 3, frames: [0, 1],           speed: 800 },
  happy:    { row: 0, frames: [0, 1, 2, 3],     speed: 250 },
  sad:      { row: 1, frames: [2, 3],           speed: 1000 },
  dirty:    { row: 2, frames: [2, 3],           speed: 600 },
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

const PetSprite: React.FC<PetSpriteProps> = ({ mood, pixelSize = 7 }) => {
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
          row={config.row}
          scale={6}
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
