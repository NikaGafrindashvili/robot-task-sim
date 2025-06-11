import { Bot, Target } from "lucide-react"

export default function VisualLegend() {
  return (
    <div className="bg-gray-50 border rounded-lg p-3 mt-4">
      <h3 className="text-sm font-medium mb-2">Icon Indicators</h3>
      
      <div className="space-y-2 text-xs">
        {/* Robot states */}
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" />
          <span>Idle Robot</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600 fill-blue-100" />
          <span>Active Robot</span>
        </div>
        
        {/* Task states */}
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-red-500" />
          <span>Available Task</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-600 fill-orange-100" />
          <span>Assigned Task</span>
        </div>
        
        {/* Path visualization */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-50 border border-blue-300 rounded-sm"></div>
          <span>Robot Path</span>
        </div>
      </div>
    </div>
  )
} 