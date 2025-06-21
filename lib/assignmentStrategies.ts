import { Position, Robot, Task, Obstacle } from '@/store/simulationStore'
import { calculateManhattanDistance, findPath } from './utils'

/**
 * Represents a task assignment for a robot
 */
export interface TaskAssignment {
  robotId: string
  taskId: string
  path: Position[]
}

/**
 * Assigns tasks to robots using the nearest-first strategy
 * Each robot gets assigned to the closest unassigned task
 * 
 * @param robots Array of robots
 * @param tasks Array of tasks
 * @param gridSize Grid dimensions [rows, cols]
 * @param obstacles Array of obstacle positions (other robots/tasks)
 * @returns Array of task assignments
 */
export function assignTasksNearestFirst(
  robots: Robot[],
  tasks: Task[],
  gridSize: Position,
  obstacles: Obstacle[] = []
): TaskAssignment[] {
  const assignments: TaskAssignment[] = []
  
  // Filter idle robots (no target task) and unassigned tasks
  const idleRobots = robots.filter(robot => !robot.targetTaskId)
  const unassignedTasks = tasks.filter(task => !task.assigned)
  
  // If no idle robots or no unassigned tasks, return empty assignments
  if (idleRobots.length === 0 || unassignedTasks.length === 0) {
    return assignments
  }
  
  // Create a copy of unassigned tasks to track assignments in this function
  const availableTasks = [...unassignedTasks]
  
  // For each idle robot, find the nearest available task
  for (const robot of idleRobots) {
    if (availableTasks.length === 0) break
    
    let nearestTask: Task | null = null
    let shortestDistance = Infinity
    let bestPath: Position[] = []
    
    // Find the nearest task with a valid path
    for (const task of availableTasks) {
      const distance = calculateManhattanDistance(robot.position, task.position)
      
      // Only consider this task if it's closer than current best
      if (distance < shortestDistance) {
        // Calculate path to this task (exclude this robot and task from obstacles)
        const pathObstacles = getObstaclePositions(robots, tasks, obstacles, robot.id, task.id)
        const path = findPath(robot.position, task.position, gridSize, pathObstacles)
        
        // If a valid path exists, this could be our best option
        if (path.length > 0) {
          nearestTask = task
          shortestDistance = distance
          bestPath = path
        }
      }
    }
    
    // If we found a valid assignment, add it and remove task from available list
    if (nearestTask && bestPath.length > 0) {
      assignments.push({
        robotId: robot.id,
        taskId: nearestTask.id,
        path: bestPath
      })
      
      // Remove assigned task from available tasks
      const taskIndex = availableTasks.findIndex(t => t.id === nearestTask!.id)
      if (taskIndex !== -1) {
        availableTasks.splice(taskIndex, 1)
      }
    }
  }
  
  return assignments
}

/**
 * Get obstacle positions for pathfinding
 * Includes all robot and task positions except the ones involved in pathfinding
 * 
 * @param robots Array of all robots
 * @param tasks Array of all tasks
 * @param obstacles Array of obstacle positions
 * @param excludeRobotId Optional robot ID to exclude from obstacles
 * @param excludeTaskId Optional task ID to exclude from obstacles
 * @returns Array of obstacle positions
 */
export function getObstaclePositions(
  robots: Robot[],
  tasks: Task[],
  obstacles: Obstacle[],
  excludeRobotId?: string,
  excludeTaskId?: string
): Position[] {
  const obstaclePositions: Position[] = []
  
  // Add robot positions as obstacles (except the moving robot)
  robots.forEach(robot => {
    if (robot.id !== excludeRobotId) {
      obstaclePositions.push(robot.position)
    }
  })
  
  // Add task positions as obstacles (except the target task)
  tasks.forEach(task => {
    if (task.id !== excludeTaskId) {
      obstaclePositions.push(task.position)
    }
  })
  
  // Add obstacle positions
  obstacles.forEach(obstacle => {
    obstaclePositions.push(obstacle.position)
  })
  
  return obstaclePositions
}

/**
 * Assigns tasks to robots using the round-robin strategy
 * Cycles through robots in order, assigning the nearest task to each robot in turn
 * 
 * @param robots Array of robots
 * @param tasks Array of tasks
 * @param gridSize Grid dimensions [rows, cols]
 * @param lastAssignedRobotIndex Index of the last robot that was assigned a task
 * @param obstacles Array of obstacle positions
 * @returns Object containing assignments array and updated lastAssignedRobotIndex
 */
export function assignTasksRoundRobin(
  robots: Robot[],
  tasks: Task[],
  gridSize: Position,
  lastAssignedRobotIndex: number,
  obstacles: Obstacle[] = []
): { assignments: TaskAssignment[], nextRobotIndex: number } {
  const assignments: TaskAssignment[] = []
  
  // Filter idle robots and unassigned tasks
  const idleRobots = robots.filter(robot => !robot.targetTaskId)
  const unassignedTasks = tasks.filter(task => !task.assigned)
  
  // If no idle robots or no unassigned tasks, return empty assignments
  if (idleRobots.length === 0 || unassignedTasks.length === 0) {
    return { assignments, nextRobotIndex: lastAssignedRobotIndex }
  }
  
  // Create a copy of unassigned tasks to track assignments in this function
  const availableTasks = [...unassignedTasks]
  
  // Find the starting robot index for round-robin assignment
  let currentRobotIndex = (lastAssignedRobotIndex + 1) % idleRobots.length
  let assignmentsThisRound = 0
  
  // Continue assigning until no more tasks or we've cycled through all robots
  while (availableTasks.length > 0 && assignmentsThisRound < idleRobots.length) {
    const robot = idleRobots[currentRobotIndex]
    
    // Find the nearest task to this robot
    let nearestTask: Task | null = null
    let shortestDistance = Infinity
    let bestPath: Position[] = []
    
    for (const task of availableTasks) {
      const distance = calculateManhattanDistance(robot.position, task.position)
      
      // Only consider this task if it's closer than current best
      if (distance < shortestDistance) {
        // Calculate path to this task (exclude this robot and task from obstacles)
        const pathObstacles = getObstaclePositions(robots, tasks, obstacles, robot.id, task.id)
        const path = findPath(robot.position, task.position, gridSize, pathObstacles)
        
        // If a valid path exists, this could be our best option
        if (path.length > 0) {
          nearestTask = task
          shortestDistance = distance
          bestPath = path
        }
      }
    }
    
    // If we found a valid assignment, add it and remove task from available list
    if (nearestTask && bestPath.length > 0) {
      assignments.push({
        robotId: robot.id,
        taskId: nearestTask.id,
        path: bestPath
      })
      
      // Remove assigned task from available tasks
      const taskIndex = availableTasks.findIndex(t => t.id === nearestTask!.id)
      if (taskIndex !== -1) {
        availableTasks.splice(taskIndex, 1)
      }
      
      // Update the last assigned robot index
      lastAssignedRobotIndex = currentRobotIndex
    }
    
    // Move to next robot in round-robin fashion
    currentRobotIndex = (currentRobotIndex + 1) % idleRobots.length
    assignmentsThisRound++
  }
  
  return { assignments, nextRobotIndex: lastAssignedRobotIndex }
} 