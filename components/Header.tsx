import { useSimulationStore } from '@/store/simulationStore'
import { Bot, Target, Timer, Zap } from 'lucide-react'

export default function Header() {
  const { robots, tasks, isRunning, tickSpeed } = useSimulationStore()
  
  const idleRobots = robots.filter(robot => !robot.targetTaskId).length
  const busyRobots = robots.filter(robot => robot.targetTaskId).length
  const availableTasks = tasks.filter(task => !task.assigned).length
  const assignedTasks = tasks.filter(task => task.assigned).length

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Robot Task Simulator</h1>
          <p className="text-sm text-gray-600 mt-1">
            Automated task assignment and pathfinding simulation
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Simulation Status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isRunning ? 'Running' : 'Paused'}
            </span>
          </div>

          {/* Speed Indicator */}
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{tickSpeed}x Speed</span>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex items-center gap-1">
              <Bot className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">
                {busyRobots}/{robots.length} Active
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600">
                {tasks.length} Tasks
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 