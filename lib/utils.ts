import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Position, Robot, Task } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if a cell is occupied by a robot or task
 * @param row Row position to check
 * @param col Column position to check
 * @param robots Array of robots
 * @param tasks Array of tasks
 * @returns true if the cell is occupied
 */
export function isCellOccupied(
  row: number, 
  col: number, 
  robots: Robot[], 
  tasks: Task[]
): boolean {
  // Check if any robot is at this position
  const robotAtPosition = robots.some(robot => {
    const [robotRow, robotCol] = robot.position
    return robotRow === row && robotCol === col
  })

  // Check if any task is at this position
  const taskAtPosition = tasks.some(task => {
    const [taskRow, taskCol] = task.position
    return taskRow === row && taskCol === col
  })

  return robotAtPosition || taskAtPosition
}

/**
 * Calculate Manhattan distance between two positions
 * @param pos1 First position [row, col]
 * @param pos2 Second position [row, col]
 * @returns Manhattan distance as a number
 */
export function calculateManhattanDistance(pos1: Position, pos2: Position): number {
  const [row1, col1] = pos1
  const [row2, col2] = pos2
  return Math.abs(row1 - row2) + Math.abs(col1 - col2)
}

/**
 * Check if a position is within grid bounds
 * @param position Position to check [row, col]
 * @param gridSize Grid dimensions [rows, cols]
 * @returns true if position is within bounds
 */
function isInBounds(position: Position, gridSize: Position): boolean {
  const [row, col] = position
  const [maxRows, maxCols] = gridSize
  return row >= 0 && row < maxRows && col >= 0 && col < maxCols
}

/**
 * Check if a position is occupied by an obstacle
 * @param position Position to check [row, col]
 * @param obstacles Array of obstacle positions
 * @returns true if position is occupied
 */
function isObstacle(position: Position, obstacles: Position[]): boolean {
  return obstacles.some(([obsRow, obsCol]) => 
    position[0] === obsRow && position[1] === obsCol
  )
}

/**
 * Find the shortest path between two positions using BFS algorithm
 * @param startPos Starting position [row, col]
 * @param endPos Target position [row, col]
 * @param gridSize Grid dimensions [rows, cols]
 * @param obstacles Array of obstacle positions to avoid
 * @returns Array of positions representing the path, or empty array if no path found
 */
export function findPath(
  startPos: Position, 
  endPos: Position, 
  gridSize: Position, 
  obstacles: Position[] = []
): Position[] {
  console.log(`findPath: start=[${startPos[0]},${startPos[1]}] end=[${endPos[0]},${endPos[1]}] gridSize=[${gridSize[0]},${gridSize[1]}] obstacles=${obstacles.length}`)
  
  if (startPos[0] === endPos[0] && startPos[1] === endPos[1]) {
    console.log('findPath: start and end are the same, returning empty path')
    return []
  }

  if (!isInBounds(startPos, gridSize) || !isInBounds(endPos, gridSize)) {
    console.log('findPath: start or end position out of bounds')
    return []
  }

  if (isObstacle(startPos, obstacles) || isObstacle(endPos, obstacles)) {
    console.log('findPath: start or end position is an obstacle')
    return []
  }

  
  const queue: Array<{ position: Position; path: Position[] }> = [
    { position: startPos, path: [] }
  ]
  const visited = new Set<string>()
  
  
  const directions: Position[] = [
    [-1, 0], [0, 1], [1, 0], [0, -1]
  ]

  while (queue.length > 0) {
    const current = queue.shift()!
    const { position, path } = current
    const [row, col] = position

    
    const posKey = `${row},${col}`
    
    
    if (visited.has(posKey)) {
      continue
    }
    
    visited.add(posKey)

    
    if (row === endPos[0] && col === endPos[1]) {
      return path
    }

   
    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow
      const newCol = col + dCol
      const newPos: Position = [newRow, newCol]
      const newPosKey = `${newRow},${newCol}`

            if (
        !isInBounds(newPos, gridSize) ||
        visited.has(newPosKey) ||
        isObstacle(newPos, obstacles)
      ) {
        continue
      }

      queue.push({
        position: newPos,
        path: [...path, newPos]
      })
    }
  }

  
  return []
}
