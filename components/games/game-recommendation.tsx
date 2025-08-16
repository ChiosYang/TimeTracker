'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { SyncDetailsButton } from '@/components/games/sync-details-button'

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
    <div className="space-y-8">
      {/* 极简推荐触发区域 */}
      <div className="text-center py-12">
        <Button 
          onClick={getRecommendation}
          disabled={loading}
          className="relative h-16 px-12 text-lg font-light bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>AI正在思考... {formatTime(elapsedTime)}s</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
              <span>获取推荐</span>
            </div>
          )}
        </Button>
      </div>


      {/* 简化错误状态 */}
      {error && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* 现代化推荐结果 */}
      {recommendation && (
        <div className="space-y-8 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
          <RecommendationCard 
            recommendation={recommendation} 
            formatConfidence={formatConfidence}
            finalTime={finalTime}
            formatTime={formatTime}
          />
          
          {/* 分析数据展示 */}
          {analysisData && (
            <div className="opacity-0 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards]">
              <AnalysisDataCard 
                analysisData={analysisData}
                formatPlaytime={formatPlaytime}
              />
            </div>
          )}
        </div>
      )}

      {/* 同步按钮 - 始终显示在底部 */}
      <div className="text-center py-8 border-t border-slate-200 dark:border-slate-700">
        <div className="mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            游戏库数据同步
          </p>
          <SyncDetailsButton />
        </div>
      </div>
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

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
      {/* 极简主推荐区域 */}
      <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800">
        <div className="mb-6">
          <h2 className="text-3xl font-light text-slate-900 dark:text-slate-100 mb-2">
            {recommendation.recommendedGame}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {recommendation.gameType || '精选推荐'}
          </p>
        </div>

        {/* 简化的可信度指示器 */}
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-20 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-900 dark:bg-slate-100 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${formatConfidence(recommendation.confidence)}%` }}
              />
            </div>
            <span className="font-medium">{formatConfidence(recommendation.confidence)}% 匹配</span>
          </div>
          {finalTime && (
            <span className="text-xs">
              {formatTime(finalTime)}s
            </span>
          )}
        </div>
      </div>

      {/* 极简操作区域 */}
      <div className="p-6">
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showDetails ? '收起' : '理由'}
          </button>
          
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {showAnalysis ? '收起' : '分析'}
          </button>
        </div>

        {/* 极简展开内容 */}
        {showDetails && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {recommendation.reason}
            </p>
          </div>
        )}

        {showAnalysis && recommendation.userPreferenceAnalysis && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {recommendation.userPreferenceAnalysis}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// 分析数据卡片组件
interface AnalysisDataCardProps {
  analysisData: AnalysisData
  formatPlaytime: (minutes: number) => number
}

function AnalysisDataCard({ analysisData, formatPlaytime }: AnalysisDataCardProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6">
      <h3 className="text-lg font-light text-slate-900 dark:text-slate-100 mb-4 text-center">
        基于您的游戏偏好
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            常玩游戏
          </h4>
          {analysisData.topGames.slice(0, 3).map((game) => (
            <div key={game.appId} className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-800 dark:text-slate-200 truncate pr-4">
                {game.name}
              </span>
              <span className="text-xs text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-md shrink-0">
                {formatPlaytime(game.playtimeForever)}h
              </span>
            </div>
          ))}
        </div>
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
            库存概况
          </h4>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-slate-800 dark:text-slate-200">游戏总数</span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {analysisData.totalGames}
            </span>
          </div>
          <div className="text-xs text-slate-500 pt-2">
            {new Date(analysisData.analysisTimestamp).toLocaleDateString('zh-CN')}
          </div>
        </div>
      </div>
    </div>
  )
}
