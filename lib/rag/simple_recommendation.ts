import { sql } from '@/lib/db/connection';
import { ChatOpenAI } from '@langchain/openai';
import { embedSingleText } from '@/lib/services/embedding_service';
import { getTopUserGames } from '@/lib/db/user-games';

// 使用免费的Kimi模型
const llm = new ChatOpenAI({
    modelName: "moonshotai/kimi-k2:free",
    temperature: 0.7,
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: { 
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": process.env.AUTH_URL || "http://localhost:3000",
        }
    },
});

// 直接使用SQL进行向量相似度搜索
async function searchSimilarGames(queryText: string, limit = 10) {
    try {
        // 生成查询向量
        const queryVector = await embedSingleText(queryText);
        const vectorString = `[${queryVector.join(',')}]`;
        
        // 使用余弦相似度搜索
        const results = await sql`
            SELECT 
                name,
                short_description,
                genres,
                developer,
                1 - (embedding <=> ${vectorString}::vector) as similarity
            FROM game_details 
            WHERE embedding IS NOT NULL
            ORDER BY embedding <=> ${vectorString}::vector
            LIMIT ${limit}
        `;
        
        return results;
        
    } catch (error) {
        console.error('向量搜索失败:', error);
        return [];
    }
}

// 简化版RAG推荐
export async function getSimpleRagRecommendation(userId: string) {
    try {
        // 获取用户最喜欢的游戏
        const topGames = await getTopUserGames(userId, 5);
        if (topGames.length === 0) {
            throw new Error("用户游戏库为空，无法生成推荐");
        }

        // 构建用户偏好查询
        const userPreference = `用户喜欢的游戏类型包括：${topGames.map(game => game.name).join('、')}`;
        
        // 搜索相似游戏
        const similarGames = await searchSimilarGames(userPreference, 15);
        
        if (similarGames.length === 0) {
            throw new Error("未找到相似游戏，可能向量数据有问题");
        }

        // 构建上下文
        const context = similarGames.map(game => 
            `游戏: ${game.name}\n描述: ${game.short_description}\n类型: ${game.genres}\n开发商: ${game.developer}\n相似度: ${(game.similarity * 100).toFixed(1)}%`
        ).join('\n\n');

        // 生成推荐
        const prompt = `你是专业的游戏推荐专家。基于用户的游戏偏好和以下相似游戏，推荐一个最适合的游戏。

用户偏好：
${userPreference}

相似游戏库：
${context}

请推荐一个游戏并说明理由，以JSON格式回复：
{
  "recommendedGame": "推荐的游戏名称",
  "reason": "详细推荐理由",
  "confidence": 0.85,
  "gameType": "游戏类型",
  "similarity": "与用户偏好的相似度分析"
}

要求：
1. 推荐的游戏必须在上述相似游戏库中
2. 详细解释为什么推荐这个游戏
3. 使用中文回复`;

        const response = await llm.invoke(prompt);
        
        // 简化JSON解析
        const parseResponse = (content: string) => {
            try {
                return JSON.parse(content);
            } catch {
                return {
                    recommendedGame: "推荐分析",
                    reason: content,
                    confidence: 0.8,
                    gameType: "基于相似度分析",
                    similarity: "高相似度匹配"
                };
            }
        };
        
        const recommendation = parseResponse(response.content as string);

        // 将similarity字段映射为userPreferenceAnalysis，以匹配前端期望
        const mappedRecommendation = {
            ...recommendation,
            userPreferenceAnalysis: recommendation.similarity
        };

        return {
            recommendation: mappedRecommendation,
            metadata: {
                userTopGames: topGames.map(g => ({ name: g.name, hours: Math.round(g.playtimeForever / 60) })),
                similarGamesFound: similarGames.length,
                maxSimilarity: similarGames[0]?.similarity || 0,
                generatedAt: new Date().toISOString()
            }
        };

    } catch (error) {
        console.error('简化RAG推荐失败:', error);
        throw error;
    }
}

// 检查RAG服务是否就绪（仅检查数据）
export async function isRagServiceReady(): Promise<{ ready: boolean; gameCount: number }> {
    try {
        const results = await sql`SELECT COUNT(*) as count FROM game_details WHERE embedding IS NOT NULL`;
        const gameCount = parseInt(results[0].count) || 0;
        return { ready: gameCount > 0, gameCount };
    } catch (error) {
        console.error('RAG服务检查失败:', error);
        return { ready: false, gameCount: 0 };
    }
}