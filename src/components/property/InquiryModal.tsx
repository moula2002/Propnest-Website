'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { inquirySchema, InquiryFormData } from '@/validations/inquiry';
import { inquiryService } from '@/services/inquiryService';
import { useAuth } from '@/hooks/useAuth';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getErrorMessage } from '@/lib/api/client';

interface InquiryFormProps {
  propertyId: string;
  propertyTitle: string;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ propertyId, propertyTitle }) => {
  const { user } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      message: `Hi, I am interested in your property "${propertyTitle}". Please contact me with more details.`,
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    setServerError(null);
    try {
      await inquiryService.createInquiry(propertyId, {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        source: 'WEBSITE',
      });
      setIsSuccess(true);
      reset();
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h4 className="text-base font-semibold text-emerald-900">Inquiry Sent Successfully!</h4>
        <p className="text-xs text-emerald-700 leading-relaxed">
          The property owner/agent has been notified and will reach out to you directly via your phone or email.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-xs text-emerald-800 font-semibold underline hover:text-emerald-900 pt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="flex items-start gap-2 p-3 text-xs bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
        <input
          type="text"
          {...register('name')}
          placeholder="e.g. Rahul Sharma"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
        <input
          type="email"
          {...register('email')}
          placeholder="e.g. rahul@example.com"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
        <input
          type="tel"
          {...register('phone')}
          placeholder="e.g. +919876543210"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
        <textarea
          rows={3}
          {...register('message')}
          placeholder="I would like to schedule a site visit..."
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {errors.message && <p className="text-xs text-rose-600 mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Inquiry...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Contact Property Owner</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-600 text-center">
        Your contact details are shared only with the verified owner or agent.
      </p>
    </form>
  );
};

