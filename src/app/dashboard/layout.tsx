'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Loader2, Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center gap-3 bg-[#FAF9F6]">
        <Loader2 className="w-8 h-8 text-[#C8A46A] animate-spin" />
        <p className="text-xs text-[#64748B] font-semibold tracking-wide uppercase">
          Verifying PropNest Session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-4 bg-transparent">
      {/* Mobile Top Toggle Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#142C4C] text-white flex items-center justify-center font-bold text-xs">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <span className="text-xs font-bold text-[#142C4C] truncate">{user?.fullName}</span>
        </div>
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F8F7F4] border border-slate-200 text-xs font-bold text-[#142C4C]"
        >
          <Menu className="w-4 h-4" />
          <span>Dashboard Menu</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-64 bg-white h-full shadow-2xl z-10">
            <div className="p-3 flex justify-end">
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-[#152B46]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <DashboardSidebar onCloseMobile={() => setMobileDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Dashboard Card Wrapper */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-card overflow-hidden flex flex-col md:flex-row min-h-[750px]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block shrink-0">
          <DashboardSidebar />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 sm:p-10 bg-[#FAF9F6] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
