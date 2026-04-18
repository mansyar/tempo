import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const add = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');

    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can manage topics');
    }

    const existingTopics = await ctx.db
      .query('topics')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    await ctx.db.insert('topics', {
      roomId: args.roomId,
      title: args.title,
      order: existingTopics.length + 1,
      status: 'pending',
    });
  },
});

export const listByRoom = query({
  args: { roomId: v.id('rooms') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('topics')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();
  },
});

export const remove = mutation({
  args: {
    topicId: v.id('topics'),
    identityId: v.string(),
  },
  handler: async (ctx, args) => {
    const topic = await ctx.db.get(args.topicId);
    if (!topic) throw new Error('Topic not found');

    const room = await ctx.db.get(topic.roomId);
    if (!room) throw new Error('Room not found');

    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can manage topics');
    }

    await ctx.db.delete(args.topicId);

    // Reorder remaining topics
    const remainingTopics = await ctx.db
      .query('topics')
      .withIndex('by_room', (q) => q.eq('roomId', topic.roomId))
      .collect();

    // Sort by original order to maintain relative order
    const sortedTopics = remainingTopics.sort((a, b) => a.order - b.order);

    for (let i = 0; i < sortedTopics.length; i++) {
      await ctx.db.patch(sortedTopics[i]._id, {
        order: i + 1,
      });
    }
  },
});

export const addBatch = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
    titlesString: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');

    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can manage topics');
    }

    const titles = args.titlesString
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const existingTopics = await ctx.db
      .query('topics')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    let nextOrder = existingTopics.length + 1;

    for (const title of titles) {
      await ctx.db.insert('topics', {
        roomId: args.roomId,
        title,
        order: nextOrder++,
        status: 'pending',
      });
    }
  },
});

export const reorder = mutation({
  args: {
    topicId: v.id('topics'),
    identityId: v.string(),
    newOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const topic = await ctx.db.get(args.topicId);
    if (!topic) throw new Error('Topic not found');

    const room = await ctx.db.get(topic.roomId);
    if (!room) throw new Error('Room not found');

    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can manage topics');
    }

    const oldOrder = topic.order;
    const newOrder = args.newOrder;

    if (oldOrder === newOrder) return;

    const allTopics = await ctx.db
      .query('topics')
      .withIndex('by_room', (q) => q.eq('roomId', topic.roomId))
      .collect();

    if (newOrder < 1 || newOrder > allTopics.length) {
      throw new Error('Invalid order');
    }

    for (const t of allTopics) {
      if (oldOrder < newOrder) {
        // Moving down
        if (t.order > oldOrder && t.order <= newOrder) {
          await ctx.db.patch(t._id, { order: t.order - 1 });
        }
      } else {
        // Moving up
        if (t.order >= newOrder && t.order < oldOrder) {
          await ctx.db.patch(t._id, { order: t.order + 1 });
        }
      }
    }

    await ctx.db.patch(args.topicId, { order: newOrder });
  },
});

export const setFinalEstimate = mutation({
  args: {
    topicId: v.id('topics'),
    identityId: v.string(),
    estimate: v.string(),
  },
  handler: async (ctx, args) => {
    const topic = await ctx.db.get(args.topicId);
    if (!topic) throw new Error('Topic not found');

    const room = await ctx.db.get(topic.roomId);
    if (!room) throw new Error('Room not found');

    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can manage topics');
    }

    await ctx.db.patch(args.topicId, {
      finalEstimate: args.estimate,
    });
  },
});

export const update = mutation({
  args: {
    topicId: v.id('topics'),
    identityId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const topic = await ctx.db.get(args.topicId);
    if (!topic) throw new Error('Topic not found');

    const room = await ctx.db.get(topic.roomId);
    if (!room) throw new Error('Room not found');

    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can manage topics');
    }

    await ctx.db.patch(args.topicId, {
      title: args.title,
    });
  },
});
