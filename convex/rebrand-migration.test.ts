import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import schema from './schema';
import * as migrations from './migrations';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('migration: backfillToolType', async () => {
  const t = convexTest(schema, {
    // @ts-expect-error: convex-test type mismatch
    migrations: async () => migrations,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  // 1. Create a room without toolType (since it's optional)
  const roomId = await t.run(async (ctx) => {
    return await ctx.db.insert('rooms', {
      slug: 'migration-test',
      status: 'voting',
      facilitatorId: 'user1',
      updatedAt: Date.now(),
    });
  });

  const roomBefore = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(roomBefore?.toolType).toBeUndefined();

  // 2. Run migration
  // @ts-expect-error: convex-test mutation type mismatch
  await t.mutation(migrations.backfillToolType, {});

  // 3. Verify
  const roomAfter = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(roomAfter?.toolType).toBe('poker');
});
