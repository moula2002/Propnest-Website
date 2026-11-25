'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

/**
 * Renders the fixed architectural apartment background image on all
 * non-homepage routes (the homepage manages its own alternating section backdrop).
 */
export const SubpageBackground: React.FC = () => {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none transform-gpu">
      <Image
        src="/images/properties/apartment-1.jpg"
        alt="Architectural background"
        fill
        quality={75}
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#F8F7F4]/80" />
    </div>
  );
};

