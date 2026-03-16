export interface PetStats {
  hunger: number;
  happiness: number;
  cleanliness: number;
  energy: number;
}

export type PetMood = 'idle' | 'eating' | 'bathing' | 'sleeping' | 'happy' | 'sad' | 'dirty';

export type MenuItem = 'feed' | 'bathe' | 'sleep' | 'stats';

export type FoodItem = 'riceball' | 'apple' | 'cookie';

export interface FoodOption {
  name: string;
  id: FoodItem;
  hungerBoost: number;
  happinessBoost: number;
}

export type TimeOfDay = 'day' | 'evening' | 'night';

export type DeviceMode = 'home' | 'menu' | 'feeding' | 'bathing' | 'sleeping' | 'stats';

export type PixelRow = (string | null)[];
export type PixelFrame = PixelRow[];
export type AnimationFrames = PixelFrame[];
