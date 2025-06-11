'use client'

import { useSimulationStore } from '@/store/simulationStore'
import Cell from './Cell'
import RobotIcon from './RobotIcon'
import TaskIcon from './TaskIcon'

export default function Grid() {
  const { gridSize, robots, tasks, addRobot, addTask, removeAtPosition, isRunning } = useSimulationStore()

  const handleClick = (row: number, col: number) => {
    if (isRunning) return

    const occupiedRobot = robots.find(r => r.position[0] === row && r.position[1] === col)
    const occupiedTask = tasks.find(t => t.position[0] === row && t.position[1] === col)

    if (occupiedRobot || occupiedTask) {
      removeAtPosition([row, col])
    } else {
      if (robots.length <= tasks.length) {
        addRobot([row, col])
      } else {
        addTask([row, col])
      }
    }
  }

  // Helper function to check if a cell is part of any robot's path
  const isInPath = (row: number, col: number) => {
    return robots.some(robot => 
      robot.path && robot.path.some(([pathRow, pathCol]) => 
        pathRow === row && pathCol === col
      )
    )
  }

  return (
    <div className="inline-block">
      <div
        className="grid border border-gray-500 rounded-lg overflow-hidden"
        style={{
          gridTemplateRows: `repeat(${gridSize[0]}, 40px)`,
          gridTemplateColumns: `repeat(${gridSize[1]}, 40px)`,
          display: 'grid'
        }}
      >
        {Array.from({ length: gridSize[0] * gridSize[1] }).map((_, index) => {
          const row = Math.floor(index / gridSize[1])
          const col = index % gridSize[1]

          const robot = robots.find(r => r.position[0] === row && r.position[1] === col)
          const task = tasks.find(t => t.position[0] === row && t.position[1] === col)
          const cellIsInPath = isInPath(row, col)

          return (
            <Cell 
              key={index} 
              row={row} 
              col={col} 
              onClick={handleClick}
              isInPath={cellIsInPath}
            >
              {task && <TaskIcon assigned={task.assigned} />}
              {robot && <RobotIcon hasTask={!!robot.targetTaskId} />}
            </Cell>
          )
        })}
      </div>
    </div>
  )
}