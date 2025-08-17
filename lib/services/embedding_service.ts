import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { log } from "@/lib/utils/logger";

// 创建Gemini embedding实例
export const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_AI_API_KEY!,
    modelName: "embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
});

// 批量生成embedding，处理Gemini API的批处理限制
export async function batchEmbed(texts: string[]): Promise<number[][]> {
    const batchSize = 100; // Gemini API批处理限制
    const results: number[][] = [];
    
    log.info('开始批量生成embedding', { totalTexts: texts.length, batchSize });
    
    for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        const currentBatch = Math.floor(i/batchSize) + 1;
        const totalBatches = Math.ceil(texts.length/batchSize);
        log.debug('处理embedding批次', { currentBatch, totalBatches, batchTexts: batch.length });
        
        try {
            const batchResults = await embeddings.embedDocuments(batch);
            results.push(...batchResults);
            
            // 避免触发API速率限制
            if (i + batchSize < texts.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            const batchNumber = Math.floor(i/batchSize) + 1;
            log.warn('批量embedding失败，尝试逐个处理', { batchNumber, batchSize: batch.length, error: error instanceof Error ? error.message : String(error) });
            // 如果批量失败，尝试逐个处理
            for (const text of batch) {
                try {
                    const singleResult = await embeddings.embedQuery(text);
                    results.push(singleResult);
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (singleError) {
                    log.error('单个文本embedding失败', singleError, { textLength: text.length });
                    // 添加零向量作为占位符
                    results.push(new Array(768).fill(0));
                }
            }
        }
    }
    
    log.info('批量embedding生成完成', { 
        totalVectors: results.length, 
        expectedVectors: texts.length, 
        success: results.length === texts.length 
    });
    return results;
}

// 单个文本embedding
export async function embedSingleText(text: string): Promise<number[]> {
    try {
        return await embeddings.embedQuery(text);
    } catch (error) {
        log.error('单个embedding生成失败', error, { textLength: text.length });
        // 返回零向量作为备选
        return new Array(768).fill(0);
    }
}

// 验证API密钥是否配置正确
export async function testEmbeddingService(): Promise<boolean> {
    try {
        if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY === 'your_google_ai_api_key_here') {
            log.error('Google AI API Key未配置');
            return false;
        }
        
        const testVector = await embeddings.embedQuery("测试文本");
        log.info('Embedding服务测试成功', { vectorDimension: testVector.length });
        return testVector.length === 768;
    } catch (error) {
        log.error('Embedding服务测试失败', error);
        return false;
    }
}