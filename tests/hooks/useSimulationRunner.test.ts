import { renderHook, act } from '@testing-library/react'
import { useSimulationRunner } from '../../hooks/useSimulationRunner'
import { useSimulationStore } from '../../store/simulationStore'

// Mock timers for testing intervals
jest.useFakeTimers()

describe('useSimulationRunner', () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useSimulationStore.getState()
    store.clearGrid()
    store.resetSimulation()
    
    // Clear all timers
    jest.clearAllTimers()
  })

  afterEach(() => {
    // Clean up timers after each test
    jest.clearAllTimers()
  })

  it('should not start interval when simulation is not running', () => {
    const { result } = renderHook(() => useSimulationRunner())
    
    expect(result.current.isRunning).toBe(false)
    
    // Fast-forward time and verify no ticks occurred
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    // No robots should have moved (since none exist)
    const robots = useSimulationStore.getState().robots
    expect(robots).toHaveLength(0)
  })

  it('should start interval when simulation is running', () => {
    const store = useSimulationStore.getState()
    
    // Add a robot with a path
    store.addRobot([0, 0])
    const currentState = useSimulationStore.getState()
    const robot = currentState.robots[0]
    store.moveRobot(robot.id, [0, 0], [[0, 1], [0, 2]]) // Give it a path
    
    const { result } = renderHook(() => useSimulationRunner())
    
    // Start simulation
    act(() => {
      store.startSimulation()
    })
    
    expect(result.current.isRunning).toBe(true)
    
    // Advance time by one tick (default speed is 2, so 500ms)
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Robot should have moved to next position in path
    const updatedRobots = useSimulationStore.getState().robots
    const updatedRobot = updatedRobots[0]
    expect(updatedRobot.position).toEqual([0, 1])
    expect(updatedRobot.path).toEqual([[0, 2]])
  })

  it('should handle different tick speeds correctly', () => {
    const store = useSimulationStore.getState()
    
    // Test fast speed (5 = 200ms intervals)
    store.setTickSpeed(5)
    store.startSimulation()
    
    const { result } = renderHook(() => useSimulationRunner())
    
    expect(result.current.tickSpeed).toBe(5)
    
    // Pause and change to slow speed
    act(() => {
      store.pauseSimulation()
      store.setTickSpeed(1)
      store.startSimulation()
    })
    
    expect(result.current.tickSpeed).toBe(1)
  })

  it('should stop interval when simulation is paused', () => {
    const store = useSimulationStore.getState()
    
    // Add robot with path
    store.addRobot([0, 0])
    const robot = useSimulationStore.getState().robots[0]
    store.moveRobot(robot.id, [0, 0], [[0, 1], [0, 2]])
    
    renderHook(() => useSimulationRunner())
    
    // Start simulation
    act(() => {
      store.startSimulation()
    })
    
    // Let it run for one tick
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Robot should have moved
    expect(useSimulationStore.getState().robots[0].position).toEqual([0, 1])
    
    // Pause simulation
    act(() => {
      store.pauseSimulation()
    })
    
    // Advance time further
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    // Robot should not have moved further
    expect(useSimulationStore.getState().robots[0].position).toEqual([0, 1])
  })

  it('should move multiple robots in the same tick', () => {
    const store = useSimulationStore.getState()
    
    // Add two robots with paths
    store.addRobot([0, 0])
    store.addRobot([1, 0])
    
    const robots = useSimulationStore.getState().robots
    const robot1 = robots[0]
    const robot2 = robots[1]
    
    // Give both robots paths
    store.moveRobot(robot1.id, [0, 0], [[0, 1], [0, 2]])
    store.moveRobot(robot2.id, [1, 0], [[1, 1], [1, 2]])
    
    renderHook(() => useSimulationRunner())
    
    // Start simulation
    act(() => {
      store.startSimulation()
    })
    
    // Advance one tick
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Both robots should have moved
    const updatedRobots = useSimulationStore.getState().robots
    const updatedRobot1 = updatedRobots.find(r => r.id === robot1.id)
    const updatedRobot2 = updatedRobots.find(r => r.id === robot2.id)
    
    expect(updatedRobot1!.position).toEqual([0, 1])
    expect(updatedRobot2!.position).toEqual([1, 1])
  })

  it('should not move robots without paths', () => {
    const store = useSimulationStore.getState()
    
    // Add robot without path
    store.addRobot([0, 0])
    const robot = useSimulationStore.getState().robots[0]
    const initialPosition = robot.position
    
    renderHook(() => useSimulationRunner())
    
    // Start simulation
    act(() => {
      store.startSimulation()
    })
    
    // Advance time
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Robot should not have moved
    const updatedRobot = useSimulationStore.getState().robots[0]
    expect(updatedRobot.position).toEqual(initialPosition)
  })

  it('should handle path completion correctly', () => {
    const store = useSimulationStore.getState()
    
    // Add robot with single-step path
    store.addRobot([0, 0])
    const robot = useSimulationStore.getState().robots[0]
    store.moveRobot(robot.id, [0, 0], [[0, 1]]) // Only one step in path
    
    renderHook(() => useSimulationRunner())
    
    // Start simulation
    act(() => {
      store.startSimulation()
    })
    
    // Advance one tick
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Robot should have moved and path should be cleared
    const updatedRobot = useSimulationStore.getState().robots[0]
    expect(updatedRobot.position).toEqual([0, 1])
    expect(updatedRobot.path).toBeNull()
    
    // Advance another tick
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Robot should stay in same position (no more path)
    const finalRobot = useSimulationStore.getState().robots[0]
    expect(finalRobot.position).toEqual([0, 1])
  })

  it('should provide correct robotsWithPaths count', () => {
    const store = useSimulationStore.getState()
    
    // Add robots - some with paths, some without
    store.addRobot([0, 0])
    store.addRobot([1, 0])
    store.addRobot([2, 0])
    
    const robots = useSimulationStore.getState().robots
    
    // Give path to only first two robots
    store.moveRobot(robots[0].id, [0, 0], [[0, 1]])
    store.moveRobot(robots[1].id, [1, 0], [[1, 1], [1, 2]])
    // Third robot has no path
    
    const { result } = renderHook(() => useSimulationRunner())
    
    expect(result.current.robotsWithPaths).toHaveLength(2)
  })

  it('should allow manual tick when not running', () => {
    const store = useSimulationStore.getState()
    
    // Add robot with path
    store.addRobot([0, 0])
    const robot = useSimulationStore.getState().robots[0]
    store.moveRobot(robot.id, [0, 0], [[0, 1]])
    
    const { result } = renderHook(() => useSimulationRunner())
    
    expect(result.current.isRunning).toBe(false)
    
    // Manual tick should work
    act(() => {
      result.current.tick()
    })
    
    // Robot should have moved
    const updatedRobot = useSimulationStore.getState().robots[0]
    expect(updatedRobot.position).toEqual([0, 1])
  })

  it('should auto-stop simulation when all tasks completed and dynamic spawning disabled', () => {
    const store = useSimulationStore.getState()
    
    // Ensure dynamic task spawning is disabled
    if (store.dynamicTaskSpawning) {
      store.toggleDynamicTaskSpawning()
    }
    
    // Add robot and task
    store.addRobot([0, 0])
    store.addTask([0, 2])
    
    const robot = useSimulationStore.getState().robots[0]
    const task = useSimulationStore.getState().tasks[0]
    
    // Assign task to robot with a path that reaches the target
    store.assignTaskToRobot(robot.id, task.id, [[0, 1], [0, 2]])
    
    renderHook(() => useSimulationRunner())
    
    // Start simulation
    act(() => {
      store.startSimulation()
    })
    
    expect(useSimulationStore.getState().isRunning).toBe(true)
    
    // Let robot move to complete its path (2 ticks to reach target)
    act(() => {
      jest.advanceTimersByTime(500) // Move to [0, 1]
    })
    
    act(() => {
      jest.advanceTimersByTime(500) // Move to [0, 2] and complete task
    })
    
    // Simulation should have auto-stopped since all tasks are complete
    const finalState = useSimulationStore.getState()
    expect(finalState.isRunning).toBe(false)
    expect(finalState.tasks).toHaveLength(0) // Task should be removed
  })

  it('should NOT auto-stop simulation when dynamic spawning is enabled', () => {
    const store = useSimulationStore.getState()
    
    // Ensure dynamic task spawning is enabled
    if (!store.dynamicTaskSpawning) {
      store.toggleDynamicTaskSpawning()
    }
    
    // Mock Math.random to prevent spawning during test
    const originalRandom = Math.random
    Math.random = jest.fn(() => 0.5) // Return value > 0.1 to prevent spawning
    
    // Add robot and task
    store.addRobot([0, 0])
    store.addTask([0, 2])
    
    const robot = useSimulationStore.getState().robots[0]
    const task = useSimulationStore.getState().tasks[0]
    
    // Assign task to robot with a path that reaches the target
    store.assignTaskToRobot(robot.id, task.id, [[0, 1], [0, 2]])
    
    renderHook(() => useSimulationRunner())
    
    // Start simulation
    act(() => {
      store.startSimulation()
    })
    
    expect(useSimulationStore.getState().isRunning).toBe(true)
    
    // Let robot move to complete its path
    act(() => {
      jest.advanceTimersByTime(500) // Move to [0, 1]
    })
    
    act(() => {
      jest.advanceTimersByTime(500) // Move to [0, 2] and complete task
    })
    
    // Simulation should still be running since dynamic spawning is enabled
    const finalState = useSimulationStore.getState()
    expect(finalState.isRunning).toBe(true)
    expect(finalState.tasks).toHaveLength(0) // Task should be removed but sim continues
    
    // Restore original Math.random
    Math.random = originalRandom
  })

  it('should spawn tasks dynamically when enabled', () => {
    const store = useSimulationStore.getState()
    
    // Ensure dynamic task spawning is enabled
    if (!store.dynamicTaskSpawning) {
      store.toggleDynamicTaskSpawning()
    }
    
    // Start with smaller grid for more predictable spawning
    store.setGridSize([5, 5])
    
    // Clear any existing tasks
    store.clearGrid()
    
    renderHook(() => useSimulationRunner())
    
    // Start simulation
    act(() => {
      store.startSimulation()
    })
    
    const initialTaskCount = useSimulationStore.getState().tasks.length
    expect(initialTaskCount).toBe(0)
    
    // Mock Math.random to ensure spawning happens (10% chance)
    const originalRandom = Math.random
    let randomCallCount = 0
    Math.random = jest.fn(() => {
      randomCallCount++
      // Return 0.05 (less than 0.1) on first call to trigger spawning
      if (randomCallCount === 1) return 0.05
      // Return values for random position generation
      if (randomCallCount === 2) return 0.2 // row = 1 (0.2 * 5 = 1)
      if (randomCallCount === 3) return 0.4 // col = 2 (0.4 * 5 = 2)
      return 0.5
    })
    
    // Advance time by one tick
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Should have spawned a task
    const finalState = useSimulationStore.getState()
    expect(finalState.tasks.length).toBeGreaterThan(initialTaskCount)
    
    // Restore original Math.random
    Math.random = originalRandom
  })

  it('should not spawn tasks when dynamic spawning is disabled', () => {
    const store = useSimulationStore.getState()
    
    // Ensure dynamic task spawning is disabled
    if (store.dynamicTaskSpawning) {
      store.toggleDynamicTaskSpawning()
    }
    
    // Start with smaller grid
    store.setGridSize([5, 5])
    store.clearGrid()
    
    renderHook(() => useSimulationRunner())
    
    // Start simulation
    act(() => {
      store.startSimulation()
    })
    
    const initialTaskCount = useSimulationStore.getState().tasks.length
    expect(initialTaskCount).toBe(0)
    
    // Mock Math.random to return 0.05 (would trigger spawning if enabled)
    const originalRandom = Math.random
    Math.random = jest.fn(() => 0.05)
    
    // Advance time by one tick
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Should not have spawned any tasks
    const finalState = useSimulationStore.getState()
    expect(finalState.tasks.length).toBe(initialTaskCount)
    
    // Restore original Math.random
    Math.random = originalRandom
  })

  it('should not spawn tasks when already at maximum (20 tasks)', () => {
    const store = useSimulationStore.getState()
    
    // Ensure dynamic task spawning is enabled
    if (!store.dynamicTaskSpawning) {
      store.toggleDynamicTaskSpawning()
    }
    
    // Set larger grid to accommodate 20 tasks
    store.setGridSize([10, 10])
    store.clearGrid()
    
    // Add 20 tasks manually to reach the limit
    for (let i = 0; i < 20; i++) {
      const row = Math.floor(i / 10)
      const col = i % 10
      store.addTask([row, col])
    }
    
    expect(useSimulationStore.getState().tasks.length).toBe(20)
    
    renderHook(() => useSimulationRunner())
    
    // Start simulation
    act(() => {
      store.startSimulation()
    })
    
    // Mock Math.random to return 0.05 (would trigger spawning if under limit)
    const originalRandom = Math.random
    Math.random = jest.fn(() => 0.05)
    
    // Advance time by one tick
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    // Should still have exactly 20 tasks (no new spawning)
    const finalState = useSimulationStore.getState()
    expect(finalState.tasks.length).toBe(20)
    
    // Restore original Math.random
    Math.random = originalRandom
  })
}) 