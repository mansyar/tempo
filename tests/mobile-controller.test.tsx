import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MobileController } from '../src/components/MobileController';
import { JuiceProvider } from '../src/components/shared/JuiceToggle';

// Mock useIdentity
vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: () => ({
    identityId: 'test-identity-id',
    nickname: 'Test User',
  }),
}));

// Mock convex
vi.mock('convex/react', () => {
  const mockMutation = Object.assign(vi.fn().mockResolvedValue({}), {
    withOptimisticUpdate: vi.fn().mockReturnThis(),
  });
  return {
    useQuery: vi.fn(),
    useMutation: vi.fn(() => mockMutation),
  };
});

// Mock useSound - needs patterns for usePresence
vi.mock('../src/hooks/useSound', () => ({
  useSound: () => ({
    play: vi.fn(),
    vibrate: vi.fn(),
    patterns: {
      pop: 10,
      whoosh: 20,
      confetti: [50, 30, 50],
      success: 100,
      reveal: [30, 50, 30],
      nudge: 20,
    },
  }),
}));

import { useQuery, useMutation } from 'convex/react';

describe('MobileController Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.stubGlobal('innerWidth', 375);

    // Mock all useMutation calls
    vi.mocked(useMutation).mockReturnValue(
      Object.assign(vi.fn().mockResolvedValue({}), {
        withOptimisticUpdate: vi.fn().mockReturnThis(),
      })
    );

    // Mock queries
    vi.mocked(useQuery).mockImplementation((...args: unknown[]) => {
      const a = args[1] as Record<string, unknown>;
      if (a && a.slug !== undefined) {
          return {
            _id: 'room-123',
            slug: a.slug as string,
            facilitatorId: 'test-identity-id',
            status: 'voting',
            currentTopicId: 'topic-1',
            scaleType: 'fibonacci',
          };
        }
        if (a && a.roomId !== undefined && a.identityId === undefined) {
          return [
            {
              _id: 'player-1',
              identityId: 'test-identity-id',
              name: 'Test User',
              isOnline: true,
            },
          ];
        }
        if (a && a.roomId !== undefined && a.identityId !== undefined) {
          return [];
        }
        return null;
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should render the mobile controller', () => {
    render(
      <JuiceProvider>
        <MobileController slug="test-room" onExit={vi.fn()} />
      </JuiceProvider>
    );

    expect(screen.getByText('Test User')).toBeDefined();
    expect(screen.getByText(/Cast your vote/i)).toBeDefined();
  });

  it('should call onExit when logout is clicked', () => {
    const onExit = vi.fn();
    render(
      <JuiceProvider>
        <MobileController slug="test-room" onExit={onExit} />
      </JuiceProvider>
    );

    const logoutButton = screen.getByLabelText(/Exit Controller/i);
    fireEvent.click(logoutButton);

    expect(onExit).toHaveBeenCalled();
  });

  it('should call castVote when a vote is selected', () => {
    const mockCastVote = Object.assign(vi.fn().mockResolvedValue({}), {
      withOptimisticUpdate: vi.fn().mockReturnThis(),
    });
    vi.mocked(useMutation).mockReturnValue(mockCastVote);

    render(
      <JuiceProvider>
        <MobileController slug="test-room" onExit={vi.fn()} />
      </JuiceProvider>
    );

    // Click on a vote card
    const voteCard = screen.getByText('5');
    fireEvent.click(voteCard);

    expect(mockCastVote).toHaveBeenCalled();
  });
});
