'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  User,
  Heart,
  ArrowRight,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Building2,
  MessageSquare,
  Sparkles,
  Search,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Smooth scroll detection for transparent -> solid white navbar transition
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 24;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    router.push('/login');
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Properties', href: '/properties' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled ? 'pt-2 sm:pt-3' : 'pt-3 sm:pt-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between rounded-full px-4 sm:px-6 transition-all duration-500 ease-out ${
            isScrolled
              ? 'bg-white border border-slate-200/80 py-2 shadow-[0_14px_36px_-6px_rgba(11,31,56,0.12),0_4px_12px_-2px_rgba(11,31,56,0.04)]'
              : 'bg-transparent border border-transparent py-2.5 sm:py-3 shadow-none'
          }`}
        >
          {/* Official Brand Logo — smoothly resizes on scroll */}
          <Link href="/" className="flex items-center group py-0.5 shrink-0">
            <div
              className={`relative flex items-center transition-all duration-500 ease-out ${
                isScrolled
                  ? 'h-10 sm:h-11 w-36 sm:w-40'
                  : 'h-16 sm:h-20 w-56 sm:w-64'
              }`}
            >
              <Image
                src="/logo.png"
                alt="PropNest"
                fill
                priority
                className="object-contain object-left transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 192px, 224px"
              />
            </div>
          </Link>

          {/* Center Navigation Links - Clean Pill & Active Underline */}
          <nav className="hidden lg:flex items-center space-x-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`nav-link-indicator px-4 py-2 text-[15px] font-bold transition-colors duration-300 ${
                    isActive
                      ? 'active text-[#142C4C]'
                      : isScrolled
                      ? 'text-[#71839D] hover:text-[#142C4C]'
                      : 'text-[#142C4C]/85 hover:text-[#142C4C]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center space-x-2.5 sm:space-x-3.5">
            {/* Search Icon */}
            <Link
              href="/properties"
              className={`p-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
                isScrolled
                  ? 'text-[#71839D] hover:text-[#142C4C] hover:bg-slate-100/80'
                  : 'text-[#142C4C] bg-white/60 hover:bg-white shadow-xs'
              }`}
              title="Search Properties"
            >
              <Search className="w-[18px] h-[18px]" />
            </Link>

            {/* Wishlist / Heart Icon */}
            <Link
              href={isAuthenticated ? '/dashboard/favorites' : '/login?redirect=/dashboard/favorites'}
              className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 relative group ${
                isScrolled
                  ? 'text-[#71839D] hover:text-rose-500 hover:bg-slate-100/80'
                  : 'text-[#142C4C] bg-white/60 hover:bg-white hover:text-rose-500 shadow-xs'
              }`}
              title="Wishlist / Favorites"
            >
              <Heart className="w-[18px] h-[18px] group-hover:stroke-rose-500 transition-colors" />
              {isAuthenticated && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF7A1A] ring-2 ring-white" />
              )}
            </Link>

            {/* User / Account Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 pl-2 pr-1.5 rounded-full border border-slate-200/80 bg-white hover:border-[#FF7A1A]/50 transition-all shadow-xs"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-6 h-6 rounded-full bg-[#142C4C] text-white font-bold text-[10px] flex items-center justify-center">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold text-[#142C4C] max-w-[80px] truncate hidden md:inline">
                    {user.fullName?.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#71839D] transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180 text-[#142C4C]' : ''
                    }`}
                  />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-scale-pop">
                    <div className="px-4 py-3 border-b border-slate-100 bg-[#F8F7F4] rounded-t-xl">
                      <p className="text-xs font-bold text-[#142C4C] truncate">{user.fullName}</p>
                      <p className="text-[11px] text-[#71839D] truncate">{user.email}</p>
                      <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-50 text-[#FF7A1A] border border-orange-200/60">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{user.role} Member</span>
                      </div>
                    </div>

                    <div className="py-1 text-xs font-semibold text-[#71839D]">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 hover:text-[#142C4C] transition-all"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>Dashboard Overview</span>
                      </Link>
                      <Link
                        href="/dashboard/properties"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 hover:text-[#142C4C] transition-all"
                      >
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span>My Properties</span>
                      </Link>
                      <Link
                        href="/dashboard/favorites"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 hover:text-[#142C4C] transition-all"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        <span>Saved Favorites</span>
                      </Link>
                      <Link
                        href="/dashboard/inquiries"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 hover:text-[#142C4C] transition-all"
                      >
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span>Inquiries</span>
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 hover:text-[#142C4C] transition-all"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Profile & Security</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`p-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isScrolled
                    ? 'text-[#71839D] hover:text-[#142C4C] hover:bg-slate-100/80'
                    : 'text-[#142C4C] bg-white/60 hover:bg-white shadow-xs'
                }`}
                title="Account Login"
              >
                <User className="w-[18px] h-[18px]" />
              </Link>
            )}

            {/* Dark Navy Pill Button "Get Started →" */}
            <Link
              href={isAuthenticated ? '/dashboard/properties/create' : '/login?redirect=/dashboard/properties/create'}
              className="group relative inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-bold text-white bg-[#142C4C] hover:bg-[#0B1F38] shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden shrink-0"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-4 h-4 relative z-10 transform group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link
              href={isAuthenticated ? '/dashboard/properties/create' : '/login?redirect=/dashboard/properties/create'}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#142C4C] shadow-xs"
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#142C4C] rounded-full hover:bg-black/[0.04] transition-transform active:scale-95"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 animate-scale-pop" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mx-4 mt-2 border border-slate-100 bg-white/98 backdrop-blur-xl px-5 pt-4 pb-6 rounded-3xl space-y-4 shadow-2xl animate-fade-in-down">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-xs font-bold text-[#142C4C] rounded-xl hover:bg-slate-50 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            <Link
              href={isAuthenticated ? '/dashboard/properties/create' : '/login?redirect=/dashboard/properties/create'}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#142C4C] hover:bg-[#0B1F38] rounded-full shadow transition"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {isAuthenticated && user ? (
              <div className="space-y-1 pt-1 text-xs font-semibold text-[#71839D]">
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-50">
                  <LayoutDashboard className="w-4 h-4 text-slate-400" />
                  <span>Dashboard Overview</span>
                </Link>
                <Link href="/dashboard/properties" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-50">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>My Properties</span>
                </Link>
                <Link href="/dashboard/favorites" className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-50">
                  <Heart className="w-4 h-4 text-slate-400" />
                  <span>Saved Favorites</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-rose-600 rounded-xl hover:bg-rose-50 text-left transition"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  className="flex items-center justify-center px-4 py-2 text-xs font-bold text-[#142C4C] bg-white border border-slate-200 hover:bg-slate-50 rounded-full text-center transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-[#142C4C] hover:bg-[#0B1F38] rounded-full text-center transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
