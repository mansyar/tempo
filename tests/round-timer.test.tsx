import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RoundTimer } from '../src/components/RoundTimer';
import React from 'react';

// Mock convex
vi.mock('convex/react', () => ({
  useMutation: vi.fn().mockReturnValue(vi.fn()),
}));

describe('RoundTimer Component', () => {
  // @ts-expect-error - testing with mock Id
  const roomId: Id<'rooms'> = 'room-123';
  const identityId = 'user-1';

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render nothing if timer not started and not facilitator', () => {
    const { container } = render(
      <RoundTimer
        roomId={roomId}
        identityId={identityId}
        isFacilitator={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should render placeholder if timer not started but is facilitator', () => {
    render(
      <RoundTimer
        roomId={roomId}
        identityId={identityId}
        isFacilitator={true}
      />
    );
    expect(screen.getByText('--')).toBeDefined();
    expect(screen.getByTitle('Start Timer')).toBeDefined();
  });

  it('should show countdown if timer is started', () => {
    const startTime = Date.now();
    render(
      <RoundTimer
        roomId={roomId}
        identityId={identityId}
        timerStartedAt={startTime}
        isFacilitator={false}
      />
    );

    expect(screen.getByText('60s')).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('59s')).toBeDefined();
  });

  it('should show 0s when timer is finished', () => {
    const startTime = Date.now() - 61000;
    render(
      <RoundTimer
        roomId={roomId}
        identityId={identityId}
        timerStartedAt={startTime}
        isFacilitator={false}
      />
    );

    expect(screen.getByText('0s')).toBeDefined();
  });

  it('should show urgency state when < 10s', () => {
    const startTime = Date.now() - 51000; // 9s left
    const { container } = render(
      <RoundTimer
        roomId={roomId}
        identityId={identityId}
        timerStartedAt={startTime}
        isFacilitator={false}
      />
    );

    const timerDiv = container.querySelector('.animate-pulse');
    expect(timerDiv).toBeDefined();
    expect(timerDiv?.className).toContain('text-red-500');
  });
});
