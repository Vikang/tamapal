import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import EggShell from './src/components/EggShell';
import { usePetStore, startAutoSave, stopAutoSave } from './src/store/petStore';
import { FOOD_OPTIONS } from './src/data/foodData';
import { triggerHaptic } from './src/utils/haptics';

const MENU_ACTIONS = ['feed', 'bathe', 'sleep', 'stats'] as const;

export default function App() {
  const deviceMode = usePetStore(s => s.deviceMode);
  const menuIndex = usePetStore(s => s.menuIndex);
  const foodIndex = usePetStore(s => s.foodIndex);
  const isSleeping = usePetStore(s => s.isSleeping);

  const setDeviceMode = usePetStore(s => s.setDeviceMode);
  const setMenuIndex = usePetStore(s => s.setMenuIndex);
  const setFoodIndex = usePetStore(s => s.setFoodIndex);
  const feed = usePetStore(s => s.feed);
  const bathe = usePetStore(s => s.bathe);
  const startSleep = usePetStore(s => s.startSleep);
  const wakeUp = usePetStore(s => s.wakeUp);
  const tickDecay = usePetStore(s => s.tickDecay);
  const loadState = usePetStore(s => s.loadState);

  // Load saved state + start timers on mount
  useEffect(() => {
    loadState();
    startAutoSave();

    // Decay tick every second
    const decayTimer = setInterval(tickDecay, 1000);

    return () => {
      clearInterval(decayTimer);
      stopAutoSave();
    };
  }, [loadState, tickDecay]);

  // Left button: navigate left in menus, or go back
  const handleLeft = useCallback(() => {
    triggerHaptic('light');

    switch (deviceMode) {
      case 'menu':
        setMenuIndex((menuIndex - 1 + MENU_ACTIONS.length) % MENU_ACTIONS.length);
        break;
      case 'feeding':
        setFoodIndex((foodIndex - 1 + FOOD_OPTIONS.length) % FOOD_OPTIONS.length);
        break;
      case 'stats':
        setDeviceMode('home');
        break;
      default:
        break;
    }
  }, [deviceMode, menuIndex, foodIndex, setMenuIndex, setFoodIndex, setDeviceMode]);

  // Right button: navigate right in menus
  const handleRight = useCallback(() => {
    triggerHaptic('light');

    switch (deviceMode) {
      case 'menu':
        setMenuIndex((menuIndex + 1) % MENU_ACTIONS.length);
        break;
      case 'feeding':
        setFoodIndex((foodIndex + 1) % FOOD_OPTIONS.length);
        break;
      case 'stats':
        setDeviceMode('home');
        break;
      default:
        break;
    }
  }, [deviceMode, menuIndex, foodIndex, setMenuIndex, setFoodIndex, setDeviceMode]);

  // Middle button: confirm / open menu / wake up
  const handleMiddle = useCallback(() => {
    triggerHaptic('medium');

    switch (deviceMode) {
      case 'home':
        if (isSleeping) {
          wakeUp();
        } else {
          setMenuIndex(0);
          setDeviceMode('menu');
        }
        break;

      case 'sleeping':
        wakeUp();
        break;

      case 'menu': {
        const action = MENU_ACTIONS[menuIndex];
        if (action === 'feed') {
          setFoodIndex(0);
          setDeviceMode('feeding');
        } else if (action === 'bathe') {
          bathe();
          setDeviceMode('home');
        } else if (action === 'sleep') {
          startSleep();
        } else if (action === 'stats') {
          setDeviceMode('stats');
        }
        break;
      }

      case 'feeding': {
        const food = FOOD_OPTIONS[foodIndex];
        feed(food.id);
        setDeviceMode('home');
        break;
      }

      case 'stats':
        setDeviceMode('home');
        break;

      default:
        setDeviceMode('home');
        break;
    }
  }, [deviceMode, menuIndex, foodIndex, isSleeping, setDeviceMode, setMenuIndex, setFoodIndex, feed, bathe, startSleep, wakeUp]);

  return (
    <View style={styles.container}>
      <EggShell
        onLeftPress={handleLeft}
        onMiddlePress={handleMiddle}
        onRightPress={handleRight}
      />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
