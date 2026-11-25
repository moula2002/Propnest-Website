'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, BedDouble, Bath, Maximize2, ArrowRight, ShieldCheck } from 'lucide-react';
import { PropertyListItem } from '@/types';
import { formatPrice, formatArea, getFullImageUrl } from '@/lib/utils';
import { favoriteService } from '@/services/favoriteService';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface PropertyCardProps {
  property: PropertyListItem;
  isFavoritedInitially?: boolean;
  onFavoriteChange?: (propertyId: string, isFavorited: boolean) => void;
  view?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavoritedInitially = false,
  onFavoriteChange,
  view = 'grid',
}) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(isFavoritedInitially);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const mainImage = property.images && property.images.length > 0 ? property.images[0] : null;
  const rawImageUrl = mainImage?.imageUrl || mainImage?.thumbnailUrl;
  const imageSrc =
    !imgError && rawImageUrl
      ? getFullImageUrl(rawImageUrl)
      : '/images/properties/property-placeholder.jpg';

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?redirect=/properties/${property.slug || property.id}`);
      return;
    }

    try {
      setIsFavLoading(true);
      if (isFavorited) {
        await favoriteService.removeFavorite(property.id);
        setIsFavorited(false);
        onFavoriteChange?.(property.id, false);
      } else {
        await favoriteService.addFavorite(property.id);
        setIsFavorited(true);
        onFavoriteChange?.(property.id, true);
      }
    } catch (err) {
      console.error('Failed to update favorite', err);
    } finally {
      setIsFavLoading(false);
    }
  };

  const propertyLink = `/properties/${property.slug || property.id}`;
  const isRent = property.listingType === 'RENT';
  const priceDisplay = isRent
    ? `${formatPrice(property.price)} /month`
    : formatPrice(property.price);

  if (view === 'list') {
    return (
      <div className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col sm:flex-row hover:-translate-y-1">
        {/* Card Image */}
        <div className="relative w-full sm:w-80 h-56 sm:h-auto shrink-0 bg-slate-100 overflow-hidden">
          <Link href={propertyLink} className="block w-full h-full relative">
            <Image
              src={imageSrc}
              alt={mainImage?.altText || property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={() => setImgError(true)}
              sizes="(max-width: 640px) 100vw, 320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25" />
          </Link>

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
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-[#0B1F38]/85 text-white backdrop-blur-md">
                <ShieldCheck className="w-3 h-3 text-[#FF7A1A]" />
                <span>Verified</span>
              </span>
            )}
          </div>

          {/* Top-Right Favorite button */}
          <button
            onClick={handleFavoriteClick}
            disabled={isFavLoading}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-[#142C4C] hover:text-rose-500 hover:bg-white transition-all transform hover:scale-110 active:scale-90 z-10"
            aria-label="Save to favorites"
          >
            <Heart
              className={`w-4 h-4 transition-all duration-200 ${
                isFavorited ? 'fill-rose-500 text-rose-500 scale-110' : ''
              }`}
            />
          </button>

          {/* Bottom-Left Price Overlay */}
          <div className="absolute bottom-3.5 left-4 z-10">
            <span className="text-xl font-black text-white font-display tracking-tight drop-shadow-md">
              {priceDisplay}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF7A1A]">
                {property.propertyType}
              </span>
            </div>

            <Link href={propertyLink} className="block">
              <h3 className="font-bold text-[#142C4C] group-hover:text-[#FF7A1A] text-lg line-clamp-1 mb-1.5 tracking-tight font-editorial transition-colors">
                {property.title}
              </h3>
            </Link>

            <p className="text-xs text-[#71839D] flex items-center gap-1.5 mb-5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#FF7A1A] shrink-0" />
              <span className="truncate">
                {property.locality}, {property.city}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-between pt-3.5 border-t border-slate-100">
            <div className="flex items-center gap-4 text-xs text-[#71839D] font-semibold">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1.5">
                  <BedDouble className="w-3.5 h-3.5 text-[#142C4C]/60" />
                  <span>{property.bedrooms} Beds</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-[#142C4C]/60" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-[#142C4C]/60" />
                <span>{formatArea(property.carpetArea, property.areaUnit)}</span>
              </div>
            </div>

            <Link
              href={propertyLink}
              className="w-9 h-9 rounded-full bg-[#EAF3FC] group-hover:bg-[#FF7A1A] text-[#142C4C] group-hover:text-white flex items-center justify-center transition-all duration-300"
              aria-label="View property details"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Signature Reference Card Style)
  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col hover:-translate-y-1.5">
      {/* Card Image */}
      <div className="relative aspect-[16/11] w-full bg-slate-100 overflow-hidden">
        <Link href={propertyLink} className="block w-full h-full relative">
          <Image
            src={imageSrc}
            alt={mainImage?.altText || property.title}
            fill
            className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/25" />
        </Link>

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
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-[#0B1F38]/85 text-white backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-3 h-3 text-[#FF7A1A]" />
              <span>Verified</span>
            </span>
          )}
          <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/55 text-white backdrop-blur-md">
            {property.propertyType}
          </span>
        </div>

        {/* Top-Right Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isFavLoading}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md flex items-center justify-center text-[#142C4C] hover:text-rose-500 hover:bg-white transition-all transform hover:scale-110 active:scale-90 z-10"
          aria-label="Save to favorites"
        >
          <Heart
            className={`w-4 h-4 transition-all duration-200 ${
              isFavorited ? 'fill-rose-500 text-rose-500 scale-110' : ''
            }`}
          />
        </button>

        {/* Bottom-Left Price Overlay & Bottom-Right Expand Icon */}
        <div className="absolute bottom-3.5 left-4 right-4 z-10 flex items-end justify-between pointer-events-none">
          <span className="text-xl font-black text-white font-display tracking-tight drop-shadow-md">
            {priceDisplay}
          </span>
          <Link
            href={propertyLink}
            className="pointer-events-auto w-8 h-8 rounded-lg bg-black/60 hover:bg-[#FF7A1A] text-white backdrop-blur-md flex items-center justify-center transition-colors"
            aria-label={`Inspect ${property.title}`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link href={propertyLink} className="block">
            <h3 className="font-bold text-[#142C4C] group-hover:text-[#FF7A1A] text-lg line-clamp-1 mb-1.5 tracking-tight font-editorial transition-colors">
              {property.title}
            </h3>
          </Link>

          <p className="text-xs text-[#71839D] flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#FF7A1A] shrink-0" />
            <span className="truncate">
              {property.locality}, {property.city}
            </span>
          </p>
        </div>

        {/* Footer Specs & Action */}
        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100 text-xs text-[#71839D] font-semibold">
          <div className="flex items-center gap-3">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1" title={`${property.bedrooms} Bedrooms`}>
                <BedDouble className="w-3.5 h-3.5 text-[#142C4C]/60" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1" title={`${property.bathrooms} Bathrooms`}>
                  <Bath className="w-3.5 h-3.5 text-[#142C4C]/60" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              </>
            )}
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1" title="Carpet Area">
              <Maximize2 className="w-3.5 h-3.5 text-[#142C4C]/60" />
              <span>{formatArea(property.carpetArea, property.areaUnit)}</span>
            </div>
          </div>

          <Link
            href={propertyLink}
            className="w-8 h-8 rounded-full bg-[#EAF3FC] group-hover:bg-[#FF7A1A] text-[#142C4C] group-hover:text-white flex items-center justify-center transition-all duration-300 shrink-0"
            aria-label="View property details"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
