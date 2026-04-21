import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoomSettingsModal } from '../src/components/RoomSettingsModal';
import { convexTest } from 'convex-test';
import schema from '../convex/schema';
import * as rooms from '../convex/rooms';
import * as votes from '../convex/votes';
import * as players from '../convex/players';
import { api } from '../convex/_generated/api';
import * as apiModule from '../convex/_generated/api';
import * as serverModule from '../convex/_generated/server';

// Mock convex react
vi.mock('convex/react', () => {
  const mockFn = vi.fn().mockResolvedValue({});
  return {
    useMutation: vi.fn(() =>
      Object.assign(mockFn, { withOptimisticUpdate: vi.fn().mockReturnThis() })
    ),
  };
});

import { useMutation } from 'convex/react';

describe('RoomSettings UI', () => {
  // @ts-expect-error - testing with mock Id
  const roomId: Id<'rooms'> = 'room-1';
  const identityId = 'user-1';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call updateSettings when Save is clicked', async () => {
    const mockUpdate = Object.assign(vi.fn().mockResolvedValue({}), {
      withOptimisticUpdate: vi.fn().mockReturnThis(),
    });
    vi.mocked(useMutation).mockReturnValue(mockUpdate);

    render(
      <RoomSettingsModal
        isOpen={true}
        onClose={vi.fn()}
        roomId={roomId}
        identityId={identityId}
      />
    );

    const tshirtBtn = screen.getByText(/T-Shirt/i);
    fireEvent.click(tshirtBtn);

    const saveBtn = screen.getByText(/Save Changes/i);
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        roomId,
        identityId,
        autoReveal: false,
        scaleType: 'tshirt',
      });
    });
  });
});

describe('Auto-Reveal Logic (Convex)', () => {
  it('should automatically reveal when everyone has voted and autoReveal is true', async () => {
    const t = convexTest(schema, {
      rooms: async () => rooms,
      votes: async () => votes,
      players: async () => players,
      topics: async () => await import('../convex/topics'),
      '_generated/api': async () => apiModule,
      '_generated/server': async () => serverModule,
    });

    const facId = 'fac';
    const player1 = 'p1';

    const { roomId } = await t.mutation(api.rooms.create, {
      slug: 'auto-reveal-test',
      facilitatorId: facId,
    });

    // Create a topic
    await t.mutation(api.topics.add, {
      roomId,
      identityId: facId,
      title: 'Test Topic',
    });

    const roomWithTopic = await t.run(async (ctx) => await ctx.db.get(roomId));
    const topicId = roomWithTopic!.currentTopicId!;

    // Enable auto-reveal
    await t.mutation(api.rooms.updateSettings, {
      roomId,
      identityId: facId,
      autoReveal: true,
    });

    await t.mutation(api.players.join, {
      roomId,
      identityId: facId,
      name: 'Fac',
    });
    await t.mutation(api.players.join, {
      roomId,
      identityId: player1,
      name: 'P1',
    });

    // P1 votes (1/2 voted)
    await t.mutation(api.votes.cast, {
      roomId,
      identityId: player1,
      topicId,
      value: '5',
    });

    let room = await t.run(async (ctx) => await ctx.db.get(roomId));
    expect(room?.status).toBe('voting');

    // Fac votes (2/2 voted) -> Should trigger reveal
    await t.mutation(api.votes.cast, {
      roomId,
      identityId: facId,
      topicId,
      value: '8',
    });

    room = await t.run(async (ctx) => await ctx.db.get(roomId));
    expect(room?.status).toBe('revealed');
  });
});
