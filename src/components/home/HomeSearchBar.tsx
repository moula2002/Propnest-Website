'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Home, IndianRupee, BedDouble, Search, KeyRound } from 'lucide-react';
import { propertyService } from '@/services/propertyService';
import { LocationItem, PropertyCategory } from '@/types';

interface HomeSearchBarProps {
  initialLocations?: LocationItem[];
  initialCategories?: PropertyCategory[];
}

export const HomeSearchBar: React.FC<HomeSearchBarProps> = ({
  initialLocations = [],
  initialCategories = [],
}) => {
  const router = useRouter();
  const [listingType, setListingType] = useState<'SALE' | 'RENT'>('SALE');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>(() =>
    Array.from(new Set(initialLocations.map((l) => l.city)))
  );
  const [categories, setCategories] = useState<PropertyCategory[]>(initialCategories);

  // Fetch real cities and categories from database if not passed via SSR
  useEffect(() => {
    if (initialCategories.length === 0) {
      propertyService
        .getCategories()
        .then((cats) => {
          if (Array.isArray(cats) && cats.length > 0) {
            setCategories(cats);
          }
        })
        .catch((err) => {
          console.error('Failed to load categories for search bar', err);
        });
    }

    if (initialLocations.length > 0) return;
    propertyService
      .searchLocations()
      .then((locs: LocationItem[]) => {
        if (locs && locs.length > 0) {
          const unique = Array.from(new Set(locs.map((l) => l.city)));
          setAvailableCities(unique);
        }
      })
      .catch((err) => {
        console.error('Failed to load cities for search bar', err);
      });
  }, [initialCategories.length, initialLocations.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingType) params.set('listingType', listingType);
    if (city.trim()) params.set('city', city.trim());
    if (propertyType) params.set('propertyType', propertyType);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative z-30 max-w-6xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 lg:-mt-14">
      {/* Floating Pill Search Bar Container */}
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl lg:rounded-full p-3 sm:p-4 shadow-2xl border border-white/90">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 sm:gap-3">
          {/* 1. Transaction Type Toggle (Buy / Rent) */}
          <div className="flex items-center bg-[#F8F7F4] p-1 rounded-full border border-slate-200/80 shrink-0 self-center lg:self-auto">
            <button
              type="button"
              onClick={() => {
                setListingType('SALE');
                setMaxPrice('');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                listingType === 'SALE'
                  ? 'bg-[#142C4C] text-white shadow-xs'
                  : 'text-[#71839D] hover:text-[#142C4C]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Buy</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setListingType('RENT');
                setMaxPrice('');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                listingType === 'RENT'
                  ? 'bg-[#142C4C] text-white shadow-xs'
                  : 'text-[#71839D] hover:text-[#142C4C]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Rent</span>
            </button>
          </div>

          <div className="hidden lg:block w-[1px] h-8 bg-slate-200 shrink-0 mx-1" />

          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 flex-1 items-center">
            {/* Field 1: Dynamic Location */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl lg:rounded-none hover:bg-slate-50 transition border border-slate-100 lg:border-none">
              <div className="w-8 h-8 rounded-full bg-[#EAF3FC] text-[#142C4C] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#FF7A1A]" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#71839D]">Location</span>
                {availableCities.length > 0 ? (
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs text-[#142C4C] font-bold focus:outline-none bg-transparent cursor-pointer truncate"
                  >
                    <option value="">All Locations</option>
                    {availableCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city or area"
                    className="w-full text-xs text-[#142C4C] font-bold placeholder-[#94A3B8] focus:outline-none bg-transparent truncate"
                  />
                )}
              </div>
            </div>

            {/* Field 2: Property Type matching Backend Enum */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl lg:rounded-none hover:bg-slate-50 transition border border-slate-100 lg:border-none">
              <div className="w-8 h-8 rounded-full bg-[#EAF3FC] text-[#142C4C] flex items-center justify-center shrink-0">
                <Home className="w-4 h-4 text-[#FF7A1A]" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#71839D]">Property Type</span>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full text-xs text-[#142C4C] font-bold focus:outline-none bg-transparent cursor-pointer truncate"
                >
                  <option value="">Any Type</option>
                  {categories.map((cat) => (
                    <option key={cat.id || cat.type} value={cat.type}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field 3: Budget (Dynamic based on Buy vs Rent) */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl lg:rounded-none hover:bg-slate-50 transition border border-slate-100 lg:border-none">
              <div className="w-8 h-8 rounded-full bg-[#EAF3FC] text-[#142C4C] flex items-center justify-center shrink-0">
                <IndianRupee className="w-4 h-4 text-[#FF7A1A]" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#71839D]">Budget</span>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full text-xs text-[#142C4C] font-bold focus:outline-none bg-transparent cursor-pointer truncate"
                >
                  <option value="">Any Budget</option>
                  {listingType === 'SALE' ? (
                    <>
                      <option value="5000000">Up to ₹50 Lakh</option>
                      <option value="10000000">Up to ₹1 Crore</option>
                      <option value="25000000">Up to ₹2.5 Crore</option>
                      <option value="50000000">Up to ₹5 Crore</option>
                      <option value="100000000">Up to ₹10 Crore</option>
                    </>
                  ) : (
                    <>
                      <option value="25000">Up to ₹25,000 /mo</option>
                      <option value="50000">Up to ₹50,000 /mo</option>
                      <option value="100000">Up to ₹1 Lakh /mo</option>
                      <option value="250000">Up to ₹2.5 Lakh /mo</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Field 4: Bedrooms */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl lg:rounded-none hover:bg-slate-50 transition border border-slate-100 lg:border-none">
              <div className="w-8 h-8 rounded-full bg-[#EAF3FC] text-[#142C4C] flex items-center justify-center shrink-0">
                <BedDouble className="w-4 h-4 text-[#FF7A1A]" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#71839D]">Bedrooms</span>
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full text-xs text-[#142C4C] font-bold focus:outline-none bg-transparent cursor-pointer truncate"
                >
                  <option value="">Any BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="group relative px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#142C4C] hover:bg-[#0B1F38] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
          >
            <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
};
