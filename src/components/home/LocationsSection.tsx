'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react';
import { LocationItem } from '@/types';

interface Props {
  locations?: LocationItem[];
}

// City image lookup matching popular Indian architectural landmarks
const CITY_IMAGE_MAP: Record<string, string> = {
  bengaluru: '/images/locations/bengaluru.jpg',
  bangalore: '/images/locations/bengaluru.jpg',
  chennai: '/images/locations/chennai.jpg',
  hyderabad: '/images/locations/hyderabad.jpg',
  coimbatore: '/images/locations/coimbatore.jpg',
  mumbai: '/images/locations/mumbai.jpg',
  pune: '/images/locations/pune.jpg',
  delhi: '/images/locations/delhi.jpg',
  goa: '/images/locations/goa.jpg',
};

export const LocationsSection: React.FC<Props> = ({ locations = [] }) => {
  const [scrollIndex, setScrollIndex] = useState(0);

  // If backend returns locations, use them. If none or only 1, supply top dynamic destination filters
  const displayLocations: LocationItem[] =
    locations.length > 0
      ? locations
      : [
          { city: 'Bengaluru', state: 'Karnataka', propertyCount: 0 },
          { city: 'Chennai', state: 'Tamil Nadu', propertyCount: 0 },
          { city: 'Hyderabad', state: 'Telangana', propertyCount: 0 },
          { city: 'Coimbatore', state: 'Tamil Nadu', propertyCount: 0 },
        ];

  const handlePrev = () => {
    setScrollIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleNext = () => {
    setScrollIndex((prev) => (prev < displayLocations.length - 1 ? prev + 1 : prev));
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header matching Reference Image */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-[2px] bg-[#FF7A1A]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF7A1A]">
              FEATURED LOCATIONS
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142C4C] font-display tracking-tight">
            Explore Prime Locations
          </h2>
          <p className="text-xs sm:text-sm text-[#71839D] font-medium mt-1">
            Discover top residential destinations and high-demand investment corridors across India.
          </p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={scrollIndex === 0}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
              scrollIndex === 0
                ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white/50'
                : 'border-slate-300 text-[#142C4C] hover:bg-[#142C4C] hover:text-white bg-white shadow-xs'
            }`}
            aria-label="Previous location"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={scrollIndex >= displayLocations.length - 4}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
              scrollIndex >= displayLocations.length - 4
                ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-white/50'
                : 'border-slate-300 text-[#142C4C] hover:bg-[#142C4C] hover:text-white bg-white shadow-xs'
            }`}
            aria-label="Next location"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Dynamic Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayLocations.map((loc) => {
          const cityKey = loc.city.toLowerCase().trim();
          const imgUrl =
            CITY_IMAGE_MAP[cityKey] ||
            '/images/locations/bengaluru.jpg';

          return (
            <Link
              key={loc.city}
              href={`/properties?city=${encodeURIComponent(loc.city)}`}
              className="group relative h-64 rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 block transform hover:-translate-y-1"
            >
              {/* City Photo */}
              <Image
                src={imgUrl}
                alt={`${loc.city}, ${loc.state}`}
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Location Pin Badge on Top */}
              <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#142C4C] group-hover:bg-[#FF7A1A] group-hover:text-white transition-colors shadow-sm">
                <MapPin className="w-3.5 h-3.5" />
              </div>

              {/* Bottom Details from Reference */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white space-y-1">
                <h3 className="text-xl font-bold font-display text-white group-hover:text-[#FF7A1A] transition-colors drop-shadow-md">
                  {loc.city}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>
                    {loc.propertyCount > 0
                      ? `${loc.propertyCount} ${loc.propertyCount === 1 ? 'Listing' : 'Listings'}`
                      : 'Explore Homes'}
                  </span>
                  <span className="text-[11px] text-white/90 font-medium">{loc.state}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      </div>
    </section>
  );
};
