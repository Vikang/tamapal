import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { View, Pressable, Image, StyleSheet, Platform, ImageSourcePropType, Text, TouchableOpacity } from 'react-native';
import DeviceScreen from './DeviceScreen';
import { playButtonClick } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

// Lazy load InspectView — Three.js won't be imported until inspect is toggled
const InspectView = React.lazy(() => import('./InspectView'));

interface EggShellProps {
  onLeftPress: () => void;
  onMiddlePress: () => void;
  onRightPress: () => void;
  isInspectMode: boolean;
  onToggleInspect: () => void;
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

const EggShell: React.FC<EggShellProps> = ({ onLeftPress, onMiddlePress, onRightPress, isInspectMode, onToggleInspect }) => {
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

    // 3. After 150ms, reset image then call the action handler
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setPressedButton(null);
      // Small delay before handler so the image reset renders first
      requestAnimationFrame(() => {
        handler();
      });
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
      // 'i' toggles inspect mode
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        onToggleInspect();
        return;
      }

      // Don't handle game keys in inspect mode
      if (isInspectMode) return;

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
  }, [handleLeft, handleMiddle, handleRight, isInspectMode, onToggleInspect]);

  return (
    <View style={styles.outerWrapper}>
      <View style={styles.container}>
        {isInspectMode ? (
          /* ── Inspect Mode: 3D rotatable view ── */
          <Suspense fallback={
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading 3D...</Text>
            </View>
          }>
            <InspectView />
          </Suspense>
        ) : (
          /* ── Play Mode: existing PNG system (unchanged) ── */
          <>
            {/* 1 ▸ Game screen – renders BEHIND the egg PNG */}
            <View style={styles.screenPosition}>
              <DeviceScreen />
            </View>

            {/* 2 ▸ All egg frames pre-rendered, toggle via opacity (no flash on swap) */}
            <Image
              source={EGG_REST}
              style={[styles.eggImage, { opacity: pressedButton ? 0 : 1 }]}
              resizeMode="contain"
            />
            <Image
              source={EGG_LEFT_PRESSED}
              style={[styles.eggImage, { opacity: pressedButton === 'left' ? 1 : 0 }]}
              resizeMode="contain"
            />
            <Image
              source={EGG_MIDDLE_PRESSED}
              style={[styles.eggImage, { opacity: pressedButton === 'middle' ? 1 : 0 }]}
              resizeMode="contain"
            />
            <Image
              source={EGG_RIGHT_PRESSED}
              style={[styles.eggImage, { opacity: pressedButton === 'right' ? 1 : 0 }]}
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
          </>
        )}
      </View>

      {/* ── Toggle button below the egg ── */}
      <TouchableOpacity
        onPress={onToggleInspect}
        style={styles.toggleButton}
        activeOpacity={0.7}
      >
        <Text style={styles.toggleText}>
          {isInspectMode ? '🎮 Play' : '🔍 Inspect'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    alignItems: 'center',
  },
  container: {
    width: EGG_DISPLAY_W,
    height: EGG_DISPLAY_H,
    position: 'relative' as const,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
  },
  toggleButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 115, 85, 0.15)',
  },
  toggleText: {
    fontSize: 13,
    color: '#8B7355',
    fontWeight: '500',
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
