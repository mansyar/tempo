import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';
import * as rooms from './rooms';
import * as players from './players';
import * as votes from './votes';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('rooms.create and players.join', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    players: async () => players,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  // 1. Create a room
  const slug = 'test-room';
  const facilitatorId = 'facilitator-1';
  const roomId = await t.mutation(api.rooms.create, { slug, facilitatorId });

  const room = await t.run(async (ctx) => {
    return await ctx.db.get(roomId);
  });
  expect(room?.slug).toBe(slug);
  expect(room?.facilitatorId).toBe(facilitatorId);
  expect(room?.status).toBe('voting');

  // 2. Join as a player
  const playerIdentityId = 'player-1';
  const playerName = 'Alice';
  await t.mutation(api.players.join, {
    roomId,
    identityId: playerIdentityId,
    name: playerName,
  });

  const player = await t.run(async (ctx) => {
    return await ctx.db
      .query('players')
      .withIndex('by_identity', (q) =>
        q.eq('roomId', roomId).eq('identityId', playerIdentityId)
      )
      .unique();
  });
  expect(player?.name).toBe(playerName);
  expect(player?.isOnline).toBe(true);
});

test('rooms:reveal is facilitator-only', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test',
    facilitatorId: 'user1',
  });

  // Non-facilitator attempts reveal
  await expect(
    t.mutation(api.rooms.reveal, { roomId, identityId: 'user2' })
  ).rejects.toThrow('Only the facilitator can reveal votes');

  // Facilitator attempts reveal
  await t.mutation(api.rooms.reveal, { roomId, identityId: 'user1' });
  const room = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(room?.status).toBe('revealed');
});

test('rooms:reset clears votes and is facilitator-only', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    votes: async () => votes,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test',
    facilitatorId: 'user1',
  });
  await t.mutation(api.votes.cast, { roomId, identityId: 'user1', value: '5' });

  // Non-facilitator attempts reset
  await expect(
    t.mutation(api.rooms.reset, { roomId, identityId: 'user2' })
  ).rejects.toThrow('Only the facilitator can reset the round');

  // Facilitator attempts reset
  await t.mutation(api.rooms.reset, { roomId, identityId: 'user1' });

  const room = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(room?.status).toBe('voting');

  const roomVotes = await t.run(async (ctx) => {
    return await ctx.db
      .query('votes')
      .withIndex('by_room', (q) => q.eq('roomId', roomId))
      .collect();
  });
  expect(roomVotes.length).toBe(0);
});
