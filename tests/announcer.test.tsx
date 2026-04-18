import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  AriaLiveAnnouncer,
  announce,
} from '../src/components/AriaLiveAnnouncer';
import React from 'react';

describe('AriaLiveAnnouncer Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render an empty aria-live region initially', () => {
    render(<AriaLiveAnnouncer />);
    const region = screen.getByTestId('aria-live-region');
    expect(region.textContent).toBe('');
    expect(region.getAttribute('aria-live')).toBe('polite');
  });

  it('should display announcement when announce function is called', () => {
    render(<AriaLiveAnnouncer />);
    act(() => {
      announce('Test message');
    });
    const region = screen.getByTestId('aria-live-region');
    expect(region.textContent).toBe('Test message');
  });

  it('should clear announcement after a delay', () => {
    render(<AriaLiveAnnouncer />);
    act(() => {
      announce('Test message');
    });

    act(() => {
      vi.advanceTimersByTime(3000); // Wait for timeout
    });

    const region = screen.getByTestId('aria-live-region');
    expect(region.textContent).toBe('');
  });
});
