import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ZParticle {
  id: number;
  opacity: Animated.Value;
  translateY: Animated.Value;
  translateX: Animated.Value;
  size: number;
}

const SPAWN_INTERVAL = 750; // ms, matching Tamaweb reference
const PARTICLE_LIFETIME = 2500; // ms
const FLOAT_HEIGHT = 60; // pixels upward
const SWAY_AMOUNT = 8; // pixels side-to-side

const SleepParticles: React.FC = () => {
  const [particles, setParticles] = useState<ZParticle[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = nextId.current++;
      const opacity = new Animated.Value(1);
      const translateY = new Animated.Value(0);
      const translateX = new Animated.Value(0);
      // Vary size for depth: small, medium, large
      const sizes = [10, 13, 16];
      const size = sizes[id % sizes.length];

      const particle: ZParticle = { id, opacity, translateY, translateX, size };

      setParticles(prev => [...prev, particle]);

      // Animate float up, sway, and fade
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -FLOAT_HEIGHT,
          duration: PARTICLE_LIFETIME,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: SWAY_AMOUNT,
            duration: PARTICLE_LIFETIME / 4,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -SWAY_AMOUNT,
            duration: PARTICLE_LIFETIME / 2,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: PARTICLE_LIFETIME / 4,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: PARTICLE_LIFETIME,
          useNativeDriver: true,
        }),
      ]).start();

      // Remove particle after lifetime
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== id));
      }, PARTICLE_LIFETIME + 100);
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map(p => (
        <Animated.Text
          key={p.id}
          style={[
            styles.zText,
            {
              fontSize: p.size,
              opacity: p.opacity,
              transform: [
                { translateY: p.translateY },
                { translateX: p.translateX },
              ],
            },
          ]}
        >
          Z
        </Animated.Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // Position above the pet — centered horizontally, starting from pet top area
    bottom: 70,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -10,
    width: 30,
    height: 80,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  zText: {
    position: 'absolute',
    bottom: 0,
    color: '#AAAAAA',
    fontWeight: '900',
    fontFamily: 'monospace',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});

export default SleepParticles;
