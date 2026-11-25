'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/api/client';
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Mail,
  Lock,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const redirectUrl = searchParams?.get('redirect') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      await login(data);
      setSuccessMessage('Logged in successfully! Redirecting...');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 500);
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Split-Screen Architectural Visual */}
        <div className="relative hidden lg:flex flex-col justify-between p-10 xl:p-12 bg-[#0B1F38] text-white overflow-hidden min-h-[560px]">
          <Image
            src="/images/auth/auth-login.jpg"
            alt="Luxury architecture hero background"
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

          {/* Center Quote / Pitch */}
          <div className="relative z-10 space-y-4 max-w-sm">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#FF7A1A] text-xs font-bold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 fill-[#FF7A1A]" />
              <span className="text-white">Better Living</span>
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight leading-snug font-editorial text-white drop-shadow-sm">
              Welcome back to your luxury real estate journey.
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Access saved listings, track direct owner inquiries, and discover verified properties tailored to your lifestyle.
            </p>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 flex items-center gap-2 text-xs text-slate-300 font-medium pt-4 border-t border-white/15">
            <ShieldCheck className="w-4 h-4 text-[#FF7A1A] shrink-0" />
            <span>Encrypted authentication &amp; verified owner directory</span>
          </div>
        </div>

        {/* Right Side: Clean Form Card */}
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-6 bg-white">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#FF7A1A] block mb-1.5">
              ACCOUNT LOGIN
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#142C4C] tracking-tight font-editorial">
              Sign In to PropNest
            </h1>
            <p className="text-xs sm:text-sm text-[#71839D] mt-1 font-medium">
              Enter your credentials to access your account &amp; dashboard
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#71839D] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:bg-white bg-[#F8F7F4] text-[#142C4C] transition"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#142C4C] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71839D] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:bg-white bg-[#F8F7F4] text-[#142C4C] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#71839D] hover:text-[#142C4C]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password.message}</p>
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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-[#71839D] font-medium">
            Don&apos;t have an account?{' '}
            <Link
              href={`/register${redirectUrl !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
              className="font-bold text-[#142C4C] hover:text-[#FF7A1A] hover:underline transition"
            >
              Create an account free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-28 text-center text-[#71839D]">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
