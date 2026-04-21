import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RoundTimer } from '../src/components/RoundTimer';
import type { Id } from '../convex/_generated/dataModel';
import { useMutation } from 'convex/react';

// Mock convex
vi.mock('convex/react', () => ({
  useMutation: vi.fn(),
}));

describe('RoundTimer Component', () => {
  const roomId = 'room-123' as Id<'rooms'>;
  const identityId = 'user-1';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(useMutation).mockReturnValue(
      Object.assign(vi.fn(), { withOptimisticUpdate: vi.fn().mockReturnThis() })
    );
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

  it('should call startTimer when facilitator clicks start button', () => {
    const startTimerMock = Object.assign(vi.fn(), {
      withOptimisticUpdate: vi.fn().mockReturnThis(),
    });
    vi.mocked(useMutation).mockReturnValue(startTimerMock);

    render(
      <RoundTimer
        roomId={roomId}
        identityId={identityId}
        isFacilitator={true}
      />
    );

    const startButton = screen.getByTitle('Start Timer');
    fireEvent.click(startButton);

    expect(startTimerMock).toHaveBeenCalledWith({ roomId, identityId });
  });

  it('should call resetTimer when facilitator clicks reset button', () => {
    const resetTimerMock = Object.assign(vi.fn(), {
      withOptimisticUpdate: vi.fn().mockReturnThis(),
    });
    vi.mocked(useMutation).mockReturnValue(resetTimerMock);

    const startTime = Date.now();
    render(
      <RoundTimer
        roomId={roomId}
        identityId={identityId}
        timerStartedAt={startTime}
        isFacilitator={true}
      />
    );

    const resetButton = screen.getByTitle('Reset Timer');
    fireEvent.click(resetButton);

    expect(resetTimerMock).toHaveBeenCalledWith({ roomId, identityId });
  });

  it('should stop countdown when timer reaches 0', () => {
    const startTime = Date.now();
    render(
      <RoundTimer
        roomId={roomId}
        identityId={identityId}
        timerStartedAt={startTime}
        isFacilitator={false}
      />
    );

    // Advance past the 60-second duration
    act(() => {
      vi.advanceTimersByTime(61000);
    });

    expect(screen.getByText('0s')).toBeDefined();
  });

  it('should clean up interval on unmount', () => {
    const startTime = Date.now();
    const { unmount } = render(
      <RoundTimer
        roomId={roomId}
        identityId={identityId}
        timerStartedAt={startTime}
        isFacilitator={false}
      />
    );

    // Verify timer is running
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('59s')).toBeDefined();

    // Unmount should clear interval
    unmount();

    // Advance timers - if interval wasn't cleared, this would cause errors
    act(() => {
      vi.advanceTimersByTime(1000);
    });
  });

  it('should not render urgency state when timeLeft > 10', () => {
    const startTime = Date.now() - 49000; // 11s left
    const { container } = render(
      <RoundTimer
        roomId={roomId}
        identityId={identityId}
        timerStartedAt={startTime}
        isFacilitator={false}
      />
    );

    const timerDiv = container.querySelector('.animate-pulse');
    expect(timerDiv).toBeNull();
  });
});
