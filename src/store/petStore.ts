import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PetStats, PetMood, DeviceMode, MenuItem, FoodItem, LifeStage } from '../types';
import { clamp } from '../utils/time';
import { FOOD_OPTIONS } from '../data/foodData';
import { evolve, calculateCareRating, getAgingDuration, getCharacter } from '../data/evolution';

const STORAGE_KEY = 'tamapal_state';
const SAVE_INTERVAL = 30_000; // 30 seconds

// Decay rates (points per second)
const DECAY_RATES = {
  hunger: 1 / 60,       // 1 point per 60s
  happiness: 1 / 90,    // 1 point per 90s
  cleanliness: 1 / 120,  // 1 point per 120s
  energy: 1 / 90,       // 1 point per 90s
};

interface PetState {
  // Pet data
  stats: PetStats;
  mood: PetMood;
  birthTime: number;
  lastSaveTime: number;

  // Evolution data
  characterId: string;
  lifeStage: LifeStage;
  stageStartTime: number;       // When current stage began (ms timestamp)
  evolutionPending: boolean;     // True when pet is ready to evolve

  // Device UI state
  deviceMode: DeviceMode;
  menuIndex: number;
  foodIndex: number;
  isSleeping: boolean;

  // Actions
  feed: (food: FoodItem) => void;
  bathe: () => void;
  startSleep: () => void;
  wakeUp: () => void;
  setDeviceMode: (mode: DeviceMode) => void;
  setMenuIndex: (idx: number) => void;
  setFoodIndex: (idx: number) => void;
  tickDecay: () => void;
  checkEvolution: () => void;    // Check if it's time to evolve
  triggerEvolution: () => void;  // Actually evolve the pet
  computeMood: () => PetMood;
  saveState: () => Promise<void>;
  loadState: () => Promise<void>;
}

export const usePetStore = create<PetState>((set, get) => ({
  stats: { hunger: 80, happiness: 80, cleanliness: 80, energy: 80 },
  mood: 'idle',
  birthTime: Date.now(),
  lastSaveTime: Date.now(),

  // Evolution — start as baby_01 (egg stage skipped for now)
  characterId: 'baby_01',
  lifeStage: LifeStage.Baby,
  stageStartTime: Date.now(),
  evolutionPending: false,

  deviceMode: 'home',
  menuIndex: 0,
  foodIndex: 0,
  isSleeping: false,

  feed: (foodId: FoodItem) => {
    if (get().isSleeping) return; // Can't feed while sleeping
    const food = FOOD_OPTIONS.find(f => f.id === foodId);
    if (!food) return;
    set(state => ({
      stats: {
        ...state.stats,
        hunger: clamp(state.stats.hunger + food.hungerBoost, 0, 100),
        happiness: clamp(state.stats.happiness + food.happinessBoost, 0, 100),
      },
      mood: 'eating',
    }));
    // Return to idle after animation (only if not sleeping)
    setTimeout(() => {
      if (!get().isSleeping) {
        set({ mood: get().computeMood() });
      }
    }, 2000);
  },

  bathe: () => {
    if (get().isSleeping) return; // Can't bathe while sleeping
    set(state => ({
      stats: {
        ...state.stats,
        cleanliness: clamp(state.stats.cleanliness + 40, 0, 100),
      },
      mood: 'bathing',
    }));
    setTimeout(() => {
      if (!get().isSleeping) {
        set({ mood: get().computeMood() });
      }
    }, 3000);
  },

  startSleep: () => {
    set({ isSleeping: true, mood: 'sleeping', deviceMode: 'sleeping' });
  },

  wakeUp: () => {
    set(state => ({ isSleeping: false, mood: state.computeMood(), deviceMode: 'home' }));
  },

  setDeviceMode: (mode) => {
    // Never override deviceMode while sleeping — isSleeping is the authority
    const { isSleeping } = get();
    if (isSleeping && mode !== 'sleeping') return;
    set({ deviceMode: mode });
  },
  setMenuIndex: (idx) => set({ menuIndex: idx }),
  setFoodIndex: (idx) => set({ foodIndex: idx }),

  tickDecay: () => {
    set(state => {
      const { isSleeping } = state;
      const newStats = { ...state.stats };

      newStats.hunger = clamp(newStats.hunger - DECAY_RATES.hunger, 0, 100);
      newStats.happiness = clamp(newStats.happiness - DECAY_RATES.happiness, 0, 100);
      newStats.cleanliness = clamp(newStats.cleanliness - DECAY_RATES.cleanliness, 0, 100);

      if (isSleeping) {
        // Energy regenerates during sleep
        newStats.energy = clamp(newStats.energy + (DECAY_RATES.energy * 2), 0, 100);
      } else {
        newStats.energy = clamp(newStats.energy - DECAY_RATES.energy, 0, 100);
      }

      return { stats: newStats };
    });
  },

  // ── Evolution methods ──────────────────────────────────────
  checkEvolution: () => {
    const { characterId, lifeStage, stageStartTime, evolutionPending } = get();
    if (evolutionPending) return; // Already pending

    const duration = getAgingDuration(lifeStage);
    if (duration === null) return; // Adult — no further evolution

    const elapsed = Date.now() - stageStartTime;
    if (elapsed >= duration) {
      set({ evolutionPending: true });
      console.log(`[Evolution] ${characterId} ready to evolve after ${Math.round(elapsed / 60000)}min`);
    }
  },

  triggerEvolution: () => {
    const { characterId, stats } = get();
    const careRating = calculateCareRating(stats);
    const nextCharId = evolve(characterId, careRating);

    if (!nextCharId) {
      console.log('[Evolution] No evolution path found');
      set({ evolutionPending: false });
      return;
    }

    const nextChar = getCharacter(nextCharId);
    if (!nextChar) {
      console.log(`[Evolution] Character ${nextCharId} not found`);
      set({ evolutionPending: false });
      return;
    }

    console.log(`[Evolution] ${characterId} → ${nextCharId} (${nextChar.name}) | care: ${careRating}`);

    set({
      characterId: nextCharId,
      lifeStage: nextChar.stage,
      stageStartTime: Date.now(),
      evolutionPending: false,
    });
  },

  computeMood: (): PetMood => {
    const { stats, isSleeping } = get();
    if (isSleeping) return 'sleeping';
    if (stats.cleanliness < 20) return 'dirty';
    if (stats.hunger < 20 || stats.happiness < 20 || stats.energy < 20) return 'sad';
    if (stats.hunger > 80 && stats.happiness > 80) return 'happy';
    return 'idle';
  },

  saveState: async () => {
    try {
      const { stats, birthTime, isSleeping } = get();
      const { characterId, lifeStage, stageStartTime } = get();
      const data = {
        stats,
        birthTime,
        isSleeping,
        characterId,
        lifeStage,
        stageStartTime,
        savedAt: Date.now(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      set({ lastSaveTime: Date.now() });
    } catch {
      // Storage not available — ignore
    }
  },

  loadState: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const data = JSON.parse(raw);
      const elapsed = (Date.now() - data.savedAt) / 1000; // seconds away

      // Apply retroactive decay
      const stats: PetStats = {
        hunger: clamp(data.stats.hunger - (DECAY_RATES.hunger * elapsed), 0, 100),
        happiness: clamp(data.stats.happiness - (DECAY_RATES.happiness * elapsed), 0, 100),
        cleanliness: clamp(data.stats.cleanliness - (DECAY_RATES.cleanliness * elapsed), 0, 100),
        energy: data.isSleeping
          ? clamp(data.stats.energy + (DECAY_RATES.energy * 2 * elapsed), 0, 100)
          : clamp(data.stats.energy - (DECAY_RATES.energy * elapsed), 0, 100),
      };

      set({
        stats,
        birthTime: data.birthTime,
        isSleeping: false, // wake up on app open
        // Restore evolution state
        characterId: data.characterId || 'baby_01',
        lifeStage: data.lifeStage || LifeStage.Baby,
        stageStartTime: data.stageStartTime || Date.now(),
      });
    } catch {
      // No saved state — use defaults
    }
  },
}));

// Auto-save interval
let saveTimer: ReturnType<typeof setInterval> | null = null;

export function startAutoSave(): void {
  if (saveTimer) return;
  saveTimer = setInterval(() => {
    usePetStore.getState().saveState();
  }, SAVE_INTERVAL);
}

export function stopAutoSave(): void {
  if (saveTimer) {
    clearInterval(saveTimer);
    saveTimer = null;
  }
}
