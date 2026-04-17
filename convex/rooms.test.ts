import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";
import * as rooms from "./rooms";
import * as players from "./players";
import * as apiModule from "./_generated/api";
import * as serverModule from "./_generated/server";

test("rooms.create and players.join", async () => {
  const t = convexTest(schema, { 
    "rooms": () => rooms, 
    "players": () => players,
    "_generated/api": () => apiModule,
    "_generated/server": () => serverModule
  });

  // 1. Create a room
  const slug = "test-room";
  const facilitatorId = "facilitator-1";
  const roomId = await t.mutation(api.rooms.create, { slug, facilitatorId });
  
  const room = await t.run(async (ctx) => {
    return await ctx.db.get(roomId);
  });
  expect(room?.slug).toBe(slug);
  expect(room?.facilitatorId).toBe(facilitatorId);
  expect(room?.status).toBe("voting");

  // 2. Join as a player
  const playerIdentityId = "player-1";
  const playerName = "Alice";
  await t.mutation(api.players.join, { roomId, identityId: playerIdentityId, name: playerName });

  const player = await t.run(async (ctx) => {
    return await ctx.db
      .query("players")
      .withIndex("by_identity", (q) => q.eq("roomId", roomId).eq("identityId", playerIdentityId))
      .unique();
  });
  expect(player?.name).toBe(playerName);
  expect(player?.isOnline).toBe(true);
});
