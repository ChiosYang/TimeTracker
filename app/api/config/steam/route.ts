import { NextRequest, NextResponse } from 'next/server';
import { saveUserSteamConfig, getUserSteamConfig, deleteUserSteamConfig, testSteamConfig } from '@/lib/services/config';
import { ConfigFormData } from '@/lib/types/steam';
import { revalidateTag } from 'next/cache';

// 生成简单的用户ID（与steam.ts中的逻辑保持一致）
function generateUserId(): string {
  return 'default_user';
}

// GET: 获取用户Steam配置
export async function GET() {
  try {
    const userId = generateUserId();
    const config = await getUserSteamConfig(userId);
    
    if (config) {
      // 不返回完整的API Key，只返回部分信息用于显示
      return NextResponse.json({
        config: {
          steamApiKey: config.steamApiKey.substring(0, 8) + '••••••••••••••••••••••••',
          steamId: config.steamId
        }
      });
    } else {
      return NextResponse.json({ config: null });
    }
  } catch (error) {
    console.error('Failed to get Steam config:', error);
    return NextResponse.json(
      { error: 'Failed to get configuration' },
      { status: 500 }
    );
  }
}

// POST: 保存用户Steam配置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { steamApiKey, steamId } = body as ConfigFormData;

    if (!steamApiKey || !steamId) {
      return NextResponse.json(
        { error: 'Steam API Key and Steam ID are required' },
        { status: 400 }
      );
    }

    // 验证配置
    const testResult = await testSteamConfig({ steamApiKey, steamId });
    if (!testResult.valid) {
      return NextResponse.json(
        { error: `Configuration test failed: ${testResult.error}` },
        { status: 400 }
      );
    }

    const userId = generateUserId();
    const result = await saveUserSteamConfig(userId, { steamApiKey, steamId });

    if (result.success) {
      // 清除Steam API缓存
      revalidateTag('steam-profile');
      
      return NextResponse.json({ 
        message: 'Configuration saved successfully',
        tested: true
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Failed to save Steam config:', error);
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    );
  }
}

// DELETE: 删除用户Steam配置
export async function DELETE() {
  try {
    const userId = generateUserId();
    const success = await deleteUserSteamConfig(userId);

    if (success) {
      // 清除Steam API缓存
      revalidateTag('steam-profile');
      
      return NextResponse.json({ 
        message: 'Configuration deleted successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete configuration' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Failed to delete Steam config:', error);
    return NextResponse.json(
      { error: 'Failed to delete configuration' },
      { status: 500 }
    );
  }
}