import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    slug: v.string(),
    facilitatorId: v.string(),
  },
  handler: async (ctx, args) => {
    const roomId = await ctx.db.insert("rooms", {
      slug: args.slug,
      facilitatorId: args.facilitatorId,
      status: "voting",
      updatedAt: Date.now(),
    });
    return roomId;
  },
});
