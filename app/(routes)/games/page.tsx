import { getSteamProfile, checkSteamConfig } from "@/lib/services/steam";
import { GamesPageContent } from "@/components/steam/games-page-content";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function GamesPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  
  const hasConfig = await checkSteamConfig(userId);
  let profile = undefined;

  // 只有在有配置的情况下才获取profile
  if (hasConfig) {
    profile = await getSteamProfile(userId);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <GamesPageContent hasConfig={hasConfig} profile={profile} />
    </div>
  );
}