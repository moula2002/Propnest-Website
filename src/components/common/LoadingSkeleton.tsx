import React from 'react';
import { cn } from '@/lib/utils';

export const PropertyCardSkeleton: React.FC<{ view?: 'grid' | 'list' }> = ({ view = 'grid' }) => {
  if (view === 'list') {
    return (
      <div className="flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card animate-pulse">
        <div className="w-full sm:w-80 h-56 bg-slate-200" />
        <div className="flex-1 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-7 w-1/3 bg-slate-200 rounded-lg" />
            <div className="h-5 w-20 bg-slate-200 rounded-md" />
          </div>
          <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
          <div className="h-4 w-1/2 bg-slate-200 rounded-md" />
          <div className="flex gap-6 pt-4 border-t border-slate-100">
            <div className="h-4 w-16 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded" />
            <div className="h-4 w-16 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card animate-pulse">
      <div className="w-full h-56 bg-slate-200" />
      <div className="p-5 space-y-3.5">
        <div className="flex justify-between items-center">
          <div className="h-6 w-1/3 bg-slate-200 rounded-lg" />
          <div className="h-4 w-16 bg-slate-200 rounded-md" />
        </div>
        <div className="h-5 w-4/5 bg-slate-200 rounded-md" />
        <div className="h-4 w-2/3 bg-slate-200 rounded-md" />
        <div className="flex justify-between pt-3.5 border-t border-slate-100">
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-slate-200 rounded w-full" />
        </td>
      ))}
    </tr>
  );
};
