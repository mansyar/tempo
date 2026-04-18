import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { internal } from './_generated/api';
import schema from './schema';
import * as cleanup from './cleanup';
import * as rooms from './rooms';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('cleanup:staleRooms deletes old rooms and data', async () => {
  const t = convexTest(schema, {
    cleanup: async () => cleanup,
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  // 1. Create a stale room (updated 25 hours ago)
  const staleRoomId = await t.run(async (ctx) => {
    return await ctx.db.insert('rooms', {
      slug: 'stale',
      facilitatorId: 'user1',
      status: 'voting',
      updatedAt: Date.now() - 25 * 60 * 60 * 1000,
    });
  });

  // Add some data to it
  await t.run(async (ctx) => {
    await ctx.db.insert('players', {
      roomId: staleRoomId,
      identityId: 'user1',
      name: 'Alice',
      isOnline: true,
      lastHeartbeat: Date.now(),
    });
    await ctx.db.insert('topics', {
      roomId: staleRoomId,
      title: 'T1',
      order: 0,
      status: 'pending',
    });
    await ctx.db.insert('votes', {
      roomId: staleRoomId,
      identityId: 'user1',
      value: '5',
    });
    await ctx.db.insert('reactions', {
      roomId: staleRoomId,
      identityId: 'user1',
      emoji: '❤️',
      createdAt: Date.now(),
    });
  });

  // 2. Create a fresh room (updated 1 hour ago)
  const freshRoomId = await t.run(async (ctx) => {
    return await ctx.db.insert('rooms', {
      slug: 'fresh',
      facilitatorId: 'user2',
      status: 'voting',
      updatedAt: Date.now() - 1 * 60 * 60 * 1000,
    });
  });

  // 3. Run cleanup
  await t.mutation(internal.cleanup.staleRooms, {});

  // 4. Verify stale room is gone
  const staleRoom = await t.run(async (ctx) => await ctx.db.get(staleRoomId));
  expect(staleRoom).toBeNull();

  // Verify associated data is gone
  const stalePlayers = await t.run(
    async (ctx) =>
      await ctx.db
        .query('players')
        .withIndex('by_room', (q) => q.eq('roomId', staleRoomId))
        .collect()
  );
  expect(stalePlayers.length).toBe(0);

  const staleTopics = await t.run(
    async (ctx) =>
      await ctx.db
        .query('topics')
        .withIndex('by_room', (q) => q.eq('roomId', staleRoomId))
        .collect()
  );
  expect(staleTopics.length).toBe(0);

  const staleVotes = await t.run(
    async (ctx) =>
      await ctx.db
        .query('votes')
        .withIndex('by_room', (q) => q.eq('roomId', staleRoomId))
        .collect()
  );
  expect(staleVotes.length).toBe(0);

  const staleReactions = await t.run(
    async (ctx) =>
      await ctx.db
        .query('reactions')
        .withIndex('by_room', (q) => q.eq('roomId', staleRoomId))
        .collect()
  );
  expect(staleReactions.length).toBe(0);

  // 5. Verify fresh room is still there
  const freshRoom = await t.run(async (ctx) => await ctx.db.get(freshRoomId));
  expect(freshRoom).not.toBeNull();
});
