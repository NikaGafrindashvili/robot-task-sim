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
    maxRobots,
    setMaxRobots,
    challengeModeEnabled,
    setChallengeModeEnabled,
  } = useSimulationStore()

  const [showWarning, setShowWarning] = useState(false)
  const [showRobotLimitWarning, setShowRobotLimitWarning] = useState(false)
  const [rows, setRows] = useState(gridSize[0])
  const [cols, setCols] = useState(gridSize[1])
  const [maxRobotsInput, setMaxRobotsInput] = useState(maxRobots)

  const handleInputChange =
    (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = e.target.value.replace(/[^0-9]/g, '')
      setter(sanitized === '' ? 0 : parseInt(sanitized, 10))
    }

  const handleInputBlur =
    (value: number, setter: (value: number) => void) => () => {
      if (value < 5) {
        setter(5)
      } else if (value > 100) {
        setter(100)
      }
    }

  useEffect(() => {
    if (robots.length > 0 && tasks.length > 0) {
      setShowWarning(false)
    }
  }, [robots.length, tasks.length])

  // Show robot limit warning when trying to add robots at limit
  useEffect(() => {
    if (robots.length >= maxRobots && placementMode === 'robot') {
      setShowRobotLimitWarning(true)
      const timer = setTimeout(() => setShowRobotLimitWarning(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [robots.length, maxRobots, placementMode])

  useEffect(() => {
    setMaxRobotsInput(maxRobots)
  }, [maxRobots])

  const handleMaxRobotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value.replace(/[^0-9]/g, '')
    setMaxRobotsInput(sanitized === '' ? 1 :parseInt(sanitized))
  }

  const handleMaxRobotsUpdate = () => {
    setMaxRobots(maxRobotsInput)
    setChallengeModeEnabled(false)
  }

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
    setChallengeModeEnabled(false)
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

      {showRobotLimitWarning && (
        <div className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded px-3 py-2 mt-2">
          Robot limit reached ({robots.length}/{maxRobots}). Cannot add more robots.
        </div>
      )}

      {/* Robot Limit Display */}
      <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-2">
        <div className="flex justify-between items-center">
          <span>Robots:</span>
          <span className={`font-medium ${robots.length >= maxRobots ? 'text-orange-600' : 'text-gray-800'}`}>
            {robots.length}/{maxRobots}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span>Tasks:</span>
          <span className="font-medium text-gray-800">{tasks.length}</span>
        </div>
      </div>

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
        <label className="block font-medium mb-2">Grid Size</label>
        <div className="flex items-end gap-2">
          <div>
            <label htmlFor="rows-input" className="block text-sm font-medium text-gray-700 mb-1">
              Rows
            </label>
            <input
              id="rows-input"
              type="text"
              inputMode="numeric"
              value={rows === 0 ? '' : rows}
              onChange={handleInputChange(setRows)}
              onBlur={handleInputBlur(rows, setRows)}
              className="w-20 h-9 border border-gray-300 rounded text-center bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRunning}
            />
          </div>
          <div>
            <label htmlFor="cols-input" className="block text-sm font-medium text-gray-700 mb-1">
              Cols
            </label>
            <input
              id="cols-input"
              type="text"
              inputMode="numeric"
              value={cols === 0 ? '' : cols}
              onChange={handleInputChange(setCols)}
              onBlur={handleInputBlur(cols, setCols)}
              className="w-20 h-9 border border-gray-300 rounded text-center bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isRunning}
            />
          </div>
          <Button
            variant="secondary"
            onClick={handleGridSizeChange}
            disabled={isRunning}
            className="h-9"
          >
            Update
          </Button>
        </div>
      </div>

      <div>
        <label className="block font-medium mb-2">Max Robots</label>
        <div className="flex items-end gap-2">
          <input
            type="text"
            inputMode="numeric"
            value={maxRobotsInput}
            onChange={handleMaxRobotsChange}
            className="w-20 h-9 border border-gray-300 rounded text-center bg-gray-50 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isRunning}
          />
          <Button
            variant="secondary"
            onClick={handleMaxRobotsUpdate}
            disabled={isRunning}
            className="h-9"
          >
            Update
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={dynamicTaskSpawning} onCheckedChange={toggleDynamicTaskSpawning} />
        <span>Auto Tasks</span>
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={challengeModeEnabled} disabled />
        <span>Challenge Mode Enabled</span>
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
                : robots.length >= maxRobots
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={robots.length >= maxRobots}
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