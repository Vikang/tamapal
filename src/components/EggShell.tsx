import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Pressable, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import DeviceScreen from './DeviceScreen';
import { playButtonClick } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';

// GLB asset — Expo bundler resolves this to a URL on web
const GLB_ASSET = require('../assets/tamagotchi.glb');

interface EggShellProps {
  onLeftPress: () => void;
  onMiddlePress: () => void;
  onRightPress: () => void;
  isInspectMode: boolean;
  onToggleInspect: () => void;
}

// ── Layout constants ──────────────────────────────────────────────
// model-viewer container size
const VIEWER_W = 600;
const VIEWER_H = 750;

// LCD overlay position (percentage-based, tuned for the GLB front view)
// These are percentages of the viewer container
const LCD_TOP_PCT = 37.5;
const LCD_LEFT_PCT = 31.5;
const LCD_W_PCT = 37;
const LCD_H_PCT = 24;

// Button touch targets (percentage-based positions over 3D dome buttons)
const BUTTONS = [
  { id: 'left' as const, left: 34, top: 71, handler: 'onLeftPress' as const },
  { id: 'middle' as const, left: 45.5, top: 74, handler: 'onMiddlePress' as const },
  { id: 'right' as const, left: 57, top: 71, handler: 'onRightPress' as const },
];

const BTN_SIZE_PCT = 8; // width & height as % of viewer

// Animation names in the GLB
const ANIM_MAP: Record<string, string> = {
  left: 'Button_LeftAction.005',
  middle: 'Button_MiddleAction.005',
  right: 'Button_RightAction.005',
};

type ButtonId = 'left' | 'middle' | 'right';

const EggShell: React.FC<EggShellProps> = ({
  onLeftPress,
  onMiddlePress,
  onRightPress,
  isInspectMode,
  onToggleInspect,
}) => {
  const containerIdRef = useRef(`eggshell-mv-${Date.now()}`);
  const modelViewerRef = useRef<any>(null);
  const [mvReady, setMvReady] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load model-viewer from CDN & create element ──────────────
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const containerId = containerIdRef.current;

    const loadModelViewer = (): Promise<void> =>
      new Promise((resolve, reject) => {
        if (customElements.get('model-viewer')) {
          resolve();
          return;
        }
        const s = document.createElement('script');
        s.type = 'module';
        s.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
        s.onload = () => resolve();
        s.onerror = reject;
        document.head.appendChild(s);
      });

    (async () => {
      await loadModelViewer();

      const container = document.getElementById(containerId);
      if (!container) return;

      // Resolve GLB URL
      let url: string;
      if (typeof GLB_ASSET === 'string') url = GLB_ASSET;
      else if (GLB_ASSET?.default) url = GLB_ASSET.default;
      else if (GLB_ASSET?.uri) url = GLB_ASSET.uri;
      else url = String(GLB_ASSET);

      // Create model-viewer element
      const mv = document.createElement('model-viewer');
      mv.setAttribute('src', url);
      mv.setAttribute('interaction-prompt', 'none');
      mv.setAttribute('camera-orbit', '0deg 90deg 4m');
      mv.setAttribute('disable-zoom', '');
      mv.setAttribute('environment-image', 'neutral');
      mv.setAttribute('exposure', '1.2');
      mv.setAttribute('shadow-intensity', '0.3');
      mv.style.width = '100%';
      mv.style.height = '100%';
      mv.style.backgroundColor = 'transparent';
      mv.style.setProperty('--poster-color', 'transparent');

      // Store ref
      modelViewerRef.current = mv;
      container.appendChild(mv);

      // Wait for model load
      mv.addEventListener('load', () => {
        setMvReady(true);
      });
    })();

    return () => {
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = '';
      modelViewerRef.current = null;
    };
  }, []);

  // ── Toggle camera-controls based on inspect mode ──────────────
  useEffect(() => {
    const mv = modelViewerRef.current;
    if (!mv) return;

    if (isInspectMode) {
      mv.setAttribute('camera-controls', '');
      mv.removeAttribute('disable-zoom');
      mv.setAttribute('min-camera-orbit', 'auto 30deg auto');
      mv.setAttribute('max-camera-orbit', 'auto 150deg auto');
      mv.setAttribute('shadow-intensity', '0');
    } else {
      mv.removeAttribute('camera-controls');
      mv.setAttribute('disable-zoom', '');
      mv.removeAttribute('min-camera-orbit');
      mv.removeAttribute('max-camera-orbit');
      // Reset camera to front view
      mv.setAttribute('camera-orbit', '0deg 90deg 4m');
      mv.setAttribute('shadow-intensity', '0.3');
    }
  }, [isInspectMode, mvReady]);

  // ── Button press handler ──────────────────────────────────────
  const handleButtonPress = useCallback(
    (buttonId: ButtonId, handler: () => void) => {
      // Sound + haptic
      playButtonClick();
      triggerHaptic('light');

      // Try to play GLB animation
      const mv = modelViewerRef.current;
      if (mv && mv.availableAnimations?.length) {
        const animName = ANIM_MAP[buttonId];
        if (animName && mv.availableAnimations.includes(animName)) {
          mv.animationName = animName;
          mv.play({ repetitions: 1 });
        }
      }

      // Fire action after a short delay (let animation start)
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        handler();
        timeoutRef.current = null;
      }, 120);
    },
    [],
  );

  const handleLeft = useCallback(
    () => handleButtonPress('left', onLeftPress),
    [handleButtonPress, onLeftPress],
  );
  const handleMiddle = useCallback(
    () => handleButtonPress('middle', onMiddlePress),
    [handleButtonPress, onMiddlePress],
  );
  const handleRight = useCallback(
    () => handleButtonPress('right', onRightPress),
    [handleButtonPress, onRightPress],
  );

  const handlerMap: Record<string, () => void> = {
    onLeftPress: handleLeft,
    onMiddlePress: handleMiddle,
    onRightPress: handleRight,
  };

  // ── Keyboard support (web) ────────────────────────────────────
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        onToggleInspect();
        return;
      }

      // Don't handle game keys in inspect mode
      if (isInspectMode) return;

      switch (e.key) {
        case 'a':
        case 'A':
        case 'ArrowLeft':
          e.preventDefault();
          handleLeft();
          break;
        case 's':
        case 'S':
        case 'ArrowDown':
        case 'Enter':
        case ' ':
          e.preventDefault();
          handleMiddle();
          break;
        case 'd':
        case 'D':
        case 'ArrowRight':
        case 'Escape':
          e.preventDefault();
          handleRight();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleLeft, handleMiddle, handleRight, isInspectMode, onToggleInspect]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.outerWrapper}>
        <View style={styles.container}>
          <Text style={styles.fallbackText}>3D view requires web platform</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerWrapper}>
      <View style={styles.container}>
        {/* Layer 0: model-viewer (always on) */}
        <div
          id={containerIdRef.current}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute' as any,
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />

        {/* Layer 1: LCD overlay (always visible) */}
        <View
          style={[
            styles.lcdOverlay,
            {
              top: `${LCD_TOP_PCT}%` as any,
              left: `${LCD_LEFT_PCT}%` as any,
              width: `${LCD_W_PCT}%` as any,
              height: `${LCD_H_PCT}%` as any,
            },
          ]}
          pointerEvents={isInspectMode ? 'none' : 'none'}
        >
          <DeviceScreen />
        </View>

        {/* Layer 2: Invisible button touch targets (disabled in inspect mode) */}
        {!isInspectMode &&
          BUTTONS.map((btn) => (
            <Pressable
              key={btn.id}
              onPress={handlerMap[btn.handler]}
              style={[
                styles.btnHit,
                {
                  left: `${btn.left}%` as any,
                  top: `${btn.top}%` as any,
                  width: `${BTN_SIZE_PCT}%` as any,
                  height: `${BTN_SIZE_PCT}%` as any,
                  borderRadius: 999,
                },
              ]}
            />
          ))}

        {/* Inspect mode indicator */}
        {isInspectMode && (
          <View style={styles.inspectBadge} pointerEvents="none">
            <Text style={styles.inspectBadgeText}>🔍 Drag to rotate</Text>
          </View>
        )}
      </View>

      {/* Toggle button below */}
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
    width: VIEWER_W,
    height: VIEWER_H,
    position: 'relative' as const,
  },
  fallbackText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 14,
  },
  lcdOverlay: {
    position: 'absolute',
    zIndex: 1,
    overflow: 'hidden',
    borderRadius: 6,
  },
  btnHit: {
    position: 'absolute',
    zIndex: 2,
  },
  inspectBadge: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    left: '50%' as any,
    transform: [{ translateX: -60 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 3,
  },
  inspectBadgeText: {
    color: '#fff',
    fontSize: 12,
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
});

export default EggShell;
