'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, RotateCcw, Filter, Check, SlidersHorizontal, MapPin, Home, IndianRupee } from 'lucide-react';
import { Amenity, PropertyCategory } from '@/types';
import { propertyService } from '@/services/propertyService';

interface PropertyFiltersProps {
  onFilterChange?: () => void;
  className?: string;
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({ onFilterChange, className }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Local state initialized from searchParams
  const [keyword, setKeyword] = useState(searchParams?.get('keyword') || '');
  const [city, setCity] = useState(searchParams?.get('city') || '');
  const [locality, setLocality] = useState(searchParams?.get('locality') || '');
  const [listingType, setListingType] = useState(searchParams?.get('listingType') || '');
  const [propertyType, setPropertyType] = useState(searchParams?.get('propertyType') || '');
  const [minPrice, setMinPrice] = useState(searchParams?.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams?.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams?.get('bedrooms') || '');
  const [furnishingStatus, setFurnishingStatus] = useState(searchParams?.get('furnishingStatus') || '');
  const [sortBy, setSortBy] = useState(searchParams?.get('sortBy') || 'newest');
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams?.get('amenities') ? searchParams.get('amenities')!.split(',') : []
  );

  useEffect(() => {
    propertyService
      .getAmenities()
      .then((data) => setAmenities(data))
      .catch((err) => console.error('Failed to load amenities', err));

    propertyService
      .getCategories()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const handleApply = () => {
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (city.trim()) params.set('city', city.trim());
    if (locality.trim()) params.set('locality', locality.trim());
    if (listingType) params.set('listingType', listingType);
    if (propertyType) params.set('propertyType', propertyType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (furnishingStatus) params.set('furnishingStatus', furnishingStatus);
    if (sortBy) params.set('sortBy', sortBy);
    if (selectedAmenities.length > 0) params.set('amenities', selectedAmenities.join(','));

    // Reset to page 1 on filter change
    params.set('page', '1');

    router.push(`/properties?${params.toString()}`);
    onFilterChange?.();
  };

  const handleClear = () => {
    setKeyword('');
    setCity('');
    setLocality('');
    setListingType('');
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setFurnishingStatus('');
    setSortBy('newest');
    setSelectedAmenities([]);
    router.push('/properties');
    onFilterChange?.();
  };

  const toggleAmenity = (slug: string) => {
    if (selectedAmenities.includes(slug)) {
      setSelectedAmenities(selectedAmenities.filter((s) => s !== slug));
    } else {
      setSelectedAmenities([...selectedAmenities, slug]);
    }
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-6 ${className || ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-[#142C4C] text-sm">
          <SlidersHorizontal className="w-4 h-4 text-[#FF7A1A]" />
          <span>Filters</span>
        </div>
        <button
          onClick={handleClear}
          className="text-xs font-semibold text-[#71839D] hover:text-rose-600 flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Purpose (Buy / Rent) */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-2">
          Purpose
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['', 'SALE', 'RENT'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setListingType(type)}
              className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                listingType === type
                  ? 'bg-[#142C4C] text-white border-[#142C4C] shadow-sm'
                  : 'bg-white text-[#71839D] border-slate-200 hover:bg-[#F8F7F4]'
              }`}
            >
              {type === '' ? 'All' : type === 'SALE' ? 'Buy' : 'Rent'}
            </button>
          ))}
        </div>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1.5">
          Keywords
        </label>
        <div className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="e.g. Garden, Pool, Penthouse"
            className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] bg-[#F8F7F4] text-[#142C4C]"
          />
          <Search className="w-4 h-4 text-[#71839D] absolute left-3 top-3" />
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1.5">
          City
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Bengaluru, Mumbai"
          className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] bg-[#F8F7F4] text-[#142C4C]"
        />
      </div>

      {/* Locality */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1.5">
          Locality
        </label>
        <input
          type="text"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          placeholder="e.g. Koramangala, Whitefield"
          className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] bg-[#F8F7F4] text-[#142C4C]"
        />
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1.5">
          Property Type
        </label>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] bg-[#F8F7F4] text-[#142C4C]"
        >
          <option value="">All Types</option>
          {categories.map((cat) => (
            <option key={cat.id || cat.type} value={cat.type}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bedrooms (BHK) */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-2">
          Bedrooms (BHK)
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {['', '1', '2', '3', '4'].map((bhk) => (
            <button
              key={bhk}
              type="button"
              onClick={() => setBedrooms(bhk)}
              className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                bedrooms === bhk
                  ? 'bg-[#142C4C] text-white border-[#142C4C] shadow-sm'
                  : 'bg-white text-[#71839D] border-slate-200 hover:bg-[#F8F7F4]'
              }`}
            >
              {bhk === '' ? 'Any' : `${bhk}`}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1.5">
          Price Range (₹)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price"
            className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] bg-[#F8F7F4] text-[#142C4C]"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price"
            className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] bg-[#F8F7F4] text-[#142C4C]"
          />
        </div>
      </div>

      {/* Furnishing */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1.5">
          Furnishing
        </label>
        <select
          value={furnishingStatus}
          onChange={(e) => setFurnishingStatus(e.target.value)}
          className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] bg-[#F8F7F4] text-[#142C4C]"
        >
          <option value="">Any Status</option>
          <option value="FULLY_FURNISHED">Fully Furnished</option>
          <option value="SEMI_FURNISHED">Semi Furnished</option>
          <option value="UNFURNISHED">Unfurnished</option>
        </select>
      </div>

      {/* Amenities */}
      {amenities.length > 0 && (
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-2">
            Amenities
          </label>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {amenities.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2.5 text-xs font-medium text-[#71839D] hover:text-[#142C4C] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(item.slug)}
                  onChange={() => toggleAmenity(item.slug)}
                  className="rounded-md border-slate-300 text-[#FF7A1A] focus:ring-[#FF7A1A] w-4 h-4"
                />
                <span>{item.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Apply Button */}
      <button
        type="button"
        onClick={handleApply}
        className="group relative w-full py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#142C4C] hover:bg-[#0B1F38] rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        <Search className="w-4 h-4 relative z-10 transition-transform group-hover:scale-110" />
        <span className="relative z-10">Apply Filters</span>
      </button>
    </div>
  );
};
