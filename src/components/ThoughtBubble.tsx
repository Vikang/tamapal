import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import PixelGrid from './PixelGrid';
import { PetStats } from '../types';
import { foodIcon, waterIcon, heartIcon, sleepIcon } from '../data/roomSprites';

interface ThoughtBubbleProps {
  stats: PetStats;
}

const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({ stats }) => {
  const [visible, setVisible] = useState(true);

  // Determine what to show
  const needsFood = stats.hunger < 30;
  const needsHappy = stats.happiness < 30;
  const needsClean = stats.cleanliness < 30;
  const needsSleep = stats.energy < 30;

  const hasNeed = needsFood || needsHappy || needsClean || needsSleep;

  // Blink effect
  useEffect(() => {
    if (!hasNeed) return;
    const interval = setInterval(() => {
      setVisible(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, [hasNeed]);

  if (!hasNeed || !visible) return null;

  // Pick highest priority need
  const icon = needsFood ? foodIcon
    : needsSleep ? sleepIcon
    : needsClean ? waterIcon
    : heartIcon;

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <PixelGrid data={icon} pixelSize={4} />
      </View>
      <View style={styles.dotLarge} />
      <View style={styles.dotSmall} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -13,
    right: -27,
    alignItems: 'center',
  },
  bubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 5,
    borderWidth: 1,
    borderColor: '#AAA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  dotLarge: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#FFF',
    borderWidth: 0.5,
    borderColor: '#AAA',
    marginTop: 1,
    alignSelf: 'flex-start',
    marginLeft: 7,
  },
  dotSmall: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFF',
    borderWidth: 0.5,
    borderColor: '#AAA',
    marginTop: 1,
    alignSelf: 'flex-start',
  },
});

export default ThoughtBubble;
