'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { inquiryService } from '@/services/inquiryService';
import { getErrorMessage } from '@/lib/api/client';

export const ContactSection: React.FC = () => {
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
    <section id="contact-us" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-[2px] bg-[#FF7A1A]" />
              <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#FF7A1A]">
                CONTACT US
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142C4C] font-editorial tracking-tight">
              Get in Touch with Our Advisors
            </h2>
            <p className="text-xs sm:text-sm text-[#71839D] font-medium mt-1.5 max-w-xl">
              Have questions about buying, renting, or listing a property? Reach out to our team for personalized guidance.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-[#142C4C] bg-[#EAF3FC] hover:bg-[#142C4C] hover:text-white transition-all duration-200 border border-slate-200/60 shadow-xs shrink-0 self-start sm:self-auto"
          >
            <span>Visit Contact Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contact Cards (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Phone */}
            <div className="bg-[#F8F7F4] p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white text-[#FF7A1A] flex items-center justify-center shrink-0 shadow-xs">
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
                <p className="text-[11px] text-[#71839D] mt-0.5">Mon – Sat: 9:00 AM – 7:00 PM</p>
              </div>
            </div>

            {/* Email */}
            <div className="bg-[#F8F7F4] p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white text-[#FF7A1A] flex items-center justify-center shrink-0 shadow-xs">
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
                <p className="text-[11px] text-[#71839D] mt-0.5">Typical response within 2 business hours</p>
              </div>
            </div>

            {/* Office */}
            <div className="bg-[#F8F7F4] p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-white text-[#FF7A1A] flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#71839D] uppercase tracking-wider">Headquarters</h4>
                <p className="text-sm font-bold text-[#142C4C] mt-0.5">
                  12th Floor, Horizon Tower, MG Road, Bengaluru – 560001
                </p>
                <p className="text-[11px] text-[#71839D] mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#FF7A1A]" />
                  <span>Sunday Site Visits: 10:00 AM – 4:00 PM</span>
                </p>
              </div>
            </div>

            {/* WhatsApp Quick Connect */}
            <div className="bg-[#EAF3FC] p-5 rounded-2xl border border-sky-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[#142C4C] block">Chat on WhatsApp</span>
                  <span className="text-[11px] text-[#71839D] font-medium">Instant replies from advisors</span>
                </div>
              </div>
              <a
                href="https://wa.me/919876543210?text=Hello%20PropNest,%20I%20need%20assistance%20with%20verified%20properties."
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] transition shadow-xs shrink-0"
              >
                Chat Now
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form (lg:col-span-7) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/80 shadow-card">
              <div className="mb-6 space-y-1">
                <h3 className="text-2xl font-bold text-[#142C4C] font-editorial">Send Us a Message</h3>
                <p className="text-xs text-[#71839D] font-medium">
                  Fill in your requirements below and our property specialist will contact you shortly.
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-10 text-center space-y-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-emerald-900">Thank You for Reaching Out!</h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Your message has been received. One of our dedicated real estate advisors will contact you within 2 business hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-50 transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="flex items-start gap-2.5 p-3.5 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{submitError}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        <option value="Legal Title Verification">Legal &amp; Title Due Diligence</option>
                        <option value="Home Loan Guidance">Home Loan Guidance</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#142C4C]">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your preferred location, budget, property type, or any questions..."
                      className="w-full px-4 py-3 text-xs rounded-xl bg-[#F8F7F4] border border-slate-200 focus:outline-none focus:border-[#FF7A1A] focus:bg-white transition resize-none"
                    />
                  </div>

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
      </div>
    </section>
  );
};

