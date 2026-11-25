'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, KeyRound, TrendingUp, FileCheck2, ArrowRight } from 'lucide-react';

interface ServicePreview {
  title: string;
  description: string;
  image: string;
  icon: React.ElementType;
  href: string;
}

const SERVICES_PREVIEW: ServicePreview[] = [
  {
    title: 'Property Sales',
    description: 'Expert guidance on buying & selling verified luxury homes.',
    image: '/images/services/service-buy.jpg',
    icon: Home,
    href: '/properties?listingType=SALE',
  },
  {
    title: 'Rentals & Leasing',
    description: 'Find the perfect rental property with zero hidden charges.',
    image: '/images/services/service-rent.jpg',
    icon: KeyRound,
    href: '/properties?listingType=RENT',
  },
  {
    title: 'Investment Consult',
    description: 'Secure high-ROI residential and commercial investments.',
    image: '/images/services/service-commercial.jpg',
    icon: TrendingUp,
    href: '/properties?propertyType=COMMERCIAL',
  },
  {
    title: 'Legal & Home Loans',
    description: 'Turnkey title verification, RERA checks & loan advisory.',
    image: '/images/services/service-loan.jpg',
    icon: FileCheck2,
    href: '/services',
  },
];

export const ServicesShowcaseSection: React.FC = () => {
  return (
    <section className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Header matching Reference Screenshot */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2.5">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#FF7A1A] block">
            WHAT WE DO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142C4C] font-editorial tracking-tight">
            Our Services
          </h2>
          <p className="text-xs sm:text-sm text-[#71839D] font-medium">
            End-to-end real estate solutions crafted for buyers, tenants, and investors.
          </p>
        </div>

        {/* 4-Column Elevated Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES_PREVIEW.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.title}
                href={service.href}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
              >
                {/* Image with Floating Top-Right Circular Icon Badge */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  <div className="absolute top-3.5 right-3.5 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#142C4C] group-hover:bg-[#FF7A1A] group-hover:text-white transition-colors duration-200">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-[#142C4C] font-editorial group-hover:text-[#FF7A1A] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-[#71839D] leading-relaxed font-medium">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#142C4C] group-hover:text-[#FF7A1A] transition-colors">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-[#142C4C] hover:bg-[#0B1F38] shadow-md hover:shadow-lg transition-all"
          >
            <span>View All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

