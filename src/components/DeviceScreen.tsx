import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Room from './Room';
import PetSprite from './PetSprite';
import { getCharacter } from '../data/evolution';
import StatusBar from './StatusBar';
import ThoughtBubble from './ThoughtBubble';
import MenuOverlay from './MenuOverlay';
import FoodSelect from './FoodSelect';
import StatsScreen from './StatsScreen';
import SleepParticles from './SleepParticles';
import { usePetStore } from '../store/petStore';

interface DeviceScreenProps {
  onSelect?: () => void;
  /** Whether menu is active — used to control pointer events on overlays */
  isMenuActive?: boolean;
}

const DeviceScreen: React.FC<DeviceScreenProps> = ({ onSelect, isMenuActive }) => {
  const stats = usePetStore(s => s.stats);
  const mood = usePetStore(s => s.mood);
  const deviceMode = usePetStore(s => s.deviceMode);
  const isSleeping = usePetStore(s => s.isSleeping);
  const computeMood = usePetStore(s => s.computeMood);
  const characterId = usePetStore(s => s.characterId);
  const characterDef = getCharacter(characterId);

  // isSleeping is the authoritative flag — check it first
  const currentMood = isSleeping ? 'sleeping'
    : deviceMode === 'feeding' ? 'eating'
    : deviceMode === 'bathing' ? 'bathing'
    : computeMood();

  return (
    <Pressable style={styles.screenOuter} onPress={onSelect}>
      <View style={styles.screenInner}>
        {/* Screen content */}
        <View style={styles.screenContent}>
          {/* Status bar at top — hidden during sleep */}
          {!isSleeping && <StatusBar stats={stats} />}

          {/* Main area */}
          <View style={styles.mainArea}>
            <Room isDimmed={isSleeping} isSleeping={isSleeping} />

            {/* Pet centered */}
            <View style={styles.petContainer}>
              <PetSprite mood={currentMood} pixelSize={4} spriteKey={characterDef?.sprite} />
              {!isSleeping && deviceMode === 'home' && (
                <ThoughtBubble stats={stats} />
              )}
              {/* Floating Z particles during sleep */}
              {isSleeping && <SleepParticles />}
            </View>
          </View>

          {/* Overlays — none shown during sleep */}
          {!isSleeping && deviceMode === 'menu' && <MenuOverlay mode={deviceMode} onSelect={onSelect} />}
          {!isSleeping && deviceMode === 'feeding' && <FoodSelect onSelect={onSelect} onBack={onSelect} />}
          {!isSleeping && deviceMode === 'stats' && <StatsScreen />}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  screenOuter: {
    width: '100%' as any,
    height: '100%' as any,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenInner: {
    width: '100%' as any,
    height: '100%' as any,
    backgroundColor: '#C8D8C0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  screenContent: {
    flex: 1,
    backgroundColor: '#C8D8C0',
  },
  mainArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  petContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -28,
  },
});

export default DeviceScreen;
