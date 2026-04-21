import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Stub Audio BEFORE importing useSound
vi.stubGlobal(
  'Audio',
  vi.fn().mockImplementation(() => ({
    play: vi.fn().mockResolvedValue(undefined),
    currentTime: 0,
  }))
);

import { renderHook } from '@testing-library/react';
import { useSound } from '../src/hooks/useSound';
import type { ReactNode } from 'react';
import { JuiceProvider } from '../src/components/shared/JuiceToggle';

describe('useSound Haptics', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      vibrate: vi.fn().mockReturnValue(true),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    // Re-stub Audio for next tests since unstubAllGlobals removes it
    vi.stubGlobal(
      'Audio',
      vi.fn().mockImplementation(() => ({
        play: vi.fn().mockResolvedValue(undefined),
        currentTime: 0,
      }))
    );
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <JuiceProvider>{children}</JuiceProvider>
  );

  it('should call navigator.vibrate when juice is enabled', () => {
    const { result } = renderHook(() => useSound(), { wrapper });
    result.current.vibrate(100);

    expect(navigator.vibrate).toHaveBeenCalledWith(100);
  });

  it('should call vibrate when play is called', () => {
    const { result } = renderHook(() => useSound(), { wrapper });
    result.current.play('pop');

    expect(navigator.vibrate).toHaveBeenCalled();
  });
});
