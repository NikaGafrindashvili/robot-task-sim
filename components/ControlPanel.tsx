'use client'

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Play, Pause, RefreshCcw } from "lucide-react"
import { useSimulationStore } from "@/store/simulationStore"
import VisualLegend from "./VisualLegend"

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
  } = useSimulationStore()

  return (
    <div className="flex flex-col gap-4 p-6 w-72 border-r border-gray-200 bg-white">
      <h2 className="text-xl font-semibold text-gray-800">Controls</h2>

      <div className="flex gap-2">
        <Button onClick={isRunning ? pauseSimulation : startSimulation}>
          {isRunning ? <Pause className="mr-2 w-4 h-4" /> : <Play className="mr-2 w-4 h-4" />}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button variant="secondary" onClick={resetSimulation}>
          <RefreshCcw className="mr-2 w-4 h-4" /> Reset
        </Button>
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

      <div className="flex items-center gap-2">
        <Switch checked={dynamicTaskSpawning} onCheckedChange={toggleDynamicTaskSpawning} />
        <span>Auto Tasks</span>
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" onClick={clearGrid}>Clear</Button>
        <Button variant="outline" onClick={randomizeLayout}>Randomize</Button>
      </div>

      <VisualLegend />
    </div>
  )
}