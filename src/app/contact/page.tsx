'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { inquiryService } from '@/services/inquiryService';
import { getErrorMessage } from '@/lib/api/client';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles,
  Building2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'Buying a Property',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await inquiryService.submitContactInquiry({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });
      setIsSubmitted(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: 'Buying a Property',
        message: '',
      });
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-transparent text-[#142C4C] min-h-screen pt-28 pb-16">
      {/* Top Header & Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />

        {/* Transparent Hero Header */}
        <div className="relative py-6 sm:py-10 text-[#142C4C] border-b border-slate-200/70">
          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-orange-200/70 shadow-xs text-[#FF7A1A]">
              <Sparkles className="w-3.5 h-3.5 fill-[#FF7A1A]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#142C4C]">We&apos;re Here to Help</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.1] text-[#142C4C]">
              Get in Touch with Our <br />
              <span className="brand-script-orange text-[#FF7A1A]">Real Estate Advisors.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#4A5D75] font-medium leading-relaxed max-w-2xl">
              Have questions about buying, renting, or listing a property? Our expert team is ready to provide guidance, legal assistance, and property matching across top Indian cities.
            </p>
          </div>
        </div>
      </div>

      {/* Main Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Direct Contact Info (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-[2px] bg-[#FF7A1A]" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FF7A1A]">
                  CONTACT INFORMATION
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#142C4C] font-display">
                Let&apos;s Start a Conversation
              </h2>
              <p className="text-xs sm:text-sm text-[#71839D] font-medium leading-relaxed">
                Reach out to us through any of our direct channels or visit our central offices.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Phone */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#EAF3FC] text-[#FF7A1A] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#71839D] uppercase tracking-wider">Phone Support</h4>
                  <a
                    href="tel:+919876543210"
                    className="text-sm sm:text-base font-bold text-[#142C4C] hover:text-[#FF7A1A] transition block mt-0.5"
                  >
                    +91 98765 43210
                  </a>
                  <p className="text-[11px] text-[#71839D] mt-0.5">Toll-free: 1800-PROP-NEST (Mon – Sat)</p>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#EAF3FC] text-[#FF7A1A] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#71839D] uppercase tracking-wider">Email Inquiry</h4>
                  <a
                    href="mailto:hello@propnest.com"
                    className="text-sm sm:text-base font-bold text-[#142C4C] hover:text-[#FF7A1A] transition block mt-0.5"
                  >
                    hello@propnest.com
                  </a>
                  <p className="text-[11px] text-[#71839D] mt-0.5">We typically reply within 2 business hours</p>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#EAF3FC] text-[#FF7A1A] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#71839D] uppercase tracking-wider">Headquarters</h4>
                  <p className="text-sm font-bold text-[#142C4C] mt-0.5">
                    12th Floor, Horizon Tower, MG Road, Bengaluru – 560001
                  </p>
                  <p className="text-[11px] text-[#71839D] mt-0.5">Karnataka, India</p>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#EAF3FC] text-[#FF7A1A] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#71839D] uppercase tracking-wider">Office Hours</h4>
                  <p className="text-sm font-bold text-[#142C4C] mt-0.5">Monday – Saturday: 9:00 AM – 7:00 PM</p>
                  <p className="text-[11px] text-[#71839D] mt-0.5">Sunday: 10:00 AM – 4:00 PM (Site Visits Only)</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Quick Contact */}
            <div className="bg-[#EAF3FC] p-6 rounded-3xl border border-sky-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[#142C4C] block">Chat on WhatsApp</span>
                  <span className="text-[11px] text-[#71839D] font-medium">Instant replies from property advisors</span>
                </div>
              </div>
              <a
                href="https://wa.me/919876543210?text=Hello%20PropNest,%20I%20need%20assistance%20with%20verified%20properties."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs"
              >
                Chat Now
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-card">
              <div className="mb-6 space-y-1">
                <h3 className="text-2xl font-bold text-[#142C4C] font-display">Send Us a Message</h3>
                <p className="text-xs text-[#71839D] font-medium">
                  Fill in your requirements below and our regional property manager will contact you shortly.
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-emerald-900">Thank You for Reaching Out!</h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Your message has been received by our client service team. One of our dedicated real estate specialists will contact you within 2 business hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-50 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {submitError && (
                    <div className="flex items-start gap-2.5 p-3.5 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#142C4C]">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Ramesh Sharma"
                        className="w-full px-4 py-3 text-xs rounded-xl bg-[#F8F7F4] border border-slate-200 focus:outline-none focus:border-[#FF7A1A] focus:bg-white transition"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#142C4C]">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. ramesh@example.com"
                        className="w-full px-4 py-3 text-xs rounded-xl bg-[#F8F7F4] border border-slate-200 focus:outline-none focus:border-[#FF7A1A] focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#142C4C]">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-3 text-xs rounded-xl bg-[#F8F7F4] border border-slate-200 focus:outline-none focus:border-[#FF7A1A] focus:bg-white transition"
                      />
                    </div>

                    {/* Topic */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#142C4C]">I&apos;m Interested In *</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 text-xs rounded-xl bg-[#F8F7F4] border border-slate-200 focus:outline-none focus:border-[#FF7A1A] focus:bg-white transition cursor-pointer"
                      >
                        <option value="Buying a Property">Buying a Property</option>
                        <option value="Renting a Home">Renting a Home</option>
                        <option value="Listing / Selling a Property">Listing / Selling a Property</option>
                        <option value="Commercial Space">Commercial / Office Space</option>
                        <option value="Legal Title Verification">Legal & Title Due Diligence</option>
                        <option value="Home Loan Guidance">Home Loan Guidance</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#142C4C]">Your Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share details such as preferred location, budget, property type, or specific questions..."
                      className="w-full px-4 py-3 text-xs rounded-xl bg-[#F8F7F4] border border-slate-200 focus:outline-none focus:border-[#FF7A1A] focus:bg-white transition resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full text-xs font-bold text-white bg-[#142C4C] hover:bg-[#0B1F38] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isSubmitting ? (
                      <span>Sending Your Message...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message to PropNest</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Regional City Hubs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-card">
          <div className="mb-8 space-y-1">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#142C4C] font-display">
              Regional Experience Centers
            </h3>
            <p className="text-xs text-[#71839D] font-medium">
              Visit our local relationship managers across primary tech corridors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { city: 'Bengaluru', addr: 'MG Road, Horizon Tower, 12th Floor', phone: '+91 98765 43210' },
              { city: 'Hyderabad', addr: 'HITEC City, Cyber Gateway, 4th Floor', phone: '+91 98765 43211' },
              { city: 'Chennai', addr: 'Anna Salai, Express Chambers, 8th Floor', phone: '+91 98765 43212' },
              { city: 'Pune', addr: 'Koregaon Park, Platinum Plaza, 6th Floor', phone: '+91 98765 43213' },
            ].map((hub) => (
              <div key={hub.city} className="p-5 rounded-2xl bg-[#F8F7F4] border border-slate-200/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#FF7A1A]" />
                  <h4 className="text-sm font-bold text-[#142C4C]">{hub.city}</h4>
                </div>
                <p className="text-xs text-[#71839D] leading-relaxed">{hub.addr}</p>
                <a href={`tel:${hub.phone}`} className="text-xs font-semibold text-[#142C4C] hover:text-[#FF7A1A] block pt-1">
                  {hub.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

