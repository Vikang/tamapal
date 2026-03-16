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

  // Button A (Left) — SELECT/SCROLL: cycles forward through options
  const handleLeft = useCallback(() => {
    triggerHaptic('light');

    switch (deviceMode) {
      case 'home':
        // Open the menu
        setMenuIndex(0);
        setDeviceMode('menu');
        break;
      case 'menu':
        // Cycle menu index forward (wrapping)
        setMenuIndex((menuIndex + 1) % MENU_ACTIONS.length);
        break;
      case 'feeding':
        // Cycle food index forward (wrapping)
        setFoodIndex((foodIndex + 1) % FOOD_OPTIONS.length);
        break;
      case 'sleeping':
        wakeUp();
        break;
      default:
        break;
    }
  }, [deviceMode, menuIndex, foodIndex, setMenuIndex, setFoodIndex, setDeviceMode, wakeUp]);

  // Button B (Middle) — EXECUTE/CONFIRM: confirms the highlighted selection
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

  // Button C (Right) — CANCEL/BACK: cancels current action, returns to previous screen
  const handleRight = useCallback(() => {
    triggerHaptic('light');

    switch (deviceMode) {
      case 'home':
        // Already at home, do nothing
        break;
      case 'menu':
        // Cancel back to home
        setDeviceMode('home');
        break;
      case 'feeding':
        // Cancel back to menu
        setDeviceMode('menu');
        break;
      case 'sleeping':
        wakeUp();
        break;
      case 'stats':
        setDeviceMode('home');
        break;
      case 'bathing':
        setDeviceMode('home');
        break;
      default:
        break;
    }
  }, [deviceMode, setDeviceMode, wakeUp]);

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
    backgroundColor: '#F5D5A8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
