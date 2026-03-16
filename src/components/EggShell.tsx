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
      size: 2 + next() * 3.3,
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

const EGG_WIDTH = 360;
const EGG_HEIGHT = 530;

const styles = StyleSheet.create({
  eggOuter: {
    width: EGG_WIDTH + 27,
    height: EGG_HEIGHT + 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eggShadow: {
    position: 'absolute',
    bottom: 0,
    width: EGG_WIDTH * 0.7,
    height: 27,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 133,
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
    borderWidth: 3,
    borderColor: '#C8C0B0',
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 13,
  },
  // 3D gradient highlight (top-left light source)
  gradientHighlight: {
    position: 'absolute',
    top: -27,
    left: -27,
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
    width: 40,
    height: EGG_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  gradientEdgeRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
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
    marginTop: 60,
    backgroundColor: '#B8C8B0',
    borderRadius: 11,
    padding: 5,
    // Recessed shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 7,
    borderWidth: 1,
    borderColor: '#A8A098',
  },
  // Button row
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    gap: 24,
  },
  button: {
    width: 59,
    height: 43,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    // 3D button effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
  },
  buttonLeft: {
    backgroundColor: '#D4A8C8',
    borderColor: '#B888A8',
  },
  buttonMiddle: {
    backgroundColor: '#D4C4A8',
    borderColor: '#B8A888',
    width: 64,
    height: 48,
    borderRadius: 24,
  },
  buttonRight: {
    backgroundColor: '#A8C8D4',
    borderColor: '#88A8B8',
  },
  buttonPressed: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    transform: [{ translateY: 3 }],
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  arrowLeft: {
    borderRightWidth: 11,
    borderRightColor: '#7A5A6A',
  },
  arrowRight: {
    borderLeftWidth: 11,
    borderLeftColor: '#5A7A8A',
  },
  buttonDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#8A7A60',
  },
});

export default EggShell;
