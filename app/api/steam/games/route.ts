import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserSteamConfig } from "@/lib/services/config";

// Define the game data structure
interface Game {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  header_image?: string; // For the store's main image
}

// Define an interface for the structure of a single appdetails API response
interface AppDetailsData {
  header_image?: string;
  // Add other fields from the 'data' object if you need them for type safety
  // e.g., name?: string; type?: string; etc.
}

interface AppDetailsResponse {
  success: boolean;
  data?: AppDetailsData;
}

const STEAM_GAMES_API_ENDPOINT = "http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/";
const STEAM_APP_DETAILS_ENDPOINT = "https://store.steampowered.com/api/appdetails";
const CACHE_REVALIDATE_TIME = 3600; // 1 hour

// Fetches details for a single appid
async function fetchAppDetails(appid: number, userId: string) {
  const appDetailsUrl = new URL(STEAM_APP_DETAILS_ENDPOINT);
  appDetailsUrl.searchParams.append('appids', appid.toString()); // Request only one appid
  appDetailsUrl.searchParams.append('filters', 'basic'); // Add filter for basic info

  try {
    const response = await fetch(appDetailsUrl.toString(), {
      next: { revalidate: CACHE_REVALIDATE_TIME, tags: [`steam-details-${userId}-${appid}`] }, // Tag with specific appid
    });

    if (response.ok) {
      const data: Record<string, AppDetailsResponse> = await response.json();
      if (data && data[appid.toString()] && data[appid.toString()].success) {
        return { [appid.toString()]: data[appid.toString()] }; // Return object with appid as key
      } else {
        console.error(`App details for appid ${appid} not successful or data missing.`);
      }
    } else {
      console.error(`App details request failed for appid ${appid} with status: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error(`App details error response for appid ${appid}: ${errorText}`);
    }
  } catch (error) {
    console.error(`Failed to fetch app details for appid ${appid}`, error);
  }
  return {}; // Return empty object on failure
}

export async function GET(request: NextRequest) {
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

    // Get pagination parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10); // Default to 20 games per page
    const offset = parseInt(searchParams.get('offset') || '0', 10); // Default to start from 0

    // Step 1: Get the list of owned games (all of them first to get total count)
    const ownedGamesUrl = new URL(STEAM_GAMES_API_ENDPOINT);
    ownedGamesUrl.searchParams.append('key', userConfig.steamApiKey);
    ownedGamesUrl.searchParams.append('steamid', userConfig.steamId);
    ownedGamesUrl.searchParams.append('format', 'json');
    ownedGamesUrl.searchParams.append('include_appinfo', 'true');

    const ownedGamesResponse = await fetch(ownedGamesUrl.toString(), {
      next: { revalidate: CACHE_REVALIDATE_TIME, tags: [`steam-games-${userId}`] },
    });

    if (!ownedGamesResponse.ok) {
      throw new Error(`Steam GetOwnedGames API request failed: ${ownedGamesResponse.status}`);
    }

    const ownedGamesData = await ownedGamesResponse.json();
    if (!ownedGamesData.response?.games) {
      return NextResponse.json({ response: { game_count: 0, games: [] } });
    }

    const allGames: Game[] = ownedGamesData.response.games; // Get all games first
    const totalGameCount = allGames.length;

    // Apply pagination to the list of appids
    const paginatedAppids = allGames.slice(offset, offset + limit).map(game => game.appid);

    if (paginatedAppids.length === 0) {
      return NextResponse.json({ response: { game_count: totalGameCount, games: [] } });
    }

    // Step 2: Fetch game details for each appid individually for the paginated slice
    const allDetailsPromises = paginatedAppids.map(appid => fetchAppDetails(appid, userId));

    const allDetailsResults = await Promise.allSettled(allDetailsPromises);

    const appDetailsData: Record<string, AppDetailsResponse> = allDetailsResults.reduce((acc: Record<string, AppDetailsResponse>, result) => {
      if (result.status === 'fulfilled' && result.value) {
        return { ...acc, ...result.value };
      }
      return acc;
    }, {});

    // Step 3: Merge the data for the paginated games
    const mergedGames = allGames.slice(offset, offset + limit).map(game => {
      const details = appDetailsData[game.appid.toString()];
      if (details?.success && details.data?.header_image) {
        return {
          ...game,
          header_image: details.data.header_image,
        };
      }
      return game;
    });

    // Step 4: Return the combined data with total count
    return NextResponse.json({
      response: {
        game_count: totalGameCount,
        games: mergedGames,
      },
    });

  } catch (error) {
    console.error("An unexpected error occurred while fetching Steam games:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}