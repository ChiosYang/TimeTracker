export interface SteamPlayer {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  lastlogoff?: number;
  personastate: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  personastateflags?: number;
}

export interface SteamApiResponse {
  response: {
    players: SteamPlayer[];
  };
}

export interface SteamApiError {
  error: string;
}

export type ProfileResult = SteamPlayer | SteamApiError;

export interface PersonaState {
  text: string;
  color: string;
  bgColor: string;
}

export enum PersonaStateEnum {
  OFFLINE = 0,
  ONLINE = 1,
  BUSY = 2,
  AWAY = 3,
  SNOOZE = 4,
  LOOKING_TO_TRADE = 5,
  LOOKING_TO_PLAY = 6,
}

// KV存储相关类型
export interface UserSteamConfig {
  steamApiKey: string;
  steamId: string;
  createdAt: number;
  updatedAt: number;
}

export interface ConfigFormData {
  steamApiKey: string;
  steamId: string;
}

export interface ConfigValidationResult {
  isValid: boolean;
  errors: {
    steamApiKey?: string;
    steamId?: string;
  };
}

// Steam游戏相关类型
export interface SteamGame {
  appid: number;
  name?: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  img_icon_url?: string;
  img_logo_url?: string;
}

export interface SteamGamesResponse {
  game_count: number;
  games: SteamGame[];
}

export interface SteamGamesApiError {
  error: string;
}

export type SteamGamesResult = SteamGamesResponse | SteamGamesApiError;

// Steam 游戏详情相关类型
export interface Genre {
  id: string;
  description: string;
}

export interface Screenshot {
  id: number;
  path_thumbnail: string;
  path_full: string;
}

export interface PCRequirements {
  minimum: string;
  recommended: string;
}

export interface ReleaseDate {
  coming_soon: boolean;
  date: string;
}

export interface Movie {
  id: number;
  name: string;
  thumbnail: string;
  webm: { 480: string; max: string };
  mp4: { 480: string; max: string };
  highlight: boolean;
}

export interface PriceOverview {
  currency: string;
  initial: number;
  final: number;
  discount_percent: number;
  initial_formatted: string;
  final_formatted: string;
}

export interface Category {
  id: number;
  description: string;
}

export interface GameDetails {
  type: string;
  name: string;
  steam_appid: number;
  is_free: boolean;
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  header_image: string;
  background: string;
  background_raw: string;
  screenshots: Screenshot[];
  movies?: Movie[]; 
  developers: string[];
  publishers: string[];
  price_overview?: PriceOverview; 
  platforms: { windows: boolean; mac: boolean; linux: boolean };
  metacritic?: { score: number; url: string };
  categories?: Category[]; 
  genres: Genre[];
  release_date: ReleaseDate;
  pc_requirements: PCRequirements;
  // ... 其他可能存在的字段
}