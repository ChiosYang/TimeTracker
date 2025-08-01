import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedHeroSection } from "./animated-hero-section";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { AIRecommendationCard } from "@/components/ui/ai-recommendation-card";
import { AIChatCard } from "@/components/ui/ai-chat-card";

export function UnauthenticatedHome() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <AnimatedHeroSection />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/login">
              <ShinyButton className="!h-9.5 !px-8 !py-0 text-lg bg-white text-black border hover:bg-gray-50 flex items-center justify-center [&>span]:!text-lg [&>span]:!normal-case [&>span]:!tracking-normal [&>span]:!h-full [&>span]:!flex [&>span]:!items-center [&>span]:!justify-center">
                立即开始
              </ShinyButton>
            </Link>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg"
            >
              <Link href="#features">了解更多</Link>
            </Button>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                AI智能推荐
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                基于游玩历史智能推荐下一款值得体验的游戏
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                游戏库同步
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                一键同步Steam游戏库，自动获取游玩数据
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                数据洞察
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                深度分析游戏偏好，可视化展示游玩统计
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            强大功能特性
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            从游戏发现到深度分析，全方位提升你的游戏体验
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <AIRecommendationCard />
          <AIChatCard />
        </div>

        {/* How it works */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            三步快速上手
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                配置Steam
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                输入Steam API密钥和Steam ID完成配置
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                同步数据
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                一键同步Steam游戏库和游玩数据
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                获取推荐
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                AI分析偏好并推荐值得体验的游戏
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            开始发现你的下一款最爱游戏
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            注册账户，让AI帮你发现Steam游戏库中的隐藏宝藏
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="px-8 py-3 text-lg"
          >
            <Link href="/login">立即免费注册</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
