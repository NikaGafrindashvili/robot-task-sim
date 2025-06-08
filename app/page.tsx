'use client'

import Grid from '@/components/Grid'
import ControlPanel from '@/components/ControlPanel'
import { useSimulationRunner } from '@/hooks/useSimulationRunner'

export default function HomePage() {

  useSimulationRunner()

  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <ControlPanel />
      <div className="flex-1 p-4 overflow-auto">
        <Grid />
      </div>
    </main>
  )
}
