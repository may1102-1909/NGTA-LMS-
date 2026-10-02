"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createBrowserClient } from "@supabase/ssr";
import {
  X,
  Check,
  Loader2,
  GraduationCap,
  Sparkles,
  Award,
  Layers,
  Headphones,
  ShieldCheck,
  Key,
  ArrowRight,
} from "lucide-react";

export type RoleOption =
  | "LEARNER"
  | "INSTRUCTOR"
  | "CONTENT_MANAGER"
  | "SUPPORT_STAFF"
  | "ADMIN"
  | "SUPER_ADMIN";

interface RoleConfig {
  id: RoleOption;
  label: string;
  badge: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  targetDashboard: string;
}

const ROLES: RoleConfig[] = [
  {
    id: "LEARNER",
    label: "Learner",
    badge: "Student Portal",
    description: "Access enrolled courses, live lab workshops, 30-day challenge & community.",
    icon: GraduationCap,
    accentColor: "#EFFF4F",
    targetDashboard: "/dashboard/learner",
  },
  {
    id: "INSTRUCTOR",
    label: "Instructor",
    badge: "Creator Studio",
    description: "TagMango-style creator suite: live classes, curriculum editor & cohort grading.",
    icon: Award,
    accentColor: "#EFFF4F",
    targetDashboard: "/dashboard/instructor",
  },
  {
    id: "CONTENT_MANAGER",
    label: "Content Manager",
    badge: "Curriculum Ops",
    description: "Manage video lessons, syllabus sequencing, media assets & publishing queues.",
    icon: Layers,
    accentColor: "#EFFF4F",
    targetDashboard: "/dashboard/content",
  },
  {
    id: "SUPPORT_STAFF",
    label: "Support Staff",
    badge: "Helpdesk & CRM",
    description: "Troubleshoot student access, verify orders, and resolve learner support tickets.",
    icon: Headphones,
    accentColor: "#EFFF4F",
    targetDashboard: "/dashboard/support",
  },
  {
    id: "ADMIN",
    label: "Administrator",
    badge: "Operations Hub",
    description: "Oversee platform analytics, user rosters, revenue reports & financial auditing.",
    icon: ShieldCheck,
    accentColor: "#EFFF4F",
    targetDashboard: "/dashboard/admin",
  },
  {
    id: "SUPER_ADMIN",
    label: "Super Admin",
    badge: "Root Governance",
    description: "Master system control: 7-role RBAC governance, payment gateways & security.",
    icon: Key,
    accentColor: "#EFFF4F",
    targetDashboard: "/dashboard/super-admin",
  },
];

export interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: RoleOption;
}

export default function RoleSelectionModal({
  isOpen,
  onClose,
  defaultRole = "LEARNER",
}: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<RoleOption>(defaultRole);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body Scroll Locking: prevent landing page & footer background from scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.classList.remove("overflow-hidden");
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleProceedGoogle = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Persist chosen role in localStorage and cookie for bulletproof retrieval in callback & middleware
      if (typeof window !== "undefined") {
        localStorage.setItem("ngta_selected_role", selectedRole);
        document.cookie = `ngta_selected_role=${selectedRole}; path=/; max-age=3600; SameSite=Lax`;
      }

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const targetRedirect = `${window.location.origin}/auth/callback?role=${selectedRole}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: targetRedirect,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
            role: selectedRole,
          },
          data: {
            role: selectedRole,
          },
        } as any,
      });

      if (error) {
        console.error("Supabase OAuth trigger error:", error);
        setErrorMsg(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Error initiating OAuth with role:", err);
      setErrorMsg(err.message || "Failed to start Google sign in.");
      setLoading(false);
    }
  };

  const currentRole = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      {/* Subtle Inner Glow Backdrop */}
      <div className="absolute w-[500px] h-[500px] bg-[#EFFF4F]/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Main Glassmorphic Container */}
      <div className="relative bg-[#0a0a0c]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-3xl w-full text-white max-h-[90vh] overflow-y-auto flex flex-col space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5 shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-[#EFFF4F]/10 text-[#EFFF4F] border border-[#EFFF4F]/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#EFFF4F]" />
              <span>NextGen Testing Academy • RBAC Access</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Select Your Role
            </h2>
            <p className="text-zinc-400 text-sm font-normal mt-1">
              Choose your profile designation before authenticating with Google.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono rounded-xl shrink-0">
            {errorMsg}
          </div>
        )}

        {/* Interactive Role Selection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1 flex-1 py-1 max-h-[58vh]">
          {ROLES.map((role) => {
            const isSelected = selectedRole === role.id;
            const Icon = role.icon;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                disabled={loading}
                className={`relative p-5 rounded-2xl text-left transition-all duration-200 ease-out flex flex-col justify-between cursor-pointer focus:outline-none group ${
                  isSelected
                    ? "bg-[#EFFF4F]/10 border-2 border-[#EFFF4F] shadow-[0_0_25px_rgba(239,255,79,0.15)] -translate-y-0.5"
                    : "bg-[#121318]/60 hover:bg-[#181920]/80 border border-white/5 hover:border-white/20 hover:-translate-y-0.5"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {/* Icon Container */}
                    <div
                      className={`p-3 rounded-xl transition-colors ${
                        isSelected
                          ? "bg-[#EFFF4F] text-black font-bold shadow-sm"
                          : "bg-white/5 text-zinc-400 group-hover:text-white"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-mono uppercase font-bold tracking-wider ${
                          isSelected ? "text-[#EFFF4F]" : "text-zinc-500"
                        }`}
                      >
                        {role.badge}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#EFFF4F] text-black flex items-center justify-center shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-white tracking-tight">
                    {role.label}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    {role.description}
                  </p>
                </div>

                {/* Redirect Path Monospace Hint */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-500">Redirects to:</span>
                  <span
                    className={`font-mono text-xs transition-colors ${
                      isSelected
                        ? "text-[#EFFF4F] font-bold"
                        : "text-zinc-500 group-hover:text-[#EFFF4F]"
                    }`}
                  >
                    {role.targetDashboard}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Bar & Buttons */}
        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          {/* Selection State Indicator */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-[#EFFF4F] animate-pulse" />
            <span>
              Selected: <strong className="text-white uppercase font-bold">{currentRole.label}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 rounded-xl px-5 py-2.5 text-xs font-mono font-bold uppercase transition-colors cursor-pointer w-1/3 sm:w-auto text-center"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleProceedGoogle}
              disabled={loading}
              className="flex-1 sm:flex-initial bg-[#EFFF4F] hover:bg-[#EFFF4F]/90 text-black font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(239,255,79,0.3)] hover:shadow-[0_0_30px_rgba(239,255,79,0.5)] flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export { RoleSelectionModal as RoleSelectModal };
