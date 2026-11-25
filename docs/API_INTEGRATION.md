# API Integration Specification & Contract Document

This document provides the definitive mapping between the frontend client and the backend REST API (`http://localhost:5000/api/v1`).

---

## 1. Overview & General Standards

- **Base URL:** `http://localhost:5000/api/v1`
- **Swagger Documentation:** `http://localhost:5000/api-docs`
- **Authentication Scheme:** JSON Web Tokens (JWT).
  - Short-lived Access Token passed via `Authorization: Bearer <accessToken>` header.
  - Refresh Token stored in HttpOnly cookie (`refreshToken`) and/or passed in request body on token refresh.
  - Cross-Origin Resource Sharing (CORS): Credentials enabled (`credentials: true`), development origins permitted.
- **Envelope Standard Response Format:**
```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

---

## 2. API Endpoints Contract

### 2.1 Authentication & Profile (`/auth`, `/users`)

| Method | Endpoint | Auth | Purpose | Request Body / Query | Success Response Data |
|---|---|---|---|---|---|
| `POST` | `/auth/register` | Public | Register new user | `{ fullName, email, phone?, password, confirmPassword, role? }` | `User` object (Role: `USER` \| `AGENT`) |
| `POST` | `/auth/login` | Public | Authenticate user | `{ email, password }` | `{ user: User, accessToken: string }` + `Set-Cookie: refreshToken` |
| `POST` | `/auth/refresh` | Optional / Cookie | Refresh access token | `{ refreshToken?: string }` | `{ accessToken: string }` |
| `POST` | `/auth/logout` | Optional | Revoke session & clear cookie | `{ refreshToken?: string }` | `null` |
| `POST` | `/auth/logout-all` | Bearer | Revoke all active sessions | None | `null` |
| `GET` | `/auth/me` | Bearer | Verify current authenticated session | None | `User` |
| `PATCH` | `/auth/change-password` | Bearer | Change account password | `{ currentPassword, newPassword, confirmPassword }` | `null` |
| `POST` | `/auth/forgot-password` | Public | Request password reset token | `{ email }` | `null` |
| `POST` | `/auth/reset-password` | Public | Reset password with token | `{ token, newPassword, confirmPassword }` | `null` |
| `GET` | `/users/me` | Bearer | Get full profile details | None | `User` profile with verification status |
| `PATCH` | `/users/me` | Bearer | Update profile info | `{ fullName?, phone?, profileImage? }` | Updated `User` |
| `GET` | `/users/me/properties` | Bearer | List listings owned by user | Query: `page`, `limit`, `status?` | `Property[]` with pagination `meta` |

---

### 2.2 Property Discovery & Search (`/properties`, `/locations`, `/amenities`)

| Method | Endpoint | Auth | Purpose | Query Parameters | Success Response Data |
|---|---|---|---|---|---|
| `GET` | `/properties` | Public | Search & list approved properties | `keyword`, `city`, `locality`, `state`, `postalCode`, `propertyType`, `listingType`, `furnishingStatus`, `minPrice`, `maxPrice`, `bedrooms`, `minBedrooms`, `maxBedrooms`, `bathrooms`, `minArea`, `maxArea`, `verifiedOnly`, `amenities`, `sortBy`, `page`, `limit` | `PropertyListItem[]` + `meta` |
| `GET` | `/properties/:id` | Public | Get single property by UUID | Path param: `id` | `PropertyDetail` (with images, amenities, owner) |
| `GET` | `/properties/slug/:slug` | Public | Get single property by Slug | Path param: `slug` | `PropertyDetail` (with images, amenities, owner) |
| `GET` | `/properties/:id/similar` | Public | Fetch up to 4 similar properties | Path param: `id` | `PropertyListItem[]` |
| `GET` | `/amenities` | Public | List all available amenities | None | `Amenity[]` (`id`, `name`, `slug`, `icon`) |
| `GET` | `/locations/search` | Public | Autocomplete or top cities | Query: `q?` | `LocationItem[]` (`city`, `state`, `locality?`, `propertyCount`) |

---

### 2.3 Property Management (`/properties`)

| Method | Endpoint | Auth | Purpose | Request Body / Format | Success Response Data |
|---|---|---|---|---|---|
| `POST` | `/properties` | Bearer | Create property listing (starts in `DRAFT`) | JSON `{ title, description, propertyType, listingType, price, negotiable, bedrooms, bathrooms, balconies, builtUpArea?, carpetArea, plotArea?, areaUnit, floorNumber?, totalFloors?, furnishingStatus, possessionStatus, constructionStatus?, propertyAge?, facing?, parkingSpaces, city, locality, state, country, postalCode, latitude?, longitude?, address, landmark?, amenityIds? }` | `Property` |
| `PATCH` | `/properties/:id` | Bearer (Owner) | Update property details | JSON (partial update) | Updated `Property` |
| `PATCH` | `/properties/:id/status` | Bearer (Owner) | Change listing status (`DRAFT`, `PENDING_APPROVAL`, `SOLD`, `RENTED`, `ARCHIVED`) | `{ status: PropertyStatus }` | Updated `Property` |
| `PATCH` | `/properties/:id/submit-for-approval` | Bearer (Owner) | Submit listing for admin review | None | Updated `Property` (status: `PENDING_APPROVAL`) |
| `DELETE` | `/properties/:id` | Bearer (Owner) | Soft-delete property listing | None | `null` |
| `POST` | `/properties/:id/images` | Bearer (Owner) | Upload property photos | `multipart/form-data` with `images` field (max 10 files, 5MB each, JPEG/PNG/WebP) | `PropertyImage[]` |
| `DELETE` | `/properties/:id/images/:imageId` | Bearer (Owner) | Remove specific property image | None | `null` |
| `PATCH` | `/properties/:id/images/:imageId/primary`| Bearer (Owner) | Set primary display image | None | `null` |
| `PATCH` | `/properties/:id/images/reorder` | Bearer (Owner) | Reorder gallery display | `{ images: [{ imageId: string, displayOrder: number }] }` | `null` |

---

### 2.4 Favorites (`/favorites`)

| Method | Endpoint | Auth | Purpose | Request Body / Query | Success Response Data |
|---|---|---|---|---|---|
| `GET` | `/favorites` | Bearer | List saved properties | Query: `page`, `limit` | Array of `{ id, propertyId, createdAt, property: PropertyListItem }` + `meta` |
| `POST` | `/favorites/:propertyId` | Bearer | Save property to favorites | Path param: `propertyId` | Favorite record |
| `DELETE` | `/favorites/:propertyId` | Bearer | Remove from favorites | Path param: `propertyId` | `null` |

---

### 2.5 Inquiries (`/inquiries`, `/properties/:id/inquiries`)

| Method | Endpoint | Auth | Purpose | Request Body / Query | Success Response Data |
|---|---|---|---|---|---|
| `POST` | `/properties/:id/inquiries` | Public / Opt-Bearer | Send inquiry to property owner | `{ name, email, phone, message, source? }` | `Inquiry` object |
| `GET` | `/inquiries/my-inquiries` | Bearer | Buyer's inquiries sent | Query: `page`, `limit` | `Inquiry[]` with property details + `meta` |
| `GET` | `/inquiries/received` | Bearer | Owner's inquiries received | Query: `page`, `limit` | `Inquiry[]` with property and buyer info + `meta` |
| `GET` | `/inquiries/:id` | Bearer (Participant) | View inquiry details | Path param: `id` | Single `Inquiry` |
| `PATCH` | `/inquiries/:id/status` | Bearer (Owner) | Update inquiry status (`NEW`, `CONTACTED`, `IN_PROGRESS`, `CLOSED`, `SPAM`) | `{ status: InquiryStatus }` | Updated `Inquiry` |

---

### 2.6 System & Health

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| `GET` | `/health` | Public | Backend and PostgreSQL database health check |

---

## 3. Analysis of Capabilities & Missing Endpoints

1. **Dashboard Analytics / Overview Endpoint:**
   - The backend does not have a dedicated aggregate `/dashboard/stats` endpoint.
   - *Frontend adaptation:* The frontend retrieves the user's properties via `/users/me/properties` (calculating total, active/approved, pending, rejected, sold/rented) and received inquiries via `/inquiries/received` (calculating total and new/unread inquiries). This strictly adheres to rule #6 without simulating or fabricating statistics.
2. **Slug vs. ID Routing:**
   - Both `/properties/:id` and `/properties/slug/:slug` resolve to the exact same controller method `PropertyService.getPropertyByIdOrSlug()`. The frontend can seamlessly route using either slugs or UUIDs (`/properties/[slug]`).
3. **Image Upload Protocol:**
   - The backend exposes `POST /properties/:id/images` accepting standard `multipart/form-data` with field name `images`. Images are stored either in local storage (`/uploads/<uuid>.<ext>`) or Cloudinary, and the relative/absolute URL is saved in `PropertyImage.imageUrl`. The frontend handles both local URLs (`http://localhost:5000/uploads/...`) and remote Unsplash/Cloudinary URLs transparently.

