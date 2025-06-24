import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),
  
  challengeMaps: defineTable({
    challengeId: v.string(),
    name: v.string(),
    description: v.string(),
    difficulty: v.union(v.literal("Easy"), v.literal("Medium"), v.literal("Hard")),
    gridSize: v.array(v.number()),
    robots: v.optional(v.array(v.array(v.number()))),
    tasks: v.array(v.array(v.number())),
    obstacles: v.array(v.array(v.number())),
    maxRobots: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_difficulty", ["difficulty"])
    .index("by_challenge_id", ["challengeId"]),
}); 