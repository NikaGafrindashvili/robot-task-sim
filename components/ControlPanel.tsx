'use client'

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, RefreshCcw, Bot, Target, Mountain } from "lucide-react"
import { useSimulationStore } from "@/store/simulationStore"
import type { PlacementMode } from "@/store/simulationStore"
import VisualLegend from "./VisualLegend"
import { useState, useEffect } from "react"

export default function ControlPanel() {
  const {
    isRunning,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    tickSpeed,
    setTickSpeed,
    strategy,
    setStrategy,
    dynamicTaskSpawning,
    toggleDynamicTaskSpawning,
    clearGrid,
    randomizeLayout,
    robots,
    tasks,
    placementMode,
    setPlacementMode,
    gridSize,
    setGridSize,
  } = useSimulationStore()

  const [showWarning, setShowWarning] = useState(false)
  const [rows, setRows] = useState(gridSize[0])
  const [cols, setCols] = useState(gridSize[1])

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

  const handleGridSizeChange = () => {
    setGridSize([rows, cols])
  }

  useEffect(() => {
    setRows(gridSize[0])
    setCols(gridSize[1])
  }, [gridSize])

  return (
    <div className="flex flex-col gap-4 p-6 w-72 border-r border-gray-200 bg-white">
      <h2 className="text-xl font-semibold text-gray-800">Controls</h2>

      <div className="flex gap-2">
        <Button onClick={isRunning ? pauseSimulation : handleStart}>
          {isRunning ? <Pause className="mr-2 w-4 h-4" /> : <Play className="mr-2 w-4 h-4" />}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="secondary" onClick={resetSimulation}>
          <RefreshCcw className="mr-2 w-4 h-4" /> Reset
        </Button>
      </div>

      {showWarning && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mt-2">
          Add at least one robot and one task to start the simulation.
        </div>
      )}

      <div>
        <label className="block font-medium mb-1">Speed</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={tickSpeed}
          onChange={(e) => setTickSpeed(Number(e.target.value) as 1 | 2 | 5)}
        >
          <option value={1}>Slow (1/s)</option>
          <option value={2}>Normal (2/s)</option>
          <option value={5}>Fast (5/s)</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Strategy</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value as "nearest" | "round-robin")}
          disabled={isRunning}
        >
          <option value="nearest">Nearest First</option>
          <option value="round-robin">Round Robin</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Grid Size</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Number(e.target.value))}
            className="w-16 border rounded px-2 py-1"
            min="5"
            max="100"
            disabled={isRunning}
          />
          <span>x</span>
          <input
            type="number"
            value={cols}
            onChange={(e) => setCols(Number(e.target.value))}
            className="w-16 border rounded px-2 py-1"
            min="5"
            max="100"
            disabled={isRunning}
          />
          <Button
            variant="secondary"
            onClick={handleGridSizeChange}
            disabled={isRunning}
          >
            Update
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={dynamicTaskSpawning} onCheckedChange={toggleDynamicTaskSpawning} />
        <span>Auto Tasks</span>
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" onClick={clearGrid}>Clear</Button>
        <Button variant="outline" onClick={randomizeLayout}>Randomize</Button>
      </div>

      <div>
        <label className="block font-medium mb-2">Placement Mode</label>
        <div className="flex gap-2">
          <button
            onClick={() => setPlacementMode('robot')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              placementMode === 'robot'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Bot className="w-4 h-4 mr-1 inline" />
            Robot
          </button>
          <button
            onClick={() => setPlacementMode('task')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              placementMode === 'task'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Target className="w-4 h-4 mr-1 inline" />
            Task
          </button>
          <button
            onClick={() => setPlacementMode('obstacle')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              placementMode === 'obstacle'
                ? 'bg-gray-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Mountain className="w-4 h-4 mr-1 inline" />
            Obstacle
          </button>
        </div>
      </div>

      <VisualLegend />
    </div>
  )
}