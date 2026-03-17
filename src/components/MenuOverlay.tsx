import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, Image, Animated, Platform, Pressable } from 'react-native';
import { DeviceMode, MenuItem } from '../types';
import { usePetStore } from '../store/petStore';

const pointerImg = require('../assets/ui/pointer_right.png');

const MENU_ITEMS: { id: MenuItem; icon: string; label: string }[] = [
  { id: 'feed', icon: '🍚', label: 'Feed' },
  { id: 'bathe', icon: '🛁', label: 'Bathe' },
  { id: 'sleep', icon: '💤', label: 'Sleep' },
  { id: 'stats', icon: '📊', label: 'Stats' },
];

/** Animated pointer arrow — bounces left/right like TamaWeb (0.5s alternate) */
const PointerArrow: React.FC = () => {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: -3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [bounce]);

  return (
    <Animated.View
      style={[
        styles.pointerContainer,
        { transform: [{ translateX: bounce }] },
      ]}
    >
      <Image
        source={pointerImg}
        style={styles.pointerImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

interface MenuOverlayProps {
  mode: DeviceMode;
  onSelect?: () => void;
}

const MenuOverlay: React.FC<MenuOverlayProps> = ({ mode, onSelect }) => {
  const menuIndex = usePetStore(s => s.menuIndex);
  const setMenuIndex = usePetStore(s => s.setMenuIndex);

  if (mode !== 'menu') return null;

  const handleItemPress = useCallback((idx: number) => {
    // Set index first, then fire select synchronously
    // usePetStore.setState is sync so handleMiddle will read the updated index
    usePetStore.setState({ menuIndex: idx });
    onSelect?.();
  }, [onSelect]);

  return (
    <View style={styles.container}>
      {MENU_ITEMS.map((item, idx) => (
        <Pressable
          key={item.id}
          style={styles.menuItem}
          onHoverIn={() => setMenuIndex(idx)}
          onPress={() => handleItemPress(idx)}
        >
          {idx === menuIndex && <PointerArrow />}
          <Text style={styles.menuIcon}>{item.icon}</Text>
          <Text style={[styles.menuLabel, idx === menuIndex && styles.menuLabelSelected]}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 2,
    paddingVertical: 6,
    backgroundColor: 'rgba(245, 242, 235, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(200, 192, 176, 0.5)',
  },
  menuItem: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    position: 'relative' as const,
  },
  pointerContainer: {
    position: 'absolute',
    left: -2,
    top: '50%' as any,
    marginTop: -5, // center the 9px tall arrow
    zIndex: 1,
  },
  pointerImage: {
    width: 11,
    height: 9,
    ...(Platform.OS === 'web' ? { imageRendering: 'pixelated' } as any : {}),
  },
  menuIcon: {
    fontSize: 20,
  },
  menuLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#AAA',
    fontFamily: 'monospace',
    marginTop: 1,
  },
  menuLabelSelected: {
    color: '#555',
  },
});

export default MenuOverlay;
