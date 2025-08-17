import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { getSimpleRagRecommendation, isRagServiceReady } from "@/lib/rag/simple_recommendation";
import { apiResponse } from "@/lib/utils/api-response";
import { createError } from "@/lib/utils/error-handler";
import { log } from "@/lib/utils/logger";

export async function POST() {
  const startTime = Date.now();
  
  try {
    log.api.request('POST', '/api/games/recommendation');
    
    const session = await auth();
    if (!session?.user?.id) {
      throw createError.unauthorized();
    }

    const userId = session.user.id;
    log.user('请求RAG游戏推荐', userId);

    // 检查RAG服务是否就绪
    const serviceStatus = await isRagServiceReady();
    if (!serviceStatus.ready) {
      throw createError.ragUnavailable(
        `推荐服务未就绪，请先同步游戏库详情。当前已同步${serviceStatus.gameCount}个游戏`
      );
    }

    // 调用简化RAG推荐服务
    const ragResult = await getSimpleRagRecommendation(userId);

    const responseData = {
      success: true,
      recommendation: ragResult.recommendation,
      analysisData: {
        topGames: ragResult.metadata.userTopGames,
        totalGames: serviceStatus.gameCount,
        analysisTimestamp: new Date().toISOString()
      }
    };

    const duration = Date.now() - startTime;
    log.api.response('POST', '/api/games/recommendation', 200, duration, {
      userId,
      similarGamesFound: ragResult.metadata.similarGamesFound
    });

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    const duration = Date.now() - startTime;
    log.api.response('POST', '/api/games/recommendation', 500, duration);
    
    return apiResponse.error(error as Error);
  }
}

