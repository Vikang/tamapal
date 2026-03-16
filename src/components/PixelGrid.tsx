import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { PixelFrame } from '../types';

interface PixelGridProps {
  data: PixelFrame;
  pixelSize?: number;
}

const PixelGrid: React.FC<PixelGridProps> = memo(({ data, pixelSize = 6 }) => {
  return (
    <View style={styles.container}>
      {data.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((color, colIdx) => (
            <View
              key={colIdx}
              style={[
                {
                  width: pixelSize,
                  height: pixelSize,
                  backgroundColor: color ?? 'transparent',
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
});

PixelGrid.displayName = 'PixelGrid';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
});

export default PixelGrid;
