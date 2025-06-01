export type Position = [number, number] 

export type Robot = {
  id: string
  position: Position
  targetTaskId?: string | null
  path?: Position[]
}

export type Task = {
  id: string
  position: Position
  assigned: boolean
}

export type Strategy = 'nearest' | 'round-robin'
export type PlacementMode = 'robot' | 'task'

export interface SimulationState {
  gridSize: [number, number]                
  robots: Robot[]
  tasks: Task[]
  tickSpeed: 1 | 2 | 5
  strategy: Strategy
  isRunning: boolean
  dynamicTaskSpawning: boolean
  placementMode: PlacementMode              
  lastAssignedRobotIndex: number            
}