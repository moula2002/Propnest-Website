import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | undefined | null): string {
  if (price === undefined || price === null || price === '') return '₹ 0';
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) return '₹ 0';

  if (num >= 10000000) {
    const cr = (num / 10000000).toFixed(2);
    return `₹ ${cr.replace(/\.00$/, '')} Cr`;
  }
  if (num >= 100000) {
    const lakh = (num / 100000).toFixed(2);
    return `₹ ${lakh.replace(/\.00$/, '')} L`;
  }
  if (num >= 1000) {
    const k = (num / 1000).toFixed(1);
    return `₹ ${k.replace(/\.0$/, '')} K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatArea(area: number | string | undefined | null, unit: string = 'sqft'): string {
  if (!area) return 'N/A';
  const num = typeof area === 'string' ? parseFloat(area) : area;
  if (isNaN(num)) return 'N/A';
  return `${num.toLocaleString('en-IN')} ${unit}`;
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getFullImageUrl(url: string | null | undefined): string {
  if (!url) return '/images/properties/property-placeholder.jpg';

  const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://propnest-server.onrender.com';

  // If local uploads on backend
  if (url.startsWith('uploads/') || url.startsWith('/uploads/')) {
    return `${backendBase}${url.startsWith('/') ? '' : '/'}${url}`;
  }

  if (url.includes('http://localhost:5000/uploads/')) {
    return url.replace('http://localhost:5000', backendBase);
  }

  // If already a local relative path
  if (url.startsWith('/')) {
    return url;
  }

  return url;
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatPropertyType(type: string | undefined | null): string {
  if (!type) return '';
  return type
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function formatListingType(type: string | undefined | null): string {
  if (!type) return '';
  switch (type.toUpperCase()) {
    case 'SALE':
      return 'For Sale';
    case 'RENT':
      return 'For Rent';
    case 'LEASE':
      return 'For Lease';
    default:
      return type;
  }
}

