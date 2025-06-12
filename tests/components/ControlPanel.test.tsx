import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ControlPanel from '@/components/ControlPanel'
import { useSimulationStore } from '@/store/simulationStore'

beforeEach(() => {
  useSimulationStore.getState().clearGrid()
  useSimulationStore.getState().pauseSimulation()
})

describe('ControlPanel', () => {
  it('shows warning if trying to start with no robots or tasks', async () => {
    render(<ControlPanel />)
    const startButton = screen.getByRole('button', { name: /start/i })
    fireEvent.click(startButton)
    expect(await screen.findByText(/add at least one robot/i)).toBeInTheDocument()
  })

  it('starts simulation if robots and tasks exist', () => {
    useSimulationStore.getState().addRobot([0, 0])
    useSimulationStore.getState().addTask([1, 1])
    render(<ControlPanel />)
    const startButton = screen.getByRole('button', { name: /start/i })
    fireEvent.click(startButton)
    expect(useSimulationStore.getState().isRunning).toBe(true)
  })

  it('pauses simulation when Pause is clicked', () => {
    useSimulationStore.getState().addRobot([0, 0])
    useSimulationStore.getState().addTask([1, 1])
    useSimulationStore.getState().startSimulation()
    render(<ControlPanel />)
    const pauseButton = screen.getByRole('button', { name: /pause/i })
    fireEvent.click(pauseButton)
    expect(useSimulationStore.getState().isRunning).toBe(false)
  })

  it('resets simulation when Reset is clicked', () => {
    useSimulationStore.getState().addRobot([0, 0])
    useSimulationStore.getState().addTask([1, 1])
    render(<ControlPanel />)
    const resetButton = screen.getByRole('button', { name: /reset/i })
    fireEvent.click(resetButton)
    expect(useSimulationStore.getState().robots).toHaveLength(0)
    expect(useSimulationStore.getState().tasks).toHaveLength(0)
  })
}) 