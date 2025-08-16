import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSimpleRagRecommendation, isRagServiceReady } from "@/lib/rag/simple_recommendation";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权访问" }, { status: 401 });
    }

    const userId = session.user.id;

    // 检查RAG服务是否就绪
    const serviceStatus = await isRagServiceReady();
    if (!serviceStatus.ready) {
      return NextResponse.json({
        error: "推荐服务未就绪",
        suggestion: "请先同步游戏库详情，然后重试",
        syncedCount: serviceStatus.gameCount
      }, { status: 503 });
    }

    // 调用简化RAG推荐服务
    const ragResult = await getSimpleRagRecommendation(userId);

    return NextResponse.json({
      success: true,
      recommendation: ragResult.recommendation,
      metadata: {
        ...ragResult.metadata,
        syncedGamesCount: serviceStatus.gameCount,
        method: "SimpleRAG",
        version: "1.1"
      }
    });

  } catch (error) {
    console.error("RAG游戏推荐错误:", error);
    
    // 简化错误处理
    const getErrorInfo = (error: unknown) => {
      if (error instanceof Error) {
        if (error.message.includes("游戏库为空")) {
          return { message: "您的游戏库为空或未同步，请先同步Steam游戏库", status: 400 };
        }
        if (error.message.includes("API")) {
          return { message: "AI服务暂时不可用，请稍后重试", status: 503 };
        }
        return { message: error.message, status: 500 };
      }
      return { message: "生成推荐时发生未知错误", status: 500 };
    };
    
    const errorInfo = getErrorInfo(error);
    return NextResponse.json({ 
      error: errorInfo.message
    }, { status: errorInfo.status });
  }
}

