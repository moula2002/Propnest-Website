'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/userService';
import { inquiryService } from '@/services/inquiryService';
import { PropertyListItem, Inquiry } from '@/types';
import {
  Building2,
  CheckCircle2,
  Clock,
  MessageSquare,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      setIsLoading(true);
      try {
        const [propsRes, inqRes] = await Promise.all([
          userService.getMyProperties(1, 10),
          inquiryService.getReceivedInquiries(1, 5).catch(() => ({ inquiries: [] })),
        ]);
        setProperties(propsRes.properties || []);
        setInquiries(inqRes.inquiries || []);
      } catch (err) {
        console.error('Failed to load dashboard overview data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOverviewData();
  }, []);

  const totalListings = properties.length;
  const approvedListings = properties.filter((p) => p.status === 'APPROVED').length;
  const pendingListings = properties.filter((p) => p.status === 'PENDING_APPROVAL' || p.status === 'DRAFT').length;
  const totalInquiries = inquiries.length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF7A1A] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dashboard Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142C4C] font-editorial">
            Welcome back, {user?.fullName || 'User'}!
          </h1>
          <p className="text-xs sm:text-sm text-[#71839D] mt-1 font-medium">
            Manage your ads, track administrative approvals, and connect directly with verified buyers.
          </p>
        </div>

        <Link
          href="/dashboard/properties/create"
          className="inline-flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white bg-[#142C4C] hover:bg-[#0B1F38] rounded-full shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Post New Property</span>
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Properties */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Listings</span>
            <div className="text-3xl font-black text-navy-900 font-display">{isLoading ? '...' : totalListings}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-royal-50 text-royal-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        {/* Active/Approved */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live & Approved</span>
            <div className="text-3xl font-black text-emerald-600 font-display">{isLoading ? '...' : approvedListings}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Approval */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Review / Draft</span>
            <div className="text-3xl font-black text-amber-600 font-display">{isLoading ? '...' : pendingListings}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Received Inquiries */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Buyer Inquiries</span>
            <div className="text-3xl font-black text-royal-600 font-display">{isLoading ? '...' : totalInquiries}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-royal-50 text-royal-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Properties */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-navy-900 text-base font-display">My Recent Listings</h3>
            <Link
              href="/dashboard/properties"
              className="text-xs font-bold text-royal-600 hover:text-royal-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <p className="text-xs text-slate-400 py-4 font-medium">Loading your listings...</p>
          ) : properties.length === 0 ? (
            <div className="text-center py-8 text-slate-500 space-y-2">
              <p className="text-sm font-medium">You haven&apos;t listed any properties yet.</p>
              <Link
                href="/dashboard/properties/create"
                className="inline-block text-xs font-bold text-emerald-600 hover:underline"
              >
                + Post your first property ad
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {properties.slice(0, 4).map((prop) => (
                <div key={prop.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 overflow-hidden">
                    <Link
                      href={`/properties/${prop.slug || prop.id}`}
                      className="text-sm font-bold text-navy-900 hover:text-royal-600 truncate block"
                    >
                      {prop.title}
                    </Link>
                    <p className="text-xs text-slate-500 font-medium">
                      {prop.city} • {formatPrice(prop.price)}
                    </p>
                  </div>
                  <Badge
                    variant={
                      prop.status === 'APPROVED'
                        ? 'success'
                        : prop.status === 'PENDING_APPROVAL'
                        ? 'warning'
                        : 'neutral'
                    }
                    size="sm"
                  >
                    {prop.status || 'DRAFT'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-card space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-navy-900 text-base font-display">Recent Inquiries Received</h3>
            <Link
              href="/dashboard/inquiries"
              className="text-xs font-bold text-royal-600 hover:text-royal-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <p className="text-xs text-slate-400 py-4 font-medium">Loading inquiries...</p>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm font-medium">No buyer inquiries received yet.</p>
              <p className="text-xs text-slate-400 mt-1">Direct inquiries will appear here in real time.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {inquiries.slice(0, 4).map((inq) => (
                <div key={inq.id} className="py-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-900">{inq.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{formatDate(inq.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 italic font-medium">&ldquo;{inq.message}&rdquo;</p>
                  <p className="text-[11px] text-royal-600 font-bold">
                    Property: {inq.property?.title || 'Listing'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
