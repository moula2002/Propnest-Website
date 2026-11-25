'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { favoriteService } from '@/services/favoriteService';
import { useAuth } from '@/hooks/useAuth';
import { Favorite } from '@/types';
import { PropertyCard } from '@/components/property/PropertyCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Heart, Loader2 } from 'lucide-react';
import { getErrorMessage } from '@/lib/api/client';

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      setIsLoading(false);
      router.replace('/login?redirect=/dashboard/favorites');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await favoriteService.getFavorites(1, 50);
      setFavorites(res.favorites || []);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        router.replace('/login?redirect=/dashboard/favorites');
        return;
      }
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchFavorites();
    } else if (!authLoading && !isAuthenticated) {
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, fetchFavorites]);

  const handleFavoriteChange = (propertyId: string, isFavorited: boolean) => {
    if (!isFavorited) {
      setFavorites((prev) => prev.filter((f) => f.propertyId !== propertyId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-navy-900 font-display">Saved Favorite Properties</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Properties you have bookmarked for easy reference and fast comparison.
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-darkNavy animate-spin" />
          <p className="text-sm text-slate-500">Loading your saved properties...</p>
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved properties yet"
          description="Click the heart icon on any property listing to save it to your dashboard favorites."
          actionText="Explore Properties"
          actionHref="/properties"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <PropertyCard
              key={fav.id}
              property={fav.property}
              isFavoritedInitially={true}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

