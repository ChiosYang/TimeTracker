import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserGamesForRecommendation } from "@/lib/db/user-games";
import { getGameDetails } from "@/lib/services/steam";
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import { env } from 'process';

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
});

interface GameWithDetails {
  appId: number;
  name: string;
  playtimeForever: number;
  genres?: string[];
  shortDescription?: string;
  developers?: string[];
  releaseDate?: string;
}

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const userId = session.user.id;

    // 获取用户游戏数据
    const { topGames, allGames, totalCount } = await getUserGamesForRecommendation(userId);

    if (topGames.length === 0) {
      return NextResponse.json({ 
        error: "您的游戏库中没有足够的游戏数据，请先同步您的Steam游戏库。" 
      }, { status: 400 });
    }

    // 为top5游戏获取详细信息
    const gamesWithDetails: GameWithDetails[] = [];
    
    for (const game of topGames) {
      try {
        const details = await getGameDetails(game.appId.toString());
        
        gamesWithDetails.push({
          appId: game.appId,
          name: game.name,
          playtimeForever: game.playtimeForever,
          genres: details?.genres?.map((g: { description: string }) => g.description) || [],
          shortDescription: details?.short_description || '',
          developers: details?.developers || [],
          releaseDate: details?.release_date?.date || ''
        });
      } catch {
        // 如果获取详情失败，只使用基本信息
        gamesWithDetails.push({
          appId: game.appId,
          name: game.name,
          playtimeForever: game.playtimeForever
        });
      }
    }

    // 构建LLM推荐prompt
    const prompt = buildRecommendationPrompt(gamesWithDetails, allGames, totalCount);

    // 调用LLM获取推荐
    const result = await generateText({
      model: openrouter.chat('moonshotai/kimi-k2:free'),
      prompt: prompt,
      maxTokens: 1000,
    });

    // 解析LLM响应
    let recommendation;
    try {
      recommendation = JSON.parse(result.text);
    } catch {
      // 如果解析失败，返回文本格式
      recommendation = {
        recommendedGame: "推荐分析",
        reason: result.text,
        confidence: 0.8
      };
    }

    return NextResponse.json({
      success: true,
      recommendation,
      analysisData: {
        topGames: gamesWithDetails,
        totalGames: totalCount,
        analysisTimestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("游戏推荐错误:", error);
    return NextResponse.json({ 
      error: "生成推荐时发生错误，请稍后重试。" 
    }, { status: 500 });
  }
}

interface BasicGameInfo {
  appId: number;
  name: string;
  playtimeForever: number;
}

function buildRecommendationPrompt(
  topGames: GameWithDetails[], 
  allGames: BasicGameInfo[], 
  totalCount: number
): string {
  const topGamesInfo = topGames.map(game => {
    const playtimeHours = Math.round(game.playtimeForever / 60);
    return `
游戏名: ${game.name}
游戏时长: ${playtimeHours}小时
类型: ${game.genres?.join(', ') || '未知'}
简介: ${game.shortDescription || '无描述'}
开发商: ${game.developers?.join(', ') || '未知'}
发布日期: ${game.releaseDate || '未知'}`;
  }).join('\n---\n');

  const userLibraryGames = allGames.slice(0, 20).map(game => 
    `${game.name} (${Math.round(game.playtimeForever / 60)}小时)`
  ).join(', ');

  return `你是一个专业的游戏推荐专家。请基于用户的游戏偏好，从他们的Steam游戏库中推荐一个值得深入游玩的游戏。

## 用户游戏偏好分析数据

### 用户最喜爱的5个游戏（按游戏时长排序）：
${topGamesInfo}

### 用户游戏库概况：
- 总游戏数量: ${totalCount}个
- 部分游戏列表: ${userLibraryGames}

## 推荐要求

请分析用户的游戏偏好，重点关注：
1. 用户偏好的游戏类型和风格
2. 开发商和发布商偏好
3. 游戏复杂度和深度偏好
4. 时间投入模式分析

基于以上分析，从用户的游戏库中推荐一个：
- 用户已拥有但游戏时间相对较少的游戏
- 符合用户偏好但可能被忽略的游戏
- 有潜力成为用户新宠的游戏

请以JSON格式回复，包含以下字段：
{
  "recommendedGame": "推荐游戏名称",
  "reason": "详细的推荐理由，解释为什么这个游戏适合用户，基于用户的游戏偏好分析",
  "userPreferenceAnalysis": "用户游戏偏好的总结分析",
  "confidence": 0.85,
  "gameType": "推荐游戏的主要类型",
  "expectedPlaytime": "预计用户可能投入的游戏时长（小时）"
}

注意：
- 推荐理由要具体且个性化
- 要明确说明为什么选择这个游戏而不是其他
- 分析要基于用户的实际游戏历史数据
- 使用中文回复
`;
}