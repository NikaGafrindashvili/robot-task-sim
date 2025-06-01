import { ReactNode } from "react"

export default function Cell({
  row,
  col,
  children,
  onClick,
}: {
  row: number
  col: number
  children?: ReactNode
  onClick?: (row: number, col: number) => void
}) {
  return (
    <div
      onClick={() => onClick?.(row, col)}
      className="w-7 h-7 border border-gray-200 flex items-center justify-center cursor-pointer"
    >
      {children}
    </div>
  )
}