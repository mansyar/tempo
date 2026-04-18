import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';
import * as rooms from './rooms';
import * as topics from './topics';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('topics:add and topics:listByRoom', async () => {
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

  // Add a topic
  await t.mutation(api.topics.add, {
    roomId,
    identityId: 'user1',
    title: 'First Topic',
  });

  // List topics
  const roomTopics = await t.query(api.topics.listByRoom, { roomId });
  expect(roomTopics.length).toBe(1);
  expect(roomTopics[0].title).toBe('First Topic');
  expect(roomTopics[0].status).toBe('pending');
  expect(roomTopics[0].order).toBe(1);

  // Add another topic
  await t.mutation(api.topics.add, {
    roomId,
    identityId: 'user1',
    title: 'Second Topic',
  });

  const roomTopics2 = await t.query(api.topics.listByRoom, { roomId });
  expect(roomTopics2.length).toBe(2);
  expect(roomTopics2[1].title).toBe('Second Topic');
  expect(roomTopics2[1].order).toBe(2);
});

test('topics:add is facilitator-only', async () => {
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

  // Non-facilitator attempts to add
  await expect(
    t.mutation(api.topics.add, {
      roomId,
      identityId: 'user2',
      title: 'Hacker Topic',
    })
  ).rejects.toThrow('Only the facilitator can manage topics');
});

test('topics:remove', async () => {
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
    title: 'Topic to Remove',
  });

  const roomTopics = await t.query(api.topics.listByRoom, { roomId });
  const topicId = roomTopics[0]._id;

  // Non-facilitator attempts to remove
  await expect(
    t.mutation(api.topics.remove, {
      topicId,
      identityId: 'user2',
    })
  ).rejects.toThrow('Only the facilitator can manage topics');

  // Facilitator removes
  await t.mutation(api.topics.remove, {
    topicId,
    identityId: 'user1',
  });

  const roomTopicsAfter = await t.query(api.topics.listByRoom, { roomId });
  expect(roomTopicsAfter.length).toBe(0);
});

test('topics:remove and reorder', async () => {
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
    title: 'Topic 1',
  });
  await t.mutation(api.topics.add, {
    roomId,
    identityId: 'user1',
    title: 'Topic 2',
  });
  await t.mutation(api.topics.add, {
    roomId,
    identityId: 'user1',
    title: 'Topic 3',
  });

  const roomTopics = await t.query(api.topics.listByRoom, { roomId });
  const topic2Id = roomTopics[1]._id;

  // Remove middle topic
  await t.mutation(api.topics.remove, {
    topicId: topic2Id,
    identityId: 'user1',
  });

  const updatedTopics = await t.query(api.topics.listByRoom, { roomId });
  expect(updatedTopics.length).toBe(2);
  expect(updatedTopics[0].title).toBe('Topic 1');
  expect(updatedTopics[0].order).toBe(1);
  expect(updatedTopics[1].title).toBe('Topic 3');
  expect(updatedTopics[1].order).toBe(2);
});
