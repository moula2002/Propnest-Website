'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { inquiryService } from '@/services/inquiryService';
import { Inquiry, InquiryStatus } from '@/types';
import { formatDate, formatPrice } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';
import { EmptyState } from '@/components/common/EmptyState';
import { MessageSquare, Mail, Phone, ExternalLink, Loader2 } from 'lucide-react';
import { getErrorMessage } from '@/lib/api/client';

export default function InquiriesPage() {
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === 'received') {
        const res = await inquiryService.getReceivedInquiries(1, 50);
        setInquiries(res.inquiries || []);
      } else {
        const res = await inquiryService.getMyInquiries(1, 50);
        setInquiries(res.inquiries || []);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleUpdateStatus = async (inquiryId: string, status: InquiryStatus) => {
    try {
      await inquiryService.updateStatus(inquiryId, status);
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === inquiryId ? { ...inq, inquiryStatus: status } : inq))
      );
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-navy-900 font-display">Property Inquiries</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Direct messages and contact requests between buyers and property owners.
        </p>
      </div>

      {error && (
        <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${
            activeTab === 'received'
              ? 'bg-darkNavy text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Received on My Properties
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition ${
            activeTab === 'sent'
              ? 'bg-darkNavy text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          My Inquiries Sent as Buyer
        </button>
      </div>

      {/* Inquiries list */}
      {isLoading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 text-darkNavy animate-spin" />
          <p className="text-sm text-slate-500">Loading inquiries...</p>
        </div>
      ) : inquiries.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={activeTab === 'received' ? 'No inquiries received yet' : 'No inquiries sent yet'}
          description={
            activeTab === 'received'
              ? 'When buyers send inquiries on your listings, they will appear here with contact details.'
              : 'When you contact property owners, your sent inquiries and correspondence history will appear here.'
          }
          actionText="Browse Properties"
          actionHref="/properties"
        />
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-sm font-bold text-slate-900">{inq.name}</span>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {inq.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {inq.phone}
                    </span>
                    <span>Received: {formatDate(inq.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      inq.inquiryStatus === 'NEW'
                        ? 'primary'
                        : inq.inquiryStatus === 'CONTACTED'
                        ? 'success'
                        : inq.inquiryStatus === 'IN_PROGRESS'
                        ? 'warning'
                        : inq.inquiryStatus === 'CLOSED'
                        ? 'neutral'
                        : 'danger'
                    }
                    size="sm"
                  >
                    {inq.inquiryStatus}
                  </Badge>

                  {/* Status switcher for property owner */}
                  {activeTab === 'received' && (
                    <select
                      value={inq.inquiryStatus}
                      onChange={(e) => handleUpdateStatus(inq.id, e.target.value as InquiryStatus)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 font-medium text-slate-700"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="CLOSED">CLOSED</option>
                      <option value="SPAM">SPAM</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Message text */}
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed italic">
                &ldquo;{inq.message}&rdquo;
              </div>

              {/* Property details tag */}
              {inq.property && (
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="text-slate-600 truncate max-w-md">
                    <span className="font-semibold text-slate-800">Property: </span>
                    <span>{inq.property.title}</span>
                    <span className="text-slate-400 font-medium"> ({inq.property.city})</span>
                  </div>
                  <Link
                    href={`/properties/${inq.property.slug || inq.property.id}`}
                    className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 shrink-0"
                  >
                    <span>View Property</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

