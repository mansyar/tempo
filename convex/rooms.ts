import { mutation, query, type MutationCtx } from './_generated/server';
import { v } from 'convex/values';
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  NumberDictionary,
} from 'unique-names-generator';

async function generateUniqueSlug(ctx: MutationCtx): Promise<string> {
  const numberDictionary = NumberDictionary.generate({ min: 10, max: 99 });
  const config = {
    dictionaries: [adjectives, animals, numberDictionary],
    separator: '-',
  };

  for (let i = 0; i < 5; i++) {
    const slug = uniqueNamesGenerator(config);
    const existing = await ctx.db
      .query('rooms')
      .withIndex('by_slug', (q) => q.eq('slug', slug))
      .unique();
    if (!existing) return slug;
  }
  // Fallback to a longer one if collisions occur
  return uniqueNamesGenerator({
    ...config,
    dictionaries: [
      adjectives,
      animals,
      NumberDictionary.generate({ min: 100, max: 999 }),
    ],
  });
}

export const create = mutation({
  args: {
    slug: v.optional(v.string()),
    facilitatorId: v.string(),
    toolType: v.optional(v.union(v.literal('poker'), v.literal('standup'))),
  },
  handler: async (ctx, args) => {
    const slug = args.slug ?? (await generateUniqueSlug(ctx));

    const roomId = await ctx.db.insert('rooms', {
      slug,
      facilitatorId: args.facilitatorId,
      status: 'voting',
      toolType: args.toolType ?? 'poker',
      updatedAt: Date.now(),
    });
    return { roomId, slug };
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('rooms')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique();
  },
});

export const reveal = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');

    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can reveal votes');
    }

    await ctx.db.patch(args.roomId, {
      status: 'revealed',
      updatedAt: Date.now(),
    });
  },
});

export const reset = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');

    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can reset the round');
    }

    // 1. Reset room status
    await ctx.db.patch(args.roomId, {
      status: 'voting',
      updatedAt: Date.now(),
    });

    // 2. Clear all votes for this room
    const roomVotes = await ctx.db
      .query('votes')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    for (const vote of roomVotes) {
      await ctx.db.delete(vote._id);
    }

    // 3. Clear timer
    await ctx.db.patch(args.roomId, {
      timerStartedAt: undefined,
    });
  },
});

export const nextTopic = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');

    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can advance topics');
    }

    // 1. Mark current topic as completed
    if (room.currentTopicId) {
      await ctx.db.patch(room.currentTopicId, {
        status: 'completed',
      });
    }

    // 2. Find next pending topic
    const pendingTopics = await ctx.db
      .query('topics')
      .withIndex('by_status', (q) =>
        q.eq('roomId', args.roomId).eq('status', 'pending')
      )
      .collect();

    // Sort by order since by_status index doesn't include order
    const sortedPending = pendingTopics.sort((a, b) => a.order - b.order);
    const nextTopic = sortedPending[0];

    // 3. Update room and next topic
    if (nextTopic) {
      await ctx.db.patch(nextTopic._id, {
        status: 'active',
      });
      await ctx.db.patch(args.roomId, {
        currentTopicId: nextTopic._id,
        status: 'voting',
        timerStartedAt: undefined, // Clear timer for new round
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(args.roomId, {
        currentTopicId: undefined,
        status: 'voting',
        timerStartedAt: undefined,
        updatedAt: Date.now(),
      });
    }

    // 4. Clear all votes for the new round
    const roomVotes = await ctx.db
      .query('votes')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    for (const vote of roomVotes) {
      await ctx.db.delete(vote._id);
    }
  },
});

export const startTimer = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');

    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can start the timer');
    }

    await ctx.db.patch(args.roomId, {
      timerStartedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const resetTimer = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');

    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can reset the timer');
    }

    await ctx.db.patch(args.roomId, {
      timerStartedAt: undefined,
      updatedAt: Date.now(),
    });
  },
});

export const updateSettings = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
    autoReveal: v.optional(v.boolean()),
    scaleType: v.optional(v.union(v.literal('fibonacci'), v.literal('tshirt'))),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');

    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can update room settings');
    }

    await ctx.db.patch(args.roomId, {
      autoReveal: args.autoReveal ?? room.autoReveal,
      scaleType: args.scaleType ?? room.scaleType,
      updatedAt: Date.now(),
    });
  },
});
