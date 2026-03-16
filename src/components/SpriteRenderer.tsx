import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';

/** A single animation frame identified by row and column in the sprite sheet */
export interface SpriteFrame {
  row: number;
  col: number;
}

interface SpriteRendererProps {
  /** Image source — require('./path.png') or { uri: '...' } */
  spriteSheet: ImageSourcePropType;
  /** Width of a single frame in the sheet (px) */
  frameWidth?: number;
  /** Height of a single frame in the sheet (px) */
  frameHeight?: number;
  /** Which row of the sheet to display (0-indexed) — used when animationFrames is column-only */
  row?: number;
  /** Which column of the sheet to display (0-indexed) */
  col?: number;
  /** Display scale multiplier */
  scale?: number;
  /** Total columns in the sprite sheet */
  columns?: number;
  /** Total rows in the sprite sheet */
  rows?: number;
  /** Array of column indices OR {row,col} objects to cycle through for animation */
  animationFrames?: number[] | SpriteFrame[];
  /** Milliseconds per animation frame */
  animationSpeed?: number;
  /** Optional style override for the container */
  style?: object;
}

const SpriteRenderer: React.FC<SpriteRendererProps> = ({
  spriteSheet,
  frameWidth = 32,
  frameHeight = 32,
  row = 0,
  col = 0,
  scale = 3,
  columns = 4,
  rows = 4,
  animationFrames,
  animationSpeed = 500,
  style,
}) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Determine which row/col to render based on current animation frame
  let activeRow = row;
  let activeCol = col;

  if (animationFrames && animationFrames.length > 0) {
    const frame = animationFrames[currentFrameIndex % animationFrames.length];
    if (typeof frame === 'number') {
      // Legacy: array of column indices, use the provided row
      activeCol = frame;
      activeRow = row;
    } else {
      // New: {row, col} objects for cross-row animations
      activeRow = frame.row;
      activeCol = frame.col;
    }
  }

  useEffect(() => {
    if (!animationFrames || animationFrames.length <= 1) return;

    setCurrentFrameIndex(0);
    intervalRef.current = setInterval(() => {
      setCurrentFrameIndex(prev => (prev + 1) % animationFrames.length);
    }, animationSpeed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [animationFrames, animationSpeed]);

  const displayWidth = frameWidth * scale;
  const displayHeight = frameHeight * scale;
  const sheetWidth = columns * frameWidth * scale;
  const sheetHeight = rows * frameHeight * scale;

  // Offset to show the correct frame
  const offsetX = -activeCol * displayWidth;
  const offsetY = -activeRow * displayHeight;

  return (
    <View
      style={[
        {
          width: displayWidth,
          height: displayHeight,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Image
        source={spriteSheet}
        style={[
          {
            width: sheetWidth,
            height: sheetHeight,
            position: 'absolute',
            left: offsetX,
            top: offsetY,
          },
          // Pixel art — no smoothing (web only)
          { imageRendering: 'pixelated' } as any,
        ]}
        resizeMode="stretch"
      />
    </View>
  );
};

export default SpriteRenderer;
