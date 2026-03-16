import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Pressable, Image, StyleSheet, Platform, ImageSourcePropType } from 'react-native';
import DeviceScreen from './DeviceScreen';
import { playButtonClick } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

interface EggShellProps {
  onLeftPress: () => void;
  onMiddlePress: () => void;
  onRightPress: () => void;
}

// ── Preload all egg frame images ──────────────────────────────────
const EGG_REST = require('../assets/egg-rest.png');
const EGG_LEFT_PRESSED = require('../assets/egg-left-pressed.png');
const EGG_MIDDLE_PRESSED = require('../assets/egg-middle-pressed.png');
const EGG_RIGHT_PRESSED = require('../assets/egg-right-pressed.png');

const EGG_FRAMES: Record<string, ImageSourcePropType> = {
  left: EGG_LEFT_PRESSED,
  middle: EGG_MIDDLE_PRESSED,
  right: EGG_RIGHT_PRESSED,
};

// ── Layout constants ──────────────────────────────────────────────
// The 3D egg render is 800×1000 px. We display it at 340 px wide.
const IMG_W = 1000;
const IMG_H = 1250;
const EGG_DISPLAY_W = 600;
const SCALE = EGG_DISPLAY_W / IMG_W; // 0.425
const EGG_DISPLAY_H = IMG_H * SCALE; // 425

// Screen cutout in the source image (measured from alpha channel)
const CUT_X = 346;
const CUT_Y = 471;
const CUT_W = 306;
const CUT_H = 306; // square cutout

// Scaled cutout position & size
const SCREEN_LEFT = Math.round(CUT_X * SCALE);
const SCREEN_TOP = Math.round(CUT_Y * SCALE);
const SCREEN_W = Math.round(CUT_W * SCALE);
const SCREEN_H = Math.round(CUT_H * SCALE);

// Button centres in the source image (approximate from Blender model)
const BTN_RADIUS = 22; // touch target radius at display scale
// Button centres in 1000x1250 image
const buttons = [
  { x: 388, y: 900 }, // A – left
  { x: 500, y: 938 }, // B – middle
  { x: 612, y: 900 }, // C – right
];

type ButtonId = 'left' | 'middle' | 'right';

const PRESS_DURATION_MS = 150;

const EggShell: React.FC<EggShellProps> = ({ onLeftPress, onMiddlePress, onRightPress }) => {
  const [pressedButton, setPressedButton] = useState<ButtonId | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleButtonPress = useCallback((buttonId: ButtonId, handler: () => void) => {
    // 1. Play click sound + haptic feedback (fire-and-forget)
    playButtonClick();
    triggerHaptic('light');

    // 2. Swap to pressed frame
    setPressedButton(buttonId);

    // 3. After 150ms, reset image and call the action handler
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPressedButton(null);
      handler();
      timeoutRef.current = null;
    }, PRESS_DURATION_MS);
  }, []);

  const handleLeft = useCallback(() => handleButtonPress('left', onLeftPress), [handleButtonPress, onLeftPress]);
  const handleMiddle = useCallback(() => handleButtonPress('middle', onMiddlePress), [handleButtonPress, onMiddlePress]);
  const handleRight = useCallback(() => handleButtonPress('right', onRightPress), [handleButtonPress, onRightPress]);

  const btnHandlers = [handleLeft, handleMiddle, handleRight];

  // ── Keyboard support (web) ────────────────────────────────────
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'a': case 'A': case 'ArrowLeft':
          e.preventDefault(); handleLeft(); break;
        case 's': case 'S': case 'ArrowDown': case 'Enter': case ' ':
          e.preventDefault(); handleMiddle(); break;
        case 'd': case 'D': case 'ArrowRight': case 'Escape':
          e.preventDefault(); handleRight(); break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleLeft, handleMiddle, handleRight]);

  // Select the correct egg frame based on pressed state
  const eggSource = pressedButton ? EGG_FRAMES[pressedButton] : EGG_REST;

  return (
    <View style={styles.container}>
      {/* 1 ▸ Game screen – renders BEHIND the egg PNG */}
      <View style={styles.screenPosition}>
        <DeviceScreen />
      </View>

      {/* 2 ▸ 3D egg PNG overlay – transparent screen hole lets game show through */}
      <Image
        source={eggSource}
        style={styles.eggImage}
        resizeMode="contain"
      />

      {/* 3 ▸ Invisible touch targets over the dome buttons */}
      {buttons.map((btn, i) => (
        <Pressable
          key={i}
          onPress={btnHandlers[i]}
          style={[
            styles.btnHit,
            {
              left: Math.round(btn.x * SCALE) - BTN_RADIUS,
              top: Math.round(btn.y * SCALE) - BTN_RADIUS,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: EGG_DISPLAY_W,
    height: EGG_DISPLAY_H,
    position: 'relative' as const,
  },
  screenPosition: {
    position: 'absolute',
    left: SCREEN_LEFT,
    top: SCREEN_TOP,
    width: SCREEN_W,
    height: SCREEN_H,
    zIndex: 0,
    overflow: 'hidden',
    borderRadius: 6,
  },
  eggImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: EGG_DISPLAY_W,
    height: EGG_DISPLAY_H,
    zIndex: 1,
    pointerEvents: 'none' as any, // Let clicks pass through to buttons behind
  },
  btnHit: {
    position: 'absolute',
    width: BTN_RADIUS * 2,
    height: BTN_RADIUS * 2,
    borderRadius: BTN_RADIUS,
    zIndex: 2,
    // Uncomment to debug: backgroundColor: 'rgba(255,0,0,0.3)',
  },
});

export default EggShell;
