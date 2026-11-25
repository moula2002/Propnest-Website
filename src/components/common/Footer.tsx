'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      id="contact"
      className="relative z-10 bg-white pt-16 pb-10 text-[#142C4C] border-t border-slate-200/80 shadow-[0_-4px_24px_-6px_rgba(20,44,76,0.06)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-200/80">
          {/* Column 1: Brand Info (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <Link href="/" className="inline-block group">
              <div className="relative h-14 w-52 flex items-center">
                <Image
                  src="/logo.png"
                  alt="PropNest"
                  fill
                  className="object-contain object-left transition-transform duration-300 group-hover:scale-105"
                  sizes="208px"
                />
              </div>
            </Link>
            <p className="text-xs text-[#71839D] leading-relaxed max-w-xs font-medium">
              Discover modern homes, prime locations and lifestyle-driven communities across India.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {[
                { label: 'Facebook', text: 'f' },
                { label: 'Instagram', text: 'ig' },
                { label: 'LinkedIn', text: 'in' },
                { label: 'YouTube', text: 'yt' },
                { label: 'X (Twitter)', text: '𝕏' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#contact"
                  className="w-8 h-8 rounded-full bg-[#F8F7F4] border border-slate-200/80 hover:bg-[#FF7A1A] hover:border-[#FF7A1A] text-[#142C4C] hover:text-white flex items-center justify-center transition-all duration-200 text-xs font-bold"
                  aria-label={social.label}
                >
                  {social.text}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-extrabold text-[#142C4C] uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium text-[#71839D]">
              <li>
                <Link href="/" className="hover:text-[#FF7A1A] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-[#FF7A1A] transition">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF7A1A] transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#FF7A1A] transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF7A1A] transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Our Services (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-extrabold text-[#142C4C] uppercase tracking-wider">Our Services</h4>
            <ul className="space-y-2 text-xs font-medium text-[#71839D]">
              <li>
                <Link href="/properties?listingType=SALE" className="hover:text-[#FF7A1A] transition">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link href="/properties?listingType=RENT" className="hover:text-[#FF7A1A] transition">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link href="/dashboard/properties/create" className="hover:text-[#FF7A1A] transition">
                  Sell Property
                </Link>
              </li>
              <li>
                <Link href="/properties?sortBy=newest" className="hover:text-[#FF7A1A] transition">
                  New Projects
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF7A1A] transition">
                  Property Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get in Touch (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-extrabold text-[#142C4C] uppercase tracking-wider">Get in Touch</h4>
            <ul className="space-y-2.5 text-xs text-[#71839D] font-medium">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF7A1A] shrink-0" />
                <span className="text-[#142C4C] font-semibold">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF7A1A] shrink-0" />
                <span className="truncate">hello@propnest.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#FF7A1A] shrink-0 mt-0.5" />
                <span className="leading-relaxed">12th Floor, Horizon Tower, MG Road, Bangalore – 560001</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-extrabold text-[#142C4C] uppercase tracking-wider">
              Subscribe to our <span className="text-[#FF7A1A]">Newsletter</span>
            </h4>
            <p className="text-xs text-[#71839D] leading-relaxed font-medium">
              Get the latest properties and market updates.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to PropNest Newsletter!');
              }}
              className="relative flex items-center pt-1"
            >
              <input
                type="email"
                placeholder="Your Email Address"
                required
                className="w-full pl-4 pr-11 py-2.5 text-xs rounded-full bg-[#F8F7F4] border border-slate-200 text-[#142C4C] placeholder-[#71839D] focus:outline-none focus:border-[#FF7A1A] focus:bg-white transition"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="absolute right-1 w-8 h-8 rounded-full bg-[#FF7A1A] hover:bg-[#ea580c] text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#71839D] font-medium gap-4">
          <p>© 2026 PropNest. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[#142C4C] transition">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-[#142C4C] transition">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
