import { render, screen, fireEvent } from '@testing-library/react';
import { RoomPage } from '../src/components/RoomPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery, useMutation } from 'convex/react';
import React from 'react';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: () => ({ identityId: 'user-1', nickname: 'Alice' }),
}));

vi.mock('../src/hooks/useSound', () => ({
  useSound: () => ({
    play: vi.fn(),
    vibrate: vi.fn(),
    patterns: { success: [] },
  }),
}));

vi.mock('../src/hooks/usePresence', () => ({
  usePresence: vi.fn(),
}));

vi.mock('../src/hooks/useEmojiReactions', () => ({
  useEmojiReactions: () => ({ localReactions: [], sendReaction: vi.fn() }),
}));

vi.mock('../src/components/JuiceToggle', () => ({
  useJuice: () => ({ enabled: true }),
}));

// Mock InviteModal
vi.mock('../src/components/InviteModal', () => ({
  InviteModal: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="invite-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe('RoomPage Invite Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    let callCount = 0;
    vi.mocked(useQuery).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          _id: 'room-1',
          slug: 'test-room',
          facilitatorId: 'user-1',
          status: 'voting',
        };
      }
      return []; // Default to empty array for players, votes, topics
    });
    vi.mocked(useMutation).mockReturnValue(vi.fn().mockResolvedValue({}));
  });

  it('should open InviteModal when "Copy Invite" is clicked', async () => {
    render(<RoomPage slug="test-room" />);

    const inviteButton = screen.getByRole('button', { name: /copy invite/i });
    fireEvent.click(inviteButton);

    expect(await screen.findByTestId('invite-modal')).toBeDefined();
  });
});
