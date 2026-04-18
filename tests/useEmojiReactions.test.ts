import { renderHook, act } from '@testing-library/react';
import { useEmojiReactions } from '../src/hooks/useEmojiReactions';
import { useQuery } from 'convex/react';
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';
import type { Id } from '../convex/_generated/dataModel';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => vi.fn().mockResolvedValue({})),
}));

describe('useEmojiReactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should merge remote reactions with local optimistic ones', () => {
    const now = Date.now();
    const mockRemoteReactions = [
      {
        _id: '1',
        roomId: 'r1',
        identityId: 'user2',
        emoji: '👏',
        createdAt: now,
      },
    ];
    (useQuery as Mock).mockReturnValue(mockRemoteReactions);

    const { result } = renderHook(() =>
      useEmojiReactions('r1' as Id<'rooms'>, 'user1')
    );

    // Check if it contains the remote reaction
    const remote = result.current.localReactions.find(
      (r) => r.senderId === 'user2'
    );
    expect(remote).toBeDefined();
    expect(remote?.emoji).toBe('👏');
    expect(remote?.isOptimistic).toBe(false);
  });

  it('should filter out my own remote reactions to prefer optimistic ones', () => {
    const now = Date.now();
    const mockRemoteReactions = [
      {
        _id: '1',
        roomId: 'r1',
        identityId: 'user1',
        emoji: '❤️',
        createdAt: now,
      },
    ];
    (useQuery as Mock).mockReturnValue(mockRemoteReactions);

    const { result } = renderHook(() =>
      useEmojiReactions('r1' as Id<'rooms'>, 'user1')
    );

    // Should not have the remote 'user1' reaction in the list if it's not optimistic
    const remote = result.current.localReactions.find(
      (r) => r.senderId === 'user1' && !r.isOptimistic
    );
    expect(remote).toBeUndefined();
  });

  it('should add to local state and call batcher when sending', () => {
    (useQuery as Mock).mockReturnValue([]);
    const { result } = renderHook(() =>
      useEmojiReactions('r1' as Id<'rooms'>, 'user1')
    );

    act(() => {
      result.current.sendReaction('🔥');
    });

    expect(result.current.localReactions).toContainEqual(
      expect.objectContaining({
        emoji: '🔥',
        senderId: 'user1',
        isOptimistic: true,
      })
    );

    // Should disappear after 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.localReactions).not.toContainEqual(
      expect.objectContaining({
        emoji: '🔥',
        senderId: 'user1',
        isOptimistic: true,
      })
    );
  });
});
