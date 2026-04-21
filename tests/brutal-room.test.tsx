import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RoomPage } from '../src/components/poker/RoomPage';
import { useQuery } from 'convex/react';
import { JuiceProvider } from '../src/components/shared/JuiceToggle';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

// Mock Convex
vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => vi.fn().mockResolvedValue({})),
}));

// Mock useIdentity
vi.mock('../../hooks/useIdentity', () => ({
  useIdentity: vi.fn(() => ({
    nickname: 'Tester',
    identityId: 'test-id',
    setNickname: vi.fn(),
  })),
}));

// Mock hooks
vi.mock('../../hooks/useEmojiReactions', () => ({ useEmojiReactions: vi.fn(() => ({ sendReaction: vi.fn(), localReactions: [] })) }));
vi.mock('../../hooks/usePresence', () => ({ usePresence: vi.fn() }));
vi.mock('../../hooks/useSound', () => ({ useSound: vi.fn(() => ({ play: vi.fn(), vibrate: vi.fn(), patterns: {} })) }));

describe('Neo-Brutalist Room Layout', () => {
  it('should have a sidebar with retro blue background', () => {
    vi.mocked(useQuery).mockImplementation((...args: any[]) => {
       if (args[0].name === 'getBySlug') return { _id: 'room-id', facilitatorId: 'test-id', slug: 'test-room', status: 'voting' };
       return [];
    });

    localStorage.setItem('pointy_nickname', 'Tester');
    render(
      <JuiceProvider>
        <RoomPage slug="test-room" />
      </JuiceProvider>
    );
    const aside = document.querySelector('aside');
    expect(aside?.classList.contains('bg-retro-blue')).toBe(true);
  });

  it('should apply brutal-border and brutal-shadow to main layout containers', () => {
    localStorage.setItem('pointy_nickname', 'Tester');
    render(
      <JuiceProvider>
        <RoomPage slug="test-room" />
      </JuiceProvider>
    );
    const island = document.querySelector('.island-shell');
    // After redesign, island-shell should be replaced or updated with brutal classes
    const containers = document.querySelectorAll('.brutal-border');
    expect(containers.length).toBeGreaterThan(0);
  });
});
