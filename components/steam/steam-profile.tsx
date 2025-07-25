import Image from "next/image";
import { SteamPlayer } from "@/lib/types/steam";
import { getPersonaState } from "@/lib/utils/steam";
import SteamLogo from "@/components/ui/icon/steam.svg";

interface StatusIndicatorProps {
  personastate: number;
}

export function StatusIndicator({ personastate }: StatusIndicatorProps) {
  const status = getPersonaState(personastate);

  return (
    <div className="flex items-center space-x-2 mt-1">
      <div className={`w-3 h-3 rounded-full ${status.bgColor}`} />
      <span className={`text-sm font-medium ${status.color}`}>
        {status.text}
      </span>
    </div>
  );
}

interface ProfileAvatarProps {
  profile: SteamPlayer;
}

export function ProfileAvatar({ profile }: ProfileAvatarProps) {
  return (
    <Image
      src={profile.avatarfull || "/default-avatar.png"}
      alt={`${profile.personaname || "User"}'s avatar`}
      width={96}
      height={96}
      className="rounded-full border-2 border-gray-300 shadow-lg"
      priority
      unoptimized={!profile.avatarfull}
    />
  );
}

interface ProfileInfoProps {
  profile: SteamPlayer;
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
  return (
    <div className="flex-1">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {profile.personaname || "Unknown User"}
      </h2>

      <StatusIndicator personastate={profile.personastate} />

      <div className="mt-3 space-y-2">
        {profile.profileurl && (
          <div className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Profile: </span>
            <a
              href={profile.profileurl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 hover:underline transition-colors"
            >
              View Steam Profile
            </a>
          </div>
        )}

        {profile.timecreated && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Account Created: </span>
            {new Date(profile.timecreated * 1000).toLocaleDateString()}
          </div>
        )}

        {profile.lastlogoff && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Last Logoff: </span>
            {new Date(profile.lastlogoff * 1000).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}

interface ProfileCardProps {
  profile: SteamPlayer;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="relative bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-950 shadow-md p-6">
      <SteamLogo className="absolute top-4 right-4 h-12 w-12" fill='#ffffff'/>
      <div className="flex items-start space-x-6">
        <ProfileAvatar profile={profile} />
        <ProfileInfo profile={profile} />
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: string;
}

interface ConfigurationPromptProps {
  onSkip?: () => void;
  showGuide?: boolean;
  onShowGuide?: () => void;
}

export function ConfigurationPrompt({ onSkip, onShowGuide }: ConfigurationPromptProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* 欢迎标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          欢迎使用Steam游戏库！🎮
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          连接您的Steam账户，查看游戏收藏和游戏时间统计
        </p>
      </div>

      {/* 配置说明卡片 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-8 mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
              需要配置Steam API访问权限
            </h2>
            <p className="text-blue-800 dark:text-blue-200 mb-4">
              为了显示您的Steam个人资料、游戏库和游戏时间，我们需要访问Steam的公开API。这是完全安全的，只会读取您的公开信息。
            </p>
            
            {/* 功能列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-blue-800 dark:text-blue-200">查看游戏收藏</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-blue-800 dark:text-blue-200">游戏时间统计</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-blue-800 dark:text-blue-200">个人资料信息</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-blue-800 dark:text-blue-200">游戏成就展示</span>
              </div>
            </div>

            {/* 配置步骤 */}
            <div className="bg-white/70 dark:bg-gray-800/30 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-3">配置步骤：</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">1</span>
                  <span className="text-sm text-blue-800 dark:text-blue-200">点击&quot;获取Steam API密钥&quot;获取您的API密钥</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">2</span>
                  <span className="text-sm text-blue-800 dark:text-blue-200">复制您的Steam ID（在个人资料URL中）</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">3</span>
                  <span className="text-sm text-blue-800 dark:text-blue-200">在配置页面填入API密钥和Steam ID</span>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-3">
              <a
                href="/config"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                现在配置
              </a>
              
              {onShowGuide && (
                <button
                  onClick={onShowGuide}
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  详细配置指南
                </button>
              )}
              
              <a
                href="https://steamcommunity.com/dev/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                获取Steam API密钥
              </a>
              
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  稍后配置
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 隐私说明 */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>隐私保护：</strong>我们只读取您的公开Steam信息，不会访问或存储任何私人数据。API密钥安全存储在您的账户中，仅用于获取您的Steam数据。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ErrorState({ error }: ErrorStateProps) {
  // 根据错误类型提供不同的解决方案
  const getErrorSolution = (errorMessage: string) => {
    if (errorMessage.includes('API key not configured')) {
      return {
        title: 'Steam API密钥未配置',
        description: '您需要先配置Steam API密钥才能访问Steam数据。',
        solutions: [
          '检查您是否已在配置页面正确填入API密钥',
          '确认API密钥格式正确（32位十六进制字符串）',
          '验证API密钥是否有效且未过期'
        ],
        icon: 'key'
      }
    } else if (errorMessage.includes('Steam ID not configured')) {
      return {
        title: 'Steam ID未配置',
        description: '您需要提供有效的Steam ID来获取个人资料信息。',
        solutions: [
          '在Steam个人资料URL中找到您的Steam ID',
          '确保使用64位Steam ID格式（17位数字）',
          '检查Steam ID是否输入正确'
        ],
        icon: 'user'
      }
    } else if (errorMessage.includes('request failed')) {
      return {
        title: 'Steam API连接失败',
        description: '无法连接到Steam服务器，这可能是临时性问题。',
        solutions: [
          '检查您的网络连接是否正常',
          '稍后重试，Steam服务器可能暂时不可用',
          '确认您的API密钥仍然有效'
        ],
        icon: 'network'
      }
    } else if (errorMessage.includes('No player data found')) {
      return {
        title: '找不到玩家数据',
        description: '使用提供的Steam ID找不到对应的玩家信息。',
        solutions: [
          '验证Steam ID是否正确',
          '确保Steam个人资料设置为公开',
          '检查Steam账户是否存在且活跃'
        ],
        icon: 'search'
      }
    } else {
      return {
        title: 'Steam数据加载错误',
        description: '加载Steam数据时发生了未知错误。',
        solutions: [
          '请重新检查您的配置信息',
          '确认网络连接正常',
          '如问题持续存在，请联系技术支持'
        ],
        icon: 'alert'
      }
    }
  }

  const solution = getErrorSolution(error)

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'key':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        )
      case 'user':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        )
      case 'network':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        )
      case 'search':
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        )
      default:
        return (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {getIcon(solution.icon)}
              </svg>
            </div>
          </div>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-2">
              {solution.title}
            </h1>
            
            <p className="text-red-600 dark:text-red-300 mb-4">
              {solution.description}
            </p>

            <div className="bg-red-100 dark:bg-red-900/40 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-red-800 dark:text-red-200 mb-3">错误详情：</h3>
              <p className="text-sm text-red-700 dark:text-red-300 bg-white/50 dark:bg-gray-800/30 rounded p-2 font-mono">
                {error}
              </p>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/30 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-red-800 dark:text-red-200 mb-3">解决方案：</h3>
              <ul className="space-y-2">
                {solution.solutions.map((sol, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-medium mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm text-red-700 dark:text-red-300">{sol}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/config"
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                检查配置
              </a>
              
              <a
                href="https://steamcommunity.com/dev/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                重新获取API密钥
              </a>
              
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重试
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 帮助信息 */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>需要帮助？</strong>如果按照上述步骤仍无法解决问题，请确认您的Steam个人资料设置为公开，并且API密钥具有正确的权限。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
