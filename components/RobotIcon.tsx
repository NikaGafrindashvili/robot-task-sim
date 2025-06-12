import { Bot } from "lucide-react"

interface RobotIconProps {
  hasTask?: boolean
}

export default function RobotIcon({ hasTask = false }: RobotIconProps) {
  return (
    <Bot 
      data-testid="robot-icon"
      className={`w-5 h-5 ${
        hasTask 
          ? "text-blue-600 fill-blue-100" 
          : "text-blue-500"
      }`} 
    />
  )
}