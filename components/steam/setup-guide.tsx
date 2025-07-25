'use client'

import { useState } from 'react'

export function SteamSetupGuide() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showApiKeyDetails, setShowApiKeyDetails] = useState(false)
  const [showSteamIdDetails, setShowSteamIdDetails] = useState(false)

  const steps = [
    {
      id: 1,
      title: '获取Steam API密钥',
      description: '从Steam官方获取您的API访问密钥',
      icon: 'key'
    },
    {
      id: 2, 
      title: '找到您的Steam ID',
      description: '获取您的64位Steam ID',
      icon: 'user'
    },
    {
      id: 3,
      title: '配置到系统',
      description: '在配置页面填入您的凭据',
      icon: 'settings'
    }
  ]

  const getStepIcon = (iconType: string) => {
    switch (iconType) {
      case 'key':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
        )
      case 'user':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        )
      case 'settings':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Steam API配置指南
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          按照以下步骤完成Steam API配置，只需几分钟时间
        </p>
      </div>

      {/* 步骤导航 */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-gray-300 text-gray-400'
            }`}>
              {currentStep > step.id ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-2 ${
                currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* 步骤内容 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        {currentStep === 1 && (
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {getStepIcon('key')}
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  步骤1：获取Steam API密钥
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  从Steam官方开发者页面获取您的API密钥
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">操作步骤：</h4>
                <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium mr-2 mt-0.5">1</span>
                    <span>点击下方按钮访问Steam API密钥页面</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium mr-2 mt-0.5">2</span>
                    <span>使用您的Steam账户登录</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium mr-2 mt-0.5">3</span>
                    <span>在&quot;Key Name&quot;字段填入任意名称（如：PTS Dashboard）</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium mr-2 mt-0.5">4</span>
                    <span>点击&quot;Register&quot;按钮生成API密钥</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium mr-2 mt-0.5">5</span>
                    <span>复制生成的32位API密钥（类似：A1B2C3D4E5F6...）</span>
                  </li>
                </ol>
              </div>

              <button
                onClick={() => setShowApiKeyDetails(!showApiKeyDetails)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showApiKeyDetails ? '隐藏' : '显示'}详细信息 ↓
              </button>

              {showApiKeyDetails && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">重要提醒：</h5>
                  <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <li>• API密钥是32位十六进制字符串</li>
                    <li>• 请妥善保管，不要泄露给他人</li>
                    <li>• 如果密钥泄露，可以重新生成</li>
                    <li>• 密钥用于访问Steam公开API，无法获取私人信息</li>
                  </ul>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <a
                  href="https://steamcommunity.com/dev/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  获取Steam API密钥
                </a>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  下一步 →
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {getStepIcon('user')}
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  步骤2：获取Steam ID
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  找到您的64位Steam ID用于API调用
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">获取方法：</h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">方法1：从个人资料URL获取</h5>
                    <ol className="space-y-1 text-sm text-gray-700 dark:text-gray-300 ml-4">
                      <li>1. 访问您的Steam个人资料页面</li>
                      <li>2. 复制URL中的数字部分（17位数字）</li>
                      <li>3. 例如：<code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">https://steamcommunity.com/profiles/76561198XXXXXXXXX</code></li>
                    </ol>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">方法2：使用第三方工具</h5>
                    <p className="text-sm text-gray-700 dark:text-gray-300 ml-4">
                      可以使用 SteamID.io 等在线工具转换您的Steam用户名
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSteamIdDetails(!showSteamIdDetails)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showSteamIdDetails ? '隐藏' : '显示'}详细说明 ↓
              </button>

              {showSteamIdDetails && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                  <h5 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Steam ID格式说明：</h5>
                  <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-200">
                    <li>• <strong>64位Steam ID</strong>：17位数字，以7656119开头</li>
                    <li>• <strong>示例</strong>：76561198012345678</li>
                    <li>• <strong>注意</strong>：不是您的用户名或显示名称</li>
                    <li>• <strong>隐私</strong>：Steam ID是公开信息，可以安全使用</li>
                  </ul>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ← 上一步
                </button>
                <a
                  href="https://steamid.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Steam ID查找工具
                </a>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  下一步 →
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {getStepIcon('settings')}
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  步骤3：完成配置
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  在系统中保存您的Steam凭据
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">最后步骤：</h4>
                <ol className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium mr-2 mt-0.5">1</span>
                    <span>点击下方&quot;前往配置页面&quot;按钮</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium mr-2 mt-0.5">2</span>
                    <span>在&quot;Steam API Key&quot;字段粘贴您的API密钥</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium mr-2 mt-0.5">3</span>
                    <span>在&quot;Steam ID&quot;字段填入您的64位Steam ID</span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium mr-2 mt-0.5">4</span>
                    <span>点击&quot;保存配置&quot;完成设置</span>
                  </li>
                </ol>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">配置成功后您将能够：</h5>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• 查看您的完整Steam游戏库</li>
                      <li>• 统计每个游戏的游玩时间</li>
                      <li>• 显示Steam个人资料信息</li>
                      <li>• 同步最新的游戏数据</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ← 上一步
                </button>
                <a
                  href="/config"
                  className="inline-flex items-center px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  前往配置页面
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}