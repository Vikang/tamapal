export interface PetStats {
  hunger: number;
  happiness: number;
  cleanliness: number;
  energy: number;
}

export type PetMood = 'idle' | 'eating' | 'bathing' | 'sleeping' | 'happy' | 'sad' | 'dirty';

export type MenuItem = 'feed' | 'bathe' | 'sleep' | 'stats';

export type FoodItem = 'milk' | 'riceball' | 'apple' | 'cookie';

export interface FoodOption {
  name: string;
  id: FoodItem;
  hungerBoost: number;
  happinessBoost: number;
  /** Number owned; -1 = infinite (always available) */
  quantity: number;
}

export type TimeOfDay = 'day' | 'evening' | 'night';

export type DeviceMode = 'home' | 'menu' | 'feeding' | 'bathing' | 'sleeping' | 'stats';

export type PixelRow = (string | null)[];
export type PixelFrame = PixelRow[];
export type AnimationFrames = PixelFrame[];

// ── Evolution System ─────────────────────────────────────────

/** Life stages in order of progression */
export enum LifeStage {
  Egg = 'egg',
  Baby = 'baby',
  Toddler = 'toddler',
  Teen = 'teen',
  Adult = 'adult',
}

/** Care quality determines evolution path */
export enum CareRating {
  Low = 1,
  Medium = 2,
  High = 3,
}

/** A character definition — represents one possible pet form */
export interface CharacterDef {
  id: string;
  name: string;
  stage: LifeStage;
  /** Sprite sheet PNG path (relative to assets) */
  sprite: string;
}

/** Growth chart entry — maps a character to its possible evolutions */
export interface GrowthPath {
  /** Character ID that can evolve */
  from: string;
  /** Evolution outcomes: [low_care, medium_care, high_care] */
  to: [string, string, string];
}

/** Duration in milliseconds for each life stage before evolution */
export interface AgingConfig {
  stage: LifeStage;
  /** Time until next evolution (ms). null = no further evolution */
  durationMs: number | null;
}
