import { LifeStage, CharacterDef, GrowthPath, AgingConfig } from '../types';

// ── Aging Durations ──────────────────────────────────────────
// How long each stage lasts before the pet evolves
// These can be tuned later — using shorter times for dev/testing

export const AGING_CONFIG: AgingConfig[] = [
  { stage: LifeStage.Egg,     durationMs: 1 * 60 * 1000 },        // 1 minute (hatching)
  { stage: LifeStage.Baby,    durationMs: 2 * 60 * 60 * 1000 },   // 2 hours
  { stage: LifeStage.Toddler, durationMs: 8 * 60 * 60 * 1000 },   // 8 hours
  { stage: LifeStage.Teen,    durationMs: 24 * 60 * 60 * 1000 },   // 24 hours
  { stage: LifeStage.Adult,   durationMs: null },                   // Final stage — no further evolution
];

/** Get aging duration for a given stage */
export function getAgingDuration(stage: LifeStage): number | null {
  return AGING_CONFIG.find(c => c.stage === stage)?.durationMs ?? null;
}

// ── Character Definitions ────────────────────────────────────
// Each character has a unique ID, name, stage, and sprite reference.
// Sprites will be added as original pixel art is created.
// For now, we use placeholder IDs — the sprite field will be updated
// once art is designed in Figma.

export const CHARACTERS: CharacterDef[] = [
  // ── Egg (1 universal egg) ──
  { id: 'egg_01',      name: 'Egg',        stage: LifeStage.Egg,     sprite: 'egg' },

  // ── Baby (3 variants — you get a random one when egg hatches) ──
  { id: 'baby_01',     name: 'Mochi',      stage: LifeStage.Baby,    sprite: 'chara_1b' },
  { id: 'baby_02',     name: 'Puff',       stage: LifeStage.Baby,    sprite: 'chara_2b' },
  { id: 'baby_03',     name: 'Blob',       stage: LifeStage.Baby,    sprite: 'chara_3b' },

  // ── Toddler (6 variants — 2 per baby, based on care) ──
  { id: 'toddler_01',  name: 'Kumo',       stage: LifeStage.Toddler, sprite: 'chara_17b' },
  { id: 'toddler_02',  name: 'Maru',       stage: LifeStage.Toddler, sprite: 'chara_18b' },
  { id: 'toddler_03',  name: 'Hana',       stage: LifeStage.Toddler, sprite: 'chara_19b' },
  { id: 'toddler_04',  name: 'Kiki',       stage: LifeStage.Toddler, sprite: 'chara_20b' },
  { id: 'toddler_05',  name: 'Tama',       stage: LifeStage.Toddler, sprite: 'chara_21b' },
  { id: 'toddler_06',  name: 'Nori',       stage: LifeStage.Toddler, sprite: 'chara_22b' },

  // ── Teen (6 variants) ──
  { id: 'teen_01',     name: 'Sora',       stage: LifeStage.Teen,    sprite: 'chara_49b' },
  { id: 'teen_02',     name: 'Riku',       stage: LifeStage.Teen,    sprite: 'chara_50b' },
  { id: 'teen_03',     name: 'Yuki',       stage: LifeStage.Teen,    sprite: 'chara_51b' },
  { id: 'teen_04',     name: 'Kai',        stage: LifeStage.Teen,    sprite: 'chara_52b' },
  { id: 'teen_05',     name: 'Luna',       stage: LifeStage.Teen,    sprite: 'chara_53b' },
  { id: 'teen_06',     name: 'Zen',        stage: LifeStage.Teen,    sprite: 'chara_54b' },

  // ── Adult (6 variants — final forms) ──
  { id: 'adult_01',    name: 'Hoshi',      stage: LifeStage.Adult,   sprite: 'chara_133b' },
  { id: 'adult_02',    name: 'Miko',       stage: LifeStage.Adult,   sprite: 'chara_134b' },
  { id: 'adult_03',    name: 'Rex',        stage: LifeStage.Adult,   sprite: 'chara_135b' },
  { id: 'adult_04',    name: 'Pip',        stage: LifeStage.Adult,   sprite: 'chara_136b' },
  { id: 'adult_05',    name: 'Nova',       stage: LifeStage.Adult,   sprite: 'chara_137b' },
  { id: 'adult_06',    name: 'Taro',       stage: LifeStage.Adult,   sprite: 'chara_138b' },
];

/** Get a character by ID */
export function getCharacter(id: string): CharacterDef | undefined {
  return CHARACTERS.find(c => c.id === id);
}

/** Get all characters for a given life stage */
export function getCharactersByStage(stage: LifeStage): CharacterDef[] {
  return CHARACTERS.filter(c => c.stage === stage);
}

// ── Growth Chart ─────────────────────────────────────────────
// Maps each character to 3 possible evolutions: [low_care, medium_care, high_care]
// Care rating 1 (low) → index 0 (worst outcome)
// Care rating 2 (medium) → index 1 (default)
// Care rating 3 (high) → index 2 (best outcome)

export const GROWTH_CHART: GrowthPath[] = [
  // Egg → random Baby (care doesn't matter for hatching)
  { from: 'egg_01', to: ['baby_01', 'baby_02', 'baby_03'] },

  // Baby → Toddler (care determines path)
  { from: 'baby_01', to: ['toddler_01', 'toddler_02', 'toddler_02'] },
  { from: 'baby_02', to: ['toddler_03', 'toddler_04', 'toddler_04'] },
  { from: 'baby_03', to: ['toddler_05', 'toddler_06', 'toddler_06'] },

  // Toddler → Teen
  { from: 'toddler_01', to: ['teen_01', 'teen_02', 'teen_02'] },
  { from: 'toddler_02', to: ['teen_01', 'teen_02', 'teen_02'] },
  { from: 'toddler_03', to: ['teen_03', 'teen_04', 'teen_04'] },
  { from: 'toddler_04', to: ['teen_03', 'teen_04', 'teen_04'] },
  { from: 'toddler_05', to: ['teen_05', 'teen_06', 'teen_06'] },
  { from: 'toddler_06', to: ['teen_05', 'teen_06', 'teen_06'] },

  // Teen → Adult
  { from: 'teen_01', to: ['adult_01', 'adult_02', 'adult_02'] },
  { from: 'teen_02', to: ['adult_01', 'adult_02', 'adult_02'] },
  { from: 'teen_03', to: ['adult_03', 'adult_04', 'adult_04'] },
  { from: 'teen_04', to: ['adult_03', 'adult_04', 'adult_04'] },
  { from: 'teen_05', to: ['adult_05', 'adult_06', 'adult_06'] },
  { from: 'teen_06', to: ['adult_05', 'adult_06', 'adult_06'] },
];

/** Get possible evolutions for a character */
export function getEvolutions(characterId: string): GrowthPath | undefined {
  return GROWTH_CHART.find(g => g.from === characterId);
}

/** Pick the next evolution based on care rating */
export function evolve(characterId: string, careRating: number): string | null {
  const path = getEvolutions(characterId);
  if (!path) return null;

  // For egg hatching, pick random
  const character = getCharacter(characterId);
  if (character?.stage === LifeStage.Egg) {
    const idx = Math.floor(Math.random() * path.to.length);
    return path.to[idx];
  }

  // For all other stages, care rating determines path
  // careRating is 1-3, maps to index 0-2
  const clampedRating = Math.max(1, Math.min(3, Math.round(careRating)));
  return path.to[clampedRating - 1];
}

/** Calculate care rating from current stats (1-3 scale) */
export function calculateCareRating(stats: { hunger: number; happiness: number; cleanliness: number; energy: number }): number {
  const avg = (stats.hunger + stats.happiness + stats.cleanliness + stats.energy) / 4;

  if (avg >= 60) return 3;  // High care
  if (avg >= 30) return 2;  // Medium care
  return 1;                  // Low care
}
