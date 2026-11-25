'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  updateProfileSchema,
  UpdateProfileFormData,
  changePasswordSchema,
  ChangePasswordFormData,
} from '@/validations/auth';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/lib/api/client';
import { getFullImageUrl } from '@/lib/utils';
import { User, KeyRound, Loader2, CheckCircle2, AlertCircle, ShieldCheck, Sparkles, Camera } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileError('Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Avatar image size must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    setProfileError(null);
    setProfileSuccess(null);
    try {
      await userService.uploadAvatar(file);
      await refreshUser();
      setProfileSuccess('Profile picture updated successfully!');
    } catch (err) {
      setProfileError(getErrorMessage(err));
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user.fullName || '',
        phone: user.phone || '',
      });
    }
  }, [user, resetProfile]);

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onUpdateProfile = async (data: UpdateProfileFormData) => {
    setProfileError(null);
    setProfileSuccess(null);
    try {
      await userService.updateProfile({
        fullName: data.fullName,
        phone: data.phone || undefined,
      });
      await refreshUser();
      setProfileSuccess('Profile information updated successfully!');
    } catch (err) {
      setProfileError(getErrorMessage(err));
    }
  };

  const onChangePassword = async (data: ChangePasswordFormData) => {
    setPasswordError(null);
    setPasswordSuccess(null);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setPasswordSuccess('Password updated successfully. Please note your new credentials.');
      resetPassword();
    } catch (err) {
      setPasswordError(getErrorMessage(err));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-navy-900 font-display">Profile & Security</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
          Manage your personal details, verified phone number, and security credentials.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-navy-900 to-royal-600 text-white font-black flex items-center justify-center text-2xl shadow-md overflow-hidden border-2 border-white">
                {user?.profileImage ? (
                  <img
                    src={getFullImageUrl(user.profileImage)}
                    alt={user?.fullName || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.fullName?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 p-1.5 bg-royal-600 text-white rounded-xl shadow-md hover:bg-royal-700 transition-colors cursor-pointer"
                title="Upload profile picture"
              >
                {isUploadingAvatar ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy-900">{user?.fullName}</h2>
              <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-royal-50 text-royal-700">
                  <Sparkles className="w-2.5 h-2.5" />
                  {user?.role} Account
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="px-4 py-2 bg-royal-50 hover:bg-royal-100 text-royal-700 border border-royal-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              {isUploadingAvatar ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Camera className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </>
              )}
            </button>
          </div>
        </div>

        {profileSuccess && (
          <div className="flex items-start gap-2.5 p-3.5 text-xs bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{profileSuccess}</span>
          </div>
        )}

        {profileError && (
          <div className="flex items-start gap-2.5 p-3.5 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{profileError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Full Name</label>
              <input
                type="text"
                {...registerProfile('fullName')}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-500 bg-slate-50/70"
              />
              {profileErrors.fullName && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{profileErrors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Email (Immutable)</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl bg-slate-100 text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Contact Phone Number</label>
            <input
              type="tel"
              {...registerProfile('phone')}
              placeholder="e.g. +919876543210"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-500 bg-slate-50/70"
            />
            {profileErrors.phone && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{profileErrors.phone.message}</p>
            )}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isProfileSubmitting}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-royal-600 hover:bg-royal-700 rounded-xl shadow-sm transition flex items-center gap-1.5 disabled:opacity-60"
            >
              {isProfileSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card space-y-5">
        <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-royal-600" />
          <span>Update Security Password</span>
        </h2>

        {passwordSuccess && (
          <div className="flex items-start gap-2.5 p-3.5 text-xs bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="flex items-start gap-2.5 p-3.5 text-xs bg-rose-50 text-rose-700 rounded-xl border border-rose-200 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitPassword(onChangePassword)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Current Password *</label>
            <input
              type="password"
              {...registerPassword('currentPassword')}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-500 bg-slate-50/70"
            />
            {passwordErrors.currentPassword && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{passwordErrors.currentPassword.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">New Password *</label>
              <input
                type="password"
                {...registerPassword('newPassword')}
                placeholder="At least 8 chars, 1 uppercase, 1 symbol"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-500 bg-slate-50/70"
              />
              {passwordErrors.newPassword && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Confirm New Password *</label>
              <input
                type="password"
                {...registerPassword('confirmPassword')}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-royal-500 bg-slate-50/70"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isPasswordSubmitting}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-navy-900 hover:bg-navy-950 rounded-xl shadow-sm transition flex items-center gap-1.5 disabled:opacity-60"
            >
              {isPasswordSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
