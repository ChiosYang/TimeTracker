import Image from "next/image";
import { SteamPlayer } from "@/lib/types/steam";
import { getPersonaState } from "@/lib/utils/steam";

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
    <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-950 shadow-md p-6">
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

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
      <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
        Error Loading Steam Profile
      </h1>
      <p className="text-red-700 dark:text-red-300 mb-4">
        Could not load Steam profile data. Reason: {error}
      </p>
      <div className="bg-red-100 dark:bg-red-900/40 rounded-md p-4">
        <p className="text-sm text-red-800 dark:text-red-200 mb-4">
          Please configure your Steam API credentials to access your profile data.
        </p>
        <div className="flex space-x-3">
          <a
            href="/config"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Configure Steam API
          </a>
          <a
            href="https://steamcommunity.com/dev/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 text-sm font-medium rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors dark:bg-red-900/40 dark:text-red-200 dark:hover:bg-red-900/60"
          >
            Get Steam API Key
          </a>
        </div>
      </div>
    </div>
  );
}