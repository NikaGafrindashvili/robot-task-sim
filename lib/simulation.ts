import { Robot, Task, Position, Strategy } from '@/store/simulationStore'

// Manhattan distance between two grid cells
export function manhattan(a: Position, b: Position): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])
}

// Generate simple orthogonal path using Manhattan steps
export function generatePath(from: Position, to: Position): Position[] {
  const path: Position[] = []
  let [x, y] = from

  while (x !== to[0]) {
    x += x < to[0] ? 1 : -1
    path.push([x, y])
  }

  while (y !== to[1]) {
    y += y < to[1] ? 1 : -1
    path.push([x, y])
  }

  return path
}

// Assign nearest unassigned task to an idle robot
export function assignNearest(robot: Robot, tasks: Task[]): [string, Position[]] | null {
  const available = tasks.filter(t => !t.assigned)
  if (available.length === 0) return null

  const nearest = available.reduce((prev, curr) =>
    manhattan(robot.position, curr.position) < manhattan(robot.position, prev.position) ? curr : prev
  )

  const path = generatePath(robot.position, nearest.position)
  return [nearest.id, path]
}

// Round-robin assignment (distributes tasks cyclically)
let rrIndex = 0
export function assignRoundRobin(robot: Robot, tasks: Task[]): [string, Position[]] | null {
  const available = tasks.filter(t => !t.assigned)
  if (available.length === 0) return null
  const task = available[rrIndex % available.length]
  rrIndex++
  const path = generatePath(robot.position, task.position)
  return [task.id, path]
}

// Move each robot forward by one step if it has a path
export function tickRobots(robots: Robot[]): Robot[] {
  return robots.map((robot) => {
    if (robot.path && robot.path.length > 0) {
      const [next, ...rest] = robot.path
      return {
        ...robot,
        position: next,
        path: rest.length ? rest : null,
        targetTaskId: rest.length ? robot.targetTaskId : null,
      }
    }
    return robot
  })
}