'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize, X } from 'lucide-react';
import { PropertyImage } from '@/types';
import { getFullImageUrl } from '@/lib/utils';

interface PropertyGalleryProps {
  images: PropertyImage[];
  title: string;
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const displayImages =
    images && images.length > 0
      ? images
      : [
          {
            id: 'placeholder',
            imageUrl: '/images/properties/property-gallery-fallback.jpg',
            altText: title,
          },
        ];

  const currentImage = displayImages[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image Display */}
      <div className="relative w-full h-[320px] sm:h-[450px] md:h-[500px] rounded-2xl overflow-hidden bg-slate-900 group">
        <Image
          src={getFullImageUrl(currentImage.imageUrl)}
          alt={currentImage.altText || `${title} - Image ${currentIndex + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 900px"
        />

        {/* Counter Pill */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-xs font-medium">
          {currentIndex + 1} / {displayImages.length}
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={() => setFullscreenOpen(true)}
          className="absolute bottom-4 right-4 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full text-white transition"
          aria-label="View Fullscreen"
        >
          <Maximize className="w-4 h-4" />
        </button>

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {displayImages.map((img, index) => (
            <button
              key={img.id || index}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-20 h-14 sm:w-24 sm:h-16 shrink-0 rounded-lg overflow-hidden border-2 transition ${
                currentIndex === index ? 'border-primary-600 ring-2 ring-primary-200' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={getFullImageUrl(img.thumbnailUrl || img.imageUrl)}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="100px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal Viewer */}
      {fullscreenOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4">
          <div className="flex justify-between items-center text-white px-4 pt-2">
            <span className="text-sm font-medium">
              {title} — {currentIndex + 1} of {displayImages.length}
            </span>
            <button
              onClick={() => setFullscreenOpen(false)}
              className="p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="Close fullscreen view"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
              <Image
                src={getFullImageUrl(currentImage.imageUrl)}
                alt={currentImage.altText || title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {displayImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-6 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-6 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto pb-4">
            {displayImages.map((img, index) => (
              <button
                key={img.id || index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-16 h-12 shrink-0 rounded-md overflow-hidden border-2 transition ${
                  currentIndex === index ? 'border-primary-500 scale-105' : 'border-transparent opacity-60'
                }`}
              >
                <Image
                  src={getFullImageUrl(img.thumbnailUrl || img.imageUrl)}
                  alt="thumb"
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

