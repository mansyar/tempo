import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from '../convex/_generated/api';
import schema from '../convex/schema';
import * as rooms from '../convex/rooms';
import * as topics from '../convex/topics';
import * as apiModule from '../convex/_generated/api';
import * as serverModule from '../convex/_generated/server';

test('topics:update', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    topics: async () => topics,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test-room',
    facilitatorId: 'user1',
  });

  await t.mutation(api.topics.add, {
    roomId,
    identityId: 'user1',
    title: 'Original Title',
  });

  const roomTopics = await t.query(api.topics.listByRoom, { roomId });
  const topicId = roomTopics[0]._id;

  // Facilitator updates title
  await t.mutation(api.topics.update, {
    topicId,
    identityId: 'user1',
    title: 'Updated Title',
  });

  const updatedTopic = await t.run(async (ctx) => await ctx.db.get(topicId));
  expect(updatedTopic?.title).toBe('Updated Title');

  // Non-facilitator attempts to update
  await expect(
    t.mutation(api.topics.update, {
      topicId,
      identityId: 'user2',
      title: 'Hacker Title',
    })
  ).rejects.toThrow('Only the facilitator can manage topics');
});
