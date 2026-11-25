'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Building2, PlusCircle, ArrowRight } from 'lucide-react';
import { PropertyCategory } from '@/types';
import { propertyService } from '@/services/propertyService';
import { getFullImageUrl } from '@/lib/utils';

interface CategorySectionProps {
  initialCategories?: PropertyCategory[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  initialCategories = [],
}) => {
  const [categories, setCategories] = useState<PropertyCategory[]>(initialCategories);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refresh live admin-managed categories from backend API
  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        const data = await propertyService.getCategories();
        if (!cancelled && Array.isArray(data)) {
          setCategories(data);
        }
      } catch (err) {
        console.error('Failed to load live property categories', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative py-20 bg-transparent text-[#142C4C]">

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Editorial Title Column */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-28">
            <div className="flex items-center gap-2">
              <span className="w-5 h-[2px] bg-[#FF7A1A]" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#FF7A1A]">
                PROPERTY CATEGORIES
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold text-[#142C4C] font-editorial tracking-tight leading-[1.1]">
              Residential <br />
              Properties
            </h2>

            <p className="text-base sm:text-lg text-[#71839D] font-medium leading-relaxed max-w-xs">
              In prime locations, curated directly for modern living.
            </p>

            <div className="pt-2">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-[#FF7A1A] hover:bg-[#ea580c] shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>View All Properties</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right 2-Column Category Cards Grid matching Reference */}
          <div className="lg:col-span-8">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2].map((idx) => (
                  <div
                    key={idx}
                    className="h-72 sm:h-80 rounded-xl bg-white/10 animate-pulse border border-white/15"
                  />
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {categories.map((cat) => {
                  const count =
                    cat.approvedProperties > 0 ? cat.approvedProperties : cat.totalProperties;
                  const hasImage = Boolean(cat.imageUrl);

                  return (
                    <Link
                      key={cat.id || cat.type}
                      href={`/properties?propertyType=${encodeURIComponent(cat.type)}`}
                      className="group relative h-72 sm:h-80 rounded-xl overflow-hidden shadow-2xl border border-white/15 bg-gradient-to-br from-[#142C4C] to-[#0B1F38] transition-all duration-300 transform hover:-translate-y-1.5 block"
                    >
                      {hasImage && (
                        <Image
                          src={getFullImageUrl(cat.imageUrl)}
                          alt={cat.name}
                          fill
                          className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}

                      {/* Dark Gradient Overlay matching Reference */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/15 to-black/80 group-hover:via-black/25 transition-colors" />

                      {/* Top-Left: Count & Editorial Category Name */}
                      <div className="absolute top-6 left-6 right-6 z-10 space-y-1.5">
                        <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-white/90">
                          {count} PROPERTIES
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-semibold text-white font-editorial tracking-tight group-hover:text-[#FF7A1A] transition-colors drop-shadow-md truncate">
                          {cat.name}
                        </h3>
                        {cat.description && (
                          <p className="text-xs text-slate-200/85 line-clamp-1 font-medium">
                            {cat.description}
                          </p>
                        )}
                      </div>

                      {/* Bottom Bar: MORE DETAILS + Play/Triangle Icon */}
                      <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-white group-hover:text-[#FF7A1A] transition-colors">
                          MORE DETAILS
                        </span>

                        <div className="w-7 h-7 flex items-center justify-center text-white group-hover:text-[#FF7A1A] group-hover:translate-x-1 transition-all duration-200">
                          <Play className="w-4 h-4 stroke-[1.75]" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 space-y-4">
                <div className="w-14 h-14 rounded-full bg-white/15 text-white flex items-center justify-center mx-auto">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white font-editorial">
                  No Active Property Categories Yet
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Categories added in the Admin Panel will appear here automatically.
                </p>
                <div className="pt-2">
                  <Link
                    href="/dashboard/properties/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#FF7A1A] hover:bg-[#ea580c] shadow-sm transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Post Your Property</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
