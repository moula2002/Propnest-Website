import React from 'react';
import Image from 'next/image';
import { propertyService } from '@/services/propertyService';
import { HeroSlider } from '@/components/home/HeroSlider';
import { HomeSearchBar } from '@/components/home/HomeSearchBar';
import { FeaturedPropertiesSection } from '@/components/home/FeaturedPropertiesSection';
import { CategorySection } from '@/components/home/CategorySection';
import { LatestPropertiesSection } from '@/components/home/LatestPropertiesSection';
import { LocationsSection } from '@/components/home/LocationsSection';
import { ServicesShowcaseSection } from '@/components/home/ServicesShowcaseSection';
import { AboutSection } from '@/components/home/AboutSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ContactSection } from '@/components/home/ContactSection';
import { PropertyListItem, LocationItem, PropertyCategory } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let featuredProperties: PropertyListItem[] = [];
  let latestProperties: PropertyListItem[] = [];
  let locations: LocationItem[] = [];
  let categories: PropertyCategory[] = [];
  let totalPropertiesCount = 0;

  try {
    const [featuredRes, latestRes, locsRes, catsRes] = await Promise.all([
      propertyService.getProperties({ isFeatured: true, limit: 12, sortBy: 'newest' }).catch(() => ({ properties: [], meta: undefined })),
      propertyService.getProperties({ isLatest: true, limit: 12, sortBy: 'newest' }).catch(() => ({ properties: [], meta: undefined })),
      propertyService.searchLocations().catch(() => []),
      propertyService.getCategories().catch(() => []),
    ]);

    featuredProperties = featuredRes.properties || [];
    latestProperties = latestRes.properties || [];
    locations = locsRes || [];
    categories = catsRes || [];
    totalPropertiesCount = Math.max(
      featuredRes.meta?.total || 0,
      latestRes.meta?.total || 0,
      featuredProperties.length,
      latestProperties.length
    );
  } catch (error) {
    console.error('Failed to load homepage dynamic data from backend:', error);
  }

  return (
    <div className="relative text-[#142C4C] min-h-screen">
      {/* Fixed Single Full-Page Apartment Background Image (GPU-composited, no blur lag) */}
      <div className="fixed inset-0 z-0 pointer-events-none transform-gpu">
        <Image
          src="/images/properties/apartment-1.jpg"
          alt="Luxury apartment architecture background"
          fill
          quality={75}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#F8F7F4]/80" />
      </div>

      <div className="relative z-10">
        {/* SECTION 2 – CINEMATIC HERO SECTION */}
        <HeroSlider />

        {/* SECTION 3 – ADVANCED PROPERTY SEARCH BAR */}
        <HomeSearchBar initialLocations={locations} initialCategories={categories} />

        {/* SECTION 4 – FEATURED PROPERTIES ("Handpicked Homes for You") */}
        <FeaturedPropertiesSection properties={featuredProperties} />

        {/* SECTION 5 – PROPERTY CATEGORIES ("Browse by Category") */}
        <CategorySection initialCategories={categories} />

        {/* SECTION 6 – LATEST LISTINGS (PROPERTIES) */}
        <LatestPropertiesSection properties={latestProperties} />

        {/* SECTION 7 – OUR SERVICES ("WHAT WE DO") */}
        <ServicesShowcaseSection />

        {/* SECTION 8 – FEATURED LOCATIONS */}
        <LocationsSection locations={locations} />

        {/* SECTION 9 – ABOUT PROPNEST */}
        <AboutSection
          stats={{
            propertiesCount: totalPropertiesCount,
            citiesCount: locations.length,
          }}
        />

        {/* SECTION 10 – CUSTOMER TESTIMONIALS */}
        <TestimonialsSection />

        {/* SECTION 11 – CONTACT US SECTION */}
        <ContactSection />
      </div>
    </div>
  );
}
