import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { RoomPage } from '../src/components/RoomPage';
import { useQuery } from 'convex/react';
import type { Id } from '../convex/_generated/dataModel';

// Mock Convex
const mockMutation = Object.assign(vi.fn().mockResolvedValue({}), {
  withOptimisticUpdate: vi.fn().mockReturnThis(),
});

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => mockMutation),
}));

// Mock useIdentity
vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: vi.fn(() => ({
    identityId: 'user1',
    nickname: 'Tester',
  })),
}));

// Mock other hooks
vi.mock('../src/hooks/usePresence', () => ({ usePresence: vi.fn() }));
vi.mock('../src/hooks/useEmojiReactions', () => ({
  useEmojiReactions: vi.fn(() => ({
    sendReaction: vi.fn(),
    localReactions: [],
  })),
}));
vi.mock('../src/hooks/useSound', () => ({
  useSound: vi.fn(() => ({ play: vi.fn(), vibrate: vi.fn(), patterns: {} })),
}));
vi.mock('../src/components/shared/JuiceToggle', () => ({
  useJuice: vi.fn(() => ({ enabled: true })),
}));

describe('Meta Tags & Title Rebranding', () => {
  it('updates tab title to use Tempo branding', async () => {
    vi.mocked(useQuery).mockImplementation((...args: unknown[]) => {
      const a = args[1] as {
        slug?: string;
        roomId?: string;
        identityId?: string;
      };
      if (a?.slug === 'test-room') {
        return {
          _id: 'room1' as Id<'rooms'>,
          status: 'voting',
          currentTopicId: 'topic1' as Id<'topics'>,
          facilitatorId: 'user1',
        };
      }
      if (a?.roomId === 'room1') {
        if (a.identityId) return [];
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

    render(<RoomPage slug="test-room" />);

    await waitFor(() => {
      expect(document.title).toContain('Tempo');
      expect(document.title).not.toContain('Pointy');
    });
  });
});
