import React from 'react';
import { View, StyleSheet } from 'react-native';
import Room from './Room';
import PetSprite from './PetSprite';
import StatusBar from './StatusBar';
import ThoughtBubble from './ThoughtBubble';
import MenuOverlay from './MenuOverlay';
import FoodSelect from './FoodSelect';
import StatsScreen from './StatsScreen';
import SleepParticles from './SleepParticles';
import { usePetStore } from '../store/petStore';

const DeviceScreen: React.FC = () => {
  const stats = usePetStore(s => s.stats);
  const mood = usePetStore(s => s.mood);
  const deviceMode = usePetStore(s => s.deviceMode);
  const isSleeping = usePetStore(s => s.isSleeping);
  const computeMood = usePetStore(s => s.computeMood);

  // isSleeping is the authoritative flag — check it first
  const currentMood = isSleeping ? 'sleeping'
    : deviceMode === 'feeding' ? 'eating'
    : deviceMode === 'bathing' ? 'bathing'
    : computeMood();

  return (
    <View style={styles.screenOuter}>
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
              <PetSprite mood={currentMood} pixelSize={6} />
              {!isSleeping && deviceMode === 'home' && (
                <ThoughtBubble stats={stats} />
              )}
              {/* Floating Z particles during sleep */}
              {isSleeping && <SleepParticles />}
            </View>
          </View>

          {/* Overlays — none shown during sleep */}
          {!isSleeping && deviceMode === 'menu' && <MenuOverlay mode={deviceMode} />}
          {!isSleeping && deviceMode === 'feeding' && <FoodSelect />}
          {!isSleeping && deviceMode === 'stats' && <StatsScreen />}
        </View>
      </View>
    </View>
  );
};

// Screen — nearly square, proportional to shell
const SCREEN_WIDTH = 174;
const SCREEN_HEIGHT = 162;

const styles = StyleSheet.create({
  screenOuter: {
    width: SCREEN_WIDTH + 4,
    height: SCREEN_HEIGHT + 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenInner: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#C8D8C0',
    borderRadius: 10,
    overflow: 'hidden',
    // Recessed screen look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#9A9890',
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
    bottom: 20,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -43,
  },
});

export default DeviceScreen;
