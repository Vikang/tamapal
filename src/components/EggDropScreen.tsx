import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, Platform } from 'react-native';
import { usePetStore } from '../store/petStore';

const eggSprite = require('../assets/sprites/egg_normal_01.png');

const EggDropScreen: React.FC = () => {
  const setGamePhase = usePetStore(s => s.setGamePhase);
  const dropY = useRef(new Animated.Value(-60)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(1)).current;

  const pixelated = Platform.OS === 'web' ? ({ imageRendering: 'pixelated' } as any) : {};

  useEffect(() => {
    // Fade in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Egg drops from top to center
    Animated.sequence([
      Animated.timing(dropY, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      // Bounce on landing
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1.2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 1.05,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // After landing + bounce, wait a moment then go to naming
      setTimeout(() => {
        setGamePhase('naming');
      }, 1200);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.eggWrapper,
          {
            opacity,
            transform: [
              { translateY: dropY },
              { scale: bounce },
            ],
          },
        ]}
      >
        <Image
          source={eggSprite}
          style={[styles.eggImage, pixelated]}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F5E6D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eggWrapper: {
    alignItems: 'center',
  },
  eggImage: {
    width: 64,
    height: 64,
  },
});

export default EggDropScreen;
