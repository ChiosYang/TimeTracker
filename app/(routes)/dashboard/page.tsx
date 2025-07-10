import { getSteamProfile } from "@/lib/services/steam";
import { isProfileError } from "@/lib/utils/steam";
import { ProfileCard, ErrorState } from "@/components/steam/steam-profile";

export default async function DashboardPage() {
  const profile = await getSteamProfile();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Steam Profile
        </h1>
      </header>

      <main>
        {isProfileError(profile) ? (
          <ErrorState error={profile.error} />
        ) : (
          <ProfileCard profile={profile} />
        )}
      </main>
    </div>
  );
}