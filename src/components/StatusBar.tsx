import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PetStats } from '../types';

interface StatusBarProps {
  stats: PetStats;
}

interface StatBarProps {
  label: string;
  value: number;
  color: string;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, color }) => {
  return (
    <View style={styles.statContainer}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.barOuter}>
        <View style={[styles.barInner, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

const StatusBar: React.FC<StatusBarProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <StatBar label="HUN" value={stats.hunger} color="#E88844" />
      <StatBar label="HAP" value={stats.happiness} color="#EE6688" />
      <StatBar label="CLN" value={stats.cleanliness} color="#44AADD" />
      <StatBar label="NRG" value={stats.energy} color="#66BB66" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  statContainer: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#444',
    marginBottom: 1,
    fontFamily: 'VCROSDMono',
  },
  barOuter: {
    width: '100%',
    height: 5,
    backgroundColor: '#D5D0C8',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#AAA',
  },
  barInner: {
    height: '100%',
    borderRadius: 3,
  },
});

export default StatusBar;
