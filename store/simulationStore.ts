import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

// Types
export type Position = [number, number]

export type Task = {
  id: string
  position: Position
  assigned: boolean
}

export type Robot = {
  id: string
  position: Position
  targetTaskId: string | null
  path: Position[] | null
}

export type Strategy = 'nearest' | 'round-robin'

interface SimulationState {
  gridSize: [number, number]
  robots: Robot[]
  tasks: Task[]
  tickSpeed: 1 | 2 | 5
  strategy: Strategy
  isRunning: boolean
  dynamicTaskSpawning: boolean

  // Actions
  setGridSize: (size: [number, number]) => void
  addRobot: (pos: Position) => void
  addTask: (pos: Position) => void
  removeAtPosition: (pos: Position) => void
  clearGrid: () => void
  randomizeLayout: () => void
  setStrategy: (s: Strategy) => void
  setTickSpeed: (speed: 1 | 2 | 5) => void
  toggleDynamicTaskSpawning: () => void
  startSimulation: () => void
  pauseSimulation: () => void
  resetSimulation: () => void
  moveRobot: (robotId: string, nextPosition: Position, remainingPath: Position[]) => void
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  gridSize: [30, 75],
  robots: [],
  tasks: [],
  tickSpeed: 2,
  strategy: 'nearest',
  isRunning: false,
  dynamicTaskSpawning: false,

  setGridSize: (size) => set({ gridSize: size }),

  addRobot: (position) => {
    const { robots, tasks } = get()
    const occupied = robots.some(r => isSame(r.position, position)) || tasks.some(t => isSame(t.position, position))
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
    const { tasks, robots } = get()
    if (tasks.length >= 20) return
    const occupied = tasks.some(t => isSame(t.position, position)) || robots.some(r => isSame(r.position, position))
    if (occupied) return

    const newTask: Task = {
      id: uuidv4(),
      position,
      assigned: false,
    }
    set({ tasks: [...tasks, newTask] })
  },

  removeAtPosition: (position) => {
    const { tasks, robots } = get()
    set({
      tasks: tasks.filter(t => !isSame(t.position, position)),
      robots: robots.filter(r => !isSame(r.position, position)),
    })
  },

  clearGrid: () => set({ robots: [], tasks: [] }),

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

  setStrategy: (strategy) => set({ strategy }),
  setTickSpeed: (speed) => set({ tickSpeed: speed }),
  toggleDynamicTaskSpawning: () => set({ dynamicTaskSpawning: !get().dynamicTaskSpawning }),

  startSimulation: () => set({ isRunning: true }),
  pauseSimulation: () => set({ isRunning: false }),
  resetSimulation: () => {
    const { gridSize } = get()
    set({
      isRunning: false,
      tickSpeed: 2,
      strategy: 'nearest',
      robots: [],
      tasks: [],
      dynamicTaskSpawning: false,
      gridSize,
    })
  },

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
}))

// Utility function
const isSame = (a: Position, b: Position) => a[0] === b[0] && a[1] === b[1]
