'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  name: string;
  city: string;
  review: string;
  avatar: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Rohit Kumar',
    city: 'Bengaluru',
    review: 'PropNest made our home buying journey so smooth and transparent. Highly recommended!',
    avatar: '/images/testimonials/avatar-1.jpg',
    rating: 5,
  },
  {
    name: 'Ananya Sharma',
    city: 'Hyderabad',
    review: 'Found an incredible sea-facing penthouse in record time. The verified owner feature saved us from middlemen fees!',
    avatar: '/images/testimonials/avatar-2.jpg',
    rating: 5,
  },
  {
    name: 'Vikram Menon',
    city: 'Chennai',
    review: 'The virtual tours and accurate specifications gave me total confidence before booking my luxury villa.',
    avatar: '/images/testimonials/avatar-3.jpg',
    rating: 5,
  },
];

export const TestimonialsSection: React.FC = () => {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const item = TESTIMONIALS[current];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Heading Column (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-3 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-[2px] bg-[#FF7A1A]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF7A1A]">
              WHAT OUR CLIENTS SAY
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#142C4C] font-display tracking-tight leading-tight">
            Real Stories. <br />
            Real Happiness.
          </h2>
          <p className="text-xs sm:text-sm text-[#71839D] font-medium leading-relaxed max-w-md">
            Hear from our happy homeowners and investors who found their dream home with PropNest.
          </p>
        </div>

        {/* Right Carousel Card Column matching Reference (lg:col-span-7) */}
        <div className="lg:col-span-7">
          <div className="relative flex items-center gap-3 sm:gap-4">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-white border border-slate-200/80 text-[#142C4C] hover:bg-[#142C4C] hover:text-white flex items-center justify-center transition-colors shadow-xs shrink-0"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Testimonial Capsule Card from Reference Image */}
            <div className="flex-1 bg-white rounded-3xl sm:rounded-full p-6 sm:p-7 border border-slate-200/80 shadow-card flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
              {/* Customer Avatar */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden shrink-0 ring-4 ring-[#EAF3FC]">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              {/* Review Quote & Info */}
              <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-1 pb-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#FF7A1A] text-[#FF7A1A]" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-semibold italic text-[#142C4C] leading-snug">
                  &ldquo;{item.review}&rdquo;
                </p>
                <div>
                  <h4 className="text-xs font-black text-[#142C4C] font-display inline-block mr-2">{item.name}</h4>
                  <span className="text-[11px] text-[#71839D] font-medium">{item.city}</span>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-white border border-slate-200/80 text-[#142C4C] hover:bg-[#142C4C] hover:text-white flex items-center justify-center transition-colors shadow-xs shrink-0"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 pt-4">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === current ? 'w-6 bg-[#FF7A1A]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

