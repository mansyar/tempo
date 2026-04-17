import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const join = mutation({
  args: {
    roomId: v.id("rooms"),
    identityId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("players")
      .withIndex("by_identity", (q) =>
        q.eq("roomId", args.roomId).eq("identityId", args.identityId)
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

    const playerId = await ctx.db.insert("players", {
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

    return playerId;
  },
});
