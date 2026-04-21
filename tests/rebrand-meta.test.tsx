import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { RoomPage } from '../src/components/RoomPage';
import { useQuery } from 'convex/react';

// Mock Convex
vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => vi.fn().mockResolvedValue({})),
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
vi.mock('../src/components/JuiceToggle', () => ({
  useJuice: vi.fn(() => ({ enabled: true })),
}));

describe('Meta Tags & Title Rebranding', () => {
  it('updates tab title to use Tempo branding', async () => {
    vi.mocked(useQuery).mockImplementation((_func, _args: unknown) => {
      const args = _args as {
        slug?: string;
        roomId?: string;
        identityId?: string;
      };
      if (args?.slug === 'test-room') {
        return {
          _id: 'room1',
          status: 'voting',
          currentTopicId: 'topic1',
          facilitatorId: 'user1',
        };
      }
      if (_args?.roomId === 'room1') {
        if (_args.identityId) return [];
        return [
          {
            identityId: 'user1',
            name: 'Tester',
            _id: 'topic1',
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
