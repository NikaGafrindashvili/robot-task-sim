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
import { useUserBestScore, useChallengeMap } from '@/hooks/useChallengeMaps'

export default function HomePage() {

  useSimulationRunner()
  const { score, isRunning, challengeModeEnabled, currentChallengeId } = useSimulationStore()
  const { user } = useUserProfile()
  const setUserBestScore = useMutation(api.challengeMaps.setUserBestScore)
  const bestScore = useUserBestScore(user?._id, currentChallengeId || undefined)
  const { challengeMap } = useChallengeMap(currentChallengeId || '')

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
    } 
  }, [score, isRunning, challengeModeEnabled, currentChallengeId, user, setUserBestScore])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex overflow-hidden">
        <div className="sticky top-0 h-screen z-10 overflow-auto">
          <ControlPanel />
        </div>
        
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-3">
          {challengeModeEnabled && currentChallengeId && challengeMap && (
            <div className="mb-6 flex flex-col items-center ">
              <div className="text-xl font-extrabold text-gralay-800 mb-1 text-center tracking-tight">
                Challenge: <span className="font-black">{challengeMap.name}</span>
              </div>
              <div className="text-lg font-bold text-gray-700 mb-1 text-center">
                Best Score: <span className="font-extrabold text-black">{bestScore}</span>
              </div>
              {!isRunning && score !== null && (
                <div className="text-3xl font-black text-black mt-2 text-center">
                  Score: {score}
                </div>
              )}
            </div>
          )}
          {!challengeModeEnabled && !isRunning && score !== null && (
            <div className="text-3xl font-black text-black mb-4 text-center">
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
