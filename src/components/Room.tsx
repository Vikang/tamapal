import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { getTimeOfDay } from '../utils/time';
import { TimeOfDay } from '../types';

// Background images from TamaWeb (96x96 pixel art)
const roomDay = require('../assets/backgrounds/room_day.png');
const roomEvening = require('../assets/backgrounds/room_evening.png');
const roomNight = require('../assets/backgrounds/room_night.png');

const ROOM_BACKGROUNDS: Record<TimeOfDay, ImageSourcePropType> = {
  day: roomDay,
  evening: roomEvening,
  night: roomNight,
};

interface RoomProps {
  isDimmed?: boolean;
}

const Room: React.FC<RoomProps> = ({ isDimmed = false }) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={ROOM_BACKGROUNDS[timeOfDay]}
        style={[styles.backgroundImage, { imageRendering: 'pixelated' } as any]}
        resizeMode="cover"
      />
      {isDimmed && <View style={styles.dimOverlay} />}
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
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,20,0.45)',
  },
});

export default Room;
