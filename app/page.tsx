'use client'

import Grid from '@/components/Grid'
import ControlPanel from '@/components/ControlPanel'
import StatusPanel from '@/components/StatusPanel'
import Footer from '@/components/Footer'
import { useSimulationRunner } from '@/hooks/useSimulationRunner'
import SimulationGridControls from '@/components/SimulationGridControls'
import { useSimulationStore } from '@/store/simulationStore'

export default function HomePage() {

  useSimulationRunner()
  const { score, isRunning } = useSimulationStore()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex overflow-hidden">
        <div className="sticky top-0 h-screen z-10 overflow-auto">
          <ControlPanel />
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-3">
          {!isRunning && score !== null && (
            <div className="text-3xl font-semibold text-black mb-4 text-center">
              Score: {score}
            </div>
          )}
          <div className="w-full max-h-[70vh] overflow-auto flex justify-center mt-4">
            <Grid />
          </div>
          <SimulationGridControls />
        </div>
        
        <div className="w-80 p-6 overflow-auto">
          <StatusPanel />
        </div>
      </main>
      <Footer />
    </div>
  )
}
