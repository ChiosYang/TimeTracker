'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface RecommendationData {
  recommendedGame: string
  reason: string
  userPreferenceAnalysis?: string
  confidence: number
  gameType?: string
  expectedPlaytime?: string
}

interface AnalysisData {
  topGames: Array<{
    appId: number
    name: string
    playtimeForever: number
    genres?: string[]
  }>
  totalGames: number
  analysisTimestamp: string
}

interface RecommendationResponse {
  success: boolean
  recommendation: RecommendationData
  analysisData: AnalysisData
  error?: string
}

export function GameRecommendation() {
  const [loading, setLoading] = useState(false)
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null)
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  // 计时相关状态
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number>(0)
  const [finalTime, setFinalTime] = useState<number | null>(null)
  
  // 跟踪组件是否仍然挂载
  const isMountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // 组件挂载时设置为true
    isMountedRef.current = true
    
    // 组件卸载时的清理函数
    return () => {
      isMountedRef.current = false
      // 取消正在进行的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      // 清理计时器
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // 计时器逻辑
  useEffect(() => {
    if (loading && startTime) {
      // 开始计时
      timerRef.current = setInterval(() => {
        if (isMountedRef.current) {
          const now = Date.now()
          setElapsedTime((now - startTime) / 1000)
        }
      }, 100) // 每100ms更新一次，保证流畅显示
      
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    } else {
      // 停止计时
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [loading, startTime])

  const getRecommendation = async () => {
    // 如果组件已卸载，不执行操作
    if (!isMountedRef.current) return

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // 创建新的AbortController
    abortControllerRef.current = new AbortController()

    // 安全的状态更新函数
    const safeSetState = (updateFn: () => void) => {
      if (isMountedRef.current) {
        updateFn()
      }
    }

    // 记录开始时间并重置相关状态
    const requestStartTime = Date.now()
    setStartTime(requestStartTime)
    setElapsedTime(0)
    setFinalTime(null)

    safeSetState(() => {
      setLoading(true)
      setError(null)
      setRecommendation(null)
    })

    try {
      const response = await fetch('/api/games/recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortControllerRef.current.signal,
      })

      // 检查组件是否仍然挂载
      if (!isMountedRef.current) return

      const data: RecommendationResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '获取推荐失败')
      }

      if (data.success) {
        const endTime = Date.now()
        const totalTime = (endTime - requestStartTime) / 1000
        
        safeSetState(() => {
          setRecommendation(data.recommendation)
          setAnalysisData(data.analysisData)
          setFinalTime(totalTime)
        })
      } else {
        throw new Error(data.error || '推荐生成失败')
      }
    } catch (err) {
      // 如果是因为取消请求导致的错误，不显示错误信息
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      
      // 即使出错也记录时间
      const endTime = Date.now()
      const totalTime = (endTime - requestStartTime) / 1000
      
      safeSetState(() => {
        setError(err instanceof Error ? err.message : '发生未知错误')
        setFinalTime(totalTime)
      })
    } finally {
      safeSetState(() => {
        setLoading(false)
      })
    }
  }

  const formatConfidence = (confidence: number) => {
    return Math.round(confidence * 100)
  }

  const formatTime = (seconds: number) => {
    return seconds.toFixed(1)
  }

  const formatPlaytime = (minutes: number) => {
    return Math.round(minutes / 60)
  }

  return (
    <div className="space-y-6">
      {/* 推荐触发区域 */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI 游戏推荐助手
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            基于您的游戏偏好和游玩历史，智能推荐值得深入体验的游戏
          </p>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={getRecommendation}
            disabled={loading}
            size="lg"
            className="px-8 py-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI正在分析您的游戏偏好... ({formatTime(elapsedTime)}秒)
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                获取AI推荐
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 加载状态 */}
      {loading && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <CardTitle className="text-lg text-blue-900 dark:text-blue-100">
                AI 正在分析您的游戏偏好
              </CardTitle>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              已用时: <span className="font-mono font-semibold">{formatTime(elapsedTime)}</span> 秒
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {/* 错误状态 */}
      {error && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <h3 className="font-medium text-red-800 dark:text-red-200">推荐失败</h3>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1">{error}</p>
                {finalTime && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    尝试用时: {formatTime(finalTime)}秒
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 推荐结果 */}
      {recommendation && (
        <div className="space-y-6 animate-in fade-in-50 duration-500">
          <RecommendationCard 
            recommendation={recommendation} 
            formatConfidence={formatConfidence}
            finalTime={finalTime}
            formatTime={formatTime}
          />
          
          {/* 分析数据展示 */}
          {analysisData && (
            <AnalysisDataCard 
              analysisData={analysisData}
              formatPlaytime={formatPlaytime}
            />
          )}
        </div>
      )}
    </div>
  )
}

// 主推荐卡片组件
interface RecommendationCardProps {
  recommendation: RecommendationData
  formatConfidence: (confidence: number) => number
  finalTime: number | null
  formatTime: (seconds: number) => string
}

function RecommendationCard({ recommendation, formatConfidence, finalTime, formatTime }: RecommendationCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const getGameTypeIcon = (gameType: string | undefined) => {
    // 根据游戏类型返回对应图标
    if (!gameType) return '🎮'
    
    if (gameType.includes('动作') || gameType.includes('射击')) {
      return '🎯'
    } else if (gameType.includes('策略') || gameType.includes('战略')) {
      return '🧩'
    } else if (gameType.includes('角色扮演') || gameType.includes('RPG')) {
      return '⚔️'
    } else if (gameType.includes('模拟') || gameType.includes('经营')) {
      return '🏗️'
    } else if (gameType.includes('竞速') || gameType.includes('赛车')) {
      return '🏎️'
    } else if (gameType.includes('冒险') || gameType.includes('探索')) {
      return '🗺️'
    } else {
      return '🎮'
    }
  }

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 shadow-xl">
      <CardContent className="p-0">
        {/* 主推荐区域 */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium opacity-90">AI 智能推荐</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-75">推荐可信度</span>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${formatConfidence(recommendation.confidence)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{formatConfidence(recommendation.confidence)}%</span>
                  </div>
                </div>
              </div>
            </div>
            {/* 生成耗时显示 */}
            {finalTime && (
              <div className="text-right">
                <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>生成用时 {formatTime(finalTime)}秒</span>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="text-4xl mb-2">{getGameTypeIcon(recommendation.gameType)}</div>
            <h2 className="text-2xl font-bold mb-2">{recommendation.recommendedGame}</h2>
            <div className="flex items-center justify-center gap-4 text-sm opacity-90">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{recommendation.gameType || '未知类型'}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>预计 {recommendation.expectedPlaytime || '未知'} 小时</span>
              </div>
            </div>
          </div>
        </div>

        {/* 操作区域 */}
        <div className="p-6 bg-white dark:bg-gray-800">
          <div className="flex gap-3 mb-4">
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {showDetails ? '收起理由' : '查看推荐理由'}
            </Button>
            
            <Button
              onClick={() => setShowAnalysis(!showAnalysis)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {showAnalysis ? '收起分析' : '偏好分析'}
            </Button>
          </div>

          {/* 推荐理由展开区域 */}
          {showDetails && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-emerald-500 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">AI 推荐理由</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                    {recommendation.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 偏好分析展开区域 */}
          {showAnalysis && recommendation.userPreferenceAnalysis && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">您的游戏偏好分析</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                    {recommendation.userPreferenceAnalysis}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// 分析数据卡片组件
interface AnalysisDataCardProps {
  analysisData: AnalysisData
  formatPlaytime: (minutes: number) => number
}

function AnalysisDataCard({ analysisData, formatPlaytime }: AnalysisDataCardProps) {
  return (
    <Card className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          分析基础数据
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              您最常玩的游戏
            </h4>
            <div className="space-y-2">
              {analysisData.topGames.slice(0, 3).map((game) => (
                <div key={game.appId} className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-md">
                  <span className="text-sm font-medium truncate">{game.name}</span>
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {formatPlaytime(game.playtimeForever)}h
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              库存概况
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-800 rounded-md">
                <span className="text-sm">游戏总数</span>
                <span className="font-medium text-blue-600">{analysisData.totalGames}</span>
              </div>
              <div className="text-xs text-gray-500">
                分析时间: {new Date(analysisData.analysisTimestamp).toLocaleString('zh-CN')}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
