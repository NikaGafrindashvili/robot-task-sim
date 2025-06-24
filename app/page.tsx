'use client'

import Grid from '@/components/Grid'
import ControlPanel from '@/components/ControlPanel'
import StatusPanel from '@/components/StatusPanel'
import Footer from '@/components/Footer'
import { useSimulationRunner } from '@/hooks/useSimulationRunner'
import SimulationGridControls from '@/components/SimulationGridControls'
import { useSimulationStore } from '@/store/simulationStore'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'
import React from 'react'

export default function HomePage() {

  useSimulationRunner()
  const { score, isRunning, challengeModeEnabled, currentChallengeId } = useSimulationStore()
  const { user } = useUserProfile()
  const setUserBestScore = useMutation(api.challengeMaps.setUserBestScore)

  // Save best score when a challenge run ends
  React.useEffect(() => {
    if (
      score !== null &&
      !isRunning &&
      challengeModeEnabled &&
      currentChallengeId &&
      user && user._id
    ) {
      console.log('Calling setUserBestScore with:', {
        userId: user._id,
        challengeId: currentChallengeId,
        score,
      })
      setUserBestScore({
        userId: user._id,
        challengeId: currentChallengeId,
        score,
      })
    } else {
      console.log('Not calling setUserBestScore. Values:', {
        score,
        isRunning,
        challengeModeEnabled,
        currentChallengeId,
        user,
      })
    }
  }, [score, isRunning, challengeModeEnabled, currentChallengeId, user, setUserBestScore])

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
