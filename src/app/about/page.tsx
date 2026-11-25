import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { propertyService } from '@/services/propertyService';
import {
  ShieldCheck,
  Building2,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  TrendingUp,
  HeartHandshake,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — PropNest Real Estate',
  description:
    'Learn about PropNest, our mission to redefine modern living, and how we empower buyers, renters, and property owners with verified listings and zero brokerage transparency.',
};

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  let totalProperties = 0;
  let totalCities = 0;

  try {
    const [propsRes, locsRes] = await Promise.all([
      propertyService.getProperties({ limit: 1 }).catch(() => ({ meta: undefined, properties: [] })),
      propertyService.searchLocations().catch(() => []),
    ]);
    totalProperties = propsRes.meta?.total || 10;
    totalCities = locsRes.length || 4;
  } catch (err) {
    console.error('Error fetching about page live data:', err);
  }

  const values = [
    {
      icon: ShieldCheck,
      title: '100% Verified Listings',
      description: 'Every property uploaded is thoroughly vetted by our team to guarantee authentic titles, ownership, and specifications.',
    },
    {
      icon: HeartHandshake,
      title: 'Zero Brokerage & Transparency',
      description: 'We connect home seekers directly with verified property owners and certified builders without hidden fees or surprise markups.',
    },
    {
      icon: TrendingUp,
      title: 'Data-Driven Valuations',
      description: 'Get real-time market trends, locality price metrics, and rental yield forecasts so you make confident investment decisions.',
    },
    {
      icon: Users,
      title: 'End-to-End Assistance',
      description: 'From initial search and virtual walk-throughs to legal clearance, registration, and home loans, our specialists guide you all the way.',
    },
  ];

  const milestones = [
    { year: '2023', title: 'The Genesis', desc: 'PropNest founded with a mission to eliminate real estate opacity and bring trust to property deals.' },
    { year: '2024', title: 'Pan-India Footprint', desc: 'Expanded across Bengaluru, Hyderabad, Chennai, and Pune, introducing verified virtual property tours.' },
    { year: '2025', title: 'Direct Connect & AI Insights', desc: 'Launched direct owner-buyer messaging and automated algorithmic property valuation tools.' },
    { year: '2026', title: 'PropNest 2.0 Ecosystem', desc: 'Over thousands of happy homeowners and investors across prime metropolitan real estate corridors.' },
  ];

  return (
    <div className="bg-transparent text-[#142C4C] min-h-screen pt-28 pb-16">
      {/* Top Header & Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        {/* Transparent Hero Header */}
        <div className="relative py-6 sm:py-10 text-[#142C4C] border-b border-slate-200/70">
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-orange-200/70 shadow-xs text-[#FF7A1A]">
              <Sparkles className="w-3.5 h-3.5 fill-[#FF7A1A]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#142C4C]">Our Story &amp; Mission</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.1] text-[#142C4C]">
              Redefining Modern Living <br />
              <span className="brand-script-orange text-[#FF7A1A]">Across India.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#4A5D75] font-medium leading-relaxed max-w-2xl">
              At PropNest, we believe finding a home should be an exciting, seamless journey. We bridge the gap between discerning buyers, tenants, and property owners with technology, transparency, and verified authenticity.
            </p>
          </div>
        </div>
      </div>

      {/* Narrative & Architectural Showcase Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/images/about/about-story.jpg"
                alt="PropNest luxury modern residence interior"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:right-6 bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-[#EAF3FC] text-[#FF7A1A] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-sm font-extrabold text-[#142C4C]">Top Rated Portal</span>
                <span className="text-xs text-[#71839D] font-medium">Trusted by thousands of home seekers nationwide</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 pt-6 lg:pt-0">
            <div className="flex items-center gap-2">
              <span className="w-5 h-[2px] bg-[#FF7A1A]" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF7A1A]">
                WHO WE ARE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142C4C] font-display tracking-tight leading-tight">
              More Than Just Properties. <br />
              <span className="text-[#FF7A1A]">We Build Your Future.</span>
            </h2>

            <p className="text-sm text-[#71839D] font-medium leading-relaxed">
              PropNest was born from a fundamental frustration with traditional real estate: misleading photos, phantom listings, and excessive brokerage commissions. We set out to build an ethical property ecosystem where every single listing is verified and every interaction is backed by verified data.
            </p>

            <p className="text-sm text-[#71839D] font-medium leading-relaxed">
              Whether you are an ambitious professional purchasing your first 2 BHK in Whitefield, an investor scouting prime plots in Hyderabad, or a family seeking an independent villa in Goa, PropNest ensures your transaction is smooth, secure, and rewarding.
            </p>

            {/* Quick Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Direct Owner Communication',
                'Comprehensive Legal Title Checks',
                'Zero Spam Guarantee',
                'Certified Real Estate Advisors',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF7A1A] shrink-0" />
                  <span className="text-xs font-bold text-[#142C4C]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Metrics Section */}
      <section className="bg-white py-14 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black text-[#142C4C] font-display">100%</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#71839D]">Verified Listings</p>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-[#142C4C] font-display">{totalProperties}+</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#71839D]">Properties in Database</p>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-[#142C4C] font-display">{totalCities}+</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#71839D]">Major Cities Covered</p>
            </div>
            <div className="space-y-1 pt-4 sm:pt-0">
              <span className="text-3xl sm:text-4xl font-black text-[#142C4C] font-display">Zero</span>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#71839D]">Hidden Brokerage Fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars / Values Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="w-5 h-[2px] bg-[#FF7A1A]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF7A1A]">
              OUR COMMITMENT
            </span>
            <span className="w-5 h-[2px] bg-[#FF7A1A]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142C4C] font-display tracking-tight">
            The PropNest Advantage
          </h2>
          <p className="text-xs sm:text-sm text-[#71839D] font-medium">
            Designed from the ground up to give you total control and absolute confidence in your real estate decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAF3FC] text-[#FF7A1A] flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#142C4C] font-display">{val.title}</h3>
                  <p className="text-xs text-[#71839D] font-medium leading-relaxed">{val.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-card">
          <div className="text-left mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142C4C] font-display">Our Growth Journey</h2>
            <p className="text-xs sm:text-sm text-[#71839D] font-medium">
              Transforming the Indian property landscape year after year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m) => (
              <div key={m.year} className="p-5 rounded-2xl bg-[#F8F7F4] border border-slate-200/60 space-y-2">
                <span className="text-lg font-black text-[#FF7A1A] font-display block">{m.year}</span>
                <h4 className="text-sm font-bold text-[#142C4C]">{m.title}</h4>
                <p className="text-xs text-[#71839D] font-medium leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#0B1F38] via-[#142C4C] to-[#0B1F38] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display">Ready to Find Your Dream Space?</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Browse verified properties for sale and rent or list your own property in minutes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/properties"
              className="px-6 py-3 rounded-full text-xs font-bold text-white bg-[#FF7A1A] hover:bg-[#ea580c] shadow-md transition-all flex items-center gap-2"
            >
              <span>Explore Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              Contact Advisors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

