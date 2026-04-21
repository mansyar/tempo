import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PresenceSidebar } from '../src/components/shared/PresenceSidebar';

// Mock convex
vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn().mockReturnValue(vi.fn().mockResolvedValue({})),
}));

import { useQuery, useMutation } from 'convex/react';

describe('PresenceSidebar Nudge UI', () => {
  // @ts-expect-error - testing with mock Id
  const roomId: Id<'rooms'> = 'room-123';
  const facId = 'fac-1';
  const playerId = 'player-1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show nudge button only for facilitator', () => {
    // 1. Mock players (one fac, one player)
    vi.mocked(useQuery).mockReturnValue([
      { _id: 'p1', identityId: facId, name: 'Fac', isOnline: true },
      { _id: 'p2', identityId: playerId, name: 'Player', isOnline: true },
    ]);

    // 2. Render as regular player
    const { rerender } = render(
      <PresenceSidebar
        roomId={roomId}
        facilitatorId={facId}
        myIdentityId={playerId}
      />
    );
    expect(screen.queryByTitle(/Nudge/i)).toBeNull();

    // 3. Render as facilitator
    rerender(
      <PresenceSidebar
        roomId={roomId}
        facilitatorId={facId}
        myIdentityId={facId}
        votes={[]}
      />
    );
    expect(screen.getByTitle(/Nudge Player/i)).toBeDefined();
  });

  it('should call nudgePlayer when button is clicked', async () => {
    const mockNudge = Object.assign(vi.fn().mockResolvedValue({}), {
      withOptimisticUpdate: vi.fn().mockReturnThis(),
    });
    vi.mocked(useMutation).mockReturnValue(mockNudge);
    vi.mocked(useQuery).mockReturnValue([
      { _id: 'p1', identityId: facId, name: 'Fac', isOnline: true },
      { _id: 'p2', identityId: playerId, name: 'Player', isOnline: true },
    ]);

    render(
      <PresenceSidebar
        roomId={roomId}
        facilitatorId={facId}
        myIdentityId={facId}
        votes={[]}
      />
    );

    const nudgeBtn = screen.getByTitle(/Nudge Player/i);
    fireEvent.click(nudgeBtn);

    await waitFor(() => {
      expect(mockNudge).toHaveBeenCalledWith({
        roomId,
        identityId: facId,
        targetIdentityId: playerId,
      });
    });
  });

  it('should hide nudge button if player has already voted', () => {
    vi.mocked(useQuery).mockReturnValue([
      { _id: 'p1', identityId: facId, name: 'Fac', isOnline: true },
      { _id: 'p2', identityId: playerId, name: 'Player', isOnline: true },
    ]);

    render(
      <PresenceSidebar
        roomId={roomId}
        facilitatorId={facId}
        myIdentityId={facId}
        votes={[{ identityId: playerId, value: '5' }]}
      />
    );

    expect(screen.queryByTitle(/Nudge Player/i)).toBeNull();
  });
});
