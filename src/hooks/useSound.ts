import { useCallback } from 'react';
import { useJuice } from '../components/JuiceToggle';

type SoundType = 'pop' | 'whoosh' | 'confetti';

export function useSound() {
  const { enabled } = useJuice();

  const play = useCallback(
    (type: SoundType) => {
      if (!enabled) return;

      const audio = new Audio(`/sounds/${type}.wav`);
      audio.play().catch((e) => {
        console.warn('Sound playback failed:', e);
      });
    },
    [enabled]
  );

  return { play };
}
