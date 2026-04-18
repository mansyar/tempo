import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    slug: v.string(),
    facilitatorId: v.string(),
  },
  handler: async (ctx, args) => {
    const roomId = await ctx.db.insert('rooms', {
      slug: args.slug,
      facilitatorId: args.facilitatorId,
      status: 'voting',
      updatedAt: Date.now(),
    });
    return roomId;
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
  },
});
