import React from 'react';
import { View, StyleSheet } from 'react-native';
import Room from './Room';
import PetSprite from './PetSprite';
import StatusBar from './StatusBar';
import ThoughtBubble from './ThoughtBubble';
import MenuOverlay from './MenuOverlay';
import FoodSelect from './FoodSelect';
import StatsScreen from './StatsScreen';
import { usePetStore } from '../store/petStore';

const DeviceScreen: React.FC = () => {
  const stats = usePetStore(s => s.stats);
  const mood = usePetStore(s => s.mood);
  const deviceMode = usePetStore(s => s.deviceMode);
  const isSleeping = usePetStore(s => s.isSleeping);
  const computeMood = usePetStore(s => s.computeMood);

  const currentMood = deviceMode === 'feeding' ? 'eating'
    : deviceMode === 'bathing' ? 'bathing'
    : deviceMode === 'sleeping' ? 'sleeping'
    : computeMood();

  return (
    <View style={styles.screenOuter}>
      {/* Zigzag border effect via triangular clip simulation */}
      <ZigzagBezel />
      <View style={styles.screenInner}>
        {/* Screen content */}
        <View style={styles.screenContent}>
          {/* Status bar at top */}
          <StatusBar stats={stats} />

          {/* Main area */}
          <View style={styles.mainArea}>
            <Room isDimmed={isSleeping} />

            {/* Pet centered */}
            <View style={styles.petContainer}>
              <PetSprite mood={currentMood} pixelSize={6} />
              {!isSleeping && deviceMode === 'home' && (
                <ThoughtBubble stats={stats} />
              )}
            </View>
          </View>

          {/* Overlays */}
          {deviceMode === 'menu' && <MenuOverlay mode={deviceMode} />}
          {deviceMode === 'feeding' && <FoodSelect />}
          {deviceMode === 'stats' && <StatsScreen />}
        </View>
      </View>
    </View>
  );
};

// Zigzag/crown-shaped bezel around the screen
const ZigzagBezel: React.FC = () => {
  const points = 10;
  const toothSize = 6;

  return (
    <>
      {/* Top zigzag */}
      <View style={styles.zigzagRow}>
        {Array.from({ length: points }, (_, i) => (
          <View key={`t${i}`} style={[styles.zigzagTooth, styles.zigzagToothUp, {
            borderBottomColor: i < points / 2 ? '#C8C8C8' : '#B89CC8',
          }]} />
        ))}
      </View>
      {/* Bottom zigzag */}
      <View style={[styles.zigzagRow, styles.zigzagRowBottom]}>
        {Array.from({ length: points }, (_, i) => (
          <View key={`b${i}`} style={[styles.zigzagTooth, styles.zigzagToothDown, {
            borderTopColor: i < points / 2 ? '#B89CC8' : '#C8C8C8',
          }]} />
        ))}
      </View>
      {/* Left zigzag */}
      <View style={styles.zigzagColLeft}>
        {Array.from({ length: 8 }, (_, i) => (
          <View key={`l${i}`} style={[styles.zigzagToothLeft, {
            borderRightColor: i < 4 ? '#C8C8C8' : '#D4C4A8',
          }]} />
        ))}
      </View>
      {/* Right zigzag */}
      <View style={styles.zigzagColRight}>
        {Array.from({ length: 8 }, (_, i) => (
          <View key={`r${i}`} style={[styles.zigzagToothRight, {
            borderLeftColor: i < 4 ? '#D4C4A8' : '#B89CC8',
          }]} />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screenOuter: {
    width: 234,
    height: 195,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  screenInner: {
    width: 200,
    height: 168,
    backgroundColor: '#C8D8C0',
    borderRadius: 5,
    overflow: 'hidden',
    // Inner shadow for recessed look
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 7,
    borderWidth: 1,
    borderColor: '#999',
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
    bottom: 27,
    alignSelf: 'center',
    left: '50%',
    marginLeft: -43,
  },
  // Zigzag styles
  zigzagRow: {
    position: 'absolute',
    top: 0,
    left: 13,
    right: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 1,
  },
  zigzagRowBottom: {
    top: undefined,
    bottom: 0,
  },
  zigzagTooth: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  zigzagToothUp: {
    borderBottomWidth: 8,
    borderBottomColor: '#C8C8C8',
  },
  zigzagToothDown: {
    borderTopWidth: 8,
    borderTopColor: '#B89CC8',
  },
  zigzagColLeft: {
    position: 'absolute',
    left: 0,
    top: 13,
    bottom: 13,
    justifyContent: 'center',
    zIndex: 1,
  },
  zigzagColRight: {
    position: 'absolute',
    right: 0,
    top: 13,
    bottom: 13,
    justifyContent: 'center',
    zIndex: 1,
  },
  zigzagToothLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#C8C8C8',
  },
  zigzagToothRight: {
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#D4C4A8',
  },
});

export default DeviceScreen;
