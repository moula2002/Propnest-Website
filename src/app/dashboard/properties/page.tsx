'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { userService } from '@/services/userService';
import { propertyService } from '@/services/propertyService';
import { PropertyListItem, PropertyStatus } from '@/types';
import { formatPrice, formatDate, getFullImageUrl } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import {
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Send,
  AlertTriangle,
  Loader2,
  Building2,
} from 'lucide-react';
import { getErrorMessage } from '@/lib/api/client';

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const res = await userService.getMyProperties(
        1,
        50,
        statusFilter === 'ALL' ? undefined : statusFilter
      );
      setProperties(res.properties || []);
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await propertyService.deleteProperty(deleteTargetId);
      setDeleteTargetId(null);
      await fetchProperties();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmitForApproval = async (id: string) => {
    try {
      await propertyService.submitForApproval(id);
      await fetchProperties();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const handleUpdateStatus = async (id: string, status: PropertyStatus) => {
    try {
      await propertyService.updatePropertyStatus(id, status);
      await fetchProperties();
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-900 font-display">My Property Listings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Manage your listings, review approval statuses, and update live availability.
          </p>
        </div>

        <Link
          href="/dashboard/properties/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-darkNavy hover:bg-navy-900 rounded-xl shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Post New Property</span>
        </Link>
      </div>

      {actionError && (
        <div className="p-3.5 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200 font-medium">
          {actionError}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 text-xs font-bold">
        {['ALL', 'APPROVED', 'PENDING_APPROVAL', 'DRAFT', 'SOLD', 'RENTED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap ${
              statusFilter === st
                ? 'bg-royal-600 text-white border-royal-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st === 'ALL' ? 'All Listings' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Properties Table */}
      {isLoading ? (
        <div className="text-center py-20 text-slate-500 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-royal-600" />
          <p className="text-xs font-medium">Loading your listings...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-navy-900">No properties in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5 font-medium">
            You don&apos;t have any properties with this status. Create a new listing or adjust your filter tabs.
          </p>
          <Link
            href="/dashboard/properties/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-royal-600 hover:bg-royal-700 rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Property Free</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-4 px-5">Property</th>
                  <th className="py-4 px-4">Purpose</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Created</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {properties.map((prop) => {
                  const mainImage = prop.images && prop.images[0] ? prop.images[0].imageUrl : null;

                  return (
                    <tr key={prop.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                            <Image
                              src={getFullImageUrl(mainImage)}
                              alt={prop.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="overflow-hidden max-w-xs">
                            <Link
                              href={`/properties/${prop.slug || prop.id}`}
                              className="font-bold text-navy-900 hover:text-royal-600 truncate block text-xs"
                            >
                              {prop.title}
                            </Link>
                            <span className="text-[11px] text-slate-400 truncate block">
                              {prop.locality}, {prop.city}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant={prop.listingType === 'SALE' ? 'primary' : 'secondary'} size="sm">
                          {prop.listingType}
                        </Badge>
                      </td>

                      <td className="py-4 px-4 font-bold text-navy-900 text-xs">
                        {formatPrice(prop.price)}
                      </td>

                      <td className="py-4 px-4">
                        <Badge
                          variant={
                            prop.status === 'APPROVED'
                              ? 'success'
                              : prop.status === 'PENDING_APPROVAL'
                              ? 'warning'
                              : prop.status === 'REJECTED'
                              ? 'danger'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {prop.status || 'DRAFT'}
                        </Badge>
                      </td>

                      <td className="py-4 px-4 text-slate-500 text-[11px]">{formatDate(prop.createdAt)}</td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {prop.status === 'DRAFT' && (
                            <button
                              onClick={() => handleSubmitForApproval(prop.id)}
                              className="p-1.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1 font-bold transition"
                              title="Submit for approval"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Submit</span>
                            </button>
                          )}

                          {prop.status === 'APPROVED' && (
                            <button
                              onClick={() => handleUpdateStatus(prop.id, prop.listingType === 'SALE' ? 'SOLD' : 'RENTED')}
                              className="p-1.5 text-[11px] text-slate-600 hover:text-navy-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold transition"
                            >
                              Mark {prop.listingType === 'SALE' ? 'Sold' : 'Rented'}
                            </button>
                          )}

                          <Link
                            href={`/properties/${prop.slug || prop.id}`}
                            className="p-2 text-slate-400 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition"
                            title="View Property"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/dashboard/properties/${prop.id}/edit`}
                            className="p-2 text-royal-600 hover:text-royal-700 rounded-lg hover:bg-royal-50 transition"
                            title="Edit Property"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => setDeleteTargetId(prop.id)}
                            className="p-2 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition"
                            title="Delete Property"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Confirm Listing Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex items-center gap-3 text-amber-600">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-sm font-bold text-navy-900">
              Are you sure you want to delete this listing?
            </p>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            This action cannot be undone. The property listing, buyer inquiries, and uploaded photos will be permanently removed.
          </p>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              onClick={() => setDeleteTargetId(null)}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition flex items-center gap-1.5 disabled:opacity-60"
            >
              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Delete Permanently</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
