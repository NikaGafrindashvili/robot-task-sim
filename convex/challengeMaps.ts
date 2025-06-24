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
    maxRobots: v.number(),
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
    maxRobots: v.optional(v.number()),
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
      maxRobots: v.number(),
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
      maxRobots: v.number(),
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
          maxRobots: challengeMapData.maxRobots,
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

// Add maxRobots field to existing challenge maps
export const addMaxRobotsToExistingMaps = mutation({
  handler: async (ctx) => {
    const allChallengeMaps = await ctx.db.query("challengeMaps").collect();
    const results = [];
    
    for (const challengeMap of allChallengeMaps) {
      // Skip if maxRobots already exists
      if (challengeMap.maxRobots !== undefined) {
        continue;
      }
      
      // Calculate maxRobots based on difficulty and grid size
      let maxRobots = 5; // default
      
      if (challengeMap.difficulty === "Easy") {
        maxRobots = Math.min(4, Math.floor((challengeMap.gridSize[0] * challengeMap.gridSize[1]) / 20));
      } else if (challengeMap.difficulty === "Medium") {
        maxRobots = Math.min(6, Math.floor((challengeMap.gridSize[0] * challengeMap.gridSize[1]) / 15));
      } else if (challengeMap.difficulty === "Hard") {
        maxRobots = Math.min(8, Math.floor((challengeMap.gridSize[0] * challengeMap.gridSize[1]) / 10));
      }
      
      // Ensure at least 2 robots
      maxRobots = Math.max(2, maxRobots);
      
      const result = await ctx.db.patch(challengeMap._id, {
        maxRobots,
        updatedAt: Date.now(),
      });
      results.push(result);
    }
    
    return { success: true, updatedCount: results.length };
  },
});

// Clear all challenge maps and reseed with correct implementation
export const clearAndReseedChallengeMaps = mutation({
  handler: async (ctx) => {
    // Delete all existing challenge maps
    const allChallengeMaps = await ctx.db.query("challengeMaps").collect();
    for (const challengeMap of allChallengeMaps) {
      await ctx.db.delete(challengeMap._id);
    }
    
    const now = Date.now();
    
    // Seed with proper challenge maps including maxRobots
    const challengeMaps = [
      {
        challengeId: "easy-basic",
        name: "Basic Training",
        description: "A simple introduction to robot navigation. Small grid with few obstacles to get familiar with the controls.",
        difficulty: "Easy" as const,
        gridSize: [8, 10],
        robots: [],
        tasks: [[2, 3], [5, 7], [6, 2]],
        obstacles: [[3, 4], [4, 5]],
        maxRobots: 3,
      },
      {
        challengeId: "easy-maze",
        name: "Simple Maze",
        description: "Navigate through a basic maze layout. Learn to work around obstacles efficiently.",
        difficulty: "Easy" as const,
        gridSize: [10, 12],
        robots: [],
        tasks: [[1, 1], [8, 10], [5, 6]],
        obstacles: [[2, 2], [2, 3], [3, 2], [4, 4], [4, 5], [5, 4], [6, 6], [6, 7], [7, 6]],
        maxRobots: 4,
      },
      {
        challengeId: "gates-of-olympus",
        name: "Gates of Olympus",
        description: "A simple maze with a few obstacles to navigate around. Perfect for learning the basics.",
        difficulty: "Easy" as const,
        gridSize: [10, 15],
        robots: [],
        tasks: [[0, 14], [9, 14], [5, 7], [2, 10]],
        obstacles: [[2, 2], [2, 3], [2, 4], [7, 2], [7, 3], [7, 4], [4, 6], [5, 6], [6, 6], [4, 8], [5, 8], [6, 8]],
        maxRobots: 4,
      },
      {
        challengeId: "medium-corridor",
        name: "Corridor Challenge",
        description: "Navigate through narrow corridors while managing multiple tasks. Requires careful path planning.",
        difficulty: "Medium" as const,
        gridSize: [12, 15],
        robots: [],
        tasks: [[1, 2], [3, 7], [5, 12], [8, 3], [10, 10]],
        obstacles: [
          [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11],
          [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [2, 10], [2, 11],
          [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10], [4, 11],
          [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9], [6, 10], [6, 11],
          [8, 4], [8, 5], [8, 6], [8, 7], [8, 8], [8, 9], [8, 10], [8, 11],
          [10, 4], [10, 5], [10, 6], [10, 7], [10, 8], [10, 9], [10, 10], [10, 11],
        ],
        maxRobots: 5,
      },
      {
        challengeId: "medium-islands",
        name: "Island Hopping",
        description: "Navigate between isolated areas connected by narrow paths. Tests coordination and timing.",
        difficulty: "Medium" as const,
        gridSize: [15, 15],
        robots: [],
        tasks: [[2, 2], [2, 12], [7, 7], [12, 2], [12, 12]],
        obstacles: [
          // Top left island
          [0, 0], [0, 1], [0, 2], [0, 3], [0, 4],
          [1, 0], [1, 1], [1, 2], [1, 3], [1, 4],
          [2, 0], [2, 1], [2, 3], [2, 4],
          [3, 0], [3, 1], [3, 2], [3, 3], [3, 4],
          [4, 0], [4, 1], [4, 2], [4, 3], [4, 4],
          // Top right island
          [0, 10], [0, 11], [0, 12], [0, 13], [0, 14],
          [1, 10], [1, 11], [1, 12], [1, 13], [1, 14],
          [2, 10], [2, 11], [2, 13], [2, 14],
          [3, 10], [3, 11], [3, 12], [3, 13], [3, 14],
          [4, 10], [4, 11], [4, 12], [4, 13], [4, 14],
          // Bottom left island
          [10, 0], [10, 1], [10, 2], [10, 3], [10, 4],
          [11, 0], [11, 1], [11, 2], [11, 3], [11, 4],
          [12, 0], [12, 1], [12, 3], [12, 4],
          [13, 0], [13, 1], [13, 2], [13, 3], [13, 4],
          [14, 0], [14, 1], [14, 2], [14, 3], [14, 4],
          // Bottom right island
          [10, 10], [10, 11], [10, 12], [10, 13], [10, 14],
          [11, 10], [11, 11], [11, 12], [11, 13], [11, 14],
          [12, 10], [12, 11], [12, 13], [12, 14],
          [13, 10], [13, 11], [13, 12], [13, 13], [13, 14],
          [14, 10], [14, 11], [14, 12], [14, 13], [14, 14],
          // Center obstacles
          [6, 6], [6, 7], [6, 8],
          [7, 6], [7, 8],
          [8, 6], [8, 7], [8, 8],
        ],
        maxRobots: 6,
      },
      {
        challengeId: "hard-labyrinth",
        name: "The Labyrinth",
        description: "A complex maze with multiple paths and dead ends. Requires advanced pathfinding and coordination.",
        difficulty: "Hard" as const,
        gridSize: [20, 20],
        robots: [],
        tasks: [[1, 1], [5, 15], [10, 5], [15, 15], [18, 1], [18, 18]],
        obstacles: [
          // Complex maze pattern
          [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11], [0, 12], [0, 13], [0, 14], [0, 15], [0, 16], [0, 17], [0, 18],
          [1, 2], [1, 4], [1, 6], [1, 8], [1, 10], [1, 12], [1, 14], [1, 16], [1, 18],
          [2, 0], [2, 1], [2, 2], [2, 4], [2, 6], [2, 8], [2, 10], [2, 12], [2, 14], [2, 16], [2, 18], [2, 19],
          [3, 0], [3, 2], [3, 4], [3, 6], [3, 8], [3, 10], [3, 12], [3, 14], [3, 16], [3, 18],
          [4, 0], [4, 1], [4, 2], [4, 4], [4, 6], [4, 8], [4, 10], [4, 12], [4, 14], [4, 16], [4, 18], [4, 19],
          [5, 0], [5, 2], [5, 4], [5, 6], [5, 8], [5, 10], [5, 12], [5, 14], [5, 16], [5, 18],
          [6, 0], [6, 1], [6, 2], [6, 4], [6, 6], [6, 8], [6, 10], [6, 12], [6, 14], [6, 16], [6, 18], [6, 19],
          [7, 0], [7, 2], [7, 4], [7, 6], [7, 8], [7, 10], [7, 12], [7, 14], [7, 16], [7, 18],
          [8, 0], [8, 1], [8, 2], [8, 4], [8, 6], [8, 8], [8, 10], [8, 12], [8, 14], [8, 16], [8, 18], [8, 19],
          [9, 0], [9, 2], [9, 4], [9, 6], [9, 8], [9, 10], [9, 12], [9, 14], [9, 16], [9, 18],
          [10, 0], [10, 1], [10, 2], [10, 4], [10, 6], [10, 8], [10, 10], [10, 12], [10, 14], [10, 16], [10, 18], [10, 19],
          [11, 0], [11, 2], [11, 4], [11, 6], [11, 8], [11, 10], [11, 12], [11, 14], [11, 16], [11, 18],
          [12, 0], [12, 1], [12, 2], [12, 4], [12, 6], [12, 8], [12, 10], [12, 12], [12, 14], [12, 16], [12, 18], [12, 19],
          [13, 0], [13, 2], [13, 4], [13, 6], [13, 8], [13, 10], [13, 12], [13, 14], [13, 16], [13, 18],
          [14, 0], [14, 1], [14, 2], [14, 4], [14, 6], [14, 8], [14, 10], [14, 12], [14, 14], [14, 16], [14, 18], [14, 19],
          [15, 0], [15, 2], [15, 4], [15, 6], [15, 8], [15, 10], [15, 12], [15, 14], [15, 16], [15, 18],
          [16, 0], [16, 1], [16, 2], [16, 4], [16, 6], [16, 8], [16, 10], [16, 12], [16, 14], [16, 16], [16, 18], [16, 19],
          [17, 0], [17, 2], [17, 4], [17, 6], [17, 8], [17, 10], [17, 12], [17, 14], [17, 16], [17, 18],
          [18, 0], [18, 1], [18, 2], [18, 4], [18, 6], [18, 8], [18, 10], [18, 12], [18, 14], [18, 16], [18, 18], [18, 19],
          [19, 2], [19, 3], [19, 4], [19, 5], [19, 6], [19, 7], [19, 8], [19, 9], [19, 10], [19, 11], [19, 12], [19, 13], [19, 14], [19, 15], [19, 16], [19, 17], [19, 18],
        ],
        maxRobots: 8,
      },
      {
        challengeId: "hard-tower",
        name: "Tower Defense",
        description: "Navigate around a central tower structure with multiple levels. Tests vertical and horizontal pathfinding.",
        difficulty: "Hard" as const,
        gridSize: [18, 18],
        robots: [],
        tasks: [[2, 2], [2, 15], [8, 8], [15, 2], [15, 15]],
        obstacles: [
          // Central tower
          [6, 6], [6, 7], [6, 8], [6, 9], [6, 10], [6, 11],
          [7, 6], [7, 7], [7, 8], [7, 9], [7, 10], [7, 11],
          [8, 6], [8, 7], [8, 8], [8, 9], [8, 10], [8, 11],
          [9, 6], [9, 7], [9, 8], [9, 9], [9, 10], [9, 11],
          [10, 6], [10, 7], [10, 8], [10, 9], [10, 10], [10, 11],
          [11, 6], [11, 7], [11, 8], [11, 9], [11, 10], [11, 11],
          // Outer walls
          [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10], [0, 11], [0, 12], [0, 13], [0, 14], [0, 15], [0, 16], [0, 17],
          [1, 0], [1, 17],
          [2, 0], [2, 17],
          [3, 0], [3, 17],
          [4, 0], [4, 17],
          [5, 0], [5, 17],
          [12, 0], [12, 17],
          [13, 0], [13, 17],
          [14, 0], [14, 17],
          [15, 0], [15, 17],
          [16, 0], [16, 17],
          [17, 0], [17, 1], [17, 2], [17, 3], [17, 4], [17, 5], [17, 6], [17, 7], [17, 8], [17, 9], [17, 10], [17, 11], [17, 12], [17, 13], [17, 14], [17, 15], [17, 16], [17, 17],
        ],
        maxRobots: 7,
      },
    ];

    const results = [];
    
    for (const challengeMap of challengeMaps) {
      const result = await ctx.db.insert("challengeMaps", {
        ...challengeMap,
        createdAt: now,
        updatedAt: now,
      });
      results.push(result);
    }
    
    return { success: true, deletedCount: allChallengeMaps.length, insertedCount: results.length };
  },
}); 