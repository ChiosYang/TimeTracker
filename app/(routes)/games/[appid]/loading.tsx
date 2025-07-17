import { ArrowLeft } from 'lucide-react';

export default function Loading() {
  return (
    <div className="bg-background text-foreground">
      {/* Static background for loading state */}
      <div className="absolute top-0 left-0 w-full h-[60vh] z-0 bg-gray-900/50" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-16 animate-pulse">
        {/* Back Button Placeholder */}
        <div className="py-6">
          <div className="inline-flex items-center text-sm font-medium text-gray-400">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </div>
        </div>

        {/* Hero Section Skeleton */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Left Column: Game Poster Skeleton */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="aspect-video relative rounded-lg bg-gray-700/50 shadow-2xl"></div>
          </div>

          {/* Right Column: Game Details Skeleton */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="h-4 w-1/4 bg-gray-700/50 rounded mb-2"></div>
            <div className="h-12 w-3/4 bg-gray-600/50 rounded mb-4"></div>
            
            <div className="h-5 w-full bg-gray-700/50 rounded mb-2"></div>
            <div className="h-5 w-2/3 bg-gray-700/50 rounded mb-6"></div>

            <div className="flex flex-wrap gap-2 mb-6">
              <div className="h-6 w-20 bg-gray-700/50 rounded-full"></div>
              <div className="h-6 w-24 bg-gray-700/50 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-700/50 rounded-full"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-700/50 rounded"></div>
              <div className="h-4 bg-gray-700/50 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-700/50 rounded"></div>
            </div>
          </div>
        </div>

        {/* Main Content Section Skeleton */}
        <div className="mt-12">
          {/* Screenshots Skeleton */}
          <div className="mb-12">
            <div className="h-8 w-1/3 bg-gray-600/50 rounded mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="aspect-video rounded-lg bg-gray-700/50"></div>
              <div className="aspect-video rounded-lg bg-gray-700/50"></div>
              <div className="aspect-video rounded-lg bg-gray-700/50"></div>
            </div>
          </div>

          {/* Detailed Description Skeleton */}
          <div className="mb-12">
            <div className="h-8 w-1/3 bg-gray-600/50 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700/50 rounded"></div>
              <div className="h-4 bg-gray-700/50 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-700/50 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-700/50 rounded"></div>
              <div className="h-4 bg-gray-700/50 rounded"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
