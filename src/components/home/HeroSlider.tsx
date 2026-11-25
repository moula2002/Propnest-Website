'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  badge: string;
  headlineTop: string;
  headlineBottom: string;
  italicText: string;
  description: string;
  tagline: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 1,
    image: '/images/hero/hero-slide-1.jpg',
    badge: 'PREMIUM PROPERTIES • BETTER LIVING',
    headlineTop: 'Find Your',
    headlineBottom: 'Dream Home',
    italicText: 'with PropNest',
    description:
      'Discover modern homes, prime locations and lifestyle-driven communities — all in one place.',
    tagline: 'Luxury Villa at Dusk',
  },
  {
    id: 2,
    image: '/images/hero/hero-slide-2.jpg',
    badge: 'HANDPICKED ARCHITECTURAL MASTERPIECES',
    headlineTop: 'Curated Spaces',
    headlineBottom: 'For Modern Life',
    italicText: 'with PropNest',
    description:
      'Bespoke residences designed for comfort, luxury, and lifelong memories across top metropolitan hubs.',
    tagline: 'Contemporary Living Poolside',
  },
  {
    id: 3,
    image: '/images/hero/hero-slide-3.jpg',
    badge: '100% VERIFIED EXCLUSIVE ESTATES',
    headlineTop: 'Elevate Your',
    headlineBottom: 'Living Standard',
    italicText: 'with PropNest',
    description:
      'Direct owner connections, transparent pricing, and verified listings with zero brokerage hassles.',
    tagline: 'Private Modern Sanctuary',
  },
];

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <>
      <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center pt-28 sm:pt-32 pb-16 lg:pb-24 overflow-hidden">
        {/* Full-bleed Active Luxury Background Image */}
        <div className="absolute inset-0">
          <Image
            key={slide.id}
            src={slide.image}
            alt={slide.tagline}
            fill
            priority
            quality={80}
            className="object-cover object-center transition-opacity duration-500"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/85 sm:via-[#FAF9F6]/75 lg:via-[#FAF9F6]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F8F7F4] via-transparent to-black/25" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-6 text-left max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-orange-200/60 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7A1A] fill-[#FF7A1A]" />
                <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#142C4C]">
                  {slide.badge}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#142C4C] tracking-tight leading-[1.08] font-display">
                {slide.headlineTop} <br />
                {slide.headlineBottom} <br />
                <span className="brand-script-orange text-[#FF7A1A] font-normal tracking-normal text-4xl sm:text-6xl lg:text-7xl inline-block">
                  {slide.italicText}
                </span>
              </h1>

              {/* Supporting Description */}
              <p className="text-sm sm:text-base text-[#4A5D75] max-w-lg font-medium leading-relaxed">
                {slide.description}
              </p>

              {/* Primary CTA Button */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/properties"
                  className="group inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold text-white bg-[#142C4C] hover:bg-[#0B1F38] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span>Explore Properties</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            {/* Minimal Right Slide Indicator: 01 / 03 */}
            <div className="hidden lg:flex lg:col-span-4 flex-col items-end justify-center pr-4">
              <div className="flex flex-col items-center bg-white/85 backdrop-blur-md px-3 py-4 rounded-full border border-white/80 shadow-lg space-y-3">
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full bg-[#142C4C] text-white hover:bg-[#FF7A1A] flex items-center justify-center transition-colors shadow-xs"
                  aria-label="Previous slide"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>

                <div className="text-center py-1">
                  <span className="text-sm font-black text-[#142C4C] font-display block leading-none">
                    0{currentSlide + 1}
                  </span>
                  <span className="text-[10px] font-bold text-[#71839D] block mt-1">/ 03</span>
                </div>

                <button
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full bg-white text-[#142C4C] hover:bg-[#FF7A1A] hover:text-white border border-slate-200 flex items-center justify-center transition-colors shadow-xs"
                  aria-label="Next slide"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
