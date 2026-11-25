'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '@/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/api/client';
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  User,
  Mail,
  Phone,
  Lock,
} from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerAuth } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const redirectUrl = searchParams?.get('redirect') || '/dashboard';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'USER',
    },
  });

  const passwordVal = watch('password', '');

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(passwordVal);

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      await registerAuth({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: data.role,
      });
      setSuccessMessage('Account registered successfully! Redirecting to login...');
      setTimeout(() => {
        router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      }, 1500);
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Split-Screen Architectural Visual */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-12 bg-[#0B1F38] text-white overflow-hidden">
          <Image
            src="/images/auth/auth-register.jpg"
            alt="Luxury architectural residence at sunset"
            fill
            priority
            className="object-cover opacity-60 scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F38]/95 via-[#0B1F38]/65 to-[#0B1F38]/40" />

          {/* Top Brand Logo Pill */}
          <div className="relative z-10">
            <Link
              href="/"
              className="inline-flex items-center bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg"
            >
              <Image
                src="/logo.png"
                alt="PropNest"
                width={136}
                height={40}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center Quote / Benefits */}
          <div className="relative z-10 space-y-4 max-w-sm">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#FF7A1A] text-xs font-bold border border-white/20">
              <UserCheck className="w-3.5 h-3.5" />
              <span className="text-white">Free Registration</span>
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight leading-snug font-editorial text-white drop-shadow-sm">
              List free properties &amp; reach verified buyers directly.
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Join thousands of satisfied homeowners and verified agents across India.
            </p>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 flex items-center gap-2 text-xs text-slate-300 font-medium pt-4 border-t border-white/15">
            <ShieldCheck className="w-4 h-4 text-[#FF7A1A] shrink-0" />
            <span>Strict data privacy • RERA compliant guidelines</span>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="p-8 sm:p-10 flex flex-col justify-center space-y-4 bg-white">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#FF7A1A] block mb-1">
              JOIN PROPNEST
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142C4C] tracking-tight font-editorial">
              Create an Account
            </h1>
            <p className="text-xs sm:text-sm text-[#71839D] mt-1 font-medium">
              Start finding, buying, renting and listing verified properties
            </p>
          </div>

          {serverError && (
            <div className="flex items-start gap-2.5 p-3.5 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-2.5 p-3.5 text-xs bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Account Role Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1.5">
                Register As
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer hover:bg-[#F8F7F4] transition border-slate-200 text-xs font-bold text-[#142C4C]">
                  <input
                    type="radio"
                    value="USER"
                    {...register('role')}
                    className="text-[#FF7A1A] focus:ring-[#FF7A1A]"
                  />
                  <span>Buyer / Individual</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 border rounded-xl cursor-pointer hover:bg-[#F8F7F4] transition border-slate-200 text-xs font-bold text-[#142C4C]">
                  <input
                    type="radio"
                    value="AGENT"
                    {...register('role')}
                    className="text-[#FF7A1A] focus:ring-[#FF7A1A]"
                  />
                  <span>Real Estate Agent</span>
                </label>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#71839D] absolute left-3.5 top-3" />
                <input
                  type="text"
                  {...register('fullName')}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:bg-white bg-[#F8F7F4] text-[#142C4C] transition"
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.fullName.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#71839D] absolute left-3.5 top-3" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:bg-white bg-[#F8F7F4] text-[#142C4C] transition"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#71839D] absolute left-3.5 top-3" />
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="e.g. +919876543210"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:bg-white bg-[#F8F7F4] text-[#142C4C] transition"
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.phone.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71839D] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:bg-white bg-[#F8F7F4] text-[#142C4C] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#71839D] hover:text-[#142C4C]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordVal && (
                <div className="mt-1.5 flex gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        lvl <= strengthScore
                          ? strengthScore <= 2
                            ? 'bg-rose-500'
                            : strengthScore <= 4
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              )}
              {errors.password && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71839D] absolute left-3.5 top-3" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:bg-white bg-[#F8F7F4] text-[#142C4C] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3 text-[#71839D] hover:text-[#142C4C]"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-600 mt-1 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 text-xs sm:text-sm font-bold text-white bg-[#142C4C] hover:bg-[#0B1F38] rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 transform hover:-translate-y-0.5 active:translate-y-0 duration-150"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-[#71839D] font-medium">
            Already have an account?{' '}
            <Link
              href={`/login${redirectUrl !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
              className="font-bold text-[#142C4C] hover:text-[#FF7A1A] hover:underline transition"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-28 text-center text-[#71839D]">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
