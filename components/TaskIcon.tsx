import { Target } from "lucide-react"

interface TaskIconProps {
  assigned?: boolean
}

export default function TaskIcon({ assigned = false }: TaskIconProps) {
  return (
    <Target 
      data-testid="task-icon"
      className={`w-5 h-5 ${
        assigned 
          ? "text-orange-600 fill-orange-100" 
          : "text-red-500"
      }`} 
    />
  )
}