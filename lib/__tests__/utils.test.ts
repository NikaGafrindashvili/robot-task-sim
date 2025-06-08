import { calculateManhattanDistance, findPath } from '../utils'
import { Position } from '@/types'

describe('Pathfinding Utilities', () => {
  describe('calculateManhattanDistance', () => {
    it('should calculate distance for same position', () => {
      const pos1: Position = [0, 0]
      const pos2: Position = [0, 0]
      expect(calculateManhattanDistance(pos1, pos2)).toBe(0)
    })

    it('should calculate distance for horizontal movement', () => {
      const pos1: Position = [0, 0]
      const pos2: Position = [0, 3]
      expect(calculateManhattanDistance(pos1, pos2)).toBe(3)
    })

    it('should calculate distance for vertical movement', () => {
      const pos1: Position = [0, 0]
      const pos2: Position = [4, 0]
      expect(calculateManhattanDistance(pos1, pos2)).toBe(4)
    })

    it('should calculate distance for diagonal movement', () => {
      const pos1: Position = [0, 0]
      const pos2: Position = [3, 4]
      expect(calculateManhattanDistance(pos1, pos2)).toBe(7)
    })

    it('should calculate distance for negative coordinates', () => {
      const pos1: Position = [1, 1]
      const pos2: Position = [0, 0]
      expect(calculateManhattanDistance(pos1, pos2)).toBe(2)
    })

    it('should calculate distance symmetrically', () => {
      const pos1: Position = [2, 3]
      const pos2: Position = [5, 1]
      const distance1 = calculateManhattanDistance(pos1, pos2)
      const distance2 = calculateManhattanDistance(pos2, pos1)
      expect(distance1).toBe(distance2)
      expect(distance1).toBe(5) // |2-5| + |3-1| = 3 + 2 = 5
    })
  })

  describe('findPath', () => {
    const gridSize: Position = [5, 5] // 5x5 grid

    it('should return empty array for same start and end positions', () => {
      const start: Position = [2, 2]
      const end: Position = [2, 2]
      const path = findPath(start, end, gridSize)
      expect(path).toEqual([])
    })

    it('should find path for adjacent cells', () => {
      const start: Position = [2, 2]
      const end: Position = [2, 3]
      const path = findPath(start, end, gridSize)
      expect(path).toEqual([[2, 3]])
    })

    it('should find shortest path in straight line', () => {
      const start: Position = [0, 0]
      const end: Position = [0, 3]
      const path = findPath(start, end, gridSize)
      expect(path).toEqual([
        [0, 1],
        [0, 2],
        [0, 3]
      ])
    })

    it('should find path around single obstacle', () => {
      const start: Position = [0, 0]
      const end: Position = [0, 2]
      const obstacles: Position[] = [[0, 1]] // Block direct path
      const path = findPath(start, end, gridSize, obstacles)
      
      // Should find alternative path (there are multiple valid paths)
      expect(path.length).toBeGreaterThan(2) // Longer than direct path
      expect(path[path.length - 1]).toEqual([0, 2]) // Should end at target
    })

    it('should return empty array when no path exists', () => {
      const start: Position = [0, 0]
      const end: Position = [0, 2]
      const obstacles: Position[] = [
        [0, 1], [1, 1], [1, 0] // Surround the start position
      ]
      const path = findPath(start, end, gridSize, obstacles)
      expect(path).toEqual([])
    })

    it('should return empty array for out of bounds start position', () => {
      const start: Position = [-1, 0]
      const end: Position = [2, 2]
      const path = findPath(start, end, gridSize)
      expect(path).toEqual([])
    })

    it('should return empty array for out of bounds end position', () => {
      const start: Position = [0, 0]
      const end: Position = [5, 5] // Outside 5x5 grid
      const path = findPath(start, end, gridSize)
      expect(path).toEqual([])
    })

    it('should return empty array when start position is an obstacle', () => {
      const start: Position = [0, 0]
      const end: Position = [2, 2]
      const obstacles: Position[] = [[0, 0]]
      const path = findPath(start, end, gridSize, obstacles)
      expect(path).toEqual([])
    })

    it('should return empty array when end position is an obstacle', () => {
      const start: Position = [0, 0]
      const end: Position = [2, 2]
      const obstacles: Position[] = [[2, 2]]
      const path = findPath(start, end, gridSize, obstacles)
      expect(path).toEqual([])
    })

    it('should find path in complex maze', () => {
      const start: Position = [0, 0]
      const end: Position = [4, 4]
      const obstacles: Position[] = [
        // Create a wall pattern that forces a specific route
        [1, 0], [1, 1], [1, 2], [1, 3],
        [3, 1], [3, 2], [3, 3], [3, 4]
      ]
      const path = findPath(start, end, gridSize, obstacles)
      
      expect(path.length).toBeGreaterThan(0) // Should find a path
      expect(path[path.length - 1]).toEqual([4, 4]) // Should end at target
      
      // Verify path doesn't go through obstacles
      obstacles.forEach(obstacle => {
        expect(path).not.toContainEqual(obstacle)
      })
    })

    it('should find path with empty obstacles array', () => {
      const start: Position = [0, 0]
      const end: Position = [2, 2]
      const path = findPath(start, end, gridSize, [])
      
      expect(path.length).toBeGreaterThan(0)
      expect(path[path.length - 1]).toEqual([2, 2])
    })

    it('should find path when obstacles parameter is undefined', () => {
      const start: Position = [0, 0]
      const end: Position = [1, 1]
      const path = findPath(start, end, gridSize)
      
      expect(path.length).toBeGreaterThan(0)
      expect(path[path.length - 1]).toEqual([1, 1])
    })

    it('should find optimal path length', () => {
      const start: Position = [0, 0]
      const end: Position = [2, 3]
      const path = findPath(start, end, gridSize)
      
      // Manhattan distance is the minimum possible path length
      const minDistance = calculateManhattanDistance(start, end)
      expect(path.length).toBe(minDistance)
    })

    it('should work with different grid sizes', () => {
      const largeGrid: Position = [10, 10]
      const start: Position = [0, 0]
      const end: Position = [9, 9]
      const path = findPath(start, end, largeGrid)
      
      expect(path.length).toBe(18) // 9 + 9 = 18 steps
      expect(path[path.length - 1]).toEqual([9, 9])
    })
  })
}) 