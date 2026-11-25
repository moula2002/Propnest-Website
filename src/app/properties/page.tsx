'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { propertyService } from '@/services/propertyService';
import { PropertyListItem, PaginationMeta } from '@/types';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { Pagination } from '@/components/common/Pagination';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        keyword: searchParams?.get('keyword') || undefined,
        city: searchParams?.get('city') || undefined,
        locality: searchParams?.get('locality') || undefined,
        listingType: searchParams?.get('listingType') || undefined,
        propertyType: searchParams?.get('propertyType') || undefined,
        minPrice: searchParams?.get('minPrice') || undefined,
        maxPrice: searchParams?.get('maxPrice') || undefined,
        bedrooms: searchParams?.get('bedrooms') || undefined,
        furnishingStatus: searchParams?.get('furnishingStatus') || undefined,
        amenities: searchParams?.get('amenities') || undefined,
        sortBy: (searchParams?.get('sortBy') as any) || 'newest',
        page: searchParams?.get('page') ? parseInt(searchParams.get('page') || '1', 10) : 1,
        limit: 12,
      };

      const res = await propertyService.getProperties(params);
      setProperties(res.properties || []);
      setMeta(res.meta);
    } catch (error) {
      console.error('Failed to search properties', error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('page', page.toString());
    router.push(`/properties?${params.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('sortBy', newSort);
    params.set('page', '1');
    router.push(`/properties?${params.toString()}`);
  };

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.delete(key);
    params.set('page', '1');
    router.push(`/properties?${params.toString()}`);
  };

  const activeCity = searchParams?.get('city');
  const activeListingType = searchParams?.get('listingType');
  const activePropertyType = searchParams?.get('propertyType');
  const activeKeyword = searchParams?.get('keyword');
  const activeBedrooms = searchParams?.get('bedrooms');

  let titlePrefix = 'All Properties';
  if (activeListingType === 'SALE') titlePrefix = 'Properties For Sale';
  if (activeListingType === 'RENT') titlePrefix = 'Properties For Rent';

  const heading = activeCity ? `${titlePrefix} in ${activeCity}` : titlePrefix;

  const hasActiveFilters = Boolean(
    activeCity || activeListingType || activePropertyType || activeKeyword || activeBedrooms
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-6 bg-transparent">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Properties', href: '/properties' }, ...(activeCity ? [{ label: activeCity }] : [])]} />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#FF7A1A] block mb-1">
            VERIFIED DIRECTORY
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#142C4C] font-editorial tracking-tight">{heading}</h1>
          <p className="text-xs sm:text-sm text-[#71839D] mt-1 font-medium">
            {meta?.total !== undefined ? `${meta.total} properties available` : 'Searching properties...'}
          </p>
        </div>

        {/* View Switcher, Sorting Dropdown & Mobile Filter Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sorting Dropdown */}
          <div className="relative flex items-center">
            <select
              value={searchParams?.get('sortBy') || 'newest'}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 text-xs font-bold text-[#142C4C] bg-white border border-slate-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price_low_to_high">Price: Low to High</option>
              <option value="price_high_to_low">Price: High to Low</option>
              <option value="oldest">Sort: Oldest First</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 text-xs font-bold text-[#142C4C] bg-white border border-slate-200 rounded-full shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#FF7A1A]" />
            <span>Filters</span>
          </button>

          {/* Grid / List Switcher */}
          <div className="hidden sm:flex items-center bg-white p-1 rounded-full border border-slate-200">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-full transition-all ${
                view === 'grid' ? 'bg-[#142C4C] text-white shadow-sm' : 'text-[#71839D] hover:text-[#142C4C]'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-full transition-all ${
                view === 'list' ? 'bg-[#142C4C] text-white shadow-sm' : 'text-[#71839D] hover:text-[#142C4C]'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 py-1">
          <span className="text-xs font-bold text-[#152B46] uppercase tracking-wider mr-1">Active:</span>
          {activeCity && (
            <button
              onClick={() => removeFilter('city')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-[#152B46] hover:border-rose-300 hover:text-rose-600 shadow-xs transition group"
            >
              <span>City: {activeCity}</span>
              <X className="w-3 h-3 text-slate-400 group-hover:text-rose-600" />
            </button>
          )}
          {activeListingType && (
            <button
              onClick={() => removeFilter('listingType')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-[#152B46] hover:border-rose-300 hover:text-rose-600 shadow-xs transition group"
            >
              <span>Type: {activeListingType === 'SALE' ? 'For Sale' : 'For Rent'}</span>
              <X className="w-3 h-3 text-slate-400 group-hover:text-rose-600" />
            </button>
          )}
          {activePropertyType && (
            <button
              onClick={() => removeFilter('propertyType')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-[#152B46] hover:border-rose-300 hover:text-rose-600 shadow-xs transition group"
            >
              <span>Category: {activePropertyType}</span>
              <X className="w-3 h-3 text-slate-400 group-hover:text-rose-600" />
            </button>
          )}
          {activeBedrooms && (
            <button
              onClick={() => removeFilter('bedrooms')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-[#152B46] hover:border-rose-300 hover:text-rose-600 shadow-xs transition group"
            >
              <span>Beds: {activeBedrooms} BHK</span>
              <X className="w-3 h-3 text-slate-400 group-hover:text-rose-600" />
            </button>
          )}
          {activeKeyword && (
            <button
              onClick={() => removeFilter('keyword')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-[#152B46] hover:border-rose-300 hover:text-rose-600 shadow-xs transition group"
            >
              <span>Keyword: &quot;{activeKeyword}&quot;</span>
              <X className="w-3 h-3 text-slate-400 group-hover:text-rose-600" />
            </button>
          )}
          <button
            onClick={() => router.push('/properties')}
            className="text-xs font-bold text-rose-600 hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-28">
          <PropertyFilters />
        </aside>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto z-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3.5 border-b border-[#F1F5F9] mb-4">
                  <h3 className="font-bold text-[#152B46] text-sm">Filter Properties</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#152B46]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <PropertyFilters onFilterChange={() => setMobileFilterOpen(false)} />
              </div>
            </div>
          </div>
        )}

        {/* Main Results */}
        <div className="lg:col-span-3 space-y-8">
          <PropertyGrid properties={properties} isLoading={isLoading} view={view} />

          {meta && meta.totalPages > 1 && (
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-[#64748B]">Loading properties...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
