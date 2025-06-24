import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function useChallengeMaps() {
  const challengeMaps = useQuery(api.challengeMaps.getAllChallengeMaps);
  const bulkInsert = useMutation(api.challengeMaps.bulkInsertChallengeMaps);
  const addMaxRobots = useMutation(api.challengeMaps.addMaxRobotsToExistingMaps);
  const clearAndReseed = useMutation(api.challengeMaps.clearAndReseedChallengeMaps);
  
  // Seed database and clear robots from existing maps
  useEffect(() => {
    if (challengeMaps !== undefined) {
      if (challengeMaps.length === 0) {
        // Database is empty, seed with challenge maps
        clearAndReseed().catch(console.error);
      } else {
        // Check if any challenge map is missing maxRobots field
        const needsMaxRobots = challengeMaps.some(map => map.maxRobots === undefined);
        if (needsMaxRobots) {
          // Clear and reseed with correct implementation
          clearAndReseed().catch(console.error);
        } else {
          // Only clear robots if any map actually has robots
          const hasRobots = challengeMaps.some(map => map.robots && map.robots.length > 0);
         
        }
      }
    }
  }, [challengeMaps, ,bulkInsert, addMaxRobots, clearAndReseed]);

  // Convert database format back to frontend format
  const formattedChallengeMaps = challengeMaps?.map(map => ({
    id: map.challengeId,
    name: map.name,
    description: map.description,
    difficulty: map.difficulty,
    gridSize: map.gridSize as [number, number],
    robots: (map.robots || []) as [number, number][],
    tasks: map.tasks as [number, number][],
    obstacles: map.obstacles as [number, number][],
    maxRobots: map.maxRobots || 5, // fallback to 5 if not set
  })) || [];

  return {
    challengeMaps: formattedChallengeMaps,
    isLoading: challengeMaps === undefined,
  };
}

export function useChallengeMap(challengeId: string) {
  const challengeMap = useQuery(api.challengeMaps.getChallengeMapById, { challengeId });
  
  const formattedChallengeMap = challengeMap ? {
    id: challengeMap.challengeId,
    name: challengeMap.name,
    description: challengeMap.description,
    difficulty: challengeMap.difficulty,
    gridSize: challengeMap.gridSize as [number, number],
    robots: (challengeMap.robots || []) as [number, number][],
    tasks: challengeMap.tasks as [number, number][],
    obstacles: challengeMap.obstacles as [number, number][],
    maxRobots: challengeMap.maxRobots || 5, // fallback to 5 if not set
  } : null;

  return {
    challengeMap: formattedChallengeMap,
    isLoading: challengeMap === undefined,
  };
}

export function useUserBestScore(userId: string | undefined, challengeId: string | undefined) {
  const bestScore = useQuery(
    api.challengeMaps.getUserBestScore,
    userId && challengeId ? { userId, challengeId } : 'skip'
  );
  return bestScore?.score ?? 0;
} 