import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-500 py-3" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-primary-600 transition flex items-center gap-1">
        <Home className="w-4 h-4" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {isLast || !item.href ? (
              <span className="font-medium text-slate-800 truncate max-w-xs">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-primary-600 transition">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

