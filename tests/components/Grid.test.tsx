import { render, screen, fireEvent } from '@testing-library/react'
import Grid from '@/components/Grid'
import { useSimulationStore } from '@/store/simulationStore'

beforeEach(() => {
  useSimulationStore.getState().clearGrid()
})

describe('Grid', () => {
  it('renders correct number of cells', () => {
    useSimulationStore.getState().setGridSize([5, 5])
    render(<Grid />)
    expect(screen.getAllByRole('button')).toHaveLength(25)
  })

  it('renders robot and task icons at correct positions', () => {
    useSimulationStore.getState().addRobot([0, 0])
    useSimulationStore.getState().addTask([1, 1])
    render(<Grid />)
    expect(screen.getAllByTestId('robot-icon')).toHaveLength(1)
    expect(screen.getAllByTestId('task-icon')).toHaveLength(1)
  })

  it('adds a robot or task when clicking an empty cell', () => {
    useSimulationStore.getState().setGridSize([2, 2])
    render(<Grid />)
    const cell = screen.getByTestId('cell-0-0')
    fireEvent.click(cell)
    expect(useSimulationStore.getState().robots.length + useSimulationStore.getState().tasks.length).toBe(1)
  })

  it('adds an obstacle when in obstacle placement mode', () => {
    useSimulationStore.getState().setGridSize([2, 2])
    useSimulationStore.getState().setPlacementMode('obstacle')
    render(<Grid />)
    const cell = screen.getByTestId('cell-0-0')
    fireEvent.click(cell)
    expect(useSimulationStore.getState().obstacles).toHaveLength(1)
    expect(screen.getByTestId('obstacle-icon')).toBeInTheDocument()
  })

  it('removes robot or task when clicking an occupied cell', () => {
    useSimulationStore.getState().addRobot([0, 0])
    render(<Grid />)
    const cell = screen.getByTestId('cell-0-0')
    fireEvent.click(cell)
    expect(useSimulationStore.getState().robots).toHaveLength(0)
  })
}) 