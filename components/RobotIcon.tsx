import { Bot } from "lucide-react"

interface RobotIconProps {
  hasTask?: boolean
}

export default function RobotIcon({ hasTask = false }: RobotIconProps) {
  return (
    <Bot 
      className={`w-4 h-4 ${
        hasTask 
          ? "text-blue-600 fill-blue-100" 
          : "text-blue-500"
      }`} 
    />
  )
}