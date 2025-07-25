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
          <>
            {/* AI推荐快捷入口 */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-2">
                      🎯 获取AI游戏推荐
                    </h2>
                    <p className="text-purple-700 dark:text-purple-300 mb-4">
                      基于您的游戏偏好，智能推荐值得深入体验的游戏
                    </p>
                    <a
                      href="/recommendations"
                      className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      获取个性化推荐
                    </a>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 游戏库展示 */}
            <section>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  您的游戏库
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  浏览您的Steam游戏收藏和游戏时间统计
                </p>
              </div>
              <GamesLibrary />
            </section>
          </>
        )}
      </main>
    </>
  )
}