"use client";

import React, { useState } from "react";
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
    accentColor: "#8B5CF6",
    targetDashboard: "/dashboard/learner",
  },
  {
    id: "INSTRUCTOR",
    label: "Instructor",
    badge: "Creator Studio",
    description: "TagMango-style creator suite: live classes, curriculum editor & cohort grading.",
    icon: Award,
    accentColor: "#A855F7",
    targetDashboard: "/dashboard/instructor",
  },
  {
    id: "CONTENT_MANAGER",
    label: "Content Manager",
    badge: "Curriculum Ops",
    description: "Manage video lessons, syllabus sequencing, media assets & publishing queues.",
    icon: Layers,
    accentColor: "#06B6D4",
    targetDashboard: "/dashboard/content",
  },
  {
    id: "SUPPORT_STAFF",
    label: "Support Staff",
    badge: "Helpdesk & CRM",
    description: "Troubleshoot student access, verify orders, and resolve learner support tickets.",
    icon: Headphones,
    accentColor: "#10B981",
    targetDashboard: "/dashboard/support",
  },
  {
    id: "ADMIN",
    label: "Administrator",
    badge: "Operations Hub",
    description: "Oversee platform analytics, user rosters, revenue reports & financial auditing.",
    icon: ShieldCheck,
    accentColor: "#F59E0B",
    targetDashboard: "/dashboard/admin",
  },
  {
    id: "SUPER_ADMIN",
    label: "Super Admin",
    badge: "Root Governance",
    description: "Master system control: 7-role RBAC governance, payment gateways & security.",
    icon: Key,
    accentColor: "#EF4444",
    targetDashboard: "/dashboard/super-admin",
  },
];

interface RoleSelectionModalProps {
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

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-md bg-black/85 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0E0C17]/95 backdrop-blur-2xl border border-[#26213B] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-white overflow-hidden max-h-[92vh] flex flex-col">
        {/* Subtle Matte Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#06B6D4]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-[#26213B] pb-4 relative z-10 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#C084FC] text-[10px] font-mono font-bold uppercase tracking-wider mb-2 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
              <Sparkles className="w-3 h-3 text-[#A855F7]" />
              <span>NextGen Testing Academy • RBAC Access</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span>Select Your Role</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
              Choose your profile designation before authenticating with Google.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 text-[#64748B] hover:text-white rounded-lg hover:bg-[#161326] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono rounded shrink-0">
            {errorMsg}
          </div>
        )}

        {/* Roles Grid (Scrollable) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1 py-1">
          {ROLES.map((role) => {
            const isSelected = selectedRole === role.id;
            const Icon = role.icon;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                disabled={loading}
                className={`relative p-4 rounded-xl border text-left transition-all group flex flex-col justify-between cursor-pointer focus:outline-none ${
                  isSelected
                    ? "border-[#8B5CF6] bg-[#8B5CF6]/15 ring-2 ring-[#8B5CF6]/50 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                    : "border-[#26213B] bg-[#120F1D] hover:border-[#8B5CF6]/40 hover:bg-[#161326]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                        isSelected
                          ? "bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-sm"
                          : "bg-[#161326] border-[#26213B] text-[#94A3B8] group-hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#64748B]">
                        {role.badge}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-md">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-white uppercase tracking-wide">
                    {role.label}
                  </h3>
                  <p className="text-[11px] text-[#94A3B8] mt-1 leading-snug line-clamp-2">
                    {role.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#26213B]/60 flex items-center justify-between text-[10px] font-mono text-[#64748B]">
                  <span>Redirects to:</span>
                  <span className="text-[#C084FC] font-semibold">{role.targetDashboard}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="border-t border-[#26213B] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] font-mono text-[#94A3B8]">
            Selected: <strong className="text-white uppercase">{currentRole.label}</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 border border-[#26213B] bg-[#161326] hover:bg-[#1C172E] text-white text-xs font-mono font-bold uppercase rounded-xl transition-colors cursor-pointer w-1/3 sm:w-auto text-center"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleProceedGoogle}
              disabled={loading}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#06B6D4] text-white hover:brightness-110 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  {/* Google Icon */}
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
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
