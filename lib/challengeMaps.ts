import { ChallengeMap } from '@/store/simulationStore'

export const challengeMaps: ChallengeMap[] = [
  {
    id: 'gates-of-olympus',
    name: 'Gates of Olympus',
    description: 'A simple maze with a few obstacles to navigate around. Perfect for learning the basics.',
    difficulty: 'Easy',
    gridSize: [10, 15],
    robots: [],
    tasks: [
      [0, 14],
      [9, 14],
      [5, 7],
      [2, 10],
    ],
    obstacles: [
      [2, 2], [2, 3], [2, 4],
      [7, 2], [7, 3], [7, 4],
      [4, 6], [5, 6], [6, 6],
      [4, 8], [5, 8], [6, 8],
    ],
  },
  {
    id: 'gates-of-hades',
    name: 'Gates of Hades',
    description: 'Navigate through a warehouse layout with multiple storage areas and loading docks.',
    difficulty: 'Medium',
    gridSize: [12, 18],
    robots: [],
    tasks: [
      [6, 4], [6, 13],
      [2, 8], [9, 8],
      [5, 2], [5, 15],
      [7, 6], [7, 11],
      [1, 5], [10, 12],
    ],
    obstacles: [
      // Left storage area
      [2, 2], [2, 3], [3, 2], [3, 3],
      [2, 6], [2, 7], [3, 6], [3, 7],
      // Right storage area
      [8, 2], [8, 3], [9, 2], [9, 3],
      [8, 6], [8, 7], [9, 6], [9, 7],
      // Center barriers
      [5, 9], [6, 9], [7, 9],
      [5, 10], [6, 10], [7, 10],
      // Loading dock barriers
      [1, 14], [1, 15], [2, 14], [2, 15],
      [9, 14], [9, 15], [10, 14], [10, 15],
    ],
  },
  {
    id: 'le-bandit',
    name: 'Le Bandit',
    description: 'A challenging factory layout with multiple production lines and complex pathfinding.',
    difficulty: 'Hard',
    gridSize: [15, 20],
    robots: [],
    tasks: [
      [2, 5], [2, 14], [12, 5], [12, 14],
      [4, 2], [4, 17], [10, 2], [10, 17],
      [6, 8], [6, 11], [8, 8], [8, 11],
      [1, 9], [13, 9], [7, 4], [7, 15],
    ],
    obstacles: [
      // Production line 1
      [3, 3], [3, 4], [3, 5], [3, 6], [3, 7],
      [4, 3], [5, 3], [6, 3], [7, 3], [8, 3],
      [11, 3], [11, 4], [11, 5], [11, 6], [11, 7],
      
      // Production line 2
      [3, 12], [3, 13], [3, 14], [3, 15], [3, 16],
      [4, 16], [5, 16], [6, 16], [7, 16], [8, 16],
      [11, 12], [11, 13], [11, 14], [11, 15], [11, 16],
      
      // Central machinery
      [6, 9], [7, 9], [8, 9],
      [6, 10], [7, 10], [8, 10],
      
      // Side barriers
      [1, 2], [1, 3], [1, 16], [1, 17],
      [13, 2], [13, 3], [13, 16], [13, 17],
      
      // Complex pathways
      [5, 5], [5, 6], [9, 5], [9, 6],
      [5, 13], [5, 14], [9, 13], [9, 14],
      [2, 8], [2, 11], [12, 8], [12, 11],
    ],
  },
] 