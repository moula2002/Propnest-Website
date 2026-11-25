'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Dumbbell,
  Waves,
  Car,
  Zap,
  Droplets,
  Flame,
  Users,
  Building2,
} from 'lucide-react';
import { Amenity } from '@/types';
import { propertyService } from '@/services/propertyService';
import { getFullImageUrl } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  shield: ShieldCheck,
  pool: Waves,
  fitness: Dumbbell,
  local_parking: Car,
  bolt: Zap,
  water_drop: Droplets,
  gas_meter: Flame,
  groups: Users,
  elevator: Building2,
  child_friendly: Sparkles,
};

interface LifestyleSectionProps {
  initialAmenities?: Amenity[];
}

export const LifestyleSection: React.FC<LifestyleSectionProps> = ({
  initialAmenities = [],
}) => {
  const [amenities, setAmenities] = useState<Amenity[]>(initialAmenities);

  // Keep amenities synced with live backend API
  useEffect(() => {
    let cancelled = false;
    propertyService
      .getAmenities()
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setAmenities(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load amenities for lifestyle section', err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Show top 6 amenities prioritizing those with properties or images
  const displayItems = [...amenities]
    .sort((a, b) => (b._count?.properties || 0) - (a._count?.properties || 0))
    .slice(0, 6);

  return (
    <section className="relative py-20 bg-white text-[#142C4C]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-[2px] bg-[#FF7A1A]" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#FF7A1A]">
                EXPLORE PROPERTIES BY
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142C4C] font-editorial tracking-tight">
              Lifestyle &amp; Amenities
            </h2>
            <p className="text-xs sm:text-sm text-[#71839D] font-medium mt-1.5 max-w-lg">
              Filter live properties by verified lifestyle features and community amenities.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#142C4C] bg-[#EAF3FC] hover:bg-[#142C4C] hover:text-white transition-all duration-200 border border-slate-200/60 shadow-xs shrink-0 self-start sm:self-auto"
          >
            <span>Explore More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dynamic Lifestyle / Amenity Cards */}
        {displayItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {displayItems.map((item) => {
              const Icon = (item.icon && ICON_MAP[item.icon]) || Sparkles;
              const propCount = item._count?.properties ?? 0;
              const hasImage = Boolean(item.imageUrl);

              return (
                <Link
                  key={item.id}
                  href={`/properties?amenities=${encodeURIComponent(item.slug)}`}
                  className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-card hover:shadow-2xl border border-slate-200/70 bg-gradient-to-br from-[#142C4C] via-[#0B1F38] to-[#142C4C] transition-all duration-300 transform hover:-translate-y-1.5 block"
                >
                  {hasImage ? (
                    <>
                      <Image
                        src={getFullImageUrl(item.imageUrl)}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F38]/95 via-[#0B1F38]/40 to-[#0B1F38]/45" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none">
                      <Icon className="w-32 h-32 text-white" />
                    </div>
                  )}

                  {/* Top Label & Dynamic Amenity Name */}
                  <div className="absolute top-4 left-4 right-4 z-10 space-y-1">
                    <span className="inline-block text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#FF7A1A]">
                      {propCount > 0 ? `${propCount} ${propCount === 1 ? 'Property' : 'Properties'}` : 'AMENITY'}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white font-editorial leading-snug drop-shadow-md group-hover:text-[#FF7A1A] transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                  </div>

                  {/* Bottom Action Strip */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pt-3 border-t border-white/15">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/90 group-hover:text-white">
                      More Details
                    </span>
                    <div className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#FF7A1A] transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 px-6 bg-[#F8F7F4] rounded-3xl border border-dashed border-slate-200">
            <p className="text-xs font-semibold text-[#71839D]">
              No lifestyle features or amenities configured yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
