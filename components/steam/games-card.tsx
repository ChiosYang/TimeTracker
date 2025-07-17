import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Import Progress component
import { formatDate } from "@/lib/utils/steam"; // Import formatDate

// Update the Game interface to match the new API response
interface Game {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  header_image?: string; // header_image is optional
  rtime_last_played?: number; // Add last played time
}

interface GameCardProps {
  game: Game;
}

const MAX_PLAYTIME_MINUTES = 6000; // Assuming a max playtime of 10,000 hours for progress bar (10000 * 60 minutes)

export function GameCard({ game }: GameCardProps) {
  const playTimeHours = (game.playtime_forever / 60).toFixed(1);
  const lastPlayedDate = game.rtime_last_played ? formatDate(game.rtime_last_played) : null;

  // Calculate progress value (0-100)
  const progressValue = Math.min((game.playtime_forever / MAX_PLAYTIME_MINUTES) * 100, 100);

  return (
    <Link href={`/games/${game.appid}`} legacyBehavior={false}>
      <Card className="w-full max-w-2xl flex flex-row bg-transparent shadow-none hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden border border-gray-700/50 py-0 cursor-pointer">
        {/* Left side: Image */}
        <div className="relative w-[274px] h-32 bg-gray-200 dark:bg-gray-700 flex-shrink-0">
          {game.header_image ? (
            <Image
              src={game.header_image}
              alt={`${game.name} header`}
              fill
              className="object-contain"
              sizes="274px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-center">
              <p className="text-gray-500 dark:text-gray-400 text-xs">No Image</p>
            </div>
          )}
        </div>
        
        {/* Right side: Info */}
        <div className="flex flex-col justify-between flex-grow p-4">
          <CardHeader className="p-0">
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white truncate" title={game.name}>
              {game.name}
            </CardTitle>
          </CardHeader>

          <div className="flex flex-col text-sm text-gray-600 dark:text-gray-300">
            <p className="mb-1">{playTimeHours} h</p>
            <Progress value={progressValue} className="w-full" />
            {lastPlayedDate && (
              <p className="mt-2 text-gray-400 dark:text-gray-500">Last played: {lastPlayedDate}</p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
