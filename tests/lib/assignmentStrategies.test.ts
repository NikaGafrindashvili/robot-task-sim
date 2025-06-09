import { assignTasksNearestFirst, getObstaclePositions } from '../../lib/assignmentStrategies'
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
}) 