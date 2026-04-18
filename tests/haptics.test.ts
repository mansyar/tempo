import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSound } from '../src/hooks/useSound';

// Mock useJuice since useSound depends on it
vi.mock('../src/components/JuiceToggle', () => ({
  useJuice: vi.fn(),
}));

import { useJuice } from '../src/components/JuiceToggle';

describe('useSound Haptics', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', {
      vibrate: vi.fn().mockReturnValue(true),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('should call navigator.vibrate when juice is enabled', () => {
    (useJuice as Mock).mockReturnValue({ enabled: true });

    const { result } = renderHook(() => useSound());
    result.current.vibrate(100);

    expect(navigator.vibrate).toHaveBeenCalledWith(100);
  });

  it('should NOT call navigator.vibrate when juice is disabled', () => {
    (useJuice as Mock).mockReturnValue({ enabled: false });

    const { result } = renderHook(() => useSound());
    result.current.vibrate(100);

    expect(navigator.vibrate).not.toHaveBeenCalled();
  });

  it('should call vibrate when play is called and juice is enabled', () => {
    (useJuice as Mock).mockReturnValue({ enabled: true });

    // Mock Audio to prevent actual sound play attempt
    vi.stubGlobal(
      'Audio',
      vi.fn().mockImplementation(() => ({
        play: vi.fn().mockResolvedValue(undefined),
      }))
    );

    const { result } = renderHook(() => useSound());
    result.current.play('pop');

    expect(navigator.vibrate).toHaveBeenCalled();
  });
});
