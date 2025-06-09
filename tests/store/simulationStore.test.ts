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

  describe('assignTaskToRobot', () => {
    it('should assign task to robot with path', () => {
      const store = useSimulationStore.getState()
      
      // Add robot and task
      store.addRobot([0, 0])
      store.addTask([2, 2])
      
      const robot = useSimulationStore.getState().robots[0]
      const task = useSimulationStore.getState().tasks[0]
      const path: Position[] = [[0, 1], [1, 1], [2, 2]]
      
      // Assign task to robot
      store.assignTaskToRobot(robot.id, task.id, path)
      
      const updatedState = useSimulationStore.getState()
      const updatedRobot = updatedState.robots[0]
      const updatedTask = updatedState.tasks[0]
      
      // Robot should have target and path
      expect(updatedRobot.targetTaskId).toBe(task.id)
      expect(updatedRobot.path).toEqual(path)
      
      // Task should be marked as assigned
      expect(updatedTask.assigned).toBe(true)
    })

    it('should handle empty path assignment', () => {
      const store = useSimulationStore.getState()
      
      store.addRobot([0, 0])
      store.addTask([2, 2])
      
      const robot = useSimulationStore.getState().robots[0]
      const task = useSimulationStore.getState().tasks[0]
      
      // Assign with empty path
      store.assignTaskToRobot(robot.id, task.id, [])
      
      const updatedRobot = useSimulationStore.getState().robots[0]
      const updatedTask = useSimulationStore.getState().tasks[0]
      
      expect(updatedRobot.targetTaskId).toBe(task.id)
      expect(updatedRobot.path).toBeNull()
      expect(updatedTask.assigned).toBe(true)
    })

    it('should not affect other robots or tasks', () => {
      const store = useSimulationStore.getState()
      
      // Add multiple robots and tasks
      store.addRobot([0, 0])
      store.addRobot([5, 5])
      store.addTask([2, 2])
      store.addTask([7, 7])
      
      const state = useSimulationStore.getState()
      const robot1 = state.robots[0]
      const robot2 = state.robots[1]
      const task1 = state.tasks[0]
      const task2 = state.tasks[1]
      
      // Assign only first robot to first task
      store.assignTaskToRobot(robot1.id, task1.id, [[1, 1], [2, 2]])
      
      const updatedState = useSimulationStore.getState()
      const updatedRobot1 = updatedState.robots.find(r => r.id === robot1.id)
      const updatedRobot2 = updatedState.robots.find(r => r.id === robot2.id)
      const updatedTask1 = updatedState.tasks.find(t => t.id === task1.id)
      const updatedTask2 = updatedState.tasks.find(t => t.id === task2.id)
      
      // Robot1 and Task1 should be updated
      expect(updatedRobot1!.targetTaskId).toBe(task1.id)
      expect(updatedTask1!.assigned).toBe(true)
      
      // Robot2 and Task2 should be unchanged
      expect(updatedRobot2!.targetTaskId).toBeNull()
      expect(updatedTask2!.assigned).toBe(false)
    })

    it('should handle non-existent robot gracefully', () => {
      const store = useSimulationStore.getState()
      
      store.addTask([2, 2])
      const task = useSimulationStore.getState().tasks[0]
      const initialState = useSimulationStore.getState()
      
      // Try to assign to non-existent robot
      store.assignTaskToRobot('non-existent-robot', task.id, [[1, 1]])
      
      const finalState = useSimulationStore.getState()
      
      // Task should still be marked as assigned (this is the current behavior)
      expect(finalState.tasks[0].assigned).toBe(true)
      expect(finalState.robots).toEqual(initialState.robots)
    })

    it('should handle non-existent task gracefully', () => {
      const store = useSimulationStore.getState()
      
      store.addRobot([0, 0])
      const robot = useSimulationStore.getState().robots[0]
      const initialState = useSimulationStore.getState()
      
      // Try to assign non-existent task
      store.assignTaskToRobot(robot.id, 'non-existent-task', [[1, 1]])
      
      const finalState = useSimulationStore.getState()
      
      // Robot should still be updated (this is the current behavior)
      expect(finalState.robots[0].targetTaskId).toBe('non-existent-task')
      expect(finalState.tasks).toEqual(initialState.tasks)
    })
  })

  describe('completeTask', () => {
    it('should remove task and reset robot when task is completed', () => {
      const store = useSimulationStore.getState()
      
      // Add robot and task
      store.addRobot([0, 0])
      store.addTask([2, 2])
      
      const robot = useSimulationStore.getState().robots[0]
      const task = useSimulationStore.getState().tasks[0]
      
      // Assign task to robot first
      store.assignTaskToRobot(robot.id, task.id, [[1, 1], [2, 2]])
      
      // Verify assignment worked
      let state = useSimulationStore.getState()
      expect(state.robots[0].targetTaskId).toBe(task.id)
      expect(state.tasks[0].assigned).toBe(true)
      expect(state.tasks).toHaveLength(1)
      
      // Complete the task
      store.completeTask(robot.id, task.id)
      
      // Check final state
      state = useSimulationStore.getState()
      const updatedRobot = state.robots[0]
      
      // Robot should be reset
      expect(updatedRobot.targetTaskId).toBeNull()
      expect(updatedRobot.path).toBeNull()
      
      // Task should be removed
      expect(state.tasks).toHaveLength(0)
    })

    it('should not affect other robots or tasks', () => {
      const store = useSimulationStore.getState()
      
      // Add multiple robots and tasks
      store.addRobot([0, 0])
      store.addRobot([5, 5])
      store.addTask([2, 2])
      store.addTask([7, 7])
      
      const state = useSimulationStore.getState()
      const robot1 = state.robots[0]
      const robot2 = state.robots[1]
      const task1 = state.tasks[0]
      const task2 = state.tasks[1]
      
      // Assign both robots to their tasks
      store.assignTaskToRobot(robot1.id, task1.id, [[1, 1], [2, 2]])
      store.assignTaskToRobot(robot2.id, task2.id, [[6, 6], [7, 7]])
      
      // Complete only the first task
      store.completeTask(robot1.id, task1.id)
      
      const finalState = useSimulationStore.getState()
      const finalRobot1 = finalState.robots.find(r => r.id === robot1.id)
      const finalRobot2 = finalState.robots.find(r => r.id === robot2.id)
      
      // Robot1 should be reset
      expect(finalRobot1!.targetTaskId).toBeNull()
      expect(finalRobot1!.path).toBeNull()
      
      // Robot2 should be unchanged
      expect(finalRobot2!.targetTaskId).toBe(task2.id)
      expect(finalRobot2!.path).toEqual([[6, 6], [7, 7]])
      
      // Only task1 should be removed
      expect(finalState.tasks).toHaveLength(1)
      expect(finalState.tasks[0].id).toBe(task2.id)
    })

    it('should handle non-existent robot gracefully', () => {
      const store = useSimulationStore.getState()
      
      store.addTask([2, 2])
      const task = useSimulationStore.getState().tasks[0]
      const initialTaskCount = useSimulationStore.getState().tasks.length
      
      // Try to complete task with non-existent robot
      store.completeTask('non-existent-robot', task.id)
      
      const finalState = useSimulationStore.getState()
      
      // Task should still be removed (current behavior)
      expect(finalState.tasks).toHaveLength(initialTaskCount - 1)
    })

    it('should handle non-existent task gracefully', () => {
      const store = useSimulationStore.getState()
      
      store.addRobot([0, 0])
      const robot = useSimulationStore.getState().robots[0]
      
      // Assign robot to a task, then try to complete non-existent task
      store.assignTaskToRobot(robot.id, 'some-task-id', [[1, 1]])
      const initialState = useSimulationStore.getState()
      
      store.completeTask(robot.id, 'non-existent-task')
      
      const finalState = useSimulationStore.getState()
      
      // Robot should still be reset (current behavior)
      expect(finalState.robots[0].targetTaskId).toBeNull()
      expect(finalState.robots[0].path).toBeNull()
      
      // Tasks should be unchanged since the task didn't exist
      expect(finalState.tasks).toEqual(initialState.tasks)
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