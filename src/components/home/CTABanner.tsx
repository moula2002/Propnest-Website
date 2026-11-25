'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const CTABanner: React.FC = () => {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0B1F38] via-[#142C4C] to-[#0B1F38] overflow-hidden shadow-2xl p-8 sm:p-12 text-white border border-slate-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Content (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display text-white leading-tight">
              Your Next <span className="brand-script-orange text-[#FF7A1A]">Chapter</span> <br />
              Starts Here.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md leading-relaxed">
              Find the property that fits your dreams, lifestyle and future.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href="/properties"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-[#FF7A1A] hover:bg-[#ea580c] shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explore Homes</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <Link
                href="/dashboard/properties/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>List Your Property</span>
              </Link>
            </div>
          </div>

          {/* Right Architectural Luxury Residential Property Image from Reference (lg:col-span-5) */}
          <div className="lg:col-span-5 relative h-52 sm:h-60 rounded-2xl overflow-hidden hidden sm:block shadow-xl">
            <Image
              src="/images/cta/cta-banner.jpg"
              alt="Luxury modern residential architecture at twilight"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F38] via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

