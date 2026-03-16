import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
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

interface PetSpriteProps {
  mood: PetMood;
  pixelSize?: number;
}

const ANIMATION_FRAMES: Record<PetMood, PixelFrame[]> = {
  idle: [idleFrame1, idleFrame2],
  eating: [eatingFrame1, eatingFrame2],
  bathing: [bathFrame1, bathFrame2],
  sleeping: [sleepFrame1, sleepFrame2],
  happy: [happyFrame1, happyFrame2],
  sad: [sadFrame1, sadFrame1], // single frame for sad
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

const PetSprite: React.FC<PetSpriteProps> = ({ mood, pixelSize = 5 }) => {
  const [frameIndex, setFrameIndex] = useState(0);
  const frames = ANIMATION_FRAMES[mood];
  const duration = FRAME_DURATIONS[mood];

  useEffect(() => {
    setFrameIndex(0);
    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frames.length);
    }, duration);
    return () => clearInterval(interval);
  }, [mood, frames.length, duration]);

  return (
    <View style={styles.container}>
      <PixelGrid data={frames[frameIndex]} pixelSize={pixelSize} />
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
