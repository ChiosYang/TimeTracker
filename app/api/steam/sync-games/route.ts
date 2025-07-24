import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserSteamConfig } from "@/lib/services/config";
import { upsertUserGames, getLastSyncTime, SteamGame } from "@/lib/db/user-games";

interface SteamGamesResponse {
  response: {
    game_count: number;
    games: SteamGame[];
  };
}

interface AppDetailsData {
  header_image?: string;
}

interface AppDetailsResponse {
  success: boolean;
  data?: AppDetailsData;
}

const STEAM_GAMES_API_ENDPOINT = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/";
const STEAM_APP_DETAILS_ENDPOINT = "https://store.steampowered.com/api/appdetails";

async function fetchSteamGames(apiKey: string, steamId: string): Promise<SteamGame[]> {
  const url = new URL(STEAM_GAMES_API_ENDPOINT);
  url.searchParams.append('key', apiKey);
  url.searchParams.append('steamid', steamId);
  url.searchParams.append('format', 'json');
  url.searchParams.append('include_appinfo', 'true');

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Steam API request failed: ${response.status}`);
  }

  const data: SteamGamesResponse = await response.json();
  return data.response?.games || [];
}

async function fetchAppDetails(appId: number): Promise<string | null> {
  const url = new URL(STEAM_APP_DETAILS_ENDPOINT);
  url.searchParams.append('appids', appId.toString());
  url.searchParams.append('filters', 'basic');

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.warn(`Failed to fetch details for app ${appId}: ${response.status}`);
      return null;
    }

    const data: Record<string, AppDetailsResponse> = await response.json();
    const appData = data[appId.toString()];
    
    if (appData?.success && appData.data?.header_image) {
      return appData.data.header_image;
    }
    
    return null;
  } catch (error) {
    console.warn(`Error fetching details for app ${appId}:`, error);
    return null;
  }
}

async function enrichGamesWithDetails(games: SteamGame[]): Promise<SteamGame[]> {
  const enrichedGames = await Promise.allSettled(
    games.map(async (game) => {
      const headerImage = await fetchAppDetails(game.appid);
      return {
        ...game,
        header_image: headerImage || game.header_image
      };
    })
  );

  return enrichedGames
    .filter(
      (result): result is PromiseFulfilledResult<{
        header_image: string | undefined;
        appid: number;
        name: string;
        playtime_forever: number;
        img_icon_url?: string;
        last_played?: number;
      }> => result.status === 'fulfilled'
    )
    .map(result => result.value);
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userConfig = await getUserSteamConfig(userId);

    if (!userConfig?.steamApiKey || !userConfig?.steamId) {
      return NextResponse.json({ error: "Steam API configuration not found" }, { status: 400 });
    }

    // 获取同步选项
    const body = await request.json().catch(() => ({}));
    const forceSync = body.force === true;

    // 检查是否需要同步
    if (!forceSync) {
      const lastSync = await getLastSyncTime(userId);
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      if (lastSync && lastSync > oneHourAgo) {
        return NextResponse.json({
          message: "Games synced recently",
          lastSync: lastSync.toISOString(),
          needsSync: false
        });
      }
    }

    // 从Steam API获取游戏数据
    console.log(`Fetching games for user ${userId}...`);
    const steamGames = await fetchSteamGames(userConfig.steamApiKey, userConfig.steamId);
    
    if (steamGames.length === 0) {
      return NextResponse.json({
        message: "No games found",
        gamesCount: 0,
        syncedAt: new Date().toISOString()
      });
    }

    // 批量获取游戏详情（限制并发数）
    const BATCH_SIZE = 10;
    const enrichedGames: SteamGame[] = [];
    
    for (let i = 0; i < steamGames.length; i += BATCH_SIZE) {
      const batch = steamGames.slice(i, i + BATCH_SIZE);
      const enrichedBatch = await enrichGamesWithDetails(batch);
      enrichedGames.push(...enrichedBatch);
      
      // 添加延迟避免API限制
      if (i + BATCH_SIZE < steamGames.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // 保存到数据库
    await upsertUserGames(userId, enrichedGames);

    return NextResponse.json({
      message: "Games synced successfully",
      gamesCount: enrichedGames.length,
      syncedAt: new Date().toISOString(),
      needsSync: false
    });

  } catch (error) {
    console.error("Error syncing games:", error);
    return NextResponse.json({ 
      error: "Failed to sync games",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const lastSync = await getLastSyncTime(userId);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const needsSync = !lastSync || lastSync < oneHourAgo;

    return NextResponse.json({
      lastSync: lastSync?.toISOString() || null,
      needsSync,
      syncAge: lastSync ? Date.now() - lastSync.getTime() : null
    });

  } catch (error) {
    console.error("Error checking sync status:", error);
    return NextResponse.json({ error: "Failed to check sync status" }, { status: 500 });
  }
}