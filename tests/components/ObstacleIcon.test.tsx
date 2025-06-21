import { render, screen } from '@testing-library/react'
import ObstacleIcon from '@/components/ObstacleIcon'

describe('ObstacleIcon', () => {
  it('renders the obstacle icon', () => {
    render(<ObstacleIcon />)
    const icon = screen.getByTestId('obstacle-icon')
    expect(icon).toBeInTheDocument()
  })
}) 