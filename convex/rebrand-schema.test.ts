import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import schema from './schema';
import * as rooms from './rooms';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('schema includes toolType in rooms', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  // Try to create a room with toolType
  // If toolType is not in schema, this might fail at runtime or during schema validation in convexTest
  await t.run(async (ctx) => {
    const roomId = await ctx.db.insert('rooms', {
      slug: 'schema-test',
      status: 'voting',
      facilitatorId: 'user1',
      updatedAt: Date.now(),
      toolType: 'poker',
    });

    const room = await ctx.db.get(roomId);
    expect(room?.toolType).toBe('poker');
  });
});
