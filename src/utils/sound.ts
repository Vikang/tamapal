let Audio: typeof import('expo-av').Audio | null = null;

try {
  const av = require('expo-av');
  Audio = av.Audio;
} catch {
  // expo-av not available
}

// Simple tone frequencies for different sounds
const SOUND_MAP = {
  button_press: { frequency: 800, duration: 50 },
  menu_select: { frequency: 1000, duration: 80 },
  feed_eat: { frequency: 600, duration: 150 },
  bath_splash: { frequency: 400, duration: 200 },
  sleep_lullaby: { frequency: 300, duration: 300 },
} as const;

export type SoundName = keyof typeof SOUND_MAP;

// For MVP, sounds are best-effort. We just trigger haptics as fallback.
export async function playSound(_name: SoundName): Promise<void> {
  try {
    // In a full app, we'd load actual audio files.
    // For MVP, haptic feedback serves as audio substitute.
    const Haptics = require('expo-haptics');
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // No sound/haptic available — silently ignore
  }
}
