import { MousePointer, Play, Settings } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 px-6 py-4">
      <div className="grid grid-cols-3 gap-8 text-sm text-gray-600">
        <div className="flex items-start gap-2">
          <MousePointer className="w-4 h-4 mt-0.5 text-gray-400" />
          <div>
            <div className="font-medium text-gray-700">Grid Interaction</div>
            <div>Click empty cells to add robots/tasks</div>
            <div>Click occupied cells to remove them</div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Play className="w-4 h-4 mt-0.5 text-gray-400" />
          <div>
            <div className="font-medium text-gray-700">Simulation Control</div>
            <div>Use Start/Pause to control the simulation</div>
            <div>Adjust speed and strategy in controls</div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Settings className="w-4 h-4 mt-0.5 text-gray-400" />
          <div>
            <div className="font-medium text-gray-700">Features</div>
            <div>Dynamic task spawning available</div>
            <div>Multiple assignment strategies</div>
          </div>
        </div>
      </div>
    </footer>
  )
} 