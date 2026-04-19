import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';
import * as rooms from './rooms';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('rooms:create generates human-readable slugs (adjective-noun-number)', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const facilitatorId = 'facilitator-1';
  // Note: We'll change rooms.create to make slug optional and auto-generate it if missing
  const roomId = await t.mutation(api.rooms.create, { facilitatorId });

  const room = await t.run(async (ctx) => {
    return await ctx.db.get(roomId);
  });

  expect(room?.slug).toBeDefined();
  // Format should be adjective-noun-number (e.g., clumsy-tiger-22)
  const slugParts = room?.slug.split('-');
  expect(slugParts?.length).toBe(3);
  expect(isNaN(Number(slugParts?.[2]))).toBe(false);
});

test('rooms:create generates unique slugs', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const slugs = new Set();
  for (let i = 0; i < 10; i++) {
    const roomId = await t.mutation(api.rooms.create, {
      facilitatorId: 'user',
    });
    const room = await t.run(async (ctx) => await ctx.db.get(roomId));
    expect(slugs.has(room?.slug)).toBe(false);
    slugs.add(room?.slug);
  }
});

test('rooms:create accepts custom slug', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const customSlug = 'custom-slug';
  const roomId = await t.mutation(api.rooms.create, {
    facilitatorId: 'user',
    slug: customSlug,
  });
  const room = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(room?.slug).toBe(customSlug);
});
