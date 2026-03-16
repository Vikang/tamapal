import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DeviceMode, MenuItem } from '../types';
import { usePetStore } from '../store/petStore';

const MENU_ITEMS: { id: MenuItem; icon: string; label: string }[] = [
  { id: 'feed', icon: '🍚', label: 'Feed' },
  { id: 'bathe', icon: '🛁', label: 'Bathe' },
  { id: 'sleep', icon: '💤', label: 'Sleep' },
  { id: 'stats', icon: '📊', label: 'Stats' },
];

interface MenuOverlayProps {
  mode: DeviceMode;
}

const MenuOverlay: React.FC<MenuOverlayProps> = ({ mode }) => {
  const menuIndex = usePetStore(s => s.menuIndex);

  if (mode !== 'menu') return null;

  return (
    <View style={styles.container}>
      {MENU_ITEMS.map((item, idx) => (
        <View
          key={item.id}
          style={[styles.menuItem, idx === menuIndex && styles.menuItemSelected]}
        >
          <Text style={styles.menuIcon}>{item.icon}</Text>
          <Text style={[styles.menuLabel, idx === menuIndex && styles.menuLabelSelected]}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 4,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 4,
    paddingVertical: 3,
    backgroundColor: 'rgba(240,237,229,0.92)',
    borderTopWidth: 1,
    borderTopColor: '#C8C0B0',
  },
  menuItem: {
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  menuItemSelected: {
    backgroundColor: 'rgba(200, 176, 138, 0.4)',
    borderWidth: 1,
    borderColor: '#C4B08A',
  },
  menuIcon: {
    fontSize: 14,
  },
  menuLabel: {
    fontSize: 7,
    fontWeight: '600',
    color: '#888',
    fontFamily: 'monospace',
  },
  menuLabelSelected: {
    color: '#444',
  },
});

export default MenuOverlay;
