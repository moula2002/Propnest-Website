import React from 'react';
import { notFound } from 'next/navigation';
import { propertyService } from '@/services/propertyService';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { InquiryForm } from '@/components/property/InquiryModal';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import {
  formatPrice,
  formatArea,
  formatPropertyType,
  formatListingType,
  formatDate,
} from '@/lib/utils';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Layers,
  ShieldCheck,
  Check,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PropertyDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  let property = null;
  let similarProperties: any[] = [];

  try {
    property = await propertyService.getProperty(params.slug);
    if (property?.id) {
      similarProperties = await propertyService.getSimilarProperties(property.id).catch(() => []);
    }
  } catch (error) {
    console.error('Error fetching property detail:', error);
  }

  if (!property) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-10 bg-transparent">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Properties', href: '/properties' },
          { label: property.city, href: `/properties?city=${encodeURIComponent(property.city)}` },
          { label: property.title },
        ]}
      />

      {/* Top Title & Price Section Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold text-white bg-[#142C4C] shadow-sm tracking-wide">
              {formatListingType(property.listingType)}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF7ED] text-[#FF7A1A] border border-orange-200/70">
              {formatPropertyType(property.propertyType)}
            </span>

            {property.verifiedAt && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                Verified
              </span>
            )}

            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-[#71839D]">
              {property.furnishingStatus.replace('_', ' ')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#142C4C] tracking-tight font-editorial">
            {property.title}
          </h1>

          <p className="text-xs sm:text-sm text-[#71839D] flex items-center gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-[#FF7A1A] shrink-0" />
            <span>
              {property.address}, {property.locality}, {property.city}, {property.state} - {property.postalCode}
            </span>
          </p>
        </div>

        {/* Price & Negotiation Tag */}
        <div className="lg:text-right shrink-0 bg-[#F8F7F4] p-5 sm:p-6 rounded-2xl border border-slate-200/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#71839D] block mb-1">
            Price
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#142C4C] tracking-tight font-display">
            {formatPrice(property.price)}
            {property.listingType === 'RENT' && <span className="text-sm font-normal text-[#71839D]"> /month</span>}
          </div>
          <p className="text-xs text-[#FF7A1A] font-bold mt-1">
            {property.negotiable ? 'Negotiable' : 'Fixed Price'}
          </p>
        </div>
      </div>

      {/* Main Grid: Gallery & Info + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 cols): Gallery + Property Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <PropertyGallery images={property.images} title={property.title} />

          {/* Quick Overview Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-card text-center">
            {property.bedrooms > 0 && (
              <div className="p-4 bg-[#F8F7F4] rounded-2xl space-y-1 border border-slate-100">
                <BedDouble className="w-5 h-5 text-[#FF7A1A] mx-auto" />
                <span className="block text-[11px] text-[#71839D] font-bold uppercase tracking-wider">Bedrooms</span>
                <span className="text-base font-extrabold text-[#142C4C]">{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="p-4 bg-[#F8F7F4] rounded-2xl space-y-1 border border-slate-100">
                <Bath className="w-5 h-5 text-[#FF7A1A] mx-auto" />
                <span className="block text-[11px] text-[#71839D] font-bold uppercase tracking-wider">Bathrooms</span>
                <span className="text-base font-extrabold text-[#142C4C]">{property.bathrooms} Baths</span>
              </div>
            )}
            <div className="p-4 bg-[#F8F7F4] rounded-2xl space-y-1 border border-slate-100">
              <Maximize2 className="w-5 h-5 text-[#FF7A1A] mx-auto" />
              <span className="block text-[11px] text-[#71839D] font-bold uppercase tracking-wider">Carpet Area</span>
              <span className="text-base font-extrabold text-[#142C4C]">
                {formatArea(property.carpetArea, property.areaUnit)}
              </span>
            </div>
            <div className="p-4 bg-[#F8F7F4] rounded-2xl space-y-1 border border-slate-100">
              <Layers className="w-5 h-5 text-[#FF7A1A] mx-auto" />
              <span className="block text-[11px] text-[#71839D] font-bold uppercase tracking-wider">Floor</span>
              <span className="text-base font-extrabold text-[#142C4C]">
                {property.floorNumber !== null && property.floorNumber !== undefined
                  ? `${property.floorNumber} / ${property.totalFloors || 'N/A'}`
                  : 'Independent'}
              </span>
            </div>
          </div>

          {/* Property Description */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-card space-y-4">
            <h2 className="text-xl font-bold text-[#152B46] font-display">About this Property</h2>
            <p className="text-sm text-[#64748B] leading-relaxed whitespace-pre-line font-medium">
              {property.description}
            </p>
          </div>

          {/* Detailed Features & Specifications */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-card space-y-6">
            <h2 className="text-xl font-bold text-[#152B46] font-display">Property Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
                <span className="text-[#64748B] font-medium">Property Type</span>
                <span className="font-bold text-[#152B46]">{formatPropertyType(property.propertyType)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
                <span className="text-[#64748B] font-medium">Possession</span>
                <span className="font-bold text-[#152B46]">
                  {property.possessionStatus.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
                <span className="text-[#64748B] font-medium">Furnishing</span>
                <span className="font-bold text-[#152B46]">
                  {property.furnishingStatus.replace('_', ' ')}
                </span>
              </div>
              {property.facing && (
                <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B] font-medium">Facing Direction</span>
                  <span className="font-bold text-[#152B46]">{property.facing}</span>
                </div>
              )}
              {property.propertyAge && (
                <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B] font-medium">Property Age</span>
                  <span className="font-bold text-[#152B46]">{property.propertyAge}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
                <span className="text-[#64748B] font-medium">Parking Spaces</span>
                <span className="font-bold text-[#152B46]">
                  {property.parkingSpaces > 0 ? `${property.parkingSpaces} Reserved` : 'None'}
                </span>
              </div>
              {property.builtUpArea && (
                <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B] font-medium">Super Built-up Area</span>
                  <span className="font-bold text-[#152B46]">
                    {formatArea(property.builtUpArea, property.areaUnit)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-[#F1F5F9]">
                <span className="text-[#64748B] font-medium">Listed On</span>
                <span className="font-bold text-[#152B46]">{formatDate(property.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 shadow-card space-y-6">
              <h2 className="text-xl font-bold text-[#152B46] font-display">Amenities & Facilities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {property.amenities.map((item) => (
                  <div
                    key={item.amenityId}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E5E7EB] text-xs font-bold text-[#152B46]"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#FAF6EE] text-[#C8A46A] flex items-center justify-center shrink-0 border border-[#E8DFC8]">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>{item.amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 col): Owner Profile & Inquiry Form */}
        <div className="space-y-6 sticky top-28">
          {property.owner && (
            <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 sm:p-7 shadow-card space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-[#152B46] text-white font-black text-xl flex items-center justify-center shadow-md">
                  {property.owner.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-[#152B46] text-base">{property.owner.fullName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FAF6EE] text-[#9A6E31] font-bold uppercase tracking-wider border border-[#E8DFC8]">
                      {property.owner.role === 'AGENT' ? 'Verified Agent' : 'Property Owner'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] text-xs text-[#64748B] space-y-1.5 font-medium">
                <p>Member since {formatDate(property.owner.createdAt)}</p>
                <p className="text-[#10B981] font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8A46A]" /> High response rate
                </p>
              </div>

              {/* Inquiry Form */}
              <div className="pt-3 border-t border-[#F1F5F9]">
                <h4 className="text-sm font-bold text-[#152B46] mb-3">Contact Property Owner</h4>
                <InquiryForm propertyId={property.id} propertyTitle={property.title} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Properties Section */}
      {similarProperties.length > 0 && (
        <section className="pt-10 border-t border-[#EAE6DF] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#152B46] font-display">
                Similar Properties Nearby
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">Other recommended listings in {property.city}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarProperties.map((sim) => (
              <PropertyCard key={sim.id} property={sim} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
