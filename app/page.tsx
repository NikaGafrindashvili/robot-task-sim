'use client'

import Grid from '@/components/Grid'
import ControlPanel from '@/components/ControlPanel'
import Header from '@/components/Header'
import StatusPanel from '@/components/StatusPanel'
import Footer from '@/components/Footer'
import { useSimulationRunner } from '@/hooks/useSimulationRunner'

export default function HomePage() {

  useSimulationRunner()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        <div className="sticky top-0 h-screen z-10">
          <ControlPanel />
        </div>
        
        <div className="flex-1 flex justify-center p-6">
          <div className="w-full h-full max-h-[70vh] overflow-auto flex justify-center mt-8">
            <Grid />
          </div>
        </div>
        
        <div className="w-80 p-6 overflow-auto">
          <StatusPanel />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
