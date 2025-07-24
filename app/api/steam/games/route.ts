import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserGames, UserGame } from "@/lib/db/user-games";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 获取分页参数
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // 从本地数据库获取游戏数据
    const { games, total } = await getUserGames(userId, limit, offset);

    // 转换为前端期望的格式
    const formattedGames = games.map((game: UserGame) => ({
      appid: game.appId,
      name: game.name,
      playtime_forever: game.playtimeForever,
      img_icon_url: game.imgIconUrl || '',
      header_image: game.headerImage,
      last_played: game.lastPlayed ? Math.floor(game.lastPlayed.getTime() / 1000) : undefined
    }));

    return NextResponse.json({
      response: {
        game_count: total,
        games: formattedGames,
      },
    });

  } catch (error) {
    console.error("Error fetching user games:", error);
    return NextResponse.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}