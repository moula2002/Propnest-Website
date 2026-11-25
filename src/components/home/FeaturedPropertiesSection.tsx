'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  ShieldCheck,
  Building2,
  PlusCircle,
} from 'lucide-react';
import { PropertyListItem } from '@/types';
import { formatPrice, formatArea, getFullImageUrl } from '@/lib/utils';
import { favoriteService } from '@/services/favoriteService';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { HorizontalPropertyCarousel } from '@/components/home/HorizontalPropertyCarousel';

const PLACEHOLDER = '/images/properties/property-placeholder.jpg';

/** Isolated card component so each card has its own imgError state */
const FeaturedPropertyCard: React.FC<{
  property: PropertyListItem;
  isFavorited: boolean;
  isToggling: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
}> = ({ property, isFavorited, isToggling, onToggleFavorite }) => {
  const [imgError, setImgError] = useState(false);

  const rawImg = property.images?.[0]?.imageUrl || '';
  const displayImage =
    !imgError && rawImg ? getFullImageUrl(rawImg) : PLACEHOLDER;

  const isRent = property.listingType === 'RENT';
  const priceDisplay = isRent
    ? `${formatPrice(Number(property.price))} /month`
    : formatPrice(Number(property.price));

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1.5 w-[84vw] sm:w-[340px] lg:w-[385px] shrink-0 snap-start">
      {/* Image Container with Badges & Bottom Price Overlay */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100">
        <Image
          src={displayImage}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 768px) 84vw, (max-width: 1200px) 340px, 385px"
          onError={() => setImgError(true)}
          unoptimized
        />

        {/* Cinematic Dark Bottom & Top Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/25" />

        {/* Top-Left Multi-Pill Badges */}
        <div className="absolute top-3.5 left-3.5 z-10 flex flex-wrap items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm ${
              isRent ? 'bg-[#142C4C]' : 'bg-[#FF7A1A]'
            }`}
          >
            {isRent ? 'For Rent' : 'For Sale'}
          </span>
          {property.verifiedAt && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#0B1F38]/85 text-white backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-3 h-3 text-[#FF7A1A]" />
              <span>Verified</span>
            </span>
          )}
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/55 text-white backdrop-blur-md">
            {property.propertyType}
          </span>
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => onToggleFavorite(e, property.id)}
          className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-[#142C4C] hover:text-rose-500 hover:bg-white transition-all transform hover:scale-110 active:scale-95"
          aria-label="Add to favorites"
          disabled={isToggling}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Bottom-Left Bold Price Overlay + Bottom-Right Expand Icon */}
        <div className="absolute bottom-3.5 left-4 right-4 z-10 flex items-end justify-between">
          <div>
            <span className="text-xl sm:text-2xl font-black text-white font-display tracking-tight drop-shadow-md">
              {priceDisplay}
            </span>
          </div>
          <Link
            href={`/properties/${property.slug || property.id}`}
            className="w-8 h-8 rounded-lg bg-black/60 hover:bg-[#FF7A1A] text-white backdrop-blur-md flex items-center justify-center transition-colors"
            aria-label={`Inspect ${property.title}`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <Link href={`/properties/${property.slug || property.id}`}>
            <h3 className="text-lg font-bold text-[#142C4C] font-editorial line-clamp-1 group-hover:text-[#FF7A1A] transition-colors">
              {property.title}
            </h3>
          </Link>

          {/* Locality & City */}
          <div className="flex items-center gap-1.5 text-xs text-[#71839D] font-medium mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#FF7A1A] shrink-0" />
            <span className="truncate">
              {property.locality}, {property.city}
            </span>
          </div>
        </div>

        {/* Footer Specs & Action */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-[#71839D] font-semibold">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5 text-[#142C4C]/60" />
              <span>{property.bedrooms || 1} Beds</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5 text-[#142C4C]/60" />
              <span>{property.bathrooms || 1} Baths</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-[#142C4C]/60" />
              <span>{formatArea(Number(property.carpetArea) || 0, property.areaUnit || 'sqft')}</span>
            </div>
          </div>

          <Link
            href={`/properties/${property.slug || property.id}`}
            className="w-8 h-8 rounded-full bg-[#EAF3FC] group-hover:bg-[#FF7A1A] text-[#142C4C] group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0"
            aria-label={`View details of ${property.title}`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

interface Props {
  properties: PropertyListItem[];
}

export const FeaturedPropertiesSection: React.FC<Props> = ({ properties = [] }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'ALL' | 'SALE' | 'RENT'>('ALL');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Dynamic filter on real backend properties
  const filteredProperties = properties.filter((prop) => {
    if (activeTab === 'ALL') return true;
    return prop.listingType === activeTab;
  });

  const saleCount = properties.filter((p) => p.listingType === 'SALE').length;
  const rentCount = properties.filter((p) => p.listingType === 'RENT').length;

  const handleToggleFavorite = async (e: React.MouseEvent, propId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=/properties`);
      return;
    }

    if (togglingId === propId) return;
    setTogglingId(propId);

    const isFav = favorites[propId];
    setFavorites((prev) => ({ ...prev, [propId]: !isFav }));

    try {
      if (isFav) {
        await favoriteService.removeFavorite(propId);
      } else {
        await favoriteService.addFavorite(propId);
      }
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      // Revert on error
      setFavorites((prev) => ({ ...prev, [propId]: isFav }));
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <section id="properties" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* SECTION HEADER & TABS BAR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-5 h-[2px] bg-[#FF7A1A]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF7A1A]">
              FEATURED PROPERTIES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142C4C] font-display tracking-tight">
            Handpicked Homes for You
          </h2>
          <p className="text-xs sm:text-sm text-[#71839D] font-medium mt-1.5 max-w-xl">
            Live database listings — verified residences, modern apartments, and rental homes across India.
          </p>
        </div>

        {/* Tab Filters & View All Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 bg-white rounded-full border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                activeTab === 'ALL'
                  ? 'bg-[#142C4C] text-white shadow-xs'
                  : 'text-[#71839D] hover:text-[#142C4C] hover:bg-slate-50'
              }`}
            >
              All ({properties.length})
            </button>
            <button
              onClick={() => setActiveTab('SALE')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                activeTab === 'SALE'
                  ? 'bg-[#142C4C] text-white shadow-xs'
                  : 'text-[#71839D] hover:text-[#142C4C] hover:bg-slate-50'
              }`}
            >
              For Sale ({saleCount})
            </button>
            <button
              onClick={() => setActiveTab('RENT')}
              className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all duration-200 ${
                activeTab === 'RENT'
                  ? 'bg-[#142C4C] text-white shadow-xs'
                  : 'text-[#71839D] hover:text-[#142C4C] hover:bg-slate-50'
              }`}
            >
              For Rent ({rentCount})
            </button>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#142C4C] bg-white hover:bg-[#142C4C] hover:text-white transition-all duration-200 border border-slate-200/80 shadow-xs"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* DYNAMIC HORIZONTAL PROPERTY CAROUSEL */}
      {filteredProperties.length > 0 ? (
        <HorizontalPropertyCarousel itemCount={filteredProperties.length}>
          {filteredProperties.map((property) => (
            <FeaturedPropertyCard
              key={property.id}
              property={property}
              isFavorited={!!favorites[property.id]}
              isToggling={togglingId === property.id}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </HorizontalPropertyCarousel>
      ) : (
        /* Empty State */
        <div className="pt-10 text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 mt-6 space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-[#71839D] flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#142C4C]">No properties found in this category</h3>
          <p className="text-xs text-[#71839D] max-w-sm mx-auto">
            Try switching to another tab or browse our complete real estate directory to find verified homes.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('ALL')}
              className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#142C4C] hover:bg-[#0B1F38]"
            >
              Show All Properties
            </button>
            <Link
              href="/dashboard/properties/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-[#FF7A1A] bg-orange-50 hover:bg-orange-100"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Your Property</span>
            </Link>
          </div>
        </div>
      )}
      </div>
    </section>
  );
};
