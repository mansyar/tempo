import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';
import * as rooms from './rooms';
import * as players from './players';
import * as votes from './votes';
import * as topics from './topics';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('votes:cast and masked votes:listByRoom', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    players: async () => players,
    votes: async () => votes,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
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

  // 1. User 1 casts a vote
  await t.mutation(api.votes.cast, { roomId, identityId: 'user1', value: '5' });

  // 2. User 2 lists votes - should be masked
  const votesForUser2 = await t.query(api.votes.listByRoom, {
    roomId,
    identityId: 'user2',
  });
  const user1VoteForUser2 = votesForUser2.find((v) => v.identityId === 'user1');
  expect(user1VoteForUser2?.value).toBe('voted');

  // 3. User 1 lists votes - should see own vote
  const votesForUser1 = await t.query(api.votes.listByRoom, {
    roomId,
    identityId: 'user1',
  });
  const user1VoteForUser1 = votesForUser1.find((v) => v.identityId === 'user1');
  expect(user1VoteForUser1?.value).toBe('5');

  // 4. Reveal room (manually for now)
  await t.run(async (ctx) => {
    await ctx.db.patch(roomId, { status: 'revealed' });
  });

  // 5. User 2 lists votes - should see unmasked vote
  const votesAfterReveal = await t.query(api.votes.listByRoom, {
    roomId,
    identityId: 'user2',
  });
  const user1VoteAfterReveal = votesAfterReveal.find(
    (v) => v.identityId === 'user1'
  );
  expect(user1VoteAfterReveal?.value).toBe('5');
});

test('votes:cast with topicId', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    votes: async () => votes,
    topics: async () => topics,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'test',
    facilitatorId: 'user1',
  });

  const topicId = await t.run(async (ctx) => {
    return await ctx.db.insert('topics', {
      roomId,
      title: 'Test',
      order: 1,
      status: 'pending',
    });
  });

  // Cast vote for specific topic
  await t.mutation(api.votes.cast, {
    roomId,
    identityId: 'user1',
    topicId,
    value: '8',
  });

  const vote = await t.run(async (ctx) => {
    return await ctx.db
      .query('votes')
      .withIndex('by_topic', (q) =>
        q.eq('roomId', roomId).eq('topicId', topicId)
      )
      .unique();
  });
  expect(vote?.value).toBe('8');
  expect(vote?.topicId).toBe(topicId);

  // Cast vote for same user but DIFFERENT topic
  const topic2Id = await t.run(async (ctx) => {
    return await ctx.db.insert('topics', {
      roomId,
      title: 'Test 2',
      order: 2,
      status: 'pending',
    });
  });

  await t.mutation(api.votes.cast, {
    roomId,
    identityId: 'user1',
    topicId: topic2Id,
    value: '13',
  });

  const votesForUser = await t.run(async (ctx) => {
    return await ctx.db
      .query('votes')
      .withIndex('by_room', (q) => q.eq('roomId', roomId))
      .collect();
  });
  expect(votesForUser.length).toBe(2);
  expect(votesForUser.find((v) => v.topicId === topicId)?.value).toBe('8');
  expect(votesForUser.find((v) => v.topicId === topic2Id)?.value).toBe('13');
});
