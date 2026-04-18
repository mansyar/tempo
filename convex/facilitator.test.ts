import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';
import * as players from './players';
import * as rooms from './rooms';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('players:claimFacilitator updates facilitatorId when current is offline', async () => {
  const t = convexTest(schema, {
    players: async () => players,
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const facilitatorId = 'user1';
  const claimantId = 'user2';
  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test',
    facilitatorId,
  });

  // 1. Original facilitator joins
  const facPlayerId = await t.mutation(api.players.join, {
    roomId,
    identityId: facilitatorId,
    name: 'Fac',
  });

  // 2. Claimant joins (won't auto-assign because Fac is online)
  await t.mutation(api.players.join, {
    roomId,
    identityId: claimantId,
    name: 'Claimant',
  });

  // 3. Fac goes offline
  await t.run(async (ctx) => {
    await ctx.db.patch(facPlayerId, { isOnline: false });
  });

  // 4. Claimant claims
  await t.mutation(api.players.claimFacilitator, {
    roomId,
    identityId: claimantId,
  });

  const room = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(room!.facilitatorId).toBe(claimantId);
});

test('players:claimFacilitator fails if current facilitator is online', async () => {
  const t = convexTest(schema, {
    players: async () => players,
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const facilitatorId = 'user1';
  const claimantId = 'user2';
  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test',
    facilitatorId,
  });

  await t.mutation(api.players.join, {
    roomId,
    identityId: facilitatorId,
    name: 'Fac',
  });
  await t.mutation(api.players.join, {
    roomId,
    identityId: claimantId,
    name: 'Claimant',
  });

  await expect(
    t.mutation(api.players.claimFacilitator, { roomId, identityId: claimantId })
  ).rejects.toThrow('Current facilitator is still online');
});

test('players:join auto-assigns facilitator if current is offline', async () => {
  const t = convexTest(schema, {
    players: async () => players,
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const facilitatorId = 'user1';
  const newcomerId = 'user2';
  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test',
    facilitatorId,
  });

  // Facilitator record doesn't exist yet, so they are offline
  await t.mutation(api.players.join, {
    roomId,
    identityId: newcomerId,
    name: 'Newcomer',
  });

  const room = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(room!.facilitatorId).toBe(newcomerId);
});
