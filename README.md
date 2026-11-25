# PropNest — Fullstack Real Estate Frontend Platform

A modern, production-grade, responsive real-estate web application inspired by 99acres, NoBroker, and Housing.com. Built with Next.js (App Router), TypeScript, Tailwind CSS, React Hook Form, and Zod, fully integrated with a Node.js/Express + Prisma + PostgreSQL backend.

---

## 1. Key Features

- **Property Discovery & Search:**
  - Real-time search across title, description, locality, and city.
  - Granular filters: Purpose (Buy/Rent), Property Type (Apartment, Villa, Commercial, etc.), Price Range, Bedrooms, Bathrooms, Furnishing Status, and Amenities.
  - Multi-criteria sorting: Newest, Oldest, Price Low-to-High, Price High-to-Low.
  - Grid and List view switcher.
  - Seamless pagination synced with URL query parameters.
- **Property Details Page:**
  - Full-fidelity image gallery with thumbnail navigation and full-screen preview modal.
  - Key specifications: Carpet area, super built-up area, bedrooms, bathrooms, floor number, possession status, furnishing, and facing.
  - Interactive direct owner contact & inquiry submission form with validation and loading states.
  - Similar properties section matching city and listing type.
- **Authentication & Security:**
  - JWT token architecture with short-lived access tokens and HttpOnly refresh cookies.
  - Role-based account registration (`USER` individual buyers/tenants vs. `AGENT` brokers).
  - Password strength meter, confirm password match, and password visibility toggles.
  - Automatic token refresh on 401 via Axios interceptors.
  - Protected client routes under `/dashboard/*` with session verification against `GET /api/v1/auth/me`.
- **User Dashboard & Property Management:**
  - Dashboard analytics overview: Total listings, active/approved, pending review, and inquiries received.
  - Full Property Lifecycle: Post new property in `DRAFT`, submit for administrative approval (`PENDING_APPROVAL`), edit details, mark as `SOLD`/`RENTED`, and delete with confirmation modal.
  - Direct Multipart Photo Uploads to backend storage (`POST /api/v1/properties/:id/images`), set primary image, and delete photo.
  - Saved Favorites: Add/remove properties to favorites with instant state sync.
  - Inquiries Management: View received inquiries on user properties and sent inquiries as buyer; update inquiry status (`NEW`, `CONTACTED`, `IN_PROGRESS`, `CLOSED`).
  - Profile & Security: Update full name and phone number; change password with current password verification.
- **SEO & Performance:**
  - Dynamic OpenGraph and Twitter card metadata for property pages.
  - Automated `sitemap.xml` and `robots.txt` generation.
  - Next.js Image component optimization with remote host whitelisting.

---

## 2. Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS + PostCSS + Autoprefixer
- **HTTP Client:** Axios with request/response interceptors & token refresh
- **Form Management:** React Hook Form + @hookform/resolvers
- **Schema Validation:** Zod
- **Icons:** Lucide React

---

## 3. Environment Configuration

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Refer to `.env.example` for reference without secrets.

---

## 4. Running the Application

### Prerequisites

Ensure the backend server is running at `http://localhost:5000` with PostgreSQL database configured and seeded.

```bash
# Seed backend database if needed
cd "../real-estate-Server"
npm run seed
```

### Development Server

```bash
cd "d:\Tech Project\real-estate-website"
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Type check and build
npm run type-check
npm run build

# Start production server
npm start
```

---

## 5. Folder Architecture

```
src/
├── app/
│   ├── layout.tsx                     # Global HTML & Auth provider wrapper
│   ├── page.tsx                       # Homepage with hero, cities, featured listings
│   ├── globals.css                    # Tailwind base styles
│   ├── sitemap.ts                     # Dynamic sitemap
│   ├── robots.ts                      # Robots crawler instructions
│   ├── login/page.tsx                 # Login form & redirect
│   ├── register/page.tsx              # Registration with role & strength meter
│   ├── properties/
│   │   ├── page.tsx                   # Search, sidebar filters & pagination
│   │   └── [slug]/page.tsx            # Property detail, gallery, inquiry form
│   └── dashboard/
│       ├── layout.tsx                 # Protected route wrapper & dashboard sidebar
│       ├── page.tsx                   # Overview KPI stats & recent activity
│       ├── properties/
│       │   ├── page.tsx               # My listings table with status tabs & actions
│       │   ├── create/page.tsx        # Multi-section create property & photo upload
│       │   └── [id]/edit/page.tsx     # Edit property & photo manager
│       ├── favorites/page.tsx         # User's bookmarked properties
│       ├── inquiries/page.tsx         # Received & sent inquiries with status updates
│       └── profile/page.tsx           # Profile info & password change
├── components/
│   ├── common/                        # Header, Footer, Badge, Modal, Pagination, Breadcrumbs, EmptyState, LoadingSkeleton
│   ├── property/                      # PropertyCard, PropertyGrid, PropertyFilters, PropertyGallery, InquiryForm
│   └── dashboard/                     # DashboardSidebar
├── context/
│   └── AuthContext.tsx                # Auth state provider with refresh & me check
├── hooks/
│   ├── useAuth.ts                     # Context consumer hook
│   └── useDebounce.ts                 # Search input debounce hook
├── lib/
│   ├── api/client.ts                  # Axios client, interceptors, error extraction
│   └── utils.ts                       # Currency (₹ Cr/L), date, area, and URL formatting
├── services/                          # authService, propertyService, favoriteService, inquiryService, userService
├── types/                             # Strict TypeScript interfaces & Enums
└── validations/                       # Zod schemas (auth, property, inquiry)
```

---

## 6. Real Backend API Integration Summary

| Feature | Backend Endpoint | HTTP Method |
|---|---|---|
| User Register | `/api/v1/auth/register` | `POST` |
| User Login | `/api/v1/auth/login` | `POST` |
| Verify Session | `/api/v1/auth/me` | `GET` |
| Refresh Token | `/api/v1/auth/refresh` | `POST` |
| Logout | `/api/v1/auth/logout` | `POST` |
| Change Password | `/api/v1/auth/change-password` | `PATCH` |
| Property Discovery | `/api/v1/properties` | `GET` |
| Property Details | `/api/v1/properties/:idOrSlug` | `GET` |
| Similar Properties | `/api/v1/properties/:id/similar` | `GET` |
| Create Property | `/api/v1/properties` | `POST` |
| Upload Photos | `/api/v1/properties/:id/images` | `POST` (multipart) |
| Update Property | `/api/v1/properties/:id` | `PATCH` |
| Submit for Approval | `/api/v1/properties/:id/submit-for-approval` | `PATCH` |
| Update Status | `/api/v1/properties/:id/status` | `PATCH` |
| Delete Property | `/api/v1/properties/:id` | `DELETE` |
| Delete Photo | `/api/v1/properties/:id/images/:imageId` | `DELETE` |
| Set Primary Photo | `/api/v1/properties/:id/images/:imageId/primary` | `PATCH` |
| My Listings | `/api/v1/users/me/properties` | `GET` |
| Saved Favorites | `/api/v1/favorites` | `GET`, `POST`, `DELETE` |
| Submit Inquiry | `/api/v1/properties/:id/inquiries` | `POST` |
| Received Inquiries | `/api/v1/inquiries/received` | `GET` |
| Sent Inquiries | `/api/v1/inquiries/my-inquiries` | `GET` |
| Update Inquiry Status | `/api/v1/inquiries/:id/status` | `PATCH` |
| Amenities List | `/api/v1/amenities` | `GET` |
| Location Search | `/api/v1/locations/search` | `GET` |
| Health Check | `/api/v1/health` | `GET` |

