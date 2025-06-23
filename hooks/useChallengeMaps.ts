import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { challengeMaps as staticChallengeMaps } from "@/lib/challengeMaps";
import { useEffect } from "react";

export function useChallengeMaps() {
  const challengeMaps = useQuery(api.challengeMaps.getAllChallengeMaps);
  const clearRobots = useMutation(api.challengeMaps.clearRobotsFromAllChallengeMaps);
  const bulkInsert = useMutation(api.challengeMaps.bulkInsertChallengeMaps);
  
  // Seed database and clear robots from existing maps
  useEffect(() => {
    if (challengeMaps !== undefined) {
      if (challengeMaps.length === 0) {
        // Database is empty, insert new challenge maps
        const dbChallengeMaps = staticChallengeMaps.map(map => ({
          challengeId: map.id,
          name: map.name,
          description: map.description,
          difficulty: map.difficulty,
          gridSize: map.gridSize,
          robots: map.robots,
          tasks: map.tasks,
          obstacles: map.obstacles,
        }));
        
        bulkInsert({ challengeMaps: dbChallengeMaps }).catch(console.error);
      } else {
        // Database has maps, clear robots from all existing maps
        clearRobots().catch(console.error);
      }
    }
  }, [challengeMaps, clearRobots, bulkInsert]);

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
  } : null;

  return {
    challengeMap: formattedChallengeMap,
    isLoading: challengeMap === undefined,
  };
} 