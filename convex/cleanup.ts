import { internalMutation } from './_generated/server';

export const staleRooms = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

    const staleRooms = await ctx.db
      .query('rooms')
      .withIndex('by_updated', (q) => q.lt('updatedAt', twentyFourHoursAgo))
      .collect();

    for (const room of staleRooms) {
      // 1. Delete players
      const players = await ctx.db
        .query('players')
        .withIndex('by_room', (q) => q.eq('roomId', room._id))
        .collect();
      for (const player of players) {
        await ctx.db.delete(player._id);
      }

      // 2. Delete topics
      const topics = await ctx.db
        .query('topics')
        .withIndex('by_room', (q) => q.eq('roomId', room._id))
        .collect();
      for (const topic of topics) {
        await ctx.db.delete(topic._id);
      }

      // 3. Delete votes
      const votes = await ctx.db
        .query('votes')
        .withIndex('by_room', (q) => q.eq('roomId', room._id))
        .collect();
      for (const vote of votes) {
        await ctx.db.delete(vote._id);
      }

      // 4. Delete reactions
      const reactions = await ctx.db
        .query('reactions')
        .withIndex('by_room', (q) => q.eq('roomId', room._id))
        .collect();
      for (const reaction of reactions) {
        await ctx.db.delete(reaction._id);
      }

      // 5. Finally delete the room
      await ctx.db.delete(room._id);
    }
  },
});
