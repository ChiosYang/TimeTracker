import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export interface UserGame {
  id: number;
  userId: string;
  appId: number;
  name: string;
  playtimeForever: number;
  imgIconUrl?: string;
  headerImage?: string;
  lastPlayed?: Date;
  syncedAt: Date;
  updatedAt: Date;
}

export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url?: string;
  header_image?: string;
  last_played?: number;
}

export async function getUserGames(userId: string, limit = 20, offset = 0): Promise<{ games: UserGame[], total: number }> {
  const countRows = await sql`
    SELECT COUNT(*) as count 
    FROM user_games 
    WHERE user_id = ${userId}
  `;
  
  const total = parseInt(countRows[0].count);
  
  const rows = await sql`
    SELECT 
      id,
      user_id as "userId",
      app_id as "appId", 
      name,
      playtime_forever as "playtimeForever",
      img_icon_url as "imgIconUrl",
      header_image as "headerImage",
      last_played as "lastPlayed",
      synced_at as "syncedAt",
      updated_at as "updatedAt"
    FROM user_games 
    WHERE user_id = ${userId}
    ORDER BY playtime_forever DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
  
  return {
    games: rows as UserGame[],
    total
  };
}

export async function upsertUserGames(userId: string, games: SteamGame[]): Promise<void> {
  if (games.length === 0) return;

  const values = games.map(game => [
    userId,
    game.appid,
    game.name,
    game.playtime_forever,
    game.img_icon_url || null,
    game.header_image || null,
    game.last_played ? new Date(game.last_played * 1000) : null
  ]);

  const placeholders = values.map((_, index) => {
    const base = index * 7;
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7})`;
  }).join(', ');

  const flatValues = values.flat();

  await sql.query(`
    INSERT INTO user_games (
      user_id, app_id, name, playtime_forever, 
      img_icon_url, header_image, last_played
    ) VALUES ${placeholders}
    ON CONFLICT (user_id, app_id) 
    DO UPDATE SET
      name = EXCLUDED.name,
      playtime_forever = EXCLUDED.playtime_forever,
      img_icon_url = EXCLUDED.img_icon_url,
      header_image = EXCLUDED.header_image,
      last_played = EXCLUDED.last_played,
      updated_at = NOW()
  `, flatValues);
}

export async function getLastSyncTime(userId: string): Promise<Date | null> {
  const rows = await sql`
    SELECT MAX(synced_at) as last_sync
    FROM user_games 
    WHERE user_id = ${userId}
  `;
  
  return rows[0]?.last_sync ? new Date(rows[0].last_sync) : null;
}

export async function deleteUserGame(userId: string, appId: number): Promise<void> {
  await sql`
    DELETE FROM user_games 
    WHERE user_id = ${userId} AND app_id = ${appId}
  `;
}

export async function getUserGameByAppId(userId: string, appId: number): Promise<UserGame | null> {
  const rows = await sql`
    SELECT 
      id,
      user_id as "userId",
      app_id as "appId", 
      name,
      playtime_forever as "playtimeForever",
      img_icon_url as "imgIconUrl",
      header_image as "headerImage",
      last_played as "lastPlayed",
      synced_at as "syncedAt",
      updated_at as "updatedAt"
    FROM user_games 
    WHERE user_id = ${userId} AND app_id = ${appId}
  `;
  
  return rows[0] as UserGame || null;
}

export async function getTopUserGames(userId: string, limit = 5): Promise<UserGame[]> {
  const rows = await sql`
    SELECT 
      id,
      user_id as "userId",
      app_id as "appId", 
      name,
      playtime_forever as "playtimeForever",
      img_icon_url as "imgIconUrl",
      header_image as "headerImage",
      last_played as "lastPlayed",
      synced_at as "syncedAt",
      updated_at as "updatedAt"
    FROM user_games 
    WHERE user_id = ${userId} AND playtime_forever > 0
    ORDER BY playtime_forever DESC
    LIMIT ${limit}
  `;
  
  return rows as UserGame[];
}

export async function getUserGamesForRecommendation(userId: string): Promise<{
  topGames: UserGame[];
  allGames: UserGame[];
  totalCount: number;
}> {
  // 获取用户时长最高的5个游戏
  const topGames = await getTopUserGames(userId, 5);
  
  // 获取用户所有游戏的基本信息（用于推荐时排除）
  const allGamesRows = await sql`
    SELECT 
      app_id as "appId", 
      name,
      playtime_forever as "playtimeForever"
    FROM user_games 
    WHERE user_id = ${userId}
    ORDER BY playtime_forever DESC
  `;
  
  const countRows = await sql`
    SELECT COUNT(*) as count 
    FROM user_games 
    WHERE user_id = ${userId}
  `;
  
  return {
    topGames,
    allGames: allGamesRows as UserGame[],
    totalCount: parseInt(countRows[0].count)
  };
}