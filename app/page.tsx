'use client'

import Grid from '@/components/Grid'
import ControlPanel from '@/components/ControlPanel'

export default function HomePage() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      <ControlPanel />
      <div className="flex-1 p-4 overflow-auto">
        <Grid />
      </div>
    </main>
  )
}
