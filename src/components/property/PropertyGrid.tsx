import React from 'react';
import { PropertyListItem } from '@/types';
import { PropertyCard } from './PropertyCard';
import { PropertyCardSkeleton } from '@/components/common/LoadingSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Home } from 'lucide-react';

interface PropertyGridProps {
  properties: PropertyListItem[];
  isLoading?: boolean;
  view?: 'grid' | 'list';
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionText?: string;
  emptyActionHref?: string;
  onFavoriteChange?: (propertyId: string, isFavorited: boolean) => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({
  properties,
  isLoading = false,
  view = 'grid',
  emptyTitle = 'No properties found',
  emptyDescription = 'Try adjusting your search filters or browse other popular localities.',
  emptyActionText = 'Browse All Properties',
  emptyActionHref = '/properties',
  onFavoriteChange,
}) => {
  if (isLoading) {
    return (
      <div
        className={
          view === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <PropertyCardSkeleton key={index} view={view} />
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <EmptyState
        icon={Home}
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        actionHref={emptyActionHref}
      />
    );
  }

  return (
    <div
      className={`animate-fade-in-up ${
        view === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }`}
    >
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          view={view}
          onFavoriteChange={onFavoriteChange}
        />
      ))}
    </div>
  );
};

