import { useCallback } from 'react';
import { useJuice } from '../components/shared/JuiceToggle';

type SoundType = 'pop' | 'whoosh' | 'confetti';

const HAPTIC_PATTERNS = {
  pop: 10,
  whoosh: 20,
  confetti: [50, 30, 50],
  success: 100,
  reveal: [30, 50, 30],
  nudge: [40, 60, 40],
};

// Lazy initialization of audio objects to avoid issues with SSR and tests
let soundFiles: Record<SoundType, HTMLAudioElement | null> | null = null;

function getSoundFiles() {
  if (!soundFiles && typeof Audio !== 'undefined') {
    soundFiles = {
      pop: new Audio('/sounds/pop.wav'),
      whoosh: new Audio('/sounds/whoosh.wav'),
      confetti: new Audio('/sounds/confetti.wav'),
    };
  }
  return soundFiles;
}

export function useSound() {
  const { enabled } = useJuice();

  // Simple vibration helper
  const vibrate = useCallback(
    (pattern: number | number[]) => {
      if (!enabled) return;
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(pattern);
        } catch {
          // Ignore haptic failures
        }
      }
    },
    [enabled]
  );

  const play = useCallback(
    (type: SoundType) => {
      if (!enabled) return;

      const files = getSoundFiles();
      const audio = files ? files[type] : null;

      if (audio) {
        // Reset and play
        audio.currentTime = 0;
        audio.play().catch((e) => {
          // Only warn if not a user-gesture error
          if (e.name !== 'NotAllowedError') {
            console.warn('Sound playback failed:', e);
          }
        });
      }

      // Simultaneous Haptic feedback
      vibrate(HAPTIC_PATTERNS[type]);
    },
    [enabled, vibrate]
  );

  return { play, vibrate, patterns: HAPTIC_PATTERNS };
}
