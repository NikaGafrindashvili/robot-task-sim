import { assignTasksNearestFirst, assignTasksRoundRobin, getObstaclePositions } from '../../lib/assignmentStrategies'
import { Position, Robot, Task } from '../../store/simulationStore'

describe('Assignment Strategies', () => {
  const gridSize: Position = [10, 10]

  describe('assignTasksNearestFirst', () => {
    it('should assign nearest task to each robot', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 2], assigned: false }, // Near robot1
        { id: 'task2', position: [5, 7], assigned: false }, // Near robot2
        { id: 'task3', position: [9, 9], assigned: false }  // Far from both
      ]

      const assignments = assignTasksNearestFirst(robots, tasks, gridSize)

      expect(assignments).toHaveLength(2)
      
      // Robot1 should get task1 (closest)
      const robot1Assignment = assignments.find(a => a.robotId === 'robot1')
      expect(robot1Assignment).toBeDefined()
      expect(robot1Assignment!.taskId).toBe('task1')
      expect(robot1Assignment!.path.length).toBeGreaterThan(0)

      // Robot2 should get task2 (closest available after robot1 takes task1)
      const robot2Assignment = assignments.find(a => a.robotId === 'robot2')
      expect(robot2Assignment).toBeDefined()
      expect(robot2Assignment!.taskId).toBe('task2')
      expect(robot2Assignment!.path.length).toBeGreaterThan(0)
    })

    it('should not assign tasks to robots that already have targets', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: 'existing-task', path: [[0, 1]] },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 2], assigned: false },
        { id: 'task2', position: [5, 7], assigned: false }
      ]

      const assignments = assignTasksNearestFirst(robots, tasks, gridSize)

      expect(assignments).toHaveLength(1)
      expect(assignments[0].robotId).toBe('robot2')
    })

    it('should not assign already assigned tasks', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 2], assigned: true },  // Already assigned
        { id: 'task2', position: [5, 7], assigned: false }
      ]

      const assignments = assignTasksNearestFirst(robots, tasks, gridSize)

      expect(assignments).toHaveLength(1)
      expect(assignments[0].taskId).toBe('task2')
    })

    it('should return empty array when no idle robots', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: 'task1', path: [[0, 1]] }
      ]

      const tasks: Task[] = [
        { id: 'task2', position: [5, 7], assigned: false }
      ]

      const assignments = assignTasksNearestFirst(robots, tasks, gridSize)

      expect(assignments).toHaveLength(0)
    })

    it('should return empty array when no unassigned tasks', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [5, 7], assigned: true }
      ]

      const assignments = assignTasksNearestFirst(robots, tasks, gridSize)

      expect(assignments).toHaveLength(0)
    })

    it('should find direct path when no obstacles', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 2], assigned: false }
      ]

      const assignments = assignTasksNearestFirst(robots, tasks, gridSize)

      expect(assignments).toHaveLength(1)
      expect(assignments[0].path.length).toBe(2) // Direct path: [0,1], [0,2]
    })

    it('should assign task when path exists', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 2], assigned: false }
      ]

      const assignments = assignTasksNearestFirst(robots, tasks, gridSize)

      expect(assignments).toHaveLength(1)
      expect(assignments[0].path.length).toBeGreaterThan(0)
    })

    it('should assign multiple robots when multiple tasks available', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null },
        { id: 'robot3', position: [9, 9], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 2], assigned: false },
        { id: 'task2', position: [5, 7], assigned: false },
        { id: 'task3', position: [8, 9], assigned: false }
      ]

      const assignments = assignTasksNearestFirst(robots, tasks, gridSize)

      expect(assignments).toHaveLength(3)
      
      // Each robot should get a unique task
      const robotIds = assignments.map(a => a.robotId)
      const taskIds = assignments.map(a => a.taskId)
      
      expect(new Set(robotIds).size).toBe(3)
      expect(new Set(taskIds).size).toBe(3)
    })

    it('should handle more robots than tasks', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null },
        { id: 'robot3', position: [9, 9], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 2], assigned: false },
        { id: 'task2', position: [5, 7], assigned: false }
      ]

      const assignments = assignTasksNearestFirst(robots, tasks, gridSize)

      expect(assignments).toHaveLength(2) // Only 2 tasks available
      
      // Should assign to the 2 robots closest to tasks
      const assignedRobotIds = assignments.map(a => a.robotId)
      expect(assignedRobotIds).toContain('robot1')
      expect(assignedRobotIds).toContain('robot2')
    })
  })

  describe('getObstaclePositions', () => {
    it('should return all robot and task positions', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [2, 2], assigned: false },
        { id: 'task2', position: [7, 7], assigned: false }
      ]

      const obstacles = getObstaclePositions(robots, tasks)

      expect(obstacles).toHaveLength(4)
      expect(obstacles).toContainEqual([0, 0])
      expect(obstacles).toContainEqual([5, 5])
      expect(obstacles).toContainEqual([2, 2])
      expect(obstacles).toContainEqual([7, 7])
    })

    it('should exclude specified robot from obstacles', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [2, 2], assigned: false }
      ]

      const obstacles = getObstaclePositions(robots, tasks, 'robot1')

      expect(obstacles).toHaveLength(2)
      expect(obstacles).not.toContainEqual([0, 0]) // robot1 excluded
      expect(obstacles).toContainEqual([5, 5])     // robot2 included
      expect(obstacles).toContainEqual([2, 2])     // task1 included
    })

    it('should exclude specified task from obstacles', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [2, 2], assigned: false },
        { id: 'task2', position: [7, 7], assigned: false }
      ]

      const obstacles = getObstaclePositions(robots, tasks, undefined, 'task1')

      expect(obstacles).toHaveLength(2)
      expect(obstacles).toContainEqual([0, 0])     // robot1 included
      expect(obstacles).not.toContainEqual([2, 2]) // task1 excluded
      expect(obstacles).toContainEqual([7, 7])     // task2 included
    })

    it('should exclude both robot and task when specified', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [2, 2], assigned: false },
        { id: 'task2', position: [7, 7], assigned: false }
      ]

      const obstacles = getObstaclePositions(robots, tasks, 'robot1', 'task1')

      expect(obstacles).toHaveLength(2)
      expect(obstacles).not.toContainEqual([0, 0]) // robot1 excluded
      expect(obstacles).toContainEqual([5, 5])     // robot2 included
      expect(obstacles).not.toContainEqual([2, 2]) // task1 excluded
      expect(obstacles).toContainEqual([7, 7])     // task2 included
    })
  })
  describe('assignTasksRoundRobin', () => {
    it('should assign tasks in round-robin order', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [1, 1], targetTaskId: null, path: null },
        { id: 'robot3', position: [2, 2], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 2], assigned: false },
        { id: 'task2', position: [1, 3], assigned: false },
        { id: 'task3', position: [2, 4], assigned: false }
      ]

      // Start with lastAssignedRobotIndex = -1, so first robot (index 0) should be first
      const result = assignTasksRoundRobin(robots, tasks, gridSize, -1)

      expect(result.assignments).toHaveLength(3)
      expect(result.nextRobotIndex).toBe(2) // Last robot assigned was at index 2

      // Verify assignments exist and have valid paths
      result.assignments.forEach(assignment => {
        expect(assignment.robotId).toBeDefined()
        expect(assignment.taskId).toBeDefined()
        expect(assignment.path.length).toBeGreaterThan(0)
      })

      // Each robot should get a unique task
      const robotIds = result.assignments.map(a => a.robotId)
      const taskIds = result.assignments.map(a => a.taskId)
      
      expect(new Set(robotIds).size).toBe(3)
      expect(new Set(taskIds).size).toBe(3)
    })

    it('should start from correct robot index based on lastAssignedRobotIndex', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null },
        { id: 'robot3', position: [9, 9], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [8, 8], assigned: false } // Close to robot3
      ]

      // Start with lastAssignedRobotIndex = 0, so next robot (index 1) should be first
      const result = assignTasksRoundRobin(robots, tasks, gridSize, 0)

      expect(result.assignments).toHaveLength(1)
      
      // Should start from robot2 (index 1), but task1 is closest to robot3
      // Since it's round-robin, robot2 gets priority over robot3 even if robot3 is closer
      expect(result.assignments[0].robotId).toBe('robot2')
      expect(result.nextRobotIndex).toBe(1)
    })

    it('should cycle through robots correctly', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 2], assigned: false },
        { id: 'task2', position: [5, 7], assigned: false },
        { id: 'task3', position: [1, 1], assigned: false }
      ]

      // Start from index 1 (robot2), should cycle back to robot1
      const result = assignTasksRoundRobin(robots, tasks, gridSize, 1)

      expect(result.assignments).toHaveLength(2) // Only 2 robots available
      expect(result.nextRobotIndex).toBe(0) // Should end on robot1 (index 0)
      
      // First assignment should go to robot1 (next after index 1)
      // Second assignment should go to robot2
      const robotIds = result.assignments.map(a => a.robotId)
      expect(robotIds).toContain('robot1')
      expect(robotIds).toContain('robot2')
    })

    it('should handle more tasks than robots', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 2], assigned: false },
        { id: 'task2', position: [5, 7], assigned: false },
        { id: 'task3', position: [8, 8], assigned: false },
        { id: 'task4', position: [9, 9], assigned: false }
      ]

      const result = assignTasksRoundRobin(robots, tasks, gridSize, -1)

      // Should only assign to available robots (2), not all tasks (4)
      expect(result.assignments).toHaveLength(2)
      
      const robotIds = result.assignments.map(a => a.robotId)
      expect(robotIds).toContain('robot1')
      expect(robotIds).toContain('robot2')
    })

    it('should not assign tasks to robots that already have targets', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: 'existing-task', path: [[0, 1]] },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null },
        { id: 'robot3', position: [9, 9], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 2], assigned: false },
        { id: 'task2', position: [5, 7], assigned: false }
      ]

      const result = assignTasksRoundRobin(robots, tasks, gridSize, -1)

      expect(result.assignments).toHaveLength(2)
      
      // Should only assign to idle robots (robot2 and robot3)
      const robotIds = result.assignments.map(a => a.robotId)
      expect(robotIds).not.toContain('robot1')
      expect(robotIds).toContain('robot2')
      expect(robotIds).toContain('robot3')
    })

    it('should not assign already assigned tasks', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 2], assigned: true },  // Already assigned
        { id: 'task2', position: [5, 7], assigned: false },
        { id: 'task3', position: [8, 8], assigned: false }
      ]

      const result = assignTasksRoundRobin(robots, tasks, gridSize, -1)

      expect(result.assignments).toHaveLength(2)
      
      // Should only assign unassigned tasks
      const taskIds = result.assignments.map(a => a.taskId)
      expect(taskIds).not.toContain('task1')
      expect(taskIds).toContain('task2')
      expect(taskIds).toContain('task3')
    })

    it('should return empty assignments when no idle robots', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: 'task1', path: [[0, 1]] },
        { id: 'robot2', position: [5, 5], targetTaskId: 'task2', path: [[5, 6]] }
      ]

      const tasks: Task[] = [
        { id: 'task3', position: [8, 8], assigned: false }
      ]

      const result = assignTasksRoundRobin(robots, tasks, gridSize, -1)

      expect(result.assignments).toHaveLength(0)
      expect(result.nextRobotIndex).toBe(-1) // Should preserve input index
    })

    it('should return empty assignments when no unassigned tasks', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 2], assigned: true },
        { id: 'task2', position: [5, 7], assigned: true }
      ]

      const result = assignTasksRoundRobin(robots, tasks, gridSize, -1)

      expect(result.assignments).toHaveLength(0)
      expect(result.nextRobotIndex).toBe(-1) // Should preserve input index
    })

    it('should find valid paths for assignments', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 3], assigned: false }
      ]

      const result = assignTasksRoundRobin(robots, tasks, gridSize, -1)

      expect(result.assignments).toHaveLength(1)
      expect(result.assignments[0].path.length).toBe(3) // Direct path: [0,1], [0,2], [0,3]
      expect(result.assignments[0].path).toEqual([[0, 1], [0, 2], [0, 3]])
    })

    it('should assign tasks to closest robot among candidates in round-robin order', () => {
      const robots: Robot[] = [
        { id: 'robot1', position: [0, 0], targetTaskId: null, path: null },
        { id: 'robot2', position: [5, 5], targetTaskId: null, path: null }
      ]

      const tasks: Task[] = [
        { id: 'task1', position: [0, 1], assigned: false }, // Very close to robot1
        { id: 'task2', position: [5, 6], assigned: false }  // Very close to robot2
      ]

      // Start with robot1 (index 0) having the first turn
      const result = assignTasksRoundRobin(robots, tasks, gridSize, -1)

      expect(result.assignments).toHaveLength(2)
      
      // Robot1 should get the task closest to it
      const robot1Assignment = result.assignments.find(a => a.robotId === 'robot1')
      expect(robot1Assignment?.taskId).toBe('task1')
      
      // Robot2 should get the remaining task
      const robot2Assignment = result.assignments.find(a => a.robotId === 'robot2')
      expect(robot2Assignment?.taskId).toBe('task2')
    })
  })
}) 