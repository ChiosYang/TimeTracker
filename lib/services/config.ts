import { sql } from '@/lib/db/connection';
import { ConfigFormData, ConfigValidationResult } from '@/lib/types/steam';

// 简单的加密函数（实际生产环境建议使用更强的加密）
function encrypt(text: string): string {
  // 这里使用简单的Base64编码，实际应使用crypto模块
  return Buffer.from(text).toString('base64');
}

function decrypt(encryptedText: string): string {
  return Buffer.from(encryptedText, 'base64').toString('utf-8');
}

// 保存用户Steam配置
export async function saveUserSteamConfig(
  userId: string, 
  config: ConfigFormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // 验证配置
    const validation = validateSteamConfig(config);
    if (!validation.isValid) {
      return { 
        success: false, 
        error: Object.values(validation.errors).join(', ') 
      };
    }

    const encryptedApiKey = encrypt(config.steamApiKey);

    // 使用 UPSERT 语法插入或更新配置
    await sql`
      INSERT INTO user_steam_configs (user_id, steam_api_key, steam_id)
      VALUES (${userId}, ${encryptedApiKey}, ${config.steamId})
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        steam_api_key = ${encryptedApiKey},
        steam_id = ${config.steamId},
        updated_at = CURRENT_TIMESTAMP
    `;

    return { success: true };
  } catch (error) {
    console.error('Failed to save Steam config:', error);
    return { 
      success: false, 
      error: 'Failed to save configuration' 
    };
  }
}

// 获取用户Steam配置
export async function getUserSteamConfig(userId: string): Promise<ConfigFormData | null> {
  try {
    const result = await sql`
      SELECT steam_api_key, steam_id 
      FROM user_steam_configs 
      WHERE user_id = ${userId}
      LIMIT 1
    `;
    
    if (!result.length) {
      return null;
    }

    const config = result[0];
    return {
      steamApiKey: decrypt(config.steam_api_key),
      steamId: config.steam_id
    };
  } catch (error) {
    console.error('Failed to get Steam config:', error);
    return null;
  }
}

// 删除用户Steam配置
export async function deleteUserSteamConfig(userId: string): Promise<boolean> {
  try {
    await sql`
      DELETE FROM user_steam_configs 
      WHERE user_id = ${userId}
    `;
    return true;
  } catch (error) {
    console.error('Failed to delete Steam config:', error);
    return false;
  }
}

// 验证Steam配置
export function validateSteamConfig(config: ConfigFormData): ConfigValidationResult {
  const errors: ConfigValidationResult['errors'] = {};

  // 验证Steam API Key
  if (!config.steamApiKey || config.steamApiKey.trim().length === 0) {
    errors.steamApiKey = 'Steam API Key is required';
  } else if (config.steamApiKey.length !== 32) {
    errors.steamApiKey = 'Steam API Key should be 32 characters long';
  }

  // 验证Steam ID
  if (!config.steamId || config.steamId.trim().length === 0) {
    errors.steamId = 'Steam ID is required';
  } else if (!/^765611\d{11}$/.test(config.steamId)) {
    errors.steamId = 'Invalid Steam ID format (should be 17-digit number starting with 765611)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// 检查用户是否已配置Steam
export async function hasUserSteamConfig(userId: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT 1 
      FROM user_steam_configs 
      WHERE user_id = ${userId}
      LIMIT 1
    `;
    return result.length > 0;
  } catch (error) {
    console.error('Failed to check Steam config:', error);
    return false;
  }
}

// 测试Steam API配置是否有效
export async function testSteamConfig(config: ConfigFormData): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${config.steamApiKey}&steamids=${config.steamId}`,
      { 
        method: 'GET',
        headers: { 'User-Agent': 'Steam-Config-Test/1.0' }
      }
    );

    if (!response.ok) {
      return { 
        valid: false, 
        error: `Steam API returned status ${response.status}` 
      };
    }

    const data = await response.json();
    
    if (!data.response?.players?.length) {
      return { 
        valid: false, 
        error: 'No player data found for this Steam ID' 
      };
    }

    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: `Failed to connect to Steam API, ${error}` 
    };
  }
}