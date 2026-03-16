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

/**
 * Soft retro pixel click — like a Game Boy menu cursor or Tamagotchi beep.
 * Single square wave blip, low volume, gentle.
 */
export async function playButtonClick(): Promise<void> {
  try {
    if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AC();
      const t = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';  // Triangle wave — softest 8-bit waveform, warm and round
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Gentle "boop" — starts at G5, tiny pitch bend down for warmth
      osc.frequency.setValueAtTime(784, t);
      osc.frequency.exponentialRampToValueAtTime(660, t + 0.04); // Soft downward bend
      gain.gain.setValueAtTime(0.0, t);
      gain.gain.linearRampToValueAtTime(0.15, t + 0.005);  // Quick but soft attack
      gain.gain.setValueAtTime(0.12, t + 0.015);            // Gentle sustain
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06); // Smooth fade

      osc.start(t);
      osc.stop(t + 0.065);
    }
  } catch {
    try {
      const Haptics = require('expo-haptics');
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }
}
