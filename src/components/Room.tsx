import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import PixelGrid from './PixelGrid';
import { getTimeOfDay } from '../utils/time';
import { bedroomDay, bedroomEvening, bedroomNight } from '../data/roomSprites';
import { TimeOfDay } from '../types';

const ROOM_MAP = {
  day: bedroomDay,
  evening: bedroomEvening,
  night: bedroomNight,
};

interface RoomProps {
  isDimmed?: boolean;
}

const Room: React.FC<RoomProps> = ({ isDimmed = false }) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());

  useEffect(() => {
    // Check time every 60 seconds
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <PixelGrid data={ROOM_MAP[timeOfDay]} pixelSize={4} />
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
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,20,0.45)',
  },
});

export default Room;
