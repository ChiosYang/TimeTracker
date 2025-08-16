import { GameRecommendation } from "@/components/games/game-recommendation";
import { SyncDetailsButton } from "@/components/games/sync-details-button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function RecommendationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          下一款游戏玩什么？
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          基于RAG技术的智能推荐系统，为您提供更精准的游戏推荐
        </p>
      </div>

      {/* RAG同步控制面板 */}
      <div className="mb-8">
        <SyncDetailsButton />
      </div>

      {/* 主要推荐组件 */}
      <GameRecommendation />

      {/* 功能说明卡片 */}
      <div className="mt-12 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-6 mb-8 border border-indigo-200 dark:border-indigo-800">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
              RAG智能推荐系统工作原理
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-800 dark:text-indigo-200">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>使用Gemini Embedding向量化游戏信息</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>基于语义相似度检索相关游戏</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>结合用户偏好进行智能分析</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>LangChain驱动的推荐生成</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 底部说明 */}
      <div className="mt-12 text-center">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
            推荐提示
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <p>• RAG推荐需要先同步游戏库详情，首次使用请点击上方&ldquo;开始同步&rdquo;</p>
            <p>• 使用Google Gemini和LangChain技术，完全免费且推荐质量更高</p>
            <p>• 建议定期同步最新游戏信息，获得更精准的推荐结果</p>
          </div>
        </div>
      </div>
    </main>
  );
}
