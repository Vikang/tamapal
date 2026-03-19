import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Pressable, Image, Platform } from 'react-native';
import { usePetStore } from '../store/petStore';

const eggSprite = require('../assets/sprites/egg_normal_01.png');

// Suggested pet names — cute Japanese-inspired names
const SUGGESTED_NAMES = [
  'Mochi', 'Tama', 'Puff', 'Kiki', 'Nori', 'Yuki', 'Sora', 'Hana',
  'Maru', 'Kumo', 'Pip', 'Luna', 'Zen', 'Boba', 'Tofu', 'Dango',
  'Niko', 'Fuji', 'Riko', 'Miso', 'Sake', 'Yuzu', 'Goma', 'Azuki',
];

function getRandomName(): string {
  return SUGGESTED_NAMES[Math.floor(Math.random() * SUGGESTED_NAMES.length)];
}

const NameEggScreen: React.FC = () => {
  const [name, setName] = useState(getRandomName);
  const setPetName = usePetStore(s => s.setPetName);
  const setGamePhase = usePetStore(s => s.setGamePhase);

  const pixelated = Platform.OS === 'web' ? ({ imageRendering: 'pixelated' } as any) : {};

  const handleSet = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPetName(trimmed.slice(0, 20));
    setGamePhase('playing');
  };

  return (
    <View style={styles.container}>
      {/* Egg sprite */}
      <View style={styles.eggContainer}>
        <Image
          source={eggSprite}
          style={[styles.eggImage, pixelated]}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>NAME YOUR NEW{'\n'}EGG :</Text>

      {/* Name input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          maxLength={20}
          autoFocus
          selectTextOnFocus
          placeholder="Enter name..."
          placeholderTextColor="#CCC"
        />
      </View>

      {/* SET button */}
      <Pressable style={styles.setButton} onPress={handleSet}>
        <Text style={styles.setButtonText}>SET</Text>
      </Pressable>
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
    padding: 16,
    gap: 10,
  },
  eggContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  eggImage: {
    width: 32,
    height: 32,
  },
  title: {
    fontFamily: 'VCROSDMono',
    fontSize: 14,
    color: '#02015D',
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 20,
  },
  inputContainer: {
    width: '90%' as any,
    borderWidth: 2,
    borderColor: '#F5A623',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  input: {
    fontFamily: 'VCROSDMono',
    fontSize: 14,
    color: '#F5A623',
    textTransform: 'uppercase',
    outlineStyle: 'none',
  } as any,
  setButton: {
    width: '90%' as any,
    borderWidth: 2,
    borderColor: '#F5A623',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  setButtonText: {
    fontFamily: 'VCROSDMono',
    fontSize: 14,
    color: '#F5A623',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
});

export default NameEggScreen;
