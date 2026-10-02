"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AVATAR_OPTIONS, AvatarOption } from "@/lib/avatars";
import { createBrowserClient } from "@supabase/ssr";
import { Sparkles, Check, Loader2, UserCheck, ShieldAlert } from "lucide-react";

interface StudentOnboardingModalProps {
  forcedOpen?: boolean;
  onSuccess?: (profile: any) => void;
}

export default function StudentOnboardingModal({
  forcedOpen = false,
  onSuccess,
}: StudentOnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(forcedOpen);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("STUDENT");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATAR_OPTIONS[0].url);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // Check Supabase session & student_profiles record
  useEffect(() => {
    let isMounted = true;

    async function checkStudentStatus() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) {
          if (isMounted) setIsChecking(false);
          return;
        }

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) {
          if (isMounted) setIsChecking(false);
          return;
        }

        // Query authoritative role from Supabase profiles table
        const res = await fetch(`/api/student-profile?userId=${user.id}`);
        if (!res.ok) {
          if (isMounted) setIsChecking(false);
          return;
        }

        const data = await res.json();
        const role = String(
          data.role || user.user_metadata?.role || "LEARNER"
        ).toUpperCase();

        if (isMounted) {
          setUserId(user.id);
          setUserRole(role);
        }

        // STAGE 5: ONLY trigger avatar modal for LEARNER and GUEST.
        // Automatically BYPASS and hide modal for INSTRUCTOR, ADMIN, and SUPER_ADMIN.
        const isLearnerOrGuest = role === "LEARNER" || role === "GUEST" || role === "STUDENT";
        if (!isLearnerOrGuest) {
          if (isMounted) {
            setIsOpen(false);
            setIsChecking(false);
          }
          return;
        }

        if (!data.hasProfile) {
          // No record found -> automatically open onboarding modal for LEARNER / GUEST
          if (isMounted) {
            setIsOpen(true);
            const defaultName =
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "GigaChad_Dev";
            setUsername(defaultName.replace(/\s+/g, "_"));
          }
        } else {
          // Already has profile
          if (isMounted && forcedOpen) {
            setIsOpen(true);
            if (data.profile?.username) setUsername(data.profile.username);
            if (data.profile?.avatar_url) setSelectedAvatar(data.profile.avatar_url);
          }
        }
      } catch (err) {
        console.warn("Could not verify student onboarding status:", err);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    }

    checkStudentStatus();

    // Listen to manual open trigger event
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener("open-student-onboarding", handleOpenEvent);

    return () => {
      isMounted = false;
      window.removeEventListener("open-student-onboarding", handleOpenEvent);
    };
  }, [forcedOpen]);

  const handleLockIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = username.trim();
    if (!cleanUsername || cleanUsername.length < 2) {
      setErrorMessage("Please enter a username of at least 2 characters.");
      return;
    }

    if (!selectedAvatar) {
      setErrorMessage("Please select your gamer persona avatar.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/student-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          username: cleanUsername,
          avatar_url: selectedAvatar,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save student profile.");
      }

      // Notify application state (Header, Community, etc.)
      window.dispatchEvent(
        new CustomEvent("student-profile-updated", {
          detail: data.profile,
        })
      );

      if (onSuccess) {
        onSuccess(data.profile);
      }

      setIsOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  const currentAvatarOption =
    AVATAR_OPTIONS.find((a) => a.url === selectedAvatar) || AVATAR_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/85 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#202023] border border-[#3E3E43] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-white overflow-hidden max-h-[90vh] flex flex-col">
        {/* Subtle Ambient Lemon Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#EFFF4F]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#3E3E43] pb-4 relative z-10 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Student Custom Identity</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              Lock In Your Persona
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A5B5] mt-0.5">
              Choose your 3D avatar & homies username to enter the NextGen Academy community.
            </p>
          </div>

          {/* Current Selection Preview */}
          <div className="flex flex-col items-center shrink-0 pl-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-[#EFFF4F] bg-neutral-900 shadow-lemon-sm relative">
              <Image
                src={selectedAvatar}
                alt="Selected persona"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[10px] font-mono text-[#EFFF4F] font-bold mt-1">
              {currentAvatarOption.label}
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2 rounded shrink-0">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body - Scrollable Area */}
        <form onSubmit={handleLockIn} className="space-y-6 overflow-y-auto pr-1 flex-1">
          {/* 1. Username Input */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white">
              What homies will call you <span className="text-[#EFFF4F]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. GigaChad_Dev"
                maxLength={30}
                className="w-full px-4 py-3 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none text-sm text-white placeholder-[#5A5F70] font-mono rounded-xl transition-all shadow-inner"
              />
              <span className="absolute right-3.5 top-3.5 text-[11px] font-mono text-[#5A5F70]">
                {username.length}/30
              </span>
            </div>
            <p className="text-[11px] text-[#A0A5B5] font-sans">
              This username will appear on your community posts, thread replies, and student profile badge.
            </p>
          </div>

          {/* 2. Persona Selector Grid */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-white">
                Select a Persona <span className="text-[#EFFF4F]">*</span>
              </label>
              <span className="text-[11px] font-mono text-[#A0A5B5]">
                18 Available Avatars
              </span>
            </div>

            {/* Scrollable 6x3 Grid showing all 18 avatars */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 p-3 bg-[#28282B] border border-[#3E3E43] rounded-xl overflow-y-auto max-h-56">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = selectedAvatar === avatar.url;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar.url)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 group focus:outline-none ${isSelected
                      ? "border-[#EFFF4F] ring-2 ring-[#EFFF4F] shadow-lemon-sm scale-105 bg-[#EFFF4F]/10"
                      : "border-[#3E3E43] hover:border-white/40 bg-[#333336] hover:scale-100"
                      }`}
                    title={avatar.label}
                  >
                    <Image
                      src={avatar.url}
                      alt={avatar.label}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover rounded-lg"
                    />

                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-[#EFFF4F] text-[#28282B] rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 py-0.5 bg-black/85 text-[9px] font-mono text-center text-white/90 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {avatar.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 shrink-0">
            <button
              type="submit"
              disabled={isSubmitting || !username.trim()}
              className="w-full py-3.5 bg-[#EFFF4F] text-[#28282B] hover:bg-[#EFFF4F]/90 font-mono text-xs uppercase font-bold tracking-wider rounded-xl transition-all shadow-lemon-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Locking In Persona...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Lock In Persona</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
