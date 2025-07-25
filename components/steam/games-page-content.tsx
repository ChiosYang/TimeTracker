'use client'

import { useState } from 'react'
import { ErrorState, ConfigurationPrompt } from '@/components/steam/steam-profile'
import { NoConfigFallback } from '@/components/steam/no-config-fallback'
import { SteamSetupGuide } from '@/components/steam/setup-guide'
import { GamesLibrary } from '@/components/steam/games-library'
import SyncGamesButton from '@/components/steam/sync-games-button'
import { isProfileError } from '@/lib/utils/steam'
import { ProfileResult } from '@/lib/types/steam'

interface GamesPageContentProps {
  hasConfig: boolean
  profile?: ProfileResult
}

export function GamesPageContent({ hasConfig, profile }: GamesPageContentProps) {
  const [skipConfig, setSkipConfig] = useState(false)
  const [showGuide, setShowGuide] = useState(false)

  const handleSkipConfig = () => {
    setSkipConfig(true)
  }

  const handleShowGuide = () => {
    setShowGuide(true)
  }

  const handleBackToPrompt = () => {
    setShowGuide(false)
  }

  // 如果没有配置且用户选择跳过
  if (!hasConfig && skipConfig) {
    return <NoConfigFallback />
  }

  // 如果没有配置且用户选择查看指南
  if (!hasConfig && showGuide) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={handleBackToPrompt}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回配置页面
          </button>
        </div>
        <SteamSetupGuide />
      </div>
    )
  }

  // 如果没有配置且用户未跳过，显示配置提示
  if (!hasConfig) {
    return <ConfigurationPrompt onSkip={handleSkipConfig} onShowGuide={handleShowGuide} />
  }

  // 有配置的情况，显示正常内容
  return (
    <>
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Steam Games Library
            </h1>
            {profile && !isProfileError(profile) && (
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {profile.personaname}&apos;s game collection and playtime
              </p>
            )}
          </div>
          <SyncGamesButton />
        </div>
      </header>

      <main>
        {profile && isProfileError(profile) ? (
          <ErrorState error={profile.error} />
        ) : (
          <GamesLibrary />
        )}
      </main>
    </>
  )
}