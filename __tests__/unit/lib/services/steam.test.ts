import { getSteamProfile, checkSteamConfig, getGameDetails } from '@/lib/services/steam'

describe('Steam Service', () => {
  describe('getSteamProfile', () => {
    it('should handle missing API key', async () => {
      // 测试没有配置API key的情况
      process.env.STEAM_API_KEY = ''
      process.env.STEAM_ID = '12345'

      const result = await getSteamProfile('user123')
      
      expect(result).toHaveProperty('error')
      expect(result.error).toContain('Steam API key not configured')
    })

    it('should handle missing Steam ID', async () => {
      // 测试没有配置Steam ID的情况
      process.env.STEAM_API_KEY = 'test-api-key'
      process.env.STEAM_ID = ''

      const result = await getSteamProfile('user123')
      
      expect(result).toHaveProperty('error')
      expect(result.error).toContain('Steam ID not configured')
    })
  })

  describe('checkSteamConfig', () => {
    it('should return true when environment variables are set', async () => {
      process.env.STEAM_API_KEY = 'test-api-key'
      process.env.STEAM_ID = '12345'

      const result = await checkSteamConfig('user123')
      
      expect(result).toBe(true)
    })

    it('should return false when environment variables are not set', async () => {
      process.env.STEAM_API_KEY = ''
      process.env.STEAM_ID = ''

      const result = await checkSteamConfig('user123')
      
      expect(result).toBe(false)
    })
  })

  describe('getGameDetails', () => {
    it('should handle API requests', async () => {
      // 这个测试主要验证函数存在且可以被调用
      // 实际的API调用应该在集成测试中进行
      expect(typeof getGameDetails).toBe('function')
      expect(getGameDetails.length).toBe(1) // 期望一个参数
    })
  })
})