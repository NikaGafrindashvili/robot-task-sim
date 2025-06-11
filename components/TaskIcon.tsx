import { Target } from "lucide-react"

interface TaskIconProps {
  assigned?: boolean
}

export default function TaskIcon({ assigned = false }: TaskIconProps) {
  return (
    <Target 
      className={`w-4 h-4 ${
        assigned 
          ? "text-orange-600 fill-orange-100" 
          : "text-red-500"
      }`} 
    />
  )
}