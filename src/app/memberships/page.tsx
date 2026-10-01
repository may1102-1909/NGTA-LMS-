"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  Zap,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  Loader2,
  Calendar,
  Layers,
  Radio,
  Download,
  Headphones,
  CheckCircle2,
  Lock,
  AlertCircle,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  tier: "FREE" | "BASIC" | "PRO" | "PREMIUM";
  monthly_price: number | string;
  annual_price: number | string;
  trial_period_days: number;
  benefits: string[];
  included_course_ids: string[];
  community_access: boolean;
  live_session_access: boolean;
  downloads_access: boolean;
  priority_support: boolean;
}

function MembershipsContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeSub, setActiveSub] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("GUEST");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        let currentId: string | null = null;
        if (supabaseUrl && supabaseAnonKey) {
          const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user?.id) {
            currentId = user.id;
            setUserId(user.id);
          }
        }

        const url = currentId ? `/api/memberships?userId=${currentId}` : "/api/memberships";
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.memberships) {
            setPlans(data.memberships);
          }
          if (data.activeSubscription) {
            setActiveSub(data.activeSubscription);
          }
          if (data.currentUserRole) {
            setUserRole(data.currentUserRole);
          }
        }
      } catch (err) {
        console.error("Failed to load memberships:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSubscribe = async (plan: MembershipPlan) => {
    setSubscribingId(plan.id);
    setSuccessToast(null);

    try {
      const res = await fetch("/api/memberships/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipId: plan.id,
          billingCycle,
          userId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Subscription initialization failed.");
      }

      setSuccessToast(data.message || `Activated subscription to ${plan.name}!`);
      setActiveSub(data.userMembership);
    } catch (err: any) {
      alert(err.message || "Failed to process membership.");
    } finally {
      setSubscribingId(null);
    }
  };

  const isManager = userRole === "SUPER_ADMIN" || userRole === "INSTRUCTOR";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 text-white font-sans">
      {/* 403 Forbidden Alert */}
      {errorParam === "403" && (
        <div className="p-4 bg-red-500/15 border border-red-500/40 rounded-2xl flex items-center gap-3 text-red-400 font-mono text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>
            Access Denied: Only <strong>SUPER_ADMIN</strong> and <strong>INSTRUCTOR</strong> roles are authorized to access the membership management dashboard.
          </span>
        </div>
      )}

      {/* Success Banner */}
      {successToast && (
        <div className="p-4 bg-[#EFFF4F]/10 border border-[#EFFF4F]/40 rounded-2xl flex items-center justify-between text-[#EFFF4F] font-mono text-xs shadow-lemon-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-bold">{successToast}</span>
          </div>
          <Link
            href="/dashboard/learner"
            className="underline hover:text-white font-bold"
          >
            Go to Student Workspace
          </Link>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-mono text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>RECURRING ACADEMY PASS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
          Level Up With All-Access Memberships
        </h1>

        <p className="text-[#A0A5B5] text-sm sm:text-base font-sans leading-relaxed">
          From community discussion to 1-on-1 SDET coaching. Select the tier that matches your career trajectory with flexible monthly or annual commitments.
        </p>

        {/* Manager shortcut */}
        {isManager && (
          <div className="pt-2">
            <Link
              href="/dashboard/memberships/manage"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#28282B] border border-[#3E3E43] hover:border-[#EFFF4F]/50 text-[#EFFF4F] font-mono text-xs font-bold uppercase rounded-xl transition-all"
            >
              <span>Manage Membership Plans & Instructor Payouts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Billing Switcher (Monthly vs Annual) */}
      <div className="flex items-center justify-center gap-4 font-mono text-xs">
        <span className={billingCycle === "monthly" ? "text-white font-bold" : "text-[#5A5F70]"}>
          Monthly Billing
        </span>
        <button
          type="button"
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
          className="w-14 h-7 bg-[#28282B] border border-[#3E3E43] rounded-full p-1 transition-colors relative"
          aria-label="Toggle billing cycle"
        >
          <div
            className={`w-5 h-5 rounded-full bg-[#EFFF4F] shadow-lemon-sm transition-transform duration-200 ${
              billingCycle === "annual" ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
        <div className="flex items-center gap-1.5">
          <span className={billingCycle === "annual" ? "text-white font-bold" : "text-[#5A5F70]"}>
            Annual Billing
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#EFFF4F]/15 border border-[#EFFF4F]/30 text-[#EFFF4F] font-bold">
            Save ~17%
          </span>
        </div>
      </div>

      {/* Active User Subscription Banner if Subscribed */}
      {activeSub && (
        <div className="max-w-2xl mx-auto p-4 bg-[#0d0d0d]/90 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div>
            <div className="text-[10px] text-[#5A5F70] uppercase">CURRENT ACTIVE PLAN</div>
            <div className="text-white font-bold text-sm flex items-center gap-2 mt-0.5">
              <span>{activeSub.membership?.name || "Active Membership"}</span>
              <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded text-[10px]">
                {activeSub.state}
              </span>
            </div>
            <div className="text-[#A0A5B5] text-[11px] mt-1">
              Active through: {new Date(activeSub.current_period_end).toLocaleDateString()}
            </div>
          </div>
          <Link
            href="/dashboard/learner"
            className="px-4 py-2 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-lg shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-all text-center"
          >
            My Workspace
          </Link>
        </div>
      )}

      {/* Membership Tiers Grid (Matte-Black Glassmorphism Cards) */}
      {loading ? (
        <div className="py-20 text-center font-mono text-xs text-[#5A5F70] flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#EFFF4F]" />
          <span>Loading membership options...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isFree = plan.tier === "FREE" || Number(plan.monthly_price) === 0;
            const price = billingCycle === "annual" ? plan.annual_price : plan.monthly_price;
            const isSubscribing = subscribingId === plan.id;
            const isCurrentPlan = activeSub?.membership_id === plan.id;
            const isHighlighted = plan.tier === "PRO";

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 ${
                  isHighlighted
                    ? "bg-[#0d0d0d]/95 border-2 border-[#EFFF4F]/50 shadow-lemon-md scale-[1.02]"
                    : "bg-[#0d0d0d]/90 border border-white/10 hover:border-white/20 shadow-xl"
                } backdrop-blur-xl`}
              >
                {/* Popular Badge for PRO tier */}
                {isHighlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#EFFF4F] text-[#28282B] font-mono text-[10px] font-black uppercase tracking-wider rounded-full shadow-lemon-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[#28282B]" />
                    <span>MOST POPULAR CHOICE</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Card Header */}
                  <div>
                    <div className="font-mono text-[11px] text-[#A0A5B5] uppercase font-bold tracking-wider mb-1">
                      {plan.tier} TIER
                    </div>
                    <h3 className="text-xl font-black uppercase text-white tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-[#A0A5B5] mt-1 line-clamp-2 font-sans">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="font-mono border-t border-b border-white/5 py-4">
                    {isFree ? (
                      <div className="text-3xl font-black text-white">FREE</div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-white">
                          ₹{Number(price).toLocaleString()}
                        </span>
                        <span className="text-xs text-[#5A5F70]">
                          /{billingCycle === "annual" ? "year" : "mo"}
                        </span>
                      </div>
                    )}
                    {plan.trial_period_days > 0 && !isFree && (
                      <div className="text-[11px] text-[#EFFF4F] font-bold mt-1">
                        ★ {plan.trial_period_days}-Day Free Trial Included
                      </div>
                    )}
                  </div>

                  {/* Core Permissions Flags */}
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex items-center gap-2 text-white">
                      <Layers className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span>
                        {plan.included_course_ids?.length || 0} Courses Included
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Radio
                        className={`w-3.5 h-3.5 ${
                          plan.live_session_access ? "text-[#EFFF4F]" : "text-[#5A5F70]"
                        }`}
                      />
                      <span className={plan.live_session_access ? "text-white" : "text-[#5A5F70] line-through"}>
                        Live Session Broadcasts
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Download
                        className={`w-3.5 h-3.5 ${
                          plan.downloads_access ? "text-[#06B6D4]" : "text-[#5A5F70]"
                        }`}
                      />
                      <span className={plan.downloads_access ? "text-white" : "text-[#5A5F70] line-through"}>
                        Downloadable Framework Templates
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Headphones
                        className={`w-3.5 h-3.5 ${
                          plan.priority_support ? "text-amber-400" : "text-[#5A5F70]"
                        }`}
                      />
                      <span className={plan.priority_support ? "text-white" : "text-[#5A5F70] line-through"}>
                        Priority 1-on-1 Support
                      </span>
                    </div>
                  </div>

                  {/* Benefits Bullet Points */}
                  <div className="space-y-2.5 pt-2">
                    <div className="font-mono text-[10px] text-[#5A5F70] uppercase font-bold tracking-wider">
                      Included In This Plan:
                    </div>
                    <ul className="space-y-2 font-sans text-xs text-[#A0A5B5]">
                      {plan.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#EFFF4F] shrink-0 mt-0.5 stroke-[2.5]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call-to-Action Button */}
                <div className="pt-8">
                  {isCurrentPlan ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 bg-[#28282B] border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold uppercase rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active Plan</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSubscribe(plan)}
                      disabled={isSubscribing}
                      className={`w-full py-3.5 font-mono text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isHighlighted
                          ? "bg-[#EFFF4F] text-[#28282B] hover:bg-[#EFFF4F]/90 shadow-lemon-sm"
                          : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                      } disabled:opacity-50`}
                    >
                      {isSubscribing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Activating...</span>
                        </>
                      ) : isFree ? (
                        <span>Join Free Tier</span>
                      ) : plan.trial_period_days > 0 ? (
                        <>
                          <span>Start {plan.trial_period_days}-Day Trial</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>Subscribe Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MembershipsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center font-mono text-xs text-[#5A5F70]">
          LOADING MEMBERSHIPS CATALOG...
        </div>
      }
    >
      <MembershipsContent />
    </Suspense>
  );
}
