import { useEffect, useRef } from 'react'
import { useSimulationStore } from '@/store/simulationStore'
import { assignTasksNearestFirst, assignTasksRoundRobin, getObstaclePositions } from '@/lib/assignmentStrategies'

export function useSimulationRunner() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const { 
    isRunning, 
    tickSpeed, 
    robots, 
    tasks,
    strategy,
    gridSize,
    lastAssignedRobotIndex,
    moveRobot,
    assignTaskToRobot,
    completeTask,
    setLastAssignedRobotIndex
  } = useSimulationStore()

  
  const getTickInterval = (speed: 1 | 2 | 5): number => {
    switch (speed) {
      case 1: return 1000 
      case 2: return 500  
      case 5: return 200  
      default: return 500
    }
  }

  
  const tick = () => {
    const currentState = useSimulationStore.getState()
    const { robots, tasks, strategy, gridSize, lastAssignedRobotIndex } = currentState

    // Step 1: Assign tasks to idle robots
    if (strategy === 'nearest') {
      // Filter idle robots and unassigned tasks
      const idleRobots = robots.filter(robot => !robot.targetTaskId)
      const unassignedTasks = tasks.filter(task => !task.assigned)
      
      // Only run assignment if there are idle robots and unassigned tasks
      if (idleRobots.length > 0 && unassignedTasks.length > 0) {
        const assignments = assignTasksNearestFirst(robots, tasks, gridSize)
        
        // Apply each assignment
        assignments.forEach(assignment => {
          assignTaskToRobot(assignment.robotId, assignment.taskId, assignment.path)
        })
      }
    } else if (strategy === 'round-robin') {
      // Filter idle robots and unassigned tasks
      const idleRobots = robots.filter(robot => !robot.targetTaskId)
      const unassignedTasks = tasks.filter(task => !task.assigned)
      
      // Only run assignment if there are idle robots and unassigned tasks
      if (idleRobots.length > 0 && unassignedTasks.length > 0) {
        const result = assignTasksRoundRobin(robots, tasks, gridSize, lastAssignedRobotIndex)
        
        // Apply each assignment
        result.assignments.forEach(assignment => {
          assignTaskToRobot(assignment.robotId, assignment.taskId, assignment.path)
        })
        
        // Update the last assigned robot index
        setLastAssignedRobotIndex(result.nextRobotIndex)
      }
    }

    // Step 2: Move robots that have paths
    const updatedState = useSimulationStore.getState()
    updatedState.robots.forEach(robot => {
      if (robot.path && robot.path.length > 0) {
        const nextPosition = robot.path[0]
        const remainingPath = robot.path.slice(1)
        moveRobot(robot.id, nextPosition, remainingPath)
        
        // Step 3: Check if robot reached its target (path is now empty)
        if (remainingPath.length === 0 && robot.targetTaskId) {
          completeTask(robot.id, robot.targetTaskId)
        }
      }
    })
  }

  
  useEffect(() => {
    if (isRunning) {
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      
      intervalRef.current = setInterval(tick, getTickInterval(tickSpeed))
    } else {
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, tickSpeed, moveRobot])

  useEffect(() => {
    if (isRunning && intervalRef.current) {

      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(tick, getTickInterval(tickSpeed))
    }
  }, [tickSpeed])

  return {
    isRunning,
    tickSpeed,
    robotsWithPaths: robots.filter(robot => robot.path && robot.path.length > 0),
    tick: () => {
      if (!isRunning) {
        tick()
      }
    }
  }
} 