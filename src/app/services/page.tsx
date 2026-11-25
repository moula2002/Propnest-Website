import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import {
  Home,
  KeyRound,
  Building2,
  Briefcase,
  FileCheck2,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  Clock,
  Compass,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Services — PropNest Real Estate',
  description:
    'Explore our comprehensive real estate services: property buying, rental solutions, seller listings, commercial leases, legal title clearance, and home loan advisory.',
};

export const dynamic = 'force-dynamic';

export default function ServicesPage() {
  const services = [
    {
      icon: Home,
      title: 'Residential Property Buying',
      tag: 'BUY PROPERTIES',
      description:
        'Access curated, 100% verified luxury villas, modern apartments, and independent houses across India. We connect you directly with owners and trusted developers.',
      features: ['Zero brokerage options', 'In-depth carpet area verification', 'Neighborhood amenities report'],
      actionText: 'Browse For Sale',
      actionHref: '/properties?listingType=SALE',
      image: '/images/services/service-buy.jpg',
    },
    {
      icon: KeyRound,
      title: 'Rental & Leasing Solutions',
      tag: 'RENT HOMES',
      description:
        'Find verified flats and independent homes for rent with direct owner contacts, transparent security deposit terms, and instant digital lease agreements.',
      features: ['Verified rental agreements', 'Zero hidden charges', 'Direct landlord negotiation'],
      actionText: 'Browse For Rent',
      actionHref: '/properties?listingType=RENT',
      image: '/images/services/service-rent.jpg',
    },
    {
      icon: Building2,
      title: 'Property Listing & Selling',
      tag: 'FOR OWNERS',
      description:
        'List your property in under 3 minutes to reach thousands of verified buyers and high-intent tenants with high-resolution imagery and spotlight exposure.',
      features: ['Free verified property badge', 'Direct lead management in dashboard', 'Dedicated inquiry tracking'],
      actionText: 'Post Your Property',
      actionHref: '/dashboard/properties/create',
      image: '/images/services/service-sell.jpg',
    },
    {
      icon: Briefcase,
      title: 'Commercial & Office Spaces',
      tag: 'COMMERCIAL',
      description:
        'Prime office spaces, tech park floors, retail showrooms, and industrial plots in top metropolitan commercial hubs with flexible lease terms.',
      features: ['High-footfall retail locations', 'Grade-A tech park spaces', 'ROI & yield calculations'],
      actionText: 'Explore Commercial',
      actionHref: '/properties?propertyType=COMMERCIAL',
      image: '/images/services/service-commercial.jpg',
    },
    {
      icon: FileCheck2,
      title: 'Legal & Title Due Diligence',
      tag: 'LEGAL ADVISORY',
      description:
        'Comprehensive documentation scrutiny: Encumbrance Certificate (EC), Khata verification, RERA registration validation, and smooth property registration assistance.',
      features: ['Certified legal experts', 'Clearance certificate check', 'Dispute-free guarantee'],
      actionText: 'Request Legal Advice',
      actionHref: '/contact?service=legal',
      image: '/images/services/service-legal.jpg',
    },
    {
      icon: Calculator,
      title: 'Home Loan & Valuation Support',
      tag: 'FINANCIAL SERVICES',
      description:
        'Get competitive interest rate quotes from India’s top banks, fast pre-approvals, property valuation reports, and transparent EMI schedules.',
      features: ['Partnered with 15+ major banks', 'Fast pre-approval within 48h', 'Lowest available interest rates'],
      actionText: 'Get Financial Guidance',
      actionHref: '/contact?service=loan',
      image: '/images/services/service-loan.jpg',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Discover & Filter',
      desc: 'Use our intelligent search with city, budget, BHK, and lifestyle filters to find exactly what you need.',
    },
    {
      number: '02',
      title: 'Inspect & Verify',
      desc: 'Review high-resolution galleries, verified owner profiles, floor plans, and verified physical inspection records.',
    },
    {
      number: '03',
      title: 'Direct Connect',
      desc: 'Message or call the property owner directly without any third-party agent or middleman intervention.',
    },
    {
      number: '04',
      title: 'Close with Confidence',
      desc: 'Complete legal title clearances, loan approvals, and digital agreements with complete peace of mind.',
    },
  ];

  const faqs = [
    {
      q: 'Does PropNest charge brokerage on property transactions?',
      a: 'No. PropNest is built on a direct owner-to-seeker model with zero brokerage options. You connect straight with property owners and certified builders without surprise commissions.',
    },
    {
      q: 'How does PropNest verify listed properties?',
      a: 'Our verification team validates property documentation, checks ownership records against municipal registries, and ensures photos match the physical site before granting the Verified Badge.',
    },
    {
      q: 'Can I list both properties for sale and rent?',
      a: 'Yes! Registered users can list properties for sale, rent, or lease through the intuitive property submission dashboard in minutes.',
    },
    {
      q: 'How do I schedule a site visit or send an inquiry?',
      a: 'Every property detail page has an instant inquiry form and contact card. Submit your details to directly reach the owner or schedule a walkthrough.',
    },
  ];

  return (
    <div className="bg-transparent text-[#142C4C] min-h-screen pt-28 pb-16">
      {/* Top Header & Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <Breadcrumbs items={[{ label: 'Our Services' }]} />

        {/* Transparent Hero Header */}
        <div className="relative py-6 sm:py-10 text-[#142C4C] border-b border-slate-200/70">
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-orange-200/70 shadow-xs text-[#FF7A1A]">
              <Sparkles className="w-3.5 h-3.5 fill-[#FF7A1A]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#142C4C]">Full-Spectrum Real Estate</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.1] text-[#142C4C]">
              Comprehensive Services <br />
              <span className="brand-script-orange text-[#FF7A1A]">Tailored for You.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#4A5D75] font-medium leading-relaxed max-w-2xl">
              From discovering prime luxury homes and verified rental properties to legal due diligence and seller representation, explore how PropNest simplifies real estate at every step.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid (6 Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="w-5 h-[2px] bg-[#FF7A1A]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF7A1A]">
              WHAT WE OFFER
            </span>
            <span className="w-5 h-[2px] bg-[#FF7A1A]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142C4C] font-display tracking-tight">
            End-to-End Real Estate Solutions
          </h2>
          <p className="text-xs sm:text-sm text-[#71839D] font-medium">
            Everything you need to buy, rent, sell, or finance your real estate portfolio under one trusted roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-2xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                {/* Image & Tag */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider text-white bg-[#142C4C] shadow-sm uppercase">
                      {service.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md text-[#FF7A1A] flex items-center justify-center shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-[#142C4C] font-display group-hover:text-[#FF7A1A] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-[#71839D] font-medium leading-relaxed">
                      {service.description}
                    </p>

                    {/* Bullet features */}
                    <ul className="space-y-1.5 pt-2 border-t border-slate-100">
                      {service.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2 text-xs font-semibold text-[#142C4C]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7A1A] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2">
                    <Link
                      href={service.actionHref}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#142C4C] group-hover:text-[#FF7A1A] transition-colors"
                    >
                      <span>{service.actionText}</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="bg-white py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142C4C] font-display">How It Works</h2>
            <p className="text-xs sm:text-sm text-[#71839D] font-medium">
              A transparent, hassle-free 4-step path to your next dream space.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => (
              <div key={st.number} className="p-6 rounded-3xl bg-[#F8F7F4] border border-slate-200/60 relative space-y-3">
                <span className="text-3xl font-black text-[#FF7A1A] font-display">{st.number}</span>
                <h4 className="text-base font-bold text-[#142C4C]">{st.title}</h4>
                <p className="text-xs text-[#71839D] font-medium leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142C4C] font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#71839D] font-medium">
            Everything you need to know about our services and policies.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
              <h4 className="text-sm font-bold text-[#142C4C] flex items-center gap-2">
                <span className="text-[#FF7A1A] font-extrabold">Q.</span>
                <span>{f.q}</span>
              </h4>
              <p className="text-xs text-[#71839D] leading-relaxed pl-5 font-medium">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#0B1F38] via-[#142C4C] to-[#0B1F38] p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display">Need Custom Real Estate Advice?</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Talk to our property advisors for personalized property matching, legal title support, or loan guidance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full text-xs font-bold text-white bg-[#FF7A1A] hover:bg-[#ea580c] shadow-md transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Contact Us</span>
            </Link>
            <Link
              href="/dashboard/properties/create"
              className="px-6 py-3 rounded-full text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
            >
              List a Property
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

