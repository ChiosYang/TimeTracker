/**
 * 通用类型定义
 * 提供项目中常用的类型定义和类型守卫
 */

// 基础类型
export type ID = string | number;

export type Timestamp = string; // ISO string

// 分页参数
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

// 排序参数
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 搜索参数
export interface SearchParams {
  query?: string;
  filters?: Record<string, string | number | boolean>;
}

// 通用查询参数
export interface QueryParams extends PaginationParams, SortParams, SearchParams {}

// API响应基础类型
export interface BaseApiResponse {
  success: boolean;
  timestamp: string;
}

export interface SuccessApiResponse<T = unknown> extends BaseApiResponse {
  success: true;
  data: T;
}

export interface ErrorApiResponse extends BaseApiResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export type ApiResponse<T = unknown> = SuccessApiResponse<T> | ErrorApiResponse;

// Steam 相关类型
export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url?: string;
  img_logo_url?: string;
  has_community_visible_stats?: boolean;
  playtime_windows_forever?: number;
  playtime_mac_forever?: number;
  playtime_linux_forever?: number;
  rtime_last_played?: number;
  playtime_disconnected?: number;
}

export interface SteamGameDetails {
  steam_appid: number;
  name: string;
  detailed_description?: string;
  short_description?: string;
  genres?: Array<{ id: number; description: string }>;
  categories?: Array<{ id: number; description: string }>;
  developers?: string[];
  publishers?: string[];
  metacritic?: { score: number; url: string };
  release_date?: { coming_soon: boolean; date: string };
  header_image?: string;
  screenshots?: Array<{ id: number; path_thumbnail: string; path_full: string }>;
  price_overview?: {
    currency: string;
    initial: number;
    final: number;
    discount_percent: number;
    initial_formatted: string;
    final_formatted: string;
  };
}

export interface SteamProfile {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: number;
  communityvisibilitystate: number;
  profilestate?: number;
  lastlogoff?: number;
  commentpermission?: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  gameid?: string;
  gameserverip?: string;
  gameextrainfo?: string;
  cityid?: number;
  loccountrycode?: string;
  locstatecode?: string;
  loccityid?: number;
}

// 用户相关类型
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface UserConfig {
  id: string;
  user_id: string;
  steam_api_key: string;
  steam_id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// RAG 推荐相关类型
export interface RecommendationRequest {
  userId: string;
  preferences?: {
    genres?: string[];
    excludeGenres?: string[];
    minRating?: number;
    maxPrice?: number;
  };
}

export interface RecommendationData {
  recommendedGame: string;
  reason: string;
  userPreferenceAnalysis?: string;
  confidence: number;
  gameType?: string;
  expectedPlaytime?: string;
  similarity?: string;
}

export interface RecommendationResponse {
  recommendation: RecommendationData;
  metadata: {
    userTopGames: Array<{ name: string; hours: number }>;
    similarGamesFound: number;
    maxSimilarity: number;
    generatedAt: string;
  };
}

// 同步状态类型
export interface SyncStatus {
  isRunning: boolean;
  progress?: number;
  currentGame?: string;
  totalGames?: number;
  startTime?: Timestamp;
  estimatedEndTime?: Timestamp;
  error?: string;
}

// 配置相关类型
export interface AppConfig {
  steamApiKey?: string;
  steamId?: string;
  enableAnalytics: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// Webhook 配置类型
export interface WebhookRule {
  module: string;
  method: string;
  url: string;
}

// 类型守卫函数
export function isValidSteamId(steamId: unknown): steamId is string {
  return typeof steamId === 'string' && /^\d{17}$/.test(steamId);
}

export function isValidAppId(appId: unknown): appId is number {
  return typeof appId === 'number' && appId > 0 && Number.isInteger(appId);
}

export function isValidEmail(email: unknown): email is string {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessApiResponse<T> {
  return response.success === true;
}

export function isErrorResponse(response: ApiResponse): response is ErrorApiResponse {
  return response.success === false;
}

// 实用类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// 数据库操作类型
export interface DatabaseEntity {
  id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type CreateEntityInput<T> = Omit<T, keyof DatabaseEntity>;

export type UpdateEntityInput<T> = Partial<Omit<T, keyof DatabaseEntity>>;

// 环境变量类型
export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL: string;
  AUTH_SECRET: string;
  AUTH_URL: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GOOGLE_AI_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  VERCEL_URL?: string;
}

// Next.js 相关类型
export interface PageProps {
  params: Record<string, string>;
  searchParams: Record<string, string | string[] | undefined>;
}

export interface LayoutProps {
  children: React.ReactNode;
  params?: Record<string, string>;
}

// 错误类型
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface FormError {
  message: string;
  errors?: ValidationError[];
}