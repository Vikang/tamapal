import React from 'react';
import { View, Pressable, Text, StyleSheet, Platform } from 'react-native';
import DeviceScreen from './DeviceScreen';

interface EggShellProps {
  onLeftPress: () => void;
  onMiddlePress: () => void;
  onRightPress: () => void;
}

/**
 * Crown/zigzag bezel with iridescent silver→lavender gradient.
 */
const CrownBezel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const triH = 15;
  const hCount = 8;
  const vCount = 5;

  const colorAt = (t: number) => {
    // Silver (#D0CCD8) → Lavender (#B098C0)
    const r = Math.round(208 + (176 - 208) * t);
    const g = Math.round(204 + (152 - 204) * t);
    const b = Math.round(216 + (192 - 216) * t);
    return `rgb(${r},${g},${b})`;
  };

  const tri = (dir: 'up' | 'down' | 'left' | 'right', idx: number, c: string) => {
    const hw = triH / 2 + 3;
    const s: any = {
      width: 0, height: 0,
      borderLeftColor: 'transparent', borderRightColor: 'transparent',
      borderTopColor: 'transparent', borderBottomColor: 'transparent',
    };
    if (dir === 'up') { s.borderLeftWidth = hw; s.borderRightWidth = hw; s.borderBottomWidth = triH; s.borderBottomColor = c; }
    else if (dir === 'down') { s.borderLeftWidth = hw; s.borderRightWidth = hw; s.borderTopWidth = triH; s.borderTopColor = c; }
    else if (dir === 'left') { s.borderTopWidth = hw - 1; s.borderBottomWidth = hw - 1; s.borderRightWidth = triH; s.borderRightColor = c; }
    else { s.borderTopWidth = hw - 1; s.borderBottomWidth = hw - 1; s.borderLeftWidth = triH; s.borderLeftColor = c; }
    return <View key={`${dir}-${idx}`} style={s} />;
  };

  // FIX 3: Gradient direction — top row = silver (t=0), bottom row = lavender (t=1)
  // Top row triangles: t≈0 (silver)
  // Side triangles: t goes 0→1 top-to-bottom
  // Bottom row triangles: t≈1 (lavender)
  return (
    <View style={styles.crownOuter}>
      <View style={styles.crownRow}>
        {Array.from({ length: hCount }, (_, i) => tri('up', i, colorAt(0)))}
      </View>
      <View style={styles.crownMiddle}>
        <View style={styles.crownCol}>
          {Array.from({ length: vCount }, (_, i) => tri('left', i, colorAt(vCount > 1 ? i / (vCount - 1) : 0.5)))}
        </View>
        <View style={styles.crownInner}>
          {children}
        </View>
        <View style={styles.crownCol}>
          {Array.from({ length: vCount }, (_, i) => tri('right', i, colorAt(vCount > 1 ? i / (vCount - 1) : 0.5)))}
        </View>
      </View>
      <View style={styles.crownRow}>
        {Array.from({ length: hCount }, (_, i) => tri('down', i, colorAt(1)))}
      </View>
    </View>
  );
};

const EggShell: React.FC<EggShellProps> = ({ onLeftPress, onMiddlePress, onRightPress }) => {
  return (
    <View style={styles.eggOuter}>
      {/* Soft elliptical shadow */}
      <View style={styles.eggShadow} />

      {/* Main egg body */}
      <View style={[styles.eggBody, eggBodyWebStyle]}>
        {/* Edge darkening — left side */}
        <View style={[styles.edgeLeft, edgeLeftWebStyle]} />
        {/* Edge darkening — right side */}
        <View style={[styles.edgeRight, edgeRightWebStyle]} />
        {/* Bottom darkening for 3D curvature */}
        <View style={[styles.edgeBottom, edgeBottomWebStyle]} />

        {/* Speckle dots */}
        {Array.from({ length: 55 }, (_, i) => (
          <View
            key={`sp-${i}`}
            style={[styles.speck, {
              top: `${(i * 17 + 3) % 94}%` as any,
              left: `${(i * 23 + 5) % 90}%` as any,
              width: (i % 3) + 1.5, height: (i % 3) + 1.5,
              opacity: 0.08 + (i % 4) * 0.03,
            }]}
          />
        ))}

        {/* Silver cap — bottom portion */}
        <View style={styles.silverCapWrap}>
          {/* Jagged top edge */}
          <View style={styles.jaggedRow}>
            {Array.from({ length: 18 }, (_, i) => (
              <View key={`j-${i}`} style={{
                width: 0, height: 0,
                borderLeftWidth: 9, borderRightWidth: 9,
                borderBottomWidth: 6 + (i % 3) * 3,
                borderLeftColor: 'transparent', borderRightColor: 'transparent',
                borderBottomColor: i % 2 === 0 ? '#C4C2CC' : '#BBB9C6',
              }} />
            ))}
          </View>
          <View style={[styles.silverCap, silverCapWebStyle]}>
            {/* Primary metallic sheen */}
            <View style={[styles.sheenPrimary, sheenWebStyle]} />
            {/* Secondary soft glow */}
            <View style={styles.sheenSecondary} />
          </View>
        </View>

        {/* Big glossy highlight — upper right (specular) */}
        <View style={[styles.glossBig, glossBigWebStyle]} />
        {/* Smaller secondary highlight */}
        <View style={[styles.glossMed, glossMedWebStyle]} />

        {/* Brand label */}
        <Text style={styles.brandLabel}>TAMAPAL</Text>

        {/* Crown bezel + screen */}
        <CrownBezel>
          <DeviceScreen />
        </CrownBezel>

        {/* Three round 3D dome buttons */}
        <View style={styles.buttonRow}>
          {[onLeftPress, onMiddlePress, onRightPress].map((fn, i) => (
            <Pressable
              key={i}
              onPress={fn}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >
              {/* Dome highlight */}
              <View style={styles.btnShine} />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

// Fat, round egg — wider bottom, narrower top
const EGG_WIDTH = 320;
const EGG_HEIGHT = 420;

const eggBodyWebStyle = Platform.OS === 'web'
  ? {
      borderTopLeftRadius: '50% 60%' as any,
      borderTopRightRadius: '50% 60%' as any,
      borderBottomLeftRadius: '50% 40%' as any,
      borderBottomRightRadius: '50% 40%' as any,
    }
  : {
      borderTopLeftRadius: EGG_WIDTH * 0.50,
      borderTopRightRadius: EGG_WIDTH * 0.50,
      borderBottomLeftRadius: EGG_WIDTH * 0.45,
      borderBottomRightRadius: EGG_WIDTH * 0.45,
    };

const silverCapWebStyle = Platform.OS === 'web'
  ? { borderBottomLeftRadius: '50% 70%' as any, borderBottomRightRadius: '50% 70%' as any }
  : { borderBottomLeftRadius: EGG_WIDTH * 0.5, borderBottomRightRadius: EGG_WIDTH * 0.5 };

const sheenWebStyle = Platform.OS === 'web'
  ? { borderRadius: '50%' as any } : { borderRadius: 100 };

const glossBigWebStyle = Platform.OS === 'web'
  ? { borderRadius: '50%' as any } : { borderRadius: 100 };

const glossMedWebStyle = Platform.OS === 'web'
  ? { borderRadius: '50%' as any } : { borderRadius: 80 };

const edgeLeftWebStyle = Platform.OS === 'web'
  ? { borderRadius: '50%' as any } : { borderRadius: 200 };

const edgeRightWebStyle = Platform.OS === 'web'
  ? { borderRadius: '50%' as any } : { borderRadius: 200 };

const edgeBottomWebStyle = Platform.OS === 'web'
  ? { borderRadius: '50%' as any } : { borderRadius: 200 };

const styles = StyleSheet.create({
  eggOuter: {
    width: EGG_WIDTH + 60,
    height: EGG_HEIGHT + 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eggShadow: {
    position: 'absolute',
    bottom: 4,
    width: EGG_WIDTH * 0.6,
    height: 30,
    backgroundColor: 'rgba(80,60,40,0.15)',
    borderRadius: 100,
  },
  eggBody: {
    width: EGG_WIDTH,
    height: EGG_HEIGHT,
    backgroundColor: '#EFE9DE', // Warm eggshell
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: '#CCC4B4',
    // Strong outer shadow for 3D lift
    shadowColor: '#4A3A2A',
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.30,
    shadowRadius: 20,
    elevation: 16,
  },
  // Edge darkening for 3D curvature
  edgeLeft: {
    position: 'absolute',
    top: '10%',
    left: -15,
    width: 60,
    height: '80%',
    backgroundColor: 'rgba(0,0,0,0.06)',
    zIndex: 0,
  },
  edgeRight: {
    position: 'absolute',
    top: '10%',
    right: -15,
    width: 60,
    height: '80%',
    backgroundColor: 'rgba(0,0,0,0.04)',
    zIndex: 0,
  },
  edgeBottom: {
    position: 'absolute',
    bottom: -20,
    left: '10%',
    width: '80%',
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.05)',
    zIndex: 0,
  },
  speck: {
    position: 'absolute',
    backgroundColor: '#999',
    borderRadius: 2,
    zIndex: 1,
  },
  // Silver cap
  silverCapWrap: {
    position: 'absolute',
    bottom: -2,
    left: -3,
    right: -3,
    height: EGG_HEIGHT * 0.28,
    zIndex: 2,
  },
  silverCap: {
    flex: 1,
    backgroundColor: '#C0BEC8',
    overflow: 'hidden',
  },
  sheenPrimary: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    width: '60%',
    height: '55%',
    backgroundColor: 'rgba(255,255,255,0.35)',
    transform: [{ rotate: '10deg' }, { scaleY: 0.65 }],
  },
  sheenSecondary: {
    position: 'absolute',
    top: 5,
    left: '15%',
    width: '35%',
    height: '35%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 60,
  },
  jaggedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: -1,
  },
  // 3D highlights
  glossBig: {
    position: 'absolute',
    top: EGG_HEIGHT * 0.06,
    right: 18,
    width: EGG_WIDTH * 0.40,
    height: EGG_HEIGHT * 0.24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    transform: [{ rotate: '-15deg' }, { scaleY: 0.75 }],
    zIndex: 3,
  },
  glossMed: {
    position: 'absolute',
    top: EGG_HEIGHT * 0.38,
    left: 20,
    width: EGG_WIDTH * 0.15,
    height: EGG_HEIGHT * 0.10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    transform: [{ rotate: '8deg' }],
    zIndex: 3,
  },
  // Brand label
  brandLabel: {
    marginTop: 18,
    fontSize: 21,
    fontWeight: '900',
    color: '#444',
    letterSpacing: 5,
    textShadowColor: 'rgba(255,255,255,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
    zIndex: 4,
  },
  // Crown bezel
  crownOuter: {
    marginTop: 8,
    alignItems: 'center',
    zIndex: 4,
  },
  crownRow: { flexDirection: 'row', justifyContent: 'center' },
  crownCol: { justifyContent: 'center', gap: 1 },
  crownMiddle: { flexDirection: 'row', alignItems: 'center' },
  crownInner: {
    backgroundColor: '#B8A5C8',
    padding: 5,
    borderRadius: 3,
    // Inset shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  // 3D dome buttons
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 30,
    gap: 10,
    zIndex: 4,
  },
  button: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#D8C8A0',
    justifyContent: 'center',
    alignItems: 'center',
    // 3D dome shadow
    shadowColor: '#5A4A30',
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 1.5,
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderLeftColor: 'rgba(255,255,255,0.2)',
    borderBottomColor: '#B8A880',
    borderRightColor: '#C0B090',
    overflow: 'hidden',
  },
  btnShine: {
    position: 'absolute',
    top: 3,
    left: 5,
    width: 18,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 10,
    transform: [{ scaleX: 1.2 }, { rotate: '-5deg' }],
  },
  buttonPressed: {
    backgroundColor: '#C8B890',
    shadowOpacity: 0.15,
    transform: [{ translateY: 2 }],
  },
});

export default EggShell;
