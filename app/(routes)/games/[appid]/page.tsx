import { getGameDetails } from '@/lib/services/steam';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { GameDetails, Genre } from '@/lib/types/steam';

export default async function GameDetailPage({ params }: { params: Promise<{ appid: string }> }) {
  const { appid } = await params;
  const gameDetails: GameDetails | null = await getGameDetails(appid);

  if (!gameDetails) {
    notFound();
  }

  const { 
    name, 
    header_image, 
    background_raw,
    release_date, 
    developers, 
    publishers, 
    genres, 
    short_description, 
    screenshots, 
    detailed_description, 
    pc_requirements 
  } = gameDetails;

  const backgroundImage = background_raw || header_image;

  return (
    <div className="bg-background text-foreground">
      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-[60vh] z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        {backgroundImage && (
          <Image 
            src={backgroundImage} 
            alt={`${name} background`} 
            fill 
            className="object-cover opacity-30"
            sizes="100vw"
            priority
          />
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-16">
        {/* Back Button */}
        <div className="py-6">
          <Link href="/games" className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Games
          </Link>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Left Column: Game Poster */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="aspect-video relative rounded-lg overflow-hidden shadow-2xl">
              {header_image && (
                <Image 
                  src={header_image} 
                  alt={`${name} poster`} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                />
              )}
            </div>
          </div>

          {/* Right Column: Game Details */}
          <div className="w-full md:w-2/3 lg:w-3/4 text-white">
            <p className="text-sm text-gray-400 mb-1">{release_date?.date}</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{name}</h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 text-sm">
              <span>Developed by: <span className="font-semibold">{developers?.join(', ')}</span></span>
              <span className="hidden md:inline">|</span>
              <span>Published by: <span className="font-semibold">{publishers?.join(', ')}</span></span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {genres?.map((genre: Genre) => (
                <span key={genre.id} className="px-3 py-1 text-xs font-medium bg-gray-700/50 text-gray-300 rounded-full">
                  {genre.description}
                </span>
              ))}
            </div>

            <p className="text-base text-gray-300 leading-relaxed">{short_description}</p>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="mt-12">
          {/* Screenshots Carousel */}
          {screenshots && screenshots.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-white">Screenshots</h2>
              <Carousel className="w-full">
                <CarouselContent>
                  {screenshots.map(ss => (
                    <CarouselItem key={ss.id} className="md:basis-1/2 lg:basis-1/3">
                      <div className="aspect-video relative rounded-lg overflow-hidden">
                        <Image 
                          src={ss.path_full} 
                          alt="Screenshot" 
                          fill 
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="ml-14" />
                <CarouselNext className="mr-14" />
              </Carousel>
            </div>
          )}

          {/* Detailed Description */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">About This Game</h2>
            <div className="prose prose-invert max-w-none text-gray-300 prose-a:text-cyan-400 prose-headings:text-white" dangerouslySetInnerHTML={{ __html: detailed_description }} />
          </div>

          {/* System Requirements */}
          {pc_requirements?.minimum && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">System Requirements</h2>
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-sm text-gray-300">
                <h3 className="font-semibold text-lg mb-4 text-white">Minimum Requirements</h3>
                <div className="prose prose-invert max-w-none text-gray-300 prose-a:text-cyan-400" dangerouslySetInnerHTML={{ __html: pc_requirements.minimum }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
