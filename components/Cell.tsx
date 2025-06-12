import { ReactNode } from "react"

export default function Cell({
  row,
  col,
  children,
  onClick,
  isInPath = false,
}: {
  row: number
  col: number
  children?: ReactNode
  onClick?: (row: number, col: number) => void
  isInPath?: boolean
}) {
  return (
    <div
      onClick={() => onClick?.(row, col)}
      role="button"
      data-testid={`cell-${row}-${col}`}
      className={`w-10 h-10 border border-gray-400 flex items-center justify-center cursor-pointer ${
        isInPath 
          ? "bg-blue-50 border-blue-300" 
          : "hover:bg-gray-50"
      }`}
    >
      {children}
    </div>
  )
}