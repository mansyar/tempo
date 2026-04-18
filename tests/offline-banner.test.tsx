import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OfflineBanner } from '../src/components/OfflineBanner';
import React from 'react';

describe('OfflineBanner Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should not render when online', () => {
    vi.stubGlobal('navigator', { onLine: true });
    render(<OfflineBanner />);
    expect(screen.queryByText(/reconnecting/i)).toBeNull();
  });

  it('should render when offline', () => {
    vi.stubGlobal('navigator', { onLine: false });
    render(<OfflineBanner />);
    expect(screen.getByText(/reconnecting/i)).toBeDefined();
  });
});
