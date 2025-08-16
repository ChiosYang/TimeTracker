import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

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
    
    console.log(`开始批量生成embedding，总共${texts.length}个文本`);
    
    for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        console.log(`处理批次 ${Math.floor(i/batchSize) + 1}/${Math.ceil(texts.length/batchSize)}`);
        
        try {
            const batchResults = await embeddings.embedDocuments(batch);
            results.push(...batchResults);
            
            // 避免触发API速率限制
            if (i + batchSize < texts.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error(`批次 ${Math.floor(i/batchSize) + 1} 处理失败:`, error);
            // 如果批量失败，尝试逐个处理
            for (const text of batch) {
                try {
                    const singleResult = await embeddings.embedQuery(text);
                    results.push(singleResult);
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (singleError) {
                    console.error('单个文本embedding失败:', singleError);
                    // 添加零向量作为占位符
                    results.push(new Array(768).fill(0));
                }
            }
        }
    }
    
    console.log(`批量embedding生成完成，共生成${results.length}个向量`);
    return results;
}

// 单个文本embedding
export async function embedSingleText(text: string): Promise<number[]> {
    try {
        return await embeddings.embedQuery(text);
    } catch (error) {
        console.error('生成embedding失败:', error);
        // 返回零向量作为备选
        return new Array(768).fill(0);
    }
}

// 验证API密钥是否配置正确
export async function testEmbeddingService(): Promise<boolean> {
    try {
        if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY === 'your_google_ai_api_key_here') {
            console.error('Google AI API Key 未配置');
            return false;
        }
        
        const testVector = await embeddings.embedQuery("测试文本");
        console.log(`Embedding服务测试成功，向量维度: ${testVector.length}`);
        return testVector.length === 768;
    } catch (error) {
        console.error('Embedding服务测试失败:', error);
        return false;
    }
}