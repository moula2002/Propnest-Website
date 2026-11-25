'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertyFormSchema, PropertyFormData } from '@/validations/property';
import { propertyService } from '@/services/propertyService';
import { Property, PropertyImage, Amenity, PropertyCategory } from '@/types';
import { getErrorMessage } from '@/lib/api/client';
import { getFullImageUrl } from '@/lib/utils';
import {
  Upload,
  X,
  Loader2,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Star,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';

interface EditPropertyPageProps {
  params: {
    id: string;
  };
}

export default function EditPropertyPage({ params }: EditPropertyPageProps) {
  const router = useRouter();
  const propertyId = params.id;

  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState<Property | null>(null);
  const [existingImages, setExistingImages] = useState<PropertyImage[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newFilePreviews, setNewFilePreviews] = useState<string[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
  });

  useEffect(() => {
    const loadPropertyAndAmenities = async () => {
      setIsLoading(true);
      try {
        const [propData, amenitiesData, categoriesData] = await Promise.all([
          propertyService.getProperty(propertyId),
          propertyService.getAmenities().catch(() => []),
          propertyService.getCategories().catch(() => []),
        ]);

        setProperty(propData);
        setExistingImages(propData.images || []);
        setAmenities(amenitiesData);
        setCategories(categoriesData);

        const initialAmenityIds = propData.amenities?.map((a) => a.amenityId) || [];
        setSelectedAmenityIds(initialAmenityIds);

        reset({
          title: propData.title,
          description: propData.description,
          propertyType: propData.propertyType as any,
          listingType: propData.listingType as any,
          price: Number(propData.price),
          negotiable: propData.negotiable,
          bedrooms: propData.bedrooms,
          bathrooms: propData.bathrooms,
          balconies: propData.balconies || 0,
          builtUpArea: propData.builtUpArea ? Number(propData.builtUpArea) : undefined,
          carpetArea: Number(propData.carpetArea),
          plotArea: propData.plotArea ? Number(propData.plotArea) : undefined,
          areaUnit: propData.areaUnit || 'sqft',
          floorNumber: propData.floorNumber || 0,
          totalFloors: propData.totalFloors || 0,
          furnishingStatus: propData.furnishingStatus as any,
          possessionStatus: propData.possessionStatus as any,
          constructionStatus: propData.constructionStatus || '',
          propertyAge: propData.propertyAge || '',
          facing: propData.facing || '',
          parkingSpaces: propData.parkingSpaces || 0,
          city: propData.city,
          locality: propData.locality,
          state: propData.state,
          country: propData.country || 'India',
          postalCode: propData.postalCode,
          latitude: propData.latitude ? Number(propData.latitude) : undefined,
          longitude: propData.longitude ? Number(propData.longitude) : undefined,
          address: propData.address,
          landmark: propData.landmark || '',
          isFeatured: Boolean((propData as any).isFeatured),
          isLatest: Boolean((propData as any).isLatest),
        });
      } catch (err) {
        setServerError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadPropertyAndAmenities();
  }, [propertyId, reset]);

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      const combined = [...newFiles, ...filesArr];
      setNewFiles(combined);
      setNewFilePreviews(combined.map((f) => URL.createObjectURL(f)));
    }
  };

  const removeNewFile = (index: number) => {
    const updated = newFiles.filter((_, i) => i !== index);
    setNewFiles(updated);
    setNewFilePreviews(updated.map((f) => URL.createObjectURL(f)));
  };

  const handleDeleteExistingImage = async (imageId: string) => {
    try {
      await propertyService.deleteImage(propertyId, imageId);
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    try {
      await propertyService.setPrimaryImage(propertyId, imageId);
      setExistingImages(
        existingImages.map((img) => ({
          ...img,
          isPrimary: img.id === imageId,
        }))
      );
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
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
    setSuccessMessage(null);
    try {
      await propertyService.updateProperty(propertyId, {
        ...data,
        amenityIds: selectedAmenityIds,
      });

      if (newFiles.length > 0) {
        const uploaded = await propertyService.uploadImages(propertyId, newFiles);
        setExistingImages([...existingImages, ...uploaded]);
        setNewFiles([]);
        setNewFilePreviews([]);
      }

      setSuccessMessage('Property updated successfully!');
      setTimeout(() => {
        router.push('/dashboard/properties');
      }, 1200);
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-sm text-slate-500">Loading property details...</p>
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
          <h1 className="text-2xl font-bold text-slate-900">Edit Property Details</h1>
          <p className="text-sm text-slate-500">Update pricing, information, or photos for this listing.</p>
        </div>
      </div>

      {serverError && (
        <div className="flex items-start gap-2 p-4 text-sm bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-2 p-4 text-sm bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
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
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Property Title *</label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
            <textarea
              rows={4}
              {...register('description')}
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
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.price && <p className="text-xs text-rose-600 mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Carpet Area *</label>
              <input
                type="number"
                {...register('carpetArea')}
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
        </div>

        {/* Section 3: Existing Photos Management */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Existing Photos</h2>

          {existingImages.length === 0 ? (
            <p className="text-xs text-slate-500">No photos uploaded for this property yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {existingImages.map((img) => (
                <div
                  key={img.id}
                  className="relative rounded-xl overflow-hidden border border-slate-200 group h-28 bg-slate-100"
                >
                  <img
                    src={getFullImageUrl(img.imageUrl)}
                    alt={img.altText || 'property'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(img.id)}
                      className={`p-1.5 rounded-full transition ${
                        img.isPrimary ? 'bg-amber-500 text-white' : 'bg-white/80 hover:bg-white text-slate-800'
                      }`}
                      title={img.isPrimary ? 'Primary Image' : 'Set as primary'}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingImage(img.id)}
                      className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {img.isPrimary && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload additional images */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-xs font-semibold text-slate-700">Add More Photos</h3>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleNewFileChange}
              className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {newFilePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 pt-2">
                {newFilePreviews.map((preview, idx) => (
                  <div key={idx} className="relative h-20 rounded-lg overflow-hidden border border-slate-200">
                    <img src={preview} alt="new-thumb" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Homepage Placement Toggles */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#142C4C]">Homepage Placement</h2>
            <p className="text-xs text-[#71839D] mt-0.5">
              Choose whether this listing appears in Featured Properties or Latest Listings.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="p-4 rounded-2xl border border-slate-200 bg-[#F8F7F4] hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-4 transition-all">
              <div>
                <span className="text-xs font-bold text-[#142C4C] uppercase tracking-wide block">
                  FEATURED PROPERTIES
                </span>
                <span className="text-[11px] text-[#71839D]">
                  Show in Featured Properties section
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
                  Show in Latest Listings section
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

        {/* Submit Actions */}
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
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save & Update Property</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

