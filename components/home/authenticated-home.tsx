'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

interface GameStats {
  totalGames?: number
  totalPlaytime?: number
  topGame?: {
    name: string
    playtime: number
  }
  lastSync?: string
}

interface AuthenticatedHomeProps {
  user: User
  gameStats?: GameStats | null
}

export function AuthenticatedHome({ user, gameStats }: AuthenticatedHomeProps) {
  const formatPlaytime = (minutes: number) => {
    const hours = Math.round(minutes / 60)
    return hours
  }

  const getInitials = (name?: string | null, email?: string | null): string => {
    if (name) {
      const words = name.trim().split(" ")
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase()
      }
      return words[0].substring(0, 2).toUpperCase()
    }

    if (email) {
      return email.substring(0, 2).toUpperCase()
    }

    return "U"
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-white/20">
                  <AvatarImage 
                    src={user.image || undefined} 
                    alt={user.name || user.email || "User"} 
                  />
                  <AvatarFallback className="bg-white/20 text-white text-lg font-bold">
                    {getInitials(user.name, user.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                    欢迎回来，{user.name || "玩家"}！
                  </h1>
                  <p className="text-blue-100 opacity-90">
                    准备发现你的下一款最爱游戏了吗？
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        {gameStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  游戏总数
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {gameStats.totalGames || 0}
                </div>
                <p className="text-sm text-gray-500 mt-1">款游戏</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  总游玩时长
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {gameStats.totalPlaytime ? formatPlaytime(gameStats.totalPlaytime) : 0}
                </div>
                <p className="text-sm text-gray-500 mt-1">小时</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  最爱游戏
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-purple-600 truncate">
                  {gameStats.topGame?.name || "暂无数据"}
                </div>
                {gameStats.topGame && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatPlaytime(gameStats.topGame.playtime)} 小时
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI 游戏推荐
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                基于你的游戏偏好，AI 将为你推荐最适合的下一款游戏
              </p>
              <Button asChild className="w-full" size="lg">
                <Link href="/recommendations">
                  获取 AI 推荐
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                AI 对话助手
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                与 AI 自由对话，获取游戏建议、攻略指导或任何其他帮助
              </p>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/chat">
                  开始对话
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              快速导航
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link href="/games">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-sm">游戏库</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link href="/dashboard">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm">个人资料</span>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-20 flex-col gap-2">
                <Link href="/config">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">设置</span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex-col gap-2"
                onClick={() => window.location.reload()}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm">刷新数据</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {gameStats?.lastSync && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">最近活动</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>
                  最后同步时间: {new Date(gameStats.lastSync).toLocaleString('zh-CN')}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}