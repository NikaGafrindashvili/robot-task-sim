import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all challenge maps
export const getAllChallengeMaps = query({
  handler: async (ctx) => {
    return await ctx.db.query("challengeMaps").collect();
  },
});

// Get challenge maps by difficulty
export const getChallengeMapsByDifficulty = query({
  args: { difficulty: v.union(v.literal("Easy"), v.literal("Medium"), v.literal("Hard")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("challengeMaps")
      .withIndex("by_difficulty", (q) => q.eq("difficulty", args.difficulty))
      .collect();
  },
});

// Get a single challenge map by challengeId
export const getChallengeMapById = query({
  args: { challengeId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("challengeMaps")
      .withIndex("by_challenge_id", (q) => q.eq("challengeId", args.challengeId))
      .first();
  },
});

// Create a new challenge map
export const createChallengeMap = mutation({
  args: {
    challengeId: v.string(),
    name: v.string(),
    description: v.string(),
    difficulty: v.union(v.literal("Easy"), v.literal("Medium"), v.literal("Hard")),
    gridSize: v.array(v.number()),
    robots: v.optional(v.array(v.array(v.number()))),
    tasks: v.array(v.array(v.number())),
    obstacles: v.array(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if challenge map with this ID already exists
    const existing = await ctx.db
      .query("challengeMaps")
      .withIndex("by_challenge_id", (q) => q.eq("challengeId", args.challengeId))
      .first();
    
    if (existing) {
      throw new Error(`Challenge map with ID "${args.challengeId}" already exists`);
    }

    return await ctx.db.insert("challengeMaps", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update an existing challenge map
export const updateChallengeMap = mutation({
  args: {
    _id: v.id("challengeMaps"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    difficulty: v.optional(v.union(v.literal("Easy"), v.literal("Medium"), v.literal("Hard"))),
    gridSize: v.optional(v.array(v.number())),
    robots: v.optional(v.optional(v.array(v.array(v.number())))),
    tasks: v.optional(v.array(v.array(v.number()))),
    obstacles: v.optional(v.array(v.array(v.number()))),
  },
  handler: async (ctx, args) => {
    const { _id, ...updates } = args;
    
    return await ctx.db.patch(_id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete a challenge map
export const deleteChallengeMap = mutation({
  args: { _id: v.id("challengeMaps") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args._id);
  },
});

// Bulk insert challenge maps (useful for seeding initial data)
export const bulkInsertChallengeMaps = mutation({
  args: {
    challengeMaps: v.array(v.object({
      challengeId: v.string(),
      name: v.string(),
      description: v.string(),
      difficulty: v.union(v.literal("Easy"), v.literal("Medium"), v.literal("Hard")),
      gridSize: v.array(v.number()),
      robots: v.optional(v.array(v.array(v.number()))),
      tasks: v.array(v.array(v.number())),
      obstacles: v.array(v.array(v.number())),
    }))
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const results = [];
    
    for (const challengeMap of args.challengeMaps) {
      // Check if challenge map already exists
      const existing = await ctx.db
        .query("challengeMaps")
        .withIndex("by_challenge_id", (q) => q.eq("challengeId", challengeMap.challengeId))
        .first();
      
      if (!existing) {
        const result = await ctx.db.insert("challengeMaps", {
          ...challengeMap,
          createdAt: now,
          updatedAt: now,
        });
        results.push(result);
      }
    }
    
    return results;
  },
});

// Update existing challenge maps to remove robots
export const clearRobotsFromAllChallengeMaps = mutation({
  handler: async (ctx) => {
    const allChallengeMaps = await ctx.db.query("challengeMaps").collect();
    
    for (const challengeMap of allChallengeMaps) {
      await ctx.db.patch(challengeMap._id, {
        robots: [],
        updatedAt: Date.now(),
      });
    }
    
    return { success: true, updatedCount: allChallengeMaps.length };
  },
});

// Force update challenge maps with new data (overwrites existing)
export const forceUpdateChallengeMaps = mutation({
  args: {
    challengeMaps: v.array(v.object({
      challengeId: v.string(),
      name: v.string(),
      description: v.string(),
      difficulty: v.union(v.literal("Easy"), v.literal("Medium"), v.literal("Hard")),
      gridSize: v.array(v.number()),
      robots: v.optional(v.array(v.array(v.number()))),
      tasks: v.array(v.array(v.number())),
      obstacles: v.array(v.array(v.number())),
    }))
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const results = [];
    
    for (const challengeMapData of args.challengeMaps) {
      // Find existing challenge map
      const existing = await ctx.db
        .query("challengeMaps")
        .withIndex("by_challenge_id", (q) => q.eq("challengeId", challengeMapData.challengeId))
        .first();
      
      if (existing) {
        // Update existing
        const result = await ctx.db.patch(existing._id, {
          name: challengeMapData.name,
          description: challengeMapData.description,
          difficulty: challengeMapData.difficulty,
          gridSize: challengeMapData.gridSize,
          robots: challengeMapData.robots || [],
          tasks: challengeMapData.tasks,
          obstacles: challengeMapData.obstacles,
          updatedAt: now,
        });
        results.push(result);
      } else {
        // Create new
        const result = await ctx.db.insert("challengeMaps", {
          ...challengeMapData,
          robots: challengeMapData.robots || [],
          createdAt: now,
          updatedAt: now,
        });
        results.push(result);
      }
    }
    
    return results;
  },
}); 