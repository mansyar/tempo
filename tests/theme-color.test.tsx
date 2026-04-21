import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import ThemeToggle from '../src/components/shared/ThemeToggle';

describe('Theme Color Meta Tag', () => {
  let meta: HTMLMetaElement;

  beforeEach(() => {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = '#000000';
    document.head.appendChild(meta);

    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })
    );
  });

  afterEach(() => {
    document.head.removeChild(meta);
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('should update theme-color meta tag when theme changes', () => {
    const { getByRole } = render(<ThemeToggle />);
    const button = getByRole('button');

    // Initial state (light mode assumed if auto and matchMedia is false)
    // We need to trigger the toggle
    act(() => {
      button.click(); // Should go to light if it was auto/dark, let's see logic
    });

    // Toggle logic: auto -> light -> dark -> auto
    // If initial is auto (and prefersDark is false), next is light.
    // Let's check the code: mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light'
    // If mode was 'auto', next is 'light'.

    expect(
      document
        .querySelector('meta[name="theme-color"]')
        ?.getAttribute('content')
    ).toBe('#ffffff');

    act(() => {
      button.click(); // light -> dark
    });
    expect(
      document
        .querySelector('meta[name="theme-color"]')
        ?.getAttribute('content')
    ).toBe('#000000');
  });
});
