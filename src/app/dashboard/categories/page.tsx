'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Layers,
  Building2,
  ArrowRight,
  PlusCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { propertyService } from '@/services/propertyService';
import { PropertyCategory } from '@/types';
import { getFullImageUrl } from '@/lib/utils';

export default function DashboardCategoriesPage() {
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await propertyService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load categories', err);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF7A1A] mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Property Classifications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142C4C] font-editorial">
            Property Categories
          </h1>
          <p className="text-xs sm:text-sm text-[#71839D] mt-1 font-medium">
            Browse all active property categories configured on PropNest and post listings directly into any category.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={loadCategories}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#142C4C] bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-xs transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/dashboard/properties/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#142C4C] hover:bg-[#0B1F38] rounded-full shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Property</span>
          </Link>
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-3xl bg-white border border-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count =
              cat.approvedProperties > 0 ? cat.approvedProperties : cat.totalProperties;
            const hasImage = Boolean(cat.imageUrl);

            return (
              <div
                key={cat.id || cat.type}
                className="group bg-white rounded-3xl border border-slate-200/80 shadow-card hover:shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
              >
                {/* Category Image */}
                <div className="relative h-44 w-full bg-gradient-to-br from-[#142C4C] to-[#0B1F38] overflow-hidden">
                  {hasImage ? (
                    <Image
                      src={getFullImageUrl(cat.imageUrl)}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-15">
                      <Building2 className="w-20 h-20 text-white" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-[#142C4C] shadow-xs">
                      {cat.type}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FF7A1A] text-white shadow-xs">
                      {count} {count === 1 ? 'Listing' : 'Listings'}
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 left-4 right-4">
                    <h2 className="text-lg font-bold text-white font-editorial truncate drop-shadow-sm">
                      {cat.name}
                    </h2>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-[#71839D] leading-relaxed line-clamp-2 font-medium">
                    {cat.description || `Browse or list properties under the ${cat.name} category.`}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/properties?propertyType=${encodeURIComponent(cat.type)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#142C4C] hover:text-[#FF7A1A] transition"
                    >
                      <span>View Listings</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/dashboard/properties/create?category=${encodeURIComponent(cat.type)}`}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-white bg-[#142C4C] hover:bg-[#FF7A1A] transition"
                    >
                      <span>Post Here</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-200 space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#EAF3FC] text-[#142C4C] flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#142C4C] font-editorial">
            No Active Categories Found
          </h3>
          <p className="text-xs text-[#71839D] max-w-md mx-auto">
            Categories created in the Admin Panel will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}

