import { getSteamProfile, checkSteamConfig } from "@/lib/services/steam";
import { isProfileError } from "@/lib/utils/steam";
import { ProfileCard, ErrorState, ConfigurationPrompt } from "@/components/steam/steam-profile";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  
  // 首先检查是否有配置
  const hasConfig = await checkSteamConfig(userId);
  
  if (!hasConfig) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Steam Profile
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