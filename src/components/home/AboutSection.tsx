'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ArrowRight, Home, Building2, MapPin, X, ShieldCheck } from 'lucide-react';

interface Props {
  stats?: {
    propertiesCount?: number;
    citiesCount?: number;
    verifiedPercentage?: string;
  };
}

export const AboutSection: React.FC<Props> = ({ stats }) => {
  const [videoOpen, setVideoOpen] = useState(false);

  const totalProps = stats?.propertiesCount !== undefined ? `${stats.propertiesCount}` : '0';
  const totalCities = stats?.citiesCount !== undefined ? `${stats.citiesCount}` : '0';

  return (
    <>
      <section id="about" className="py-20 bg-transparent max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Living Room Photo with Centered "Our Story" Play Button (lg:col-span-5) */}
          <div className="lg:col-span-5 relative group">
            <div className="relative w-full h-[320px] sm:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/images/about/about-living.jpg"
                alt="Modern luxury living room interior with natural sunlight"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

              {/* Floating Centered "Our Story" Play Button */}
              <button
                onClick={() => setVideoOpen(true)}
                className="absolute inset-0 m-auto w-fit h-fit flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/95 hover:bg-white text-[#142C4C] shadow-2xl backdrop-blur-md transform hover:scale-105 transition-all duration-300 border border-white/80"
                aria-label="Watch PropNest Story Video"
              >
                <div className="w-8 h-8 rounded-full bg-[#142C4C] text-white flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <span className="text-xs font-extrabold uppercase tracking-wider">Our Story</span>
              </button>
            </div>
          </div>

          {/* Center Column: Narrative & Orange CTA Button (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-5 text-left">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-[2px] bg-[#FF7A1A]" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF7A1A]">
                  ABOUT PROPNEST
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#142C4C] font-display tracking-tight leading-tight">
                More Than Properties. <br />
                <span className="text-[#FF7A1A]">A Place to Belong.</span>
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#71839D] font-medium leading-relaxed">
              At PropNest, we believe a home is more than just a property — it&apos;s where life happens. Find your perfect space with confidence.
            </p>

            <div className="pt-2">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-[#FF7A1A] hover:bg-[#ea580c] shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Know More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Clean Dynamic Stats with Icons (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-6 lg:border-l lg:border-slate-200/80 lg:pl-8">
            {/* Stat 1 */}
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3FC] text-[#142C4C] flex items-center justify-center shadow-xs group-hover:bg-[#FF7A1A] group-hover:text-white transition-colors">
                <ShieldCheck className="w-5 h-5 text-[#FF7A1A] group-hover:text-white" />
              </div>
              <div>
                <span className="text-2xl font-black text-[#142C4C] font-display block leading-none">
                  100%
                </span>
                <span className="text-xs text-[#71839D] font-semibold">Verified Listings</span>
              </div>
            </div>

            {/* Stat 2: Real Properties from DB */}
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3FC] text-[#142C4C] flex items-center justify-center shadow-xs group-hover:bg-[#FF7A1A] group-hover:text-white transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black text-[#142C4C] font-display block leading-none">
                  {totalProps}
                </span>
                <span className="text-xs text-[#71839D] font-semibold">Properties Listed</span>
              </div>
            </div>

            {/* Stat 3: Real Cities from DB */}
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF3FC] text-[#142C4C] flex items-center justify-center shadow-xs group-hover:bg-[#FF7A1A] group-hover:text-white transition-colors">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black text-[#142C4C] font-display block leading-none">
                  {totalCities}
                </span>
                <span className="text-xs text-[#71839D] font-semibold">Active Cities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Video Modal */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <div className="flex items-center justify-between px-6 py-4 bg-[#0B1F38] text-white">
              <span className="text-xs font-bold uppercase tracking-wider">The PropNest Philosophy</span>
              <button
                onClick={() => setVideoOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/ScMzIvxBSi4?autoplay=1"
                title="PropNest Story Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
