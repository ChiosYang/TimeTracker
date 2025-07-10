import { ProfileResult, SteamApiResponse } from "@/lib/types/steam";

const STEAM_API_ENDPOINT = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/";
const CACHE_REVALIDATE_TIME = 3600; // 1 hour

export async function getSteamProfile(): Promise<ProfileResult> {
  const STEAM_API_KEY = process.env.STEAM_API_KEY;
  const STEAM_ID = process.env.STEAM_ID;

  // 验证环境变量
  if (!STEAM_API_KEY || STEAM_API_KEY === "YOUR_STEAM_API_KEY_HERE") {
    console.error("Steam API key is not configured");
    return { error: "API key not configured" };
  }

  if (!STEAM_ID) {
    console.error("Steam ID is not configured");
    return { error: "Steam ID not configured" };
  }

  try {
    const response = await fetch(
      `${STEAM_API_ENDPOINT}?key=${STEAM_API_KEY}&steamids=${STEAM_ID}`,
      { 
        next: { revalidate: CACHE_REVALIDATE_TIME },
        headers: {
          'User-Agent': 'Steam-Dashboard/1.0'
        }
      }
    );

    if (!response.ok) {
      console.error(`Steam API request failed with status: ${response.status}`);
      return { error: `API request failed with status: ${response.status}` };
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