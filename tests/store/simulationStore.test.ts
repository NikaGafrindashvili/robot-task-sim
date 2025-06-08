import { useSimulationStore } from '../../store/simulationStore'
import type { Position, Robot } from '../../store/simulationStore'

// Helper to get a fresh store instance for each test
const createTestStore = () => {
  // Reset store state before each test
  const store = useSimulationStore.getState()
  store.clearGrid()
  store.resetSimulation()
  return useSimulationStore
}

describe('SimulationStore', () => {
  beforeEach(() => {
    // Ensure clean state for each test
    const store = useSimulationStore.getState()
    store.clearGrid()
    store.resetSimulation()
  })

  describe('moveRobot', () => {
    it('should move robot to new position and update path', () => {
      const store = useSimulationStore.getState()
      
      // Add a robot first
      const initialPos: Position = [0, 0]
      store.addRobot(initialPos)
      
      // Get the robot that was added
      const robot = useSimulationStore.getState().robots[0]
      expect(robot.position).toEqual([0, 0])
      
      // Move the robot
      const newPosition: Position = [0, 1]
      const remainingPath: Position[] = [[0, 2], [0, 3]]
      store.moveRobot(robot.id, newPosition, remainingPath)
      
      // Check the robot was moved
      const updatedRobots = useSimulationStore.getState().robots
      const movedRobot = updatedRobots.find(r => r.id === robot.id)
      
      expect(movedRobot).toBeDefined()
      expect(movedRobot!.position).toEqual([0, 1])
      expect(movedRobot!.path).toEqual([[0, 2], [0, 3]])
    })

    it('should clear path when remainingPath is empty', () => {
      const store = useSimulationStore.getState()
      
      // Add a robot with an initial path
      store.addRobot([0, 0])
      const robot = useSimulationStore.getState().robots[0]
      
      // Give the robot a path first
      store.moveRobot(robot.id, [0, 1], [[0, 2], [0, 3]])
      expect(useSimulationStore.getState().robots[0].path).toEqual([[0, 2], [0, 3]])
      
      // Move robot and clear path
      const newPosition: Position = [0, 2]
      const emptyPath: Position[] = []
      store.moveRobot(robot.id, newPosition, emptyPath)
      
      const updatedRobot = useSimulationStore.getState().robots[0]
      expect(updatedRobot.position).toEqual([0, 2])
      expect(updatedRobot.path).toBeNull()
    })

    it('should not affect other robots when moving one robot', () => {
      const store = useSimulationStore.getState()
      
      // Add two robots
      store.addRobot([0, 0])
      store.addRobot([1, 1])
      
      const robots = useSimulationStore.getState().robots
      expect(robots).toHaveLength(2)
      
      const robot1 = robots[0]
      const robot2 = robots[1]
      
      // Move only the first robot
      store.moveRobot(robot1.id, [0, 1], [[0, 2]])
      
      const updatedRobots = useSimulationStore.getState().robots
      const updatedRobot1 = updatedRobots.find(r => r.id === robot1.id)
      const updatedRobot2 = updatedRobots.find(r => r.id === robot2.id)
      
      // First robot should be moved
      expect(updatedRobot1!.position).toEqual([0, 1])
      expect(updatedRobot1!.path).toEqual([[0, 2]])
      
      // Second robot should be unchanged
      expect(updatedRobot2!.position).toEqual([1, 1])
      expect(updatedRobot2!.path).toBeNull()
    })

    it('should handle moving non-existent robot gracefully', () => {
      const store = useSimulationStore.getState()
      
      // Add one robot
      store.addRobot([0, 0])
      const initialRobots = useSimulationStore.getState().robots
      
      // Try to move a robot that doesn't exist
      store.moveRobot('non-existent-id', [1, 1], [[2, 2]])
      
      // Robots should be unchanged
      const unchangedRobots = useSimulationStore.getState().robots
      expect(unchangedRobots).toEqual(initialRobots)
    })

    it('should preserve other robot properties when moving', () => {
      const store = useSimulationStore.getState()
      
      // Add a robot
      store.addRobot([0, 0])
      const robot = useSimulationStore.getState().robots[0]
      
      // Manually set some properties to test they're preserved
      const robotsWithTargetTask = useSimulationStore.getState().robots.map(r => ({
        ...r,
        targetTaskId: r.id === robot.id ? 'task-123' : r.targetTaskId
      }))
      
      useSimulationStore.setState({ robots: robotsWithTargetTask })
      
      // Move the robot
      store.moveRobot(robot.id, [1, 1], [[2, 2]])
      
      const movedRobot = useSimulationStore.getState().robots.find(r => r.id === robot.id)
      
      expect(movedRobot!.id).toBe(robot.id)
      expect(movedRobot!.targetTaskId).toBe('task-123')
      expect(movedRobot!.position).toEqual([1, 1])
      expect(movedRobot!.path).toEqual([[2, 2]])
    })
  })

  describe('basic store operations', () => {
    it('should add robots correctly', () => {
      const store = useSimulationStore.getState()
      
      store.addRobot([0, 0])
      store.addRobot([1, 1])
      
      const robots = useSimulationStore.getState().robots
      expect(robots).toHaveLength(2)
      expect(robots[0].position).toEqual([0, 0])
      expect(robots[1].position).toEqual([1, 1])
    })

    it('should not add robot to occupied position', () => {
      const store = useSimulationStore.getState()
      
      store.addRobot([0, 0])
      store.addRobot([0, 0]) // Try to add to same position
      
      const robots = useSimulationStore.getState().robots
      expect(robots).toHaveLength(1)
    })

    it('should clear grid correctly', () => {
      const store = useSimulationStore.getState()
      
      store.addRobot([0, 0])
      store.addTask([1, 1])
      
      expect(useSimulationStore.getState().robots).toHaveLength(1)
      expect(useSimulationStore.getState().tasks).toHaveLength(1)
      
      store.clearGrid()
      
      expect(useSimulationStore.getState().robots).toHaveLength(0)
      expect(useSimulationStore.getState().tasks).toHaveLength(0)
    })

    it('should handle simulation state changes', () => {
      const store = useSimulationStore.getState()
      
      expect(store.isRunning).toBe(false)
      
      store.startSimulation()
      expect(useSimulationStore.getState().isRunning).toBe(true)
      
      store.pauseSimulation()
      expect(useSimulationStore.getState().isRunning).toBe(false)
    })
  })
}) 