import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const join = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('players')
      .withIndex('by_identity', (q) =>
        q.eq('roomId', args.roomId).eq('identityId', args.identityId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        isOnline: true,
        lastHeartbeat: Date.now(),
      });
      return existing._id;
    }

    const playerId = await ctx.db.insert('players', {
      roomId: args.roomId,
      identityId: args.identityId,
      name: args.name,
      isOnline: true,
      lastHeartbeat: Date.now(),
    });

    // Update room's updatedAt
    await ctx.db.patch(args.roomId, {
      updatedAt: Date.now(),
    });

    // Auto-assign facilitator if current is offline
    const room = await ctx.db.get(args.roomId);
    if (room) {
      const currentFacilitator = await ctx.db
        .query('players')
        .withIndex('by_identity', (q) =>
          q.eq('roomId', args.roomId).eq('identityId', room.facilitatorId)
        )
        .unique();

      if (!currentFacilitator || !currentFacilitator.isOnline) {
        await ctx.db.patch(args.roomId, {
          facilitatorId: args.identityId,
          updatedAt: Date.now(),
        });
      }
    }

    return playerId;
  },
});

export const heartbeat = mutation({
  args: { playerId: v.id('players') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.playerId, {
      lastHeartbeat: Date.now(),
      isOnline: true,
    });
  },
});

export const markOffline = mutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - 30000; // 30 seconds timeout
    const onlinePlayers = await ctx.db
      .query('players')
      .filter((q) => q.eq(q.field('isOnline'), true))
      .collect();

    for (const player of onlinePlayers) {
      if (player.lastHeartbeat < cutoff) {
        await ctx.db.patch(player._id, { isOnline: false });
      }
    }
  },
});

export const claimFacilitator = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');

    const currentFacilitator = await ctx.db
      .query('players')
      .withIndex('by_identity', (q) =>
        q.eq('roomId', args.roomId).eq('identityId', room.facilitatorId)
      )
      .unique();

    if (currentFacilitator?.isOnline) {
      throw new Error('Current facilitator is still online');
    }

    await ctx.db.patch(args.roomId, {
      facilitatorId: args.identityId,
      updatedAt: Date.now(),
    });
  },
});
