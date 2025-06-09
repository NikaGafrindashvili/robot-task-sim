import { useEffect, useRef } from 'react'
import { useSimulationStore } from '@/store/simulationStore'
import { assignTasksNearestFirst, getObstaclePositions } from '@/lib/assignmentStrategies'

export function useSimulationRunner() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const { 
    isRunning, 
    tickSpeed, 
    robots, 
    moveRobot 
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
    const { robots } = currentState


    robots.forEach(robot => {
      if (robot.path && robot.path.length > 0) {
        
        const nextPosition = robot.path[0]
        const remainingPath = robot.path.slice(1)
        
                moveRobot(robot.id, nextPosition, remainingPath)
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