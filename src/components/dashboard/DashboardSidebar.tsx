'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Heart,
  MessageSquare,
  User,
  LogOut,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const DashboardSidebar: React.FC<{ onCloseMobile?: () => void }> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Listings', href: '/dashboard/properties', icon: Building2 },
    { label: 'Post Property', href: '/dashboard/properties/create', icon: PlusCircle, highlight: true },
    { label: 'Categories', href: '/dashboard/categories', icon: Layers },
    { label: 'Saved Favorites', href: '/dashboard/favorites', icon: Heart },
    { label: 'Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
    { label: 'Profile Settings', href: '/dashboard/profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-full flex flex-col justify-between p-5">
      <div className="space-y-6">
        {/* User Mini Profile Card */}
        <div className="flex items-center gap-3.5 p-3.5 bg-[#F8F7F4] rounded-2xl border border-slate-200/80">
          <div className="w-11 h-11 rounded-xl bg-[#142C4C] text-white font-extrabold flex items-center justify-center text-sm shadow-md shrink-0">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-[#142C4C] truncate">{user?.fullName || 'User'}</p>
            <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-md bg-orange-50 text-[#FF7A1A] border border-orange-200/60">
              <Sparkles className="w-2.5 h-2.5 text-[#FF7A1A]" />
              {user?.role || 'USER'}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname?.startsWith(item.href) || false;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-[#142C4C] text-white shadow-md'
                    : item.highlight
                    ? 'text-[#FF7A1A] bg-orange-50 hover:bg-orange-100/80 border border-orange-200/60'
                    : 'text-[#71839D] hover:bg-[#F8F7F4] hover:text-[#142C4C]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-[#FF7A1A]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-[#F1F5F9]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-full transition text-left"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
