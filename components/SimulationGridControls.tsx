'use client'

import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { useSimulationStore } from "@/store/simulationStore"
import { useState, useEffect } from "react"

export default function SimulationGridControls() {
  const {
    isRunning,
    startSimulation,
    pauseSimulation,
    robots,
    tasks,
    hasStarted
  } = useSimulationStore()

  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    if (robots.length > 0 && tasks.length > 0) {
      setShowWarning(false)
    }
  }, [robots.length, tasks.length])

  const handleStart = () => {
    if (robots.length === 0 || tasks.length === 0) {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 3000)
      return
    }
    startSimulation()
  }

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="flex gap-4">
        <Button onClick={handleStart} size="lg" disabled={isRunning}>
          <Play className="mr-2 w-5 h-5" />
          {hasStarted ? "Resume" : "Start"}
        </Button>
        <Button onClick={pauseSimulation} size="lg" disabled={!isRunning}>
          <Pause className="mr-2 w-5 h-5" />
          Pause
        </Button>
      </div>
      {showWarning && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mt-2">
          Add at least one robot and one task to start the simulation.
        </div>
      )}
    </div>
  )
} 