import { auth } from "@/auth";
import { getGameStats } from "@/lib/db/user-games";
import { UnauthenticatedHome } from "@/components/home/unauthenticated-home";
import { AuthenticatedHome } from "@/components/home/authenticated-home";

export default async function HomePage() {
  const session = await auth();

  // 如果用户未登录，显示营销页面
  if (!session?.user?.id) {
    return <UnauthenticatedHome />;
  }

  // 获取用户游戏统计数据
  let gameStats = null;
  try {
    gameStats = await getGameStats(session.user.id);
  } catch (error) {
    console.error("Failed to fetch game stats:", error);
    // 即使数据获取失败，也要显示已登录页面
  }

  return (
    <AuthenticatedHome 
      user={session.user}
      gameStats={gameStats}
    />
  );
}
