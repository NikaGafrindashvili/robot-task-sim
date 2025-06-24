"use client"
import { useSimulationStore } from '@/store/simulationStore'
import { Bot, Target, Timer, Zap } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { AuthButtons } from './AuthButtons'

export default function Header() {
  const { robots, tasks, isRunning, tickSpeed, resetSimulation } = useSimulationStore()
  
  const idleRobots = robots.filter(robot => !robot.targetTaskId).length
  const busyRobots = robots.filter(robot => robot.targetTaskId).length
  const availableTasks = tasks.filter(task => !task.assigned).length
  const assignedTasks = tasks.filter(task => task.assigned).length
  const pathname = usePathname()
  const router = useRouter()

  const handleChallengesClick = (e: React.MouseEvent) => {
    e.preventDefault()
    resetSimulation()
    router.push('/challanges')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="w-full flex items-center justify-between gap-6">
        {/* Far Left: Title */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-900">Robot Task Simulator</h1>
        </div>
        
        {/* Center-Left: Nav buttons */}
        <nav className="flex gap-2 min-w-fit">
          <Link href="/">
            <Button
              variant={pathname === '/' ? 'default' : 'ghost'}
              className="text-sm font-medium px-4 py-2"
              asChild
            >
              <span>Home</span>
            </Button>
          </Link>
          <Button
            variant={pathname.startsWith('/challanges') ? 'default' : 'ghost'}
            className="text-sm font-medium px-4 py-2"
            onClick={handleChallengesClick}
          >
            Challanges
          </Button>
        </nav>
        
        {/* Right: Status/auth */}
        <div className="flex items-center gap-6 min-w-fit ml-auto">
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
          <AuthButtons />
        </div>
      </div>
    </header>
  )
} 