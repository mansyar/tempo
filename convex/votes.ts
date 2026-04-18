import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const listByRoom = query({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) return [];

    const votes = await ctx.db
      .query('votes')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    // Server-side masking
    return votes.map((vote) => {
      const isOwnVote = vote.identityId === args.identityId;
      const isRevealed = room.status === 'revealed';

      if (isOwnVote || isRevealed) {
        return vote;
      }

      return {
        ...vote,
        value: vote.value === null ? null : 'voted', // Return placeholder if voted
      };
    });
  },
});

export const cast = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
    topicId: v.optional(v.id('topics')),
    value: v.union(v.string(), v.number(), v.null()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('votes')
      .withIndex('by_voter', (q) =>
        q
          .eq('roomId', args.roomId)
          .eq('identityId', args.identityId)
          .eq('topicId', args.topicId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
      });
      return existing._id;
    }

    const voteId = await ctx.db.insert('votes', {
      roomId: args.roomId,
      identityId: args.identityId,
      topicId: args.topicId,
      value: args.value,
    });

    return voteId;
  },
});
