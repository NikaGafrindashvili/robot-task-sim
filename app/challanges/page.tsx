'use client'

import { useChallengeMaps } from '@/hooks/useChallengeMaps'
import { useSimulationStore } from '@/store/simulationStore'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ChallangesPage() {
  const { challengeMaps, isLoading } = useChallengeMaps()
  const { loadChallengeMap } = useSimulationStore()
  const router = useRouter()

  const handleLoadChallenge = (challengeMap: typeof challengeMaps[0]) => {
    loadChallengeMap(challengeMap)
    router.push('/')
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Robot Challenges</h1>
          <p className="text-lg text-gray-600">Loading challenges...</p>
        </div>
      </main>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500 text-white'
      case 'Medium':
        return 'bg-yellow-500 text-white'
      case 'Hard':
        return 'bg-red-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Robot Challenges</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your robot coordination skills with these predefined challenge maps. 
            Each challenge presents unique obstacles and layouts to master.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {challengeMaps.map((challenge) => (
            <div
              key={challenge.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Challenge Preview Grid */}
              <div className="p-6 bg-gray-100">
                <div className="aspect-square bg-white border-2 border-gray-300 rounded-lg p-2">
                  <div 
                    className="w-full h-full grid gap-0.5"
                    style={{ 
                      gridTemplateColumns: `repeat(${challenge.gridSize[1]}, 1fr)`,
                      gridTemplateRows: `repeat(${challenge.gridSize[0]}, 1fr)`
                    }}
                  >
                    {Array.from({ length: challenge.gridSize[0] * challenge.gridSize[1] }).map((_, index) => {
                      const row = Math.floor(index / challenge.gridSize[1])
                      const col = index % challenge.gridSize[1]
                      const position: [number, number] = [row, col]
                      
                      const isRobot = challenge.robots?.some(([r, c]: [number, number]) => r === row && c === col) || false
                      const isTask = challenge.tasks.some(([r, c]: [number, number]) => r === row && c === col)
                      const isObstacle = challenge.obstacles.some(([r, c]: [number, number]) => r === row && c === col)
                      
                      let cellClass = 'border border-gray-200'
                      if (isObstacle) cellClass += ' bg-gray-800'
                      else if (isRobot) cellClass += ' bg-blue-500'
                      else if (isTask) cellClass += ' bg-red-500'
                      else cellClass += ' bg-white'
                      
                      return (
                        <div
                          key={index}
                          className={cellClass}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Challenge Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{challenge.name}</h3>
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {challenge.description}
                </p>

                <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                      <span className="font-medium">Robots</span>
                    </div>
                    <div className="text-gray-600">{challenge.robots?.length || 0}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
                      <span className="font-medium">Tasks</span>
                    </div>
                    <div className="text-gray-600">{challenge.tasks.length}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <div className="w-3 h-3 bg-gray-800 rounded mr-1"></div>
                      <span className="font-medium">Obstacles</span>
                    </div>
                    <div className="text-gray-600">{challenge.obstacles.length}</div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleLoadChallenge(challenge)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Load Challenge
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How to Play</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Click "Load Challenge" to import the map into the simulator</p>
              <p>• Use the control panel to start the simulation and watch robots navigate</p>
              <p>• Try different assignment strategies to optimize performance</p>
              <p>• Challenge yourself to complete all tasks as quickly as possible</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 