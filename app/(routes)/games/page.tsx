import { getSteamProfile, checkSteamConfig } from "@/lib/services/steam";
import { isProfileError } from "@/lib/utils/steam";
import { ErrorState, ConfigurationPrompt } from "@/components/steam/steam-profile";
import { GamesLibrary } from "@/components/steam/games-library";
import SyncGamesButton from "@/components/steam/sync-games-button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function GamesPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  
  const hasConfig = await checkSteamConfig(userId);
  
  if (!hasConfig) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Steam Games Library
          </h1>
        </header>
        <main>
          <ConfigurationPrompt />
        </main>
      </div>
    );
  }

  const profile = await getSteamProfile(userId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Steam Games Library
            </h1>
            {!isProfileError(profile) && (
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {profile.personaname}&apos;s game collection and playtime
              </p>
            )}
          </div>
          <SyncGamesButton />
        </div>
      </header>

      <main>
        {isProfileError(profile) ? (
          <ErrorState error={profile.error} />
        ) : (
          <GamesLibrary />
        )}
      </main>
    </div>
  );
}