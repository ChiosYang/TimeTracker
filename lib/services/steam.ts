import { ProfileResult, SteamApiResponse } from "@/lib/types/steam";
import { getUserSteamConfig } from "@/lib/services/config";

const STEAM_API_ENDPOINT = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/";
const CACHE_REVALIDATE_TIME = 3600; // 1 hour

// 生成简单的用户ID（在实际应用中，你可能需要从认证系统获取）
function generateUserId(): string {
  // 这里使用一个简单的方法生成用户ID
  // 在实际应用中，你应该从认证系统（如NextAuth、Auth0等）获取用户ID
  if (typeof window !== 'undefined') {
    // 客户端：使用localStorage
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', userId);
    }
    return userId;
  } else {
    // 服务器端：使用固定用户ID（演示用）
    return 'default_user';
  }
}

export async function getSteamProfile(userId?: string): Promise<ProfileResult> {
  const actualUserId = userId || generateUserId();
  
  // 首先尝试从环境变量获取配置（向后兼容）
  let STEAM_API_KEY = process.env.STEAM_API_KEY;
  let STEAM_ID = process.env.STEAM_ID;
  
  // 如果环境变量不存在，从KV存储获取用户配置
  if (!STEAM_API_KEY || !STEAM_ID) {
    try {
      const userConfig = await getUserSteamConfig(actualUserId);
      if (userConfig) {
        STEAM_API_KEY = userConfig.steamApiKey;
        STEAM_ID = userConfig.steamId;
      }
    } catch (error) {
      console.error('Failed to get user config from KV:', error);
    }
  }

  // 验证配置
  if (!STEAM_API_KEY || STEAM_API_KEY === "YOUR_STEAM_API_KEY_HERE") {
    console.error("Steam API key is not configured");
    return { error: "Steam API key not configured. Please configure it in the settings." };
  }

  if (!STEAM_ID) {
    console.error("Steam ID is not configured");
    return { error: "Steam ID not configured. Please configure it in the settings." };
  }

  try {
    const response = await fetch(
      `${STEAM_API_ENDPOINT}?key=${STEAM_API_KEY}&steamids=${STEAM_ID}`,
      { 
        next: { revalidate: CACHE_REVALIDATE_TIME, tags: ['steam-profile'] },
        headers: {
          'User-Agent': 'Steam-Dashboard/1.0'
        }
      }
    );

    if (!response.ok) {
      console.error(`Steam API request failed with status: ${response.status}`);
      return { error: `Steam API request failed with status: ${response.status}` };
    }

    const data: SteamApiResponse = await response.json();

    if (!data.response?.players?.length) {
      console.error("No player data found in Steam API response");
      return { error: "No player data found" };
    }

    return data.response.players[0];
  } catch (error) {
    console.error("An unexpected error occurred while fetching from Steam API:", error);
    return { error: "An unexpected error occurred" };
  }
}

// 检查用户是否已配置Steam
export async function checkSteamConfig(userId?: string): Promise<boolean> {
  const actualUserId = userId || generateUserId();
  
  // 检查环境变量
  if (process.env.STEAM_API_KEY && process.env.STEAM_ID) {
    return true;
  }
  
  // 检查KV存储
  try {
    const userConfig = await getUserSteamConfig(actualUserId);
    return userConfig !== null;
  } catch (error) {
    console.error('Failed to check Steam config:', error);
    return false;
  }
}