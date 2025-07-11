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