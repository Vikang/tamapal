import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PixelGrid from './PixelGrid';
import { usePetStore } from '../store/petStore';
import { FOOD_OPTIONS } from '../data/foodData';
import { riceBallSprite, appleSprite, cookieSprite } from '../data/petSprites';
import { PixelFrame } from '../types';

const FOOD_SPRITES: Record<string, PixelFrame> = {
  riceball: riceBallSprite,
  apple: appleSprite,
  cookie: cookieSprite,
};

const FoodSelect: React.FC = () => {
  const foodIndex = usePetStore(s => s.foodIndex);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Food</Text>
      <View style={styles.row}>
        {FOOD_OPTIONS.map((food, idx) => (
          <View key={food.id} style={[styles.foodItem, idx === foodIndex && styles.selected]}>
            <PixelGrid data={FOOD_SPRITES[food.id]} pixelSize={4} />
            <Text style={styles.foodName}>{food.name}</Text>
            <Text style={styles.foodStats}>+{food.hungerBoost} hun</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
    backgroundColor: 'rgba(240,237,229,0.95)',
    borderRadius: 11,
    padding: 8,
    borderWidth: 1,
    borderColor: '#C8C0B0',
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  foodItem: {
    alignItems: 'center',
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selected: {
    backgroundColor: 'rgba(200,176,138,0.4)',
    borderColor: '#C4B08A',
  },
  foodName: {
    fontSize: 9,
    fontWeight: '600',
    color: '#555',
    marginTop: 3,
    fontFamily: 'monospace',
  },
  foodStats: {
    fontSize: 8,
    color: '#888',
    fontFamily: 'monospace',
  },
});

export default FoodSelect;
