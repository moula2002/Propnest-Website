export type Role = 'USER' | 'AGENT' | 'ADMIN' | 'SUPER_ADMIN';

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';

export type PropertyType =
  | 'APARTMENT'
  | 'HOUSE'
  | 'VILLA'
  | 'PLOT'
  | 'COMMERCIAL'
  | 'OFFICE'
  | 'SHOP'
  | 'OTHER';

export type ListingType = 'SALE' | 'RENT' | 'LEASE';

export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SOLD'
  | 'RENTED'
  | 'ARCHIVED';

export type FurnishingStatus = 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FULLY_FURNISHED';

export type PossessionStatus = 'READY_TO_MOVE' | 'UNDER_CONSTRUCTION';

export type InquiryStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED' | 'SPAM';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: Role;
  accountStatus?: AccountStatus;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  profileImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyImage {
  id: string;
  propertyId?: string;
  storageKey?: string;
  imageUrl: string;
  thumbnailUrl?: string | null;
  altText?: string | null;
  displayOrder?: number;
  isPrimary?: boolean;
  createdAt?: string;
}

export interface Amenity {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  imageUrl?: string | null;
  _count?: {
    properties: number;
  };
}

export interface PropertyAmenityRelation {
  propertyId: string;
  amenityId: string;
  amenity: Amenity;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: string | number;
  negotiable: boolean;
  bedrooms: number;
  bathrooms: number;
  balconies?: number;
  builtUpArea?: string | number | null;
  carpetArea: string | number;
  plotArea?: string | number | null;
  areaUnit: string;
  floorNumber?: number | null;
  totalFloors?: number | null;
  furnishingStatus: FurnishingStatus;
  possessionStatus: PossessionStatus;
  constructionStatus?: string | null;
  propertyAge?: string | null;
  facing?: string | null;
  parkingSpaces: number;
  city: string;
  locality: string;
  state: string;
  country?: string;
  postalCode: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  address: string;
  landmark?: string | null;
  status: PropertyStatus;
  rejectionReason?: string | null;
  verifiedAt?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  images: PropertyImage[];
  amenities?: PropertyAmenityRelation[];
  owner?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
    role: Role;
    profileImage?: string | null;
    createdAt?: string;
  };
  _count?: {
    images?: number;
    amenities?: number;
    favorites?: number;
  };
}

export interface PropertyListItem {
  id: string;
  title: string;
  slug: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: string | number;
  negotiable: boolean;
  bedrooms: number;
  bathrooms: number;
  carpetArea: string | number;
  areaUnit: string;
  furnishingStatus: FurnishingStatus;
  possessionStatus: PossessionStatus;
  city: string;
  locality: string;
  state: string;
  postalCode: string;
  verifiedAt?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  status?: PropertyStatus;
  images: Array<{
    id: string;
    imageUrl: string;
    thumbnailUrl?: string | null;
    altText?: string | null;
  }>;
  _count?: {
    images?: number;
    amenities?: number;
    favorites?: number;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
  property: PropertyListItem;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  buyerId?: string | null;
  ownerId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiryStatus: InquiryStatus;
  source: string;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    title: string;
    slug: string;
    city: string;
    locality: string;
    price: string | number;
    images?: PropertyImage[];
  };
  buyer?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
  } | null;
  owner?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
  };
}

export interface LocationItem {
  city: string;
  state: string;
  locality?: string;
  propertyCount: number;
}

export interface PropertyCategory {
  id: string;
  type: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
  totalProperties: number;
  approvedProperties: number;
}

export interface PropertySearchParams {
  keyword?: string;
  city?: string;
  locality?: string;
  state?: string;
  postalCode?: string;
  propertyType?: string;
  listingType?: string;
  furnishingStatus?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  minArea?: number | string;
  maxArea?: number | string;
  verifiedOnly?: boolean | string;
  isFeatured?: boolean | string;
  isLatest?: boolean | string;
  amenities?: string;
  sortBy?: 'newest' | 'oldest' | 'price_low_to_high' | 'price_high_to_low' | 'area_low_to_high' | 'area_high_to_low';
  page?: number;
  limit?: number;
}
