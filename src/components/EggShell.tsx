import React, { useMemo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import DeviceScreen from './DeviceScreen';

interface EggShellProps {
  onLeftPress: () => void;
  onMiddlePress: () => void;
  onRightPress: () => void;
}

// Deterministic speckle positions — created once
function generateSpeckles(count: number, seed: number) {
  const speckles: { top: number; left: number; size: number; opacity: number }[] = [];
  let s = seed;
  const next = () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
  for (let i = 0; i < count; i++) {
    speckles.push({
      top: next() * 100,
      left: next() * 100,
      size: 1.5 + next() * 2.5,
      opacity: 0.08 + next() * 0.15,
    });
  }
  return speckles;
}

const EggShell: React.FC<EggShellProps> = ({ onLeftPress, onMiddlePress, onRightPress }) => {
  const speckles = useMemo(() => generateSpeckles(40, 42), []);

  return (
    <View style={styles.eggOuter}>
      {/* Shadow layer */}
      <View style={styles.eggShadow} />

      {/* Main egg body */}
      <View style={styles.eggBody}>
        {/* 3D gradient layers */}
        <View style={styles.gradientHighlight} />
        <View style={styles.gradientEdgeLeft} />
        <View style={styles.gradientEdgeRight} />
        <View style={styles.gradientBottom} />

        {/* Speckled texture */}
        {speckles.map((sp, i) => (
          <View
            key={i}
            style={[
              styles.speckle,
              {
                top: `${sp.top}%`,
                left: `${sp.left}%`,
                width: sp.size,
                height: sp.size,
                borderRadius: sp.size / 2,
                opacity: sp.opacity,
              },
            ]}
          />
        ))}

        {/* Screen area */}
        <View style={styles.screenArea}>
          <DeviceScreen />
        </View>

        {/* Button area */}
        <View style={styles.buttonRow}>
          <Pressable
            onPress={onLeftPress}
            style={({ pressed }) => [styles.button, styles.buttonLeft, pressed && styles.buttonPressed]}
          >
            <View style={styles.buttonInner}>
              <View style={styles.buttonIcon}>
                <View style={[styles.arrow, styles.arrowLeft]} />
              </View>
            </View>
          </Pressable>

          <Pressable
            onPress={onMiddlePress}
            style={({ pressed }) => [styles.button, styles.buttonMiddle, pressed && styles.buttonPressed]}
          >
            <View style={styles.buttonInner}>
              <View style={styles.buttonDot} />
            </View>
          </Pressable>

          <Pressable
            onPress={onRightPress}
            style={({ pressed }) => [styles.button, styles.buttonRight, pressed && styles.buttonPressed]}
          >
            <View style={styles.buttonInner}>
              <View style={styles.buttonIcon}>
                <View style={[styles.arrow, styles.arrowRight]} />
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const EGG_WIDTH = 270;
const EGG_HEIGHT = 400;

const styles = StyleSheet.create({
  eggOuter: {
    width: EGG_WIDTH + 20,
    height: EGG_HEIGHT + 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eggShadow: {
    position: 'absolute',
    bottom: 0,
    width: EGG_WIDTH * 0.7,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 100,
  },
  eggBody: {
    width: EGG_WIDTH,
    height: EGG_HEIGHT,
    backgroundColor: '#F0EDE5',
    borderTopLeftRadius: EGG_WIDTH * 0.48,
    borderTopRightRadius: EGG_WIDTH * 0.48,
    borderBottomLeftRadius: EGG_WIDTH * 0.42,
    borderBottomRightRadius: EGG_WIDTH * 0.42,
    overflow: 'hidden',
    alignItems: 'center',
    // Outer edge
    borderWidth: 2,
    borderColor: '#C8C0B0',
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  // 3D gradient highlight (top-left light source)
  gradientHighlight: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: EGG_WIDTH * 0.7,
    height: EGG_HEIGHT * 0.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: EGG_WIDTH,
    transform: [{ rotate: '-15deg' }],
  },
  gradientEdgeLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: EGG_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  gradientEdgeRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: EGG_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: EGG_HEIGHT * 0.25,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  // Speckled texture dots
  speckle: {
    position: 'absolute',
    backgroundColor: '#B8A888',
  },
  // Screen recessed area
  screenArea: {
    marginTop: 45,
    backgroundColor: '#B8C8B0',
    borderRadius: 8,
    padding: 4,
    // Recessed shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#A8A098',
  },
  // Button row
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 18,
  },
  button: {
    width: 44,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // 3D button effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1.5,
  },
  buttonLeft: {
    backgroundColor: '#D4A8C8',
    borderColor: '#B888A8',
  },
  buttonMiddle: {
    backgroundColor: '#D4C4A8',
    borderColor: '#B8A888',
    width: 48,
    height: 36,
    borderRadius: 18,
  },
  buttonRight: {
    backgroundColor: '#A8C8D4',
    borderColor: '#88A8B8',
  },
  buttonPressed: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    transform: [{ translateY: 2 }],
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  arrowLeft: {
    borderRightWidth: 8,
    borderRightColor: '#7A5A6A',
  },
  arrowRight: {
    borderLeftWidth: 8,
    borderLeftColor: '#5A7A8A',
  },
  buttonDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8A7A60',
  },
});

export default EggShell;
