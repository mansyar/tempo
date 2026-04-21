import { render, waitFor } from '@testing-library/react';
import { RoomPage } from '../src/components/RoomPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from 'convex/react';
import type { Id } from '../convex/_generated/dataModel';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => vi.fn().mockResolvedValue({})),
}));

vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: vi.fn(() => ({
    identityId: 'user1',
    nickname: 'Tester',
  })),
}));

vi.mock('../src/hooks/usePresence', () => ({
  usePresence: vi.fn(),
}));

vi.mock('../src/hooks/useEmojiReactions', () => ({
  useEmojiReactions: vi.fn(() => ({
    sendReaction: vi.fn(),
    localReactions: [],
  })),
}));

vi.mock('../src/hooks/useSound', () => ({
  useSound: vi.fn(() => ({
    play: vi.fn(),
    vibrate: vi.fn(),
    patterns: {},
  })),
}));

vi.mock('../src/components/shared/JuiceToggle', () => ({
  useJuice: vi.fn(() => ({ enabled: true })),
}));

describe('Dynamic Tab Title', () => {
  beforeEach(() => {
    document.title = 'Tempo - Planning Poker';
  });

  const mockQueries = (status: 'voting' | 'revealed') => {
    vi.mocked(useQuery).mockImplementation((...args: unknown[]) => {
      const a = args[1] as {
        slug?: string;
        roomId?: string;
        identityId?: string;
      };
      // getBySlug
      if (a?.slug === 'test-room') {
        return {
          _id: 'room1' as Id<'rooms'>,
          status,
          currentTopicId: 'topic1' as Id<'topics'>,
          facilitatorId: 'user1',
        };
      }
      // listByRoom (players, topics, votes)
      if (a?.roomId === 'room1') {
        if (a.identityId) {
          // votes
          return status === 'revealed'
            ? [{ identityId: 'user1', value: '5' }]
            : [];
        }
        // players and topics fat object
        return [
          {
            identityId: 'user1',
            name: 'Tester',
            _id: 'topic1' as Id<'topics'>,
            title: 'Test Topic',
            status: 'active',
            order: 1,
            isOnline: true,
          },
        ];
      }
      return null;
    });
  };

  it('updates title during voting', async () => {
    mockQueries('voting');
    render(<RoomPage slug="test-room" />);

    await waitFor(
      () => {
        expect(document.title).toBe('🤔 Voting: Test Topic | Tempo');
      },
      { timeout: 2000 }
    );
  });

  it('updates title after reveal', async () => {
    mockQueries('revealed');
    render(<RoomPage slug="test-room" />);

    await waitFor(
      () => {
        expect(document.title).toBe('✅ Revealed: Test Topic | Tempo');
      },
      { timeout: 2000 }
    );
  });
});
