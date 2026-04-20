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
  const { roomId } = await t.mutation(api.rooms.create, {
    slug,
    facilitatorId,
  });

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

  const { roomId } = await t.mutation(api.rooms.create, {
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

  const { roomId } = await t.mutation(api.rooms.create, {
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

test('rooms:nextTopic flow', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    topics: async () => topics,
    votes: async () => votes,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'test-room',
    facilitatorId: 'user1',
  });

  await t.mutation(api.topics.addBatch, {
    roomId,
    identityId: 'user1',
    titlesString: 'T1\nT2',
  });

  const roomTopics = await t.query(api.topics.listByRoom, { roomId });
  const t1Id = roomTopics[0]._id;
  const t2Id = roomTopics[1]._id;

  // Cast a vote for T1 (automatically the active topic if we implement it so)
  // Wait, rooms.create doesn't set first topic as active.
  // Actually, let's assume rooms.create or topics.add doesn't auto-activate.
  // We need to implement how a topic becomes active.
  // Schema says: rooms.currentTopicId is optional.

  // For now, let's just manually set it for the test or implement the auto-activation.
  // Specification says: "Next Topic: ... the next pending topic becomes active."
  // So maybe rooms:nextTopic finds the first pending one if none is active?

  // Let's test rooms:nextTopic
  await t.mutation(api.rooms.nextTopic, { roomId, identityId: 'user1' });

  let room = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(room?.currentTopicId).toBe(t1Id);
  expect(room?.status).toBe('voting');

  let t1 = await t.run(async (ctx) => await ctx.db.get(t1Id));
  expect(t1?.status).toBe('active');

  // Reveal and cast vote
  await t.mutation(api.rooms.reveal, { roomId, identityId: 'user1' });
  await t.mutation(api.votes.cast, {
    roomId,
    identityId: 'user1',
    topicId: t1Id,
    value: '5',
  });

  // Next topic
  await t.mutation(api.rooms.nextTopic, { roomId, identityId: 'user1' });

  room = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(room?.currentTopicId).toBe(t2Id);
  expect(room?.status).toBe('voting');

  t1 = await t.run(async (ctx) => await ctx.db.get(t1Id));
  expect(t1?.status).toBe('completed');

  const t2 = await t.run(async (ctx) => await ctx.db.get(t2Id));
  expect(t2?.status).toBe('active');

  // Verify votes are cleared for the new round
  const roomVotes = await t.run(async (ctx) => {
    return await ctx.db
      .query('votes')
      .withIndex('by_room', (q) => q.eq('roomId', roomId))
      .collect();
  });
  expect(roomVotes.length).toBe(0);
});

test('rooms:startTimer and rooms:resetTimer', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'timer-test',
    facilitatorId: 'user1',
  });

  // 1. Start timer
  await t.mutation(api.rooms.startTimer, { roomId, identityId: 'user1' });
  let room = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(room?.timerStartedAt).toBeDefined();
  expect(typeof room?.timerStartedAt).toBe('number');

  // 2. Reset timer
  await t.mutation(api.rooms.resetTimer, { roomId, identityId: 'user1' });
  room = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(room?.timerStartedAt).toBeUndefined();
});

test('rooms:startTimer is facilitator-only', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'timer-test',
    facilitatorId: 'user1',
  });

  await expect(
    t.mutation(api.rooms.startTimer, { roomId, identityId: 'user2' })
  ).rejects.toThrow('Only the facilitator can start the timer');
});

test('timer auto-starts on first vote', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    votes: async () => votes,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'auto-timer-test',
    facilitatorId: 'facilitator',
  });

  // Cast first vote
  await t.mutation(api.votes.cast, {
    roomId,
    identityId: 'player1',
    value: '5',
  });

  const room = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(room?.timerStartedAt).toBeDefined();
  expect(typeof room?.timerStartedAt).toBe('number');
});
