import { useEffect, useRef } from 'react'
import { useSimulationStore } from '@/store/simulationStore'
import { assignTasksNearestFirst, getObstaclePositions } from '@/lib/assignmentStrategies'

export function useSimulationRunner() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const { 
    isRunning, 
    tickSpeed, 
    robots, 
    tasks,
    strategy,
    gridSize,
    moveRobot,
    assignTaskToRobot,
    completeTask
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
    const { robots, tasks, strategy, gridSize } = currentState

    // Step 1: Assign tasks to idle robots
    if (strategy === 'nearest') {
      // Prepare obstacles (all robots and tasks positions)
      const obstacles = getObstaclePositions(robots, tasks)
      
      // Filter idle robots and unassigned tasks
      const idleRobots = robots.filter(robot => !robot.targetTaskId)
      const unassignedTasks = tasks.filter(task => !task.assigned)
      
      console.log('Debug - Idle robots:', idleRobots.length, 'Unassigned tasks:', unassignedTasks.length)
      
      // Only run assignment if there are idle robots and unassigned tasks
      if (idleRobots.length > 0 && unassignedTasks.length > 0) {
        const assignments = assignTasksNearestFirst(robots, tasks, gridSize, obstacles)
        console.log('Debug - Assignments made:', assignments.length)
        
        // Apply each assignment
        assignments.forEach(assignment => {
          console.log('Debug - Assigning robot', assignment.robotId, 'to task', assignment.taskId, 'with path length', assignment.path.length)
          assignTaskToRobot(assignment.robotId, assignment.taskId, assignment.path)
        })
      }
    }

    // Step 2: Move robots that have paths
    const updatedState = useSimulationStore.getState()
    const robotsWithPaths = updatedState.robots.filter(robot => robot.path && robot.path.length > 0)
    console.log('Debug - Robots with paths:', robotsWithPaths.length)
    
    updatedState.robots.forEach(robot => {
      if (robot.path && robot.path.length > 0) {
        console.log('Debug - Moving robot', robot.id, 'from', robot.position, 'to', robot.path[0])
        const nextPosition = robot.path[0]
        const remainingPath = robot.path.slice(1)
        moveRobot(robot.id, nextPosition, remainingPath)
        
       
        if (remainingPath.length === 0 && robot.targetTaskId) {
          console.log('Debug - Robot', robot.id, 'completed task', robot.targetTaskId)
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