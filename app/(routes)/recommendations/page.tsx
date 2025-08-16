import { GameRecommendation } from "@/components/games/game-recommendation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function RecommendationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        {/* 简化的页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-foreground mb-4 tracking-tight">
            发现新游戏
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            基于AI的智能推荐
          </p>
        </div>

        {/* 主要推荐组件 */}
        <GameRecommendation />

        {/* 简化的提示信息 */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            首次使用需要同步游戏库数据以获得个性化推荐
          </p>
        </div>
      </div>
    </main>
  );
}
