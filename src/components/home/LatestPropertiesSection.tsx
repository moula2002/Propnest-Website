'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building2, PlusCircle } from 'lucide-react';
import { PropertyListItem } from '@/types';
import { PropertyCard } from '@/components/property/PropertyCard';
import { HorizontalPropertyCarousel } from '@/components/home/HorizontalPropertyCarousel';

interface LatestPropertiesSectionProps {
  properties: PropertyListItem[];
}

export const LatestPropertiesSection: React.FC<LatestPropertiesSectionProps> = ({
  properties = [],
}) => {
  return (
    <section className="py-20 bg-white text-[#142C4C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 gap-4 border-b border-slate-200/70">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-[2px] bg-[#FF7A1A]" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#FF7A1A]">
                NEW ON MARKET
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142C4C] font-editorial tracking-tight">
              Latest Listings
            </h2>
            <p className="text-xs sm:text-sm text-[#71839D] font-medium mt-1.5 max-w-lg">
              Freshly verified homes, apartments, and commercial properties selected from the Admin Panel.
            </p>
          </div>

          <Link
            href="/properties?sortBy=newest"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#142C4C] bg-[#EAF3FC] hover:bg-[#142C4C] hover:text-white transition-all duration-200 border border-slate-200/60 shadow-xs shrink-0 self-start sm:self-auto"
          >
            <span>Explore All Properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Horizontal Carousel of Live Latest Listings */}
        {properties.length > 0 ? (
          <HorizontalPropertyCarousel itemCount={properties.length}>
            {properties.map((property) => (
              <div
                key={property.id}
                className="w-[84vw] sm:w-[340px] lg:w-[385px] shrink-0 snap-start"
              >
                <PropertyCard property={property} view="grid" />
              </div>
            ))}
          </HorizontalPropertyCarousel>
        ) : (
          <div className="text-center py-14 px-6 mt-8 bg-[#F8F7F4] rounded-3xl border border-dashed border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-full bg-white text-[#142C4C] flex items-center justify-center mx-auto shadow-xs">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#142C4C] font-editorial">
              No Latest Listings Selected Yet
            </h3>
            <p className="text-xs text-[#71839D] max-w-md mx-auto">
              Properties marked as Latest Listings in the Admin Panel will appear here automatically.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/properties/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#142C4C] hover:bg-[#0B1F38] shadow-sm transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Your Property</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
