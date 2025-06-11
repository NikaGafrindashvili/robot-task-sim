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
      className={`w-7 h-7 border border-gray-200 flex items-center justify-center cursor-pointer ${
        isInPath 
          ? "bg-blue-50 border-blue-200" 
          : "hover:bg-gray-50"
      }`}
    >
      {children}
    </div>
  )
}