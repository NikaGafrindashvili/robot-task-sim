import { useSimulationStore } from '@/store/simulationStore'
import { Bot, Target, Activity, Clock } from 'lucide-react'

export default function StatusPanel() {
  const { robots, tasks, strategy, dynamicTaskSpawning } = useSimulationStore()
  
  const idleRobots = robots.filter(robot => !robot.targetTaskId).length
  const busyRobots = robots.filter(robot => robot.targetTaskId).length
  const availableTasks = tasks.filter(task => !task.assigned).length
  const assignedTasks = tasks.filter(task => task.assigned).length
  const robotsWithPaths = robots.filter(robot => robot.path && robot.path.length > 0).length

  const stats = [
    {
      label: 'Total Robots',
      value: robots.length,
      icon: Bot,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Robots',
      value: busyRobots,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Moving Robots',
      value: robotsWithPaths,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Total Tasks',
      value: tasks.length,
      icon: Target,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Simulation Status</h3>
      
      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-3`}>
            <div className="flex items-center gap-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-sm font-medium text-gray-700">{stat.label}</span>
            </div>
            <div className={`text-xl font-bold ${stat.color} mt-1`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Info */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Strategy:</span>
          <span className="font-medium capitalize">{strategy.replace('-', ' ')}</span>
        </div>
        <div className="flex justify-between">
          <span>Auto Tasks:</span>
          <span className={`font-medium ${dynamicTaskSpawning ? 'text-green-600' : 'text-gray-500'}`}>
            {dynamicTaskSpawning ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Idle Robots:</span>
          <span className="font-medium">{idleRobots}</span>
        </div>
        <div className="flex justify-between">
          <span>Available Tasks:</span>
          <span className="font-medium">{availableTasks}</span>
        </div>
      </div>
    </div>
  )
} 