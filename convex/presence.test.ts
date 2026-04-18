import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';
import * as players from './players';
import * as rooms from './rooms';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('players:heartbeat updates lastHeartbeat', async () => {
  const t = convexTest(schema, {
    players: async () => players,
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test',
    facilitatorId: 'user1',
  });
  const playerId = await t.mutation(api.players.join, {
    roomId,
    identityId: 'user1',
    name: 'User 1',
  });

  const playerBefore = await t.run(async (ctx) => await ctx.db.get(playerId));
  const timeBefore = playerBefore!.lastHeartbeat;

  // Wait a bit to ensure time changes
  await new Promise((resolve) => setTimeout(resolve, 10));

  await t.mutation(api.players.heartbeat, { roomId, identityId: 'user1' });

  const playerAfter = await t.run(async (ctx) => await ctx.db.get(playerId));
  expect(playerAfter!.lastHeartbeat).toBeGreaterThan(timeBefore);
});

test('players:markOffline marks inactive players as offline', async () => {
  const t = convexTest(schema, {
    players: async () => players,
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test',
    facilitatorId: 'user1',
  });
  const playerId = await t.mutation(api.players.join, {
    roomId,
    identityId: 'user1',
    name: 'User 1',
  });

  // Manually set lastHeartbeat to 40 seconds ago
  await t.run(async (ctx) => {
    await ctx.db.patch(playerId, { lastHeartbeat: Date.now() - 40000 });
  });

  await t.mutation(api.players.markOffline, {});

  const player = await t.run(async (ctx) => await ctx.db.get(playerId));
  expect(player!.isOnline).toBe(false);
});

test('players:leave marks player as offline', async () => {
  const t = convexTest(schema, {
    players: async () => players,
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test',
    facilitatorId: 'user1',
  });
  await t.mutation(api.players.join, {
    roomId,
    identityId: 'user1',
    name: 'User 1',
  });

  await t.mutation(api.players.leave, { roomId, identityId: 'user1' });

  const player = await t.run(async (ctx) => {
    return await ctx.db
      .query('players')
      .withIndex('by_identity', (q) =>
        q.eq('roomId', roomId).eq('identityId', 'user1')
      )
      .unique();
  });
  expect(player!.isOnline).toBe(false);
});

test('players:listByRoom returns all players in a room', async () => {
  const t = convexTest(schema, {
    players: async () => players,
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test',
    facilitatorId: 'user1',
  });
  await t.mutation(api.players.join, {
    roomId,
    identityId: 'user1',
    name: 'User 1',
  });
  await t.mutation(api.players.join, {
    roomId,
    identityId: 'user2',
    name: 'User 2',
  });

  const playersList = await t.query(api.players.listByRoom, { roomId });
  expect(playersList.length).toBe(2);
});

test('players:join updates existing player', async () => {
  const t = convexTest(schema, {
    players: async () => players,
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test',
    facilitatorId: 'user1',
  });
  await t.mutation(api.players.join, {
    roomId,
    identityId: 'user1',
    name: 'User 1',
  });

  // Join again with different name
  await t.mutation(api.players.join, {
    roomId,
    identityId: 'user1',
    name: 'Updated Name',
  });

  const player = await t.run(async (ctx) => {
    return await ctx.db
      .query('players')
      .withIndex('by_identity', (q) =>
        q.eq('roomId', roomId).eq('identityId', 'user1')
      )
      .unique();
  });
  expect(player!.name).toBe('Updated Name');
});
