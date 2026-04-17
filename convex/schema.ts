import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rooms: defineTable({
    slug: v.string(),
    status: v.union(v.literal("voting"), v.literal("revealed")),
    facilitatorId: v.string(), // identityId of current facilitator
    currentTopicId: v.optional(v.id("topics")),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  players: defineTable({
    roomId: v.id("rooms"),
    identityId: v.string(), // Unique per browser (from localStorage)
    name: v.string(),
    isOnline: v.boolean(),
    lastHeartbeat: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_identity", ["roomId", "identityId"]),

  votes: defineTable({
    roomId: v.id("rooms"),
    topicId: v.optional(v.id("topics")),
    identityId: v.string(),
    value: v.union(v.string(), v.number(), v.null()),
  })
    .index("by_room", ["roomId"])
    .index("by_topic", ["topicId"])
    .index("by_voter", ["roomId", "identityId", "topicId"]),

  topics: defineTable({
    roomId: v.id("rooms"),
    title: v.string(),
    order: v.number(),
    status: v.union(v.literal("pending"), v.literal("active"), v.literal("completed")),
    finalEstimate: v.optional(v.string()),
  })
    .index("by_room", ["roomId"])
    .index("by_status", ["roomId", "status"]),

  reactions: defineTable({
    roomId: v.id("rooms"),
    identityId: v.string(),
    emoji: v.string(),
    createdAt: v.number(),
  }).index("by_room", ["roomId"]),
});
