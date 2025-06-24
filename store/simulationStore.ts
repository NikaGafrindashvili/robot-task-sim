import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

// Types
export type Position = [number, number]

export type Task = {
  id: string
  position: Position
  assigned: boolean
}

export type Obstacle = {
  id: string
  position: Position
}

export type Robot = {
  id: string
  position: Position
  targetTaskId: string | null
  path: Position[] | null
}

export type Strategy = 'nearest' | 'round-robin'

export type PlacementMode = 'robot' | 'task' | 'obstacle'

export type ChallengeMap = {
  id: string
  name: string
  description: string
  gridSize: [number, number]
  robots?: Position[]
  tasks: Position[]
  obstacles: Position[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  maxRobots: number
}

interface SimulationState {
  gridSize: [number, number]
  robots: Robot[]
  tasks: Task[]
  obstacles: Obstacle[]
  tickSpeed: 1 | 2 | 5
  strategy: Strategy
  isRunning: boolean
  dynamicTaskSpawning: boolean
  lastAssignedRobotIndex: number
  placementMode: PlacementMode
  hasStarted: boolean
  maxRobots: number
  challengeModeEnabled: boolean
  simulationStartTime: number | null
  simulationEndTime: number | null
  score: number | null
  currentChallengeId: string | null

  // Actions
  setGridSize: (size: [number, number]) => void
  addRobot: (pos: Position) => void
  addTask: (pos: Position) => void
  addObstacle: (pos: Position) => void
  removeAtPosition: (pos: Position) => void
  clearGrid: () => void
  randomizeLayout: () => void
  loadChallengeMap: (challengeMap: ChallengeMap) => void
  setStrategy: (s: Strategy) => void
  setTickSpeed: (speed: 1 | 2 | 5) => void
  toggleDynamicTaskSpawning: () => void
  setPlacementMode: (mode: PlacementMode) => void
  startSimulation: () => void
  pauseSimulation: () => void
  resetSimulation: () => void
  moveRobot: (robotId: string, nextPosition: Position, remainingPath: Position[]) => void
  assignTaskToRobot: (robotId: string, taskId: string, path: Position[]) => void
  completeTask: (robotId: string, taskId: string) => void
  setLastAssignedRobotIndex: (index: number) => void
  setMaxRobots: (max: number) => void
  setChallengeModeEnabled: (enabled: boolean) => void
  getScore: () => number | null
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  gridSize: [10, 15],
  robots: [],
  tasks: [],
  obstacles: [],
  tickSpeed: 2,
  strategy: 'nearest',
  isRunning: false,
  dynamicTaskSpawning: false,
  lastAssignedRobotIndex: -1,
  placementMode: 'robot',
  hasStarted: false,
  maxRobots: 10,
  challengeModeEnabled: false,
  simulationStartTime: null,
  simulationEndTime: null,
  score: null,
  currentChallengeId: null,

  setGridSize: (size) => set({ gridSize: size }),

  addRobot: (position) => {
    const { robots, tasks, obstacles, maxRobots } = get()
    
    // Check robot limit
    if (robots.length >= maxRobots) {
      console.warn(`Cannot add more robots. Maximum allowed: ${maxRobots}`)
      return
    }
    
    const occupied = robots.some(r => isSame(r.position, position)) || 
                     tasks.some(t => isSame(t.position, position)) ||
                     obstacles.some(o => isSame(o.position, position))
    if (occupied) return

    const newRobot: Robot = {
      id: uuidv4(),
      position,
      targetTaskId: null,
      path: null,
    }
    set({ robots: [...robots, newRobot] })
  },

  addTask: (position) => {
    const { tasks, robots, obstacles } = get()
    if (tasks.length >= 20) return
    const occupied = tasks.some(t => isSame(t.position, position)) || 
                     robots.some(r => isSame(r.position, position)) ||
                     obstacles.some(o => isSame(o.position, position))
    if (occupied) return

    const newTask: Task = {
      id: uuidv4(),
      position,
      assigned: false,
    }
    set({ tasks: [...tasks, newTask] })
  },

  addObstacle: (position) => {
    const { obstacles, robots, tasks } = get()
    const occupied = obstacles.some(o => isSame(o.position, position)) ||
                     robots.some(r => isSame(r.position, position)) ||
                     tasks.some(t => isSame(t.position, position))
    if (occupied) return

    const newObstacle: Obstacle = {
      id: uuidv4(),
      position,
    }
    set({ obstacles: [...obstacles, newObstacle] })
  },

  removeAtPosition: (position) => {
    const { tasks, robots, obstacles, challengeModeEnabled } = get()
    const isObstacle = obstacles.some(o => isSame(o.position, position))
    set({
      tasks: tasks.filter(t => !isSame(t.position, position)),
      robots: robots.filter(r => !isSame(r.position, position)),
      obstacles: obstacles.filter(o => !isSame(o.position, position)),
      ...(isObstacle && challengeModeEnabled ? { challengeModeEnabled: false } : {}),
    })
  },

  clearGrid: () => set({ robots: [], tasks: [], obstacles: [], challengeModeEnabled: false, currentChallengeId: null }),

  randomizeLayout: () => {
    const [rows, cols] = get().gridSize
    const tasks: Task[] = []
    const robots: Robot[] = []
    const total = Math.min(20, Math.floor((rows * cols) / 20))

    const used = new Set<string>()
    while (tasks.length < total) {
      const pos: Position = [
        Math.floor(Math.random() * rows),
        Math.floor(Math.random() * cols),
      ]
      const key = pos.join(',')
      if (used.has(key)) continue
      used.add(key)
      tasks.push({ id: uuidv4(), position: pos, assigned: false })
    }

    while (robots.length < total) {
      const pos: Position = [
        Math.floor(Math.random() * rows),
        Math.floor(Math.random() * cols),
      ]
      const key = pos.join(',')
      if (used.has(key)) continue
      used.add(key)
      robots.push({
        id: uuidv4(),
        position: pos,
        targetTaskId: null,
        path: null,
      })
    }

    set({ tasks, robots })
  },

  loadChallengeMap: (challengeMap) => {
    set({
      isRunning: false,
      hasStarted: false,
      gridSize: challengeMap.gridSize,
      robots: [],
      tasks: [],
      obstacles: [],
      lastAssignedRobotIndex: -1,
      maxRobots: challengeMap.maxRobots,
      challengeModeEnabled: true,
      currentChallengeId: challengeMap.id,
    })

    // Create robots from positions (if provided)
    const robots: Robot[] = (challengeMap.robots || []).map(position => ({
      id: uuidv4(),
      position,
      targetTaskId: null,
      path: null,
    }))

    // Create tasks from positions
    const tasks: Task[] = challengeMap.tasks.map(position => ({
      id: uuidv4(),
      position,
      assigned: false,
    }))

    // Create obstacles from positions
    const obstacles: Obstacle[] = challengeMap.obstacles.map(position => ({
      id: uuidv4(),
      position,
    }))

    set({ robots, tasks, obstacles })
  },

  setStrategy: (strategy) => set({ strategy }),
  setTickSpeed: (speed) => set({ tickSpeed: speed }),
  toggleDynamicTaskSpawning: () => set({ dynamicTaskSpawning: !get().dynamicTaskSpawning }),

  startSimulation: () => {
    set({ isRunning: true, hasStarted: true, simulationStartTime: Date.now(), simulationEndTime: null, score: null })
  },
  pauseSimulation: () => {
    const { simulationStartTime, simulationEndTime, isRunning, maxRobots, robots } = get()
    if (isRunning && simulationStartTime && !simulationEndTime) {
      const end = Date.now()
      const duration = (end - simulationStartTime) / 1000
      const baseScore = Math.max(0, 1000 - Math.round(duration * 10))
      const bonus = (maxRobots - robots.length) * 100
      const score = baseScore + bonus
      set({ isRunning: false, simulationEndTime: end, score })
    } else {
      set({ isRunning: false })
    }
  },
  resetSimulation: () => {
    const { gridSize } = get()
    set({
      isRunning: false,
      tickSpeed: 2,
      strategy: 'nearest',
      robots: [],
      tasks: [],
      obstacles: [],
      dynamicTaskSpawning: false,
      gridSize,
      lastAssignedRobotIndex: -1,
      hasStarted: false,
      challengeModeEnabled: false,
      simulationStartTime: null,
      simulationEndTime: null,
      score: null,
      currentChallengeId: null,
    })
  },

  setLastAssignedRobotIndex: (index) => set({ lastAssignedRobotIndex: index }),

  moveRobot: (robotId, nextPosition, remainingPath) => {
    const { robots } = get()
    const updatedRobots = robots.map(robot => {
      if (robot.id === robotId) {
        return {
          ...robot,
          position: nextPosition,
          path: remainingPath.length > 0 ? remainingPath : null,
        }
      }
      return robot
    })
    set({ robots: updatedRobots })
  },
  assignTaskToRobot: (robotId, taskId, path) => {
    const { robots, tasks } = get()
    
    // Update robot with target task and path
    const updatedRobots = robots.map(robot => {
      if (robot.id === robotId) {
        return {
          ...robot,
          targetTaskId: taskId,
          path: path.length > 0 ? [...path] : null,
        }
      }
      return robot
    })
    
    // Mark task as assigned
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, assigned: true }
      }
      return task
    })
    
    set({ robots: updatedRobots, tasks: updatedTasks })
  },

  completeTask: (robotId, taskId) => {
    const { robots, tasks, simulationStartTime, isRunning, maxRobots } = get()
    
    // Remove the completed task
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    
    // Reset the robot (clear target and path)
    const updatedRobots = robots.map(robot => {
      if (robot.id === robotId) {
        return {
          ...robot,
          targetTaskId: null,
          path: null,
        }
      }
      return robot
    })
    
    // If all tasks are now complete, stop simulation and score
    if (updatedTasks.length === 0 && isRunning && simulationStartTime) {
      const end = Date.now()
      const duration = (end - simulationStartTime) / 1000
      const baseScore = Math.max(0, 1000 - Math.round(duration * 10))
      const bonus = (maxRobots - robots.length) * 100
      const score = baseScore + bonus
      set({ isRunning: false, simulationEndTime: end, score })
    }
    set({ robots: updatedRobots, tasks: updatedTasks })
  },

  setPlacementMode: (mode) => set({ placementMode: mode }),

  setMaxRobots: (max) => set({ maxRobots: max }),

  setChallengeModeEnabled: (enabled) => set({ challengeModeEnabled: enabled }),

  getScore: () => get().score,
}))

// Utility function
const isSame = (a: Position, b: Position) => a[0] === b[0] && a[1] === b[1]
