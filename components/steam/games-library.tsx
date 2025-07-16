'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { GameCard } from './games-card';
import { Skeleton } from '@/components/ui/skeleton';

// Assuming the game object structure based on common Steam API responses
interface Game {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  header_image?: string; // Added header_image for the card
}

interface ApiResponse {
  response?: {
    game_count: number; // Total count of games
    games: Game[];
  };
}

const GAMES_PER_PAGE = 20; // Matches the default limit in the backend API

export function GamesLibrary() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // New state for loading more
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0); // Current page, 0-indexed
  const [hasMore, setHasMore] = useState(true); // Whether there are more games to load

  const observer = useRef<IntersectionObserver | null>(null);
  const lastGameElementRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore || !hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    }, {
      rootMargin: '0px 0px 200px 0px', // Load when 200px from bottom
    });

    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore]);

  const fetchGames = useCallback(async () => {
    if (!hasMore && page > 0) return; // Prevent fetching if no more games and not initial load

    const currentLoadingState = page === 0 ? setLoading : setLoadingMore;
    currentLoadingState(true);
    setError(null);

    try {
      const res = await fetch(`/api/steam/games?limit=${GAMES_PER_PAGE}&offset=${page * GAMES_PER_PAGE}`);
      if (!res.ok) {
        throw new Error('Failed to fetch games');
      }
      const data: ApiResponse = await res.json();

      if (data.response && data.response.games) {
        setGames(prevGames => {
          const newGames = data.response!.games;
          // Filter out duplicates if any (e.g., due to API inconsistencies or re-fetches)
          const uniqueNewGames = newGames.filter(newGame => 
            !prevGames.some(existingGame => existingGame.appid === newGame.appid)
          );
          return [...prevGames, ...uniqueNewGames];
        });

        // Check if there are more games to load
        // If the number of games returned is less than GAMES_PER_PAGE, it means it's the last page
        setHasMore(data.response.games.length === GAMES_PER_PAGE);
      } else {
        setHasMore(false); // No games returned, so no more games
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setHasMore(false); // Stop trying to load more on error
    } finally {
      currentLoadingState(false);
    }
  }, [page, hasMore]); // Depend on page and hasMore

  useEffect(() => {
    fetchGames();
  }, [fetchGames]); // Re-fetch when fetchGames callback changes (due to page/hasMore change)

  if (loading && page === 0) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: GAMES_PER_PAGE }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (games.length === 0 && !loading && !hasMore) {
    return <p>No games found.</p>;
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-4">
        {games.map((game, index) => {
          if (games.length === index + 1) {
            return <div ref={lastGameElementRef} key={game.appid}><GameCard game={game} /></div>;
          } else {
            return <GameCard key={game.appid} game={game} />;
          }
        })}
      </div>
      {loadingMore && (
        <div className="mt-8 flex justify-center">
          <p className="text-gray-500 dark:text-gray-400">Loading more games...</p>
        </div>
      )}
      {!hasMore && games.length > 0 && !loadingMore && (
        <div className="mt-8 flex justify-center">
          <p className="text-gray-500 dark:text-gray-400">You&apos;ve reached the end of your game list.</p>
        </div>
      )}
    </div>
  );
}