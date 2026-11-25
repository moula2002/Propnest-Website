'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertyFormSchema, PropertyFormData } from '@/validations/property';
import { propertyService } from '@/services/propertyService';
import { Amenity, PropertyCategory } from '@/types';
import { getErrorMessage } from '@/lib/api/client';
import {
  Upload,
  X,
  Loader2,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

function CreatePropertyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCategory = searchParams?.get('category') || '';
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      listingType: 'SALE',
      propertyType: preselectedCategory || '',
      areaUnit: 'sqft',
      furnishingStatus: 'UNFURNISHED',
      possessionStatus: 'READY_TO_MOVE',
      country: 'India',
      negotiable: false,
      isFeatured: false,
      isLatest: false,
      bedrooms: 2,
      bathrooms: 2,
      balconies: 1,
      parkingSpaces: 1,
    },
  });

  useEffect(() => {
    Promise.all([
      propertyService.getAmenities().catch(() => []),
      propertyService.getCategories().catch(() => []),
    ]).then(([amenitiesData, catsData]) => {
      setAmenities(amenitiesData);
      setCategories(catsData);
      if (preselectedCategory) {
        setValue('propertyType', preselectedCategory);
      } else if (catsData.length > 0 && !watch('propertyType')) {
        setValue('propertyType', catsData[0].type);
      } else if (catsData.length === 0 && !watch('propertyType')) {
        setValue('propertyType', 'APARTMENT');
      }
    });
  }, [preselectedCategory, setValue, watch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      const combined = [...selectedFiles, ...filesArr].slice(0, 10);
      setSelectedFiles(combined);

      // Create preview URLs
      const previews = combined.map((f) => URL.createObjectURL(f));
      setFilePreviews(previews);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFilePreviews(updatedFiles.map((f) => URL.createObjectURL(f)));
  };

  const toggleAmenity = (id: string) => {
    if (selectedAmenityIds.includes(id)) {
      setSelectedAmenityIds(selectedAmenityIds.filter((a) => a !== id));
    } else {
      setSelectedAmenityIds([...selectedAmenityIds, id]);
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    setServerError(null);
    try {
      // 1. Create property listing
      const createdProperty = await propertyService.createProperty({
        ...data,
        amenityIds: selectedAmenityIds,
      });

      // 2. Upload images if selected
      if (selectedFiles.length > 0 && createdProperty?.id) {
        await propertyService.uploadImages(createdProperty.id, selectedFiles);
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/properties');
      }, 1500);
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Property Listing Created!</h2>
        <p className="text-sm text-slate-600">
          Your listing has been created in DRAFT status. You can review and submit it for administrative approval anytime.
        </p>
        <p className="text-xs text-slate-400">Redirecting to your properties dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <Link
            href="/dashboard/properties"
            className="text-xs font-semibold text-slate-500 hover:text-primary-600 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Listings</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Post a Property for Sale or Rent</h1>
          <p className="text-sm text-slate-500">
            Fill in accurate details to get genuine buyers and verified tenant inquiries faster.
          </p>
        </div>
      </div>

      {serverError && (
        <div className="flex items-start gap-2 p-4 text-sm bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-600" />
            <span>Basic Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Listing Purpose *</label>
              <select
                {...register('listingType')}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="SALE">For Sale</option>
                <option value="RENT">For Rent</option>
                <option value="LEASE">For Lease</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Property Category *
              </label>
              <select
                {...register('propertyType')}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] bg-white"
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id || cat.type} value={cat.type}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="APARTMENT">Apartment / Flat</option>
                    <option value="HOUSE">Independent House</option>
                    <option value="VILLA">Villa</option>
                    <option value="PLOT">Plot / Land</option>
                    <option value="COMMERCIAL">Commercial Office/Space</option>
                    <option value="SHOP">Retail Shop</option>
                    <option value="OTHER">Other</option>
                  </>
                )}
              </select>
              {errors.propertyType && (
                <p className="text-xs text-rose-600 mt-1">{errors.propertyType.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Property Title *</label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Spacious 3 BHK Luxury Apartment in Koramangala"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="Provide key highlights: natural light, modular kitchen, ventilation, nearby metro, etc."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>}
          </div>
        </div>

        {/* Section 2: Pricing & Dimension */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Pricing & Dimensions</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                {...register('price')}
                placeholder="e.g. 8500000"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.price && <p className="text-xs text-rose-600 mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Carpet Area *</label>
              <input
                type="number"
                {...register('carpetArea')}
                placeholder="e.g. 1450"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.carpetArea && <p className="text-xs text-rose-600 mt-1">{errors.carpetArea.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Area Unit</label>
              <select
                {...register('areaUnit')}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="sqft">Sq. Ft.</option>
                <option value="sqyd">Sq. Yards</option>
                <option value="sqm">Sq. Meters</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="negotiable"
              {...register('negotiable')}
              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
            />
            <label htmlFor="negotiable" className="text-xs font-medium text-slate-700 cursor-pointer">
              Price is negotiable
            </label>
          </div>
        </div>

        {/* Section 3: Configuration & Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Room Specifications & Status</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bedrooms</label>
              <input
                type="number"
                {...register('bedrooms')}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bathrooms</label>
              <input
                type="number"
                {...register('bathrooms')}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Balconies</label>
              <input
                type="number"
                {...register('balconies')}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Parking Spaces</label>
              <input
                type="number"
                {...register('parkingSpaces')}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Furnishing Status</label>
              <select
                {...register('furnishingStatus')}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="UNFURNISHED">Unfurnished</option>
                <option value="SEMI_FURNISHED">Semi Furnished</option>
                <option value="FULLY_FURNISHED">Fully Furnished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Possession Status</label>
              <select
                {...register('possessionStatus')}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="READY_TO_MOVE">Ready to Move</option>
                <option value="UNDER_CONSTRUCTION">Under Construction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Facing</label>
              <input
                type="text"
                {...register('facing')}
                placeholder="e.g. North-East"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Location Address */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Location & Address</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                {...register('city')}
                placeholder="e.g. Bengaluru"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Locality *</label>
              <input
                type="text"
                {...register('locality')}
                placeholder="e.g. Whitefield"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.locality && <p className="text-xs text-rose-600 mt-1">{errors.locality.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                {...register('state')}
                placeholder="e.g. Karnataka"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.state && <p className="text-xs text-rose-600 mt-1">{errors.state.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Street Address *</label>
              <input
                type="text"
                {...register('address')}
                placeholder="e.g. Flat 402, Oakwood Residency, Main Road"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.address && <p className="text-xs text-rose-600 mt-1">{errors.address.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code (PIN) *</label>
              <input
                type="text"
                {...register('postalCode')}
                placeholder="e.g. 560066"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.postalCode && <p className="text-xs text-rose-600 mt-1">{errors.postalCode.message}</p>}
            </div>
          </div>
        </div>

        {/* Section 5: Amenities */}
        {amenities.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {amenities.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium cursor-pointer transition ${
                    selectedAmenityIds.includes(item.id)
                      ? 'bg-primary-50 border-primary-500 text-primary-900'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedAmenityIds.includes(item.id)}
                    onChange={() => toggleAmenity(item.id)}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>{item.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Section 6: Image Uploads */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Property Photos</h2>
            <span className="text-xs text-slate-500">Up to 10 photos (JPG, PNG, WebP)</span>
          </div>

          <label className="border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50/20 transition block">
            <Upload className="w-10 h-10 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-800">
              Click to select photos or drag and drop
            </p>
            <p className="text-xs text-slate-500 mt-1">High resolution images receive 3x more buyer inquiries</p>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Previews grid */}
          {filePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
              {filePreviews.map((preview, idx) => (
                <div key={idx} className="relative h-24 rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-primary-600 text-white text-[9px] font-bold rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 7: Homepage Visibility Toggles */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#142C4C]">Homepage Placement</h2>
            <p className="text-xs text-[#71839D] mt-0.5">
              Choose whether this listing should be highlighted in Featured Properties or Latest Listings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="p-4 rounded-2xl border border-slate-200 bg-[#F8F7F4] hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-4 transition-all">
              <div>
                <span className="text-xs font-bold text-[#142C4C] uppercase tracking-wide block">
                  FEATURED PROPERTIES
                </span>
                <span className="text-[11px] text-[#71839D]">
                  Show in the Featured Properties section on the homepage
                </span>
              </div>
              <div className="relative inline-flex items-center shrink-0">
                <input
                  type="checkbox"
                  {...register('isFeatured')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7A1A]" />
              </div>
            </label>

            <label className="p-4 rounded-2xl border border-slate-200 bg-[#F8F7F4] hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-4 transition-all">
              <div>
                <span className="text-xs font-bold text-[#142C4C] uppercase tracking-wide block">
                  Latest Listings
                </span>
                <span className="text-[11px] text-[#71839D]">
                  Show in the Latest Listings section on the homepage
                </span>
              </div>
              <div className="relative inline-flex items-center shrink-0">
                <input
                  type="checkbox"
                  {...register('isLatest')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#142C4C]" />
              </div>
            </label>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/dashboard/properties"
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-darkNavy hover:bg-navy-900 rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                <span>Creating Listing & Uploading...</span>
              </>
            ) : (
              <span>Save & Post Property</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CreatePropertyPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#71839D]">Loading property form...</div>}>
      <CreatePropertyForm />
    </Suspense>
  );
}

