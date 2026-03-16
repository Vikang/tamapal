import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { usePetStore } from '../store/petStore';

const StatRow: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  // Pixel-style bar: 10 segments
  const filled = Math.round(value / 10);
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.barContainer}>
        {Array.from({ length: 10 }, (_, i) => (
          <View
            key={i}
            style={[
              styles.barSegment,
              { backgroundColor: i < filled ? color : '#D5D0C8' },
            ]}
          />
        ))}
      </View>
      <Text style={styles.statValue}>{Math.round(value)}</Text>
    </View>
  );
};

const StatsScreen: React.FC = () => {
  const stats = usePetStore(s => s.stats);
  const birthTime = usePetStore(s => s.birthTime);

  const ageMs = Date.now() - birthTime;
  const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
  const ageHours = Math.floor((ageMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PET STATS</Text>
      <View style={styles.divider} />
      <StatRow label="HUNGER" value={stats.hunger} color="#E88844" />
      <StatRow label="HAPPY" value={stats.happiness} color="#EE6688" />
      <StatRow label="CLEAN" value={stats.cleanliness} color="#44AADD" />
      <StatRow label="ENERGY" value={stats.energy} color="#66BB66" />
      <View style={styles.divider} />
      <Text style={styles.ageText}>
        AGE: {ageDays}d {ageHours}h
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 21,
    left: 11,
    right: 11,
    bottom: 11,
    backgroundColor: 'rgba(240,237,229,0.95)',
    borderRadius: 11,
    padding: 11,
    borderWidth: 1,
    borderColor: '#C8C0B0',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: '#444',
    textAlign: 'center',
    fontFamily: 'monospace',
    letterSpacing: 3,
  },
  divider: {
    height: 1,
    backgroundColor: '#C8C0B0',
    marginVertical: 5,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  statLabel: {
    width: 59,
    fontSize: 9,
    fontWeight: '700',
    color: '#555',
    fontFamily: 'monospace',
  },
  barContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 1,
  },
  barSegment: {
    flex: 1,
    height: 11,
    borderRadius: 1,
    borderWidth: 0.5,
    borderColor: '#BBB',
  },
  statValue: {
    width: 29,
    fontSize: 9,
    fontWeight: '700',
    color: '#555',
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  ageText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});

export default StatsScreen;
