import React, { useEffect, useCallback, useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import EggShell from './src/components/EggShell';
import EggDropScreen from './src/components/EggDropScreen';
import NameEggScreen from './src/components/NameEggScreen';
import { usePetStore, startAutoSave, stopAutoSave } from './src/store/petStore';
import { FOOD_OPTIONS } from './src/data/foodData';
import { triggerHaptic } from './src/utils/haptics';

const MENU_ACTIONS = ['feed', 'bathe', 'sleep', 'stats'] as const;

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isInspectMode, setIsInspectMode] = useState(false);
  const decayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
  const checkEvolution = usePetStore(s => s.checkEvolution);
  const triggerEvolution = usePetStore(s => s.triggerEvolution);
  const evolutionPending = usePetStore(s => s.evolutionPending);
  const gamePhase = usePetStore(s => s.gamePhase);
  const loadState = usePetStore(s => s.loadState);

  // Load fonts on mount
  useEffect(() => {
    Font.loadAsync({
      'VCROSDMono': require('./src/assets/fonts/VCROSDMono.ttf'),
    }).then(() => setFontsLoaded(true))
      .catch(() => setFontsLoaded(true)); // fallback gracefully
  }, []);

  // Auto-trigger evolution when pending (for now — later replace with animation screen)
  useEffect(() => {
    if (evolutionPending) {
      console.log('[App] Evolution pending — triggering...');
      triggerEvolution();
    }
  }, [evolutionPending, triggerEvolution]);

  // Load saved state + start timers on mount
  useEffect(() => {
    loadState();
    startAutoSave();

    // Decay tick + evolution check every second
    decayTimerRef.current = setInterval(() => {
      tickDecay();
      checkEvolution();
    }, 1000);

    return () => {
      if (decayTimerRef.current) clearInterval(decayTimerRef.current);
      stopAutoSave();
    };
  }, [loadState, tickDecay]);

  // Pause/resume decay timer when entering/exiting inspect mode
  const toggleInspectMode = useCallback(() => {
    setIsInspectMode(prev => {
      const enteringInspect = !prev;
      if (enteringInspect) {
        // Pause decay
        if (decayTimerRef.current) {
          clearInterval(decayTimerRef.current);
          decayTimerRef.current = null;
        }
      } else {
        // Resume decay
        if (!decayTimerRef.current) {
          decayTimerRef.current = setInterval(tickDecay, 1000);
        }
      }
      return enteringInspect;
    });
  }, [tickDecay]);

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

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="small" color="#8B7355" />
      </View>
    );
  }

  // Egg intro phase — egg drops from sky
  if (gamePhase === 'egg_intro') {
    return (
      <View style={styles.container}>
        <EggShell
          onLeftPress={() => {}}
          onMiddlePress={() => {}}
          onRightPress={() => {}}
          isInspectMode={false}
          onToggleInspect={() => {}}
        />
        <View style={styles.phaseOverlay}>
          <EggDropScreen />
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  // Naming phase — name your egg
  if (gamePhase === 'naming') {
    return (
      <View style={styles.container}>
        <EggShell
          onLeftPress={() => {}}
          onMiddlePress={() => {}}
          onRightPress={() => {}}
          isInspectMode={false}
          onToggleInspect={() => {}}
        />
        <View style={styles.phaseOverlay}>
          <NameEggScreen />
        </View>
        <StatusBar style="light" />
      </View>
    );
  }

  // Normal gameplay
  return (
    <View style={styles.container}>
      <EggShell
        onLeftPress={handleLeft}
        onMiddlePress={handleMiddle}
        onRightPress={handleRight}
        isInspectMode={isInspectMode}
        onToggleInspect={toggleInspectMode}
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
  phaseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
