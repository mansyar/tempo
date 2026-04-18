import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';
import * as reactions from './reactions';
import * as rooms from './rooms';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('reactions:send and listRecent', async () => {
  const t = convexTest(schema, {
    reactions: async () => reactions,
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test',
    facilitatorId: 'user1',
  });

  // Send a reaction
  await t.mutation(api.reactions.send, {
    roomId,
    identityId: 'user1',
    emoji: '❤️',
  });

  // List recent reactions
  const recent = await t.query(api.reactions.listRecent, { roomId });
  expect(recent.length).toBe(1);
  expect(recent[0].emoji).toBe('❤️');
  expect(recent[0].identityId).toBe('user1');
});

test('reactions:listRecent filters old reactions', async () => {
  const t = convexTest(schema, {
    reactions: async () => reactions,
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test',
    facilitatorId: 'user1',
  });

  // Add an old reaction manually
  await t.run(async (ctx) => {
    await ctx.db.insert('reactions', {
      roomId,
      identityId: 'user1',
      emoji: 'OLD',
      createdAt: Date.now() - 15000, // 15 seconds ago
    });
  });

  // Send a new reaction
  await t.mutation(api.reactions.send, {
    roomId,
    identityId: 'user1',
    emoji: 'NEW',
  });

  const recent = await t.query(api.reactions.listRecent, { roomId });
  expect(recent.length).toBe(1);
  expect(recent[0].emoji).toBe('NEW');
});
