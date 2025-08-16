import { sql } from '@/lib/db/connection';
import { getGameDetails } from '@/lib/services/steam';
import { embedSingleText } from '@/lib/services/embedding_service';
import { getUserGames } from '@/lib/db/user-games';

// 游戏详情接口
interface GenreItem {
  description: string;
}

interface CategoryItem {
  description: string;
}

interface GameDetails {
  steam_appid: number;
  name: string;
  detailed_description?: string;
  short_description?: string;
  genres?: GenreItem[];
  categories?: CategoryItem[];
  developers?: string[];
  publishers?: string[];
  metacritic?: { score: number };
  release_date?: { date: string };
  header_image?: string;
}

// 构建用于embedding的文本
function buildEmbeddingText(details: GameDetails): string {
  const genres = details.genres?.map((g: GenreItem) => g.description).join(', ') || '未知';
  const tags = details.categories?.map((c: CategoryItem) => c.description).join(', ') || '';
  const developers = details.developers?.join(', ') || '未知';
  const description = details.short_description || '';
  
  return `
游戏名称: ${details.name}
类型: ${genres}
标签: ${tags}
开发商: ${developers}
简介: ${description}
  `.trim();
}

// 同步单个游戏的详情和embedding
export async function syncAndEmbedGame(appId: number): Promise<void> {
  console.log(`开始同步游戏: ${appId}`);
  
  try {
    // 获取游戏详情
    const details = await getGameDetails(appId.toString());
    if (!details || !details.name) {
      console.log(`获取游戏 ${appId} 详情失败或数据不完整`);
      return;
    }

    // 构建embedding文本
    const textToEmbed = buildEmbeddingText(details);
    console.log(`为游戏 ${appId} 生成embedding文本: ${textToEmbed.substring(0, 100)}...`);
    
    // 生成向量
    const vector = await embedSingleText(textToEmbed);
    console.log(`为游戏 ${appId} 生成向量成功，维度: ${vector.length}`);

    // 将向量转换为PostgreSQL格式
    const vectorString = `[${vector.join(',')}]`;

    // 存储到数据库
    await sql`
        INSERT INTO game_details (
            app_id, name, description, short_description, genres, tags,
            developer, publisher, metacritic_score, release_date, header_image, embedding
        )
        VALUES (
            ${details.steam_appid}, 
            ${details.name}, 
            ${details.detailed_description || null},
            ${details.short_description || null}, 
            ${JSON.stringify(details.genres?.map((g: GenreItem) => g.description) || [])},
            ${JSON.stringify(details.categories?.map((c: CategoryItem) => c.description) || [])},
            ${details.developers?.join(', ') || null}, 
            ${details.publishers?.join(', ') || null},
            ${details.metacritic?.score || null}, 
            ${details.release_date?.date || null},
            ${details.header_image || null}, 
            ${vectorString}::vector
        )
        ON CONFLICT (app_id) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            short_description = EXCLUDED.short_description,
            genres = EXCLUDED.genres,
            tags = EXCLUDED.tags,
            developer = EXCLUDED.developer,
            publisher = EXCLUDED.publisher,
            metacritic_score = EXCLUDED.metacritic_score,
            release_date = EXCLUDED.release_date,
            header_image = EXCLUDED.header_image,
            embedding = EXCLUDED.embedding,
            last_updated = NOW()
    `;
    
    console.log(`游戏 ${appId} 数据已成功存入数据库`);

  } catch (error) {
    console.error(`同步游戏 ${appId} 失败:`, error);
    throw error;
  }
}

// 同步用户整个游戏库
export async function syncUserLibrary(userId: string): Promise<{
  success: number;
  failed: number;
  total: number;
}> {
  console.log(`开始为用户 ${userId} 同步游戏库...`);
  
  try {
    // 获取用户所有游戏
    const { games } = await getUserGames(userId, 5000, 0);
    console.log(`为用户 ${userId} 找到 ${games.length} 个游戏`);

    if (games.length === 0) {
      console.log('用户游戏库为空，无需同步');
      return { success: 0, failed: 0, total: 0 };
    }

    let successCount = 0;
    let failedCount = 0;
    
    // 批量处理，避免API限制
    const batchSize = 3; // 减少并发数以避免API限制
    
    for (let i = 0; i < games.length; i += batchSize) {
      const batch = games.slice(i, i + batchSize);
      console.log(`处理批次 ${Math.floor(i/batchSize) + 1}/${Math.ceil(games.length/batchSize)}`);
      
      // 并行处理当前批次
      const batchPromises = batch.map(async (game) => {
        try {
          await syncAndEmbedGame(game.appId);
          successCount++;
          return { appId: game.appId, success: true };
        } catch (error) {
          console.error(`游戏 ${game.appId} 同步失败:`, error);
          failedCount++;
          return { appId: game.appId, success: false, error };
        }
      });

      await Promise.all(batchPromises);
      
      // 批次间延迟，避免触发速率限制
      if (i + batchSize < games.length) {
        console.log('等待2秒避免API限制...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`用户 ${userId} 游戏库同步完成: ${successCount} 成功, ${failedCount} 失败`);
    
    return {
      success: successCount,
      failed: failedCount,
      total: games.length
    };

  } catch (error) {
    console.error(`用户 ${userId} 游戏库同步过程出错:`, error);
    throw error;
  }
}

// 检查游戏是否已经同步
export async function isGameSynced(appId: number): Promise<boolean> {
  try {
    const rows = await sql`
      SELECT app_id FROM game_details WHERE app_id = ${appId}
    `;
    return rows.length > 0;
  } catch (error) {
    console.error(`检查游戏 ${appId} 同步状态失败:`, error);
    return false;
  }
}

// 获取已同步的游戏数量
export async function getSyncedGamesCount(): Promise<number> {
  try {
    const rows = await sql`
      SELECT COUNT(*) as count FROM game_details
    `;
    return parseInt(rows[0].count) || 0;
  } catch (error) {
    console.error('获取已同步游戏数量失败:', error);
    return 0;
  }
}

// 删除指定游戏的详情数据
export async function deleteGameDetails(appId: number): Promise<void> {
  try {
    await sql`
      DELETE FROM game_details WHERE app_id = ${appId}
    `;
    console.log(`已删除游戏 ${appId} 的详情数据`);
  } catch (error) {
    console.error(`删除游戏 ${appId} 详情数据失败:`, error);
    throw error;
  }
}