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
    <div className="relative min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 space-y-16 text-white font-sans">
      {/* Background Subtle Noise Texture */}
      <div className="fixed inset-0 bg-noise opacity-20 pointer-events-none z-0" />

      {/* 403 Forbidden Alert */}
      {errorParam === "403" && (
        <div className="relative z-10 p-4 bg-red-500/15 border border-red-500/40 rounded-2xl flex items-center gap-3 text-red-400 font-mono text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
          <span>
            Access Denied: Only <strong>SUPER_ADMIN</strong> and <strong>INSTRUCTOR</strong> roles are authorized to access the membership management dashboard.
          </span>
        </div>
      )}

      {/* Success Banner */}
      {successToast && (
        <div className="relative z-10 p-4 bg-[#EFFF4F]/10 border border-[#EFFF4F]/40 rounded-2xl flex items-center justify-between text-[#EFFF4F] font-mono text-xs shadow-lemon-sm">
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
      <div className="relative z-10 text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 font-mono text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(163,230,53,0.12)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>BUILT FOR BUILDERS • ALL-ACCESS PASS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
          Lock In. Execute.
        </h1>



        {/* Manager shortcut */}
        {isManager && (
          <div className="pt-2">
            <Link
              href="/dashboard/memberships/manage"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0e0f14]/80 border border-white/10 hover:border-lime-400/50 text-[#EFFF4F] font-mono text-xs font-bold uppercase rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
            >
              <span>Manage Membership Plans & Instructor Payouts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Billing Switcher (Monthly vs Annual) */}
      <div className="relative z-10 flex items-center justify-center gap-4 font-mono text-xs">
        <span className={billingCycle === "monthly" ? "text-white font-bold" : "text-zinc-500"}>
          Monthly Billing
        </span>
        <button
          type="button"
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
          className="w-14 h-7 bg-[#0e0f14] border border-white/15 rounded-full p-1 transition-colors relative hover:border-white/30"
          aria-label="Toggle billing cycle"
        >
          <div
            className={`w-5 h-5 rounded-full bg-[#EFFF4F] shadow-lemon-sm transition-transform duration-200 ${
              billingCycle === "annual" ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
        <div className="flex items-center gap-1.5">
          <span className={billingCycle === "annual" ? "text-white font-bold" : "text-zinc-500"}>
            Annual Billing
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-lime-400/15 border border-lime-400/30 text-lime-400 font-bold">
            Save ~17%
          </span>
        </div>
      </div>

      {/* Active User Subscription Banner if Subscribed */}
      {activeSub && (
        <div className="relative z-10 max-w-2xl mx-auto p-5 bg-[#0e0f14]/90 border border-white/10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs backdrop-blur-xl shadow-xl">
          <div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">CURRENT ACTIVE PLAN</div>
            <div className="text-white font-bold text-sm flex items-center gap-2 mt-0.5">
              <span>{activeSub.membership?.name || "Active Membership"}</span>
              <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full text-[10px]">
                {activeSub.state}
              </span>
            </div>
            <div className="text-zinc-400 text-[11px] mt-1">
              Active through: {new Date(activeSub.current_period_end).toLocaleDateString()}
            </div>
          </div>
          <Link
            href="/dashboard/learner"
            className="px-5 py-2.5 bg-[#EFFF4F] text-[#070709] font-bold uppercase rounded-2xl shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-all text-center active:scale-95"
          >
            My Workspace
          </Link>
        </div>
      )}

      {/* Asymmetric Bento Grid for Membership Tiers */}
      {loading ? (
        <div className="py-24 text-center font-mono text-xs text-zinc-500 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#EFFF4F]" />
          <span>Synchronizing membership tiers...</span>
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {plans.map((plan) => {
            const isFree = plan.tier === "FREE" || Number(plan.monthly_price) === 0;
            const price = billingCycle === "annual" ? plan.annual_price : plan.monthly_price;
            const isSubscribing = subscribingId === plan.id;
            const isCurrentPlan = activeSub?.membership_id === plan.id;
            const isHighlighted = plan.tier === "PRO";
            const isPremium = plan.tier === "PREMIUM";

            // Asymmetric Bento Card Span
            const bentoSpan = isHighlighted
              ? "lg:col-span-7"
              : isPremium
              ? "lg:col-span-7"
              : "lg:col-span-5";

            const cardContent = (
              <div
                className={`relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 h-full transition-all duration-300 ${
                  isHighlighted
                    ? "bg-[#0e0f14]/95 shadow-[0_0_35px_rgba(163,230,53,0.12)]"
                    : isPremium
                    ? "bg-[#0e0f14]/95 shadow-[0_0_30px_rgba(6,182,212,0.1)]"
                    : "border border-white/[0.08] bg-[#0e0f14]/80 hover:border-lime-400/40 hover:bg-[#13141c] hover:shadow-[0_0_30px_rgba(163,230,53,0.08)] backdrop-blur-xl"
                }`}
              >
                {/* Popular Badge for PRO tier */}
                {isHighlighted && (
                  <div className="absolute -top-3.5 left-8 px-3.5 py-1 bg-[#EFFF4F] text-[#070709] font-mono text-[10px] font-black uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(239,255,79,0.4)] flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-[#070709]" />
                    <span>FLAGSHIP SDET SUITE</span>
                  </div>
                )}

                {/* Elite Badge for PREMIUM tier */}
                {isPremium && (
                  <div className="absolute -top-3.5 left-8 px-3.5 py-1 bg-cyan-400 text-[#070709] font-mono text-[10px] font-black uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 fill-[#070709]" />
                    <span>EXECUTIVE 1-ON-1 TIER</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Card Header */}
                  <div>
                    <div className="font-mono text-[11px] text-zinc-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                      <span>{plan.tier} TIER</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase text-white tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 font-sans leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing Display */}
                  <div className="font-mono border-t border-b border-white/[0.08] py-4">
                    {isFree ? (
                      <div className="text-4xl font-black text-white">FREE</div>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                          ₹{Number(price).toLocaleString()}
                        </span>
                        <span className="text-xs text-zinc-400 font-bold">
                          /{billingCycle === "annual" ? "year" : "mo"}
                        </span>
                      </div>
                    )}
                    {plan.trial_period_days > 0 && !isFree && (
                      <div className="text-[11px] text-lime-400 font-bold mt-1.5 flex items-center gap-1">
                        <span>★</span>
                        <span>{plan.trial_period_days}-Day Full-Access Free Trial</span>
                      </div>
                    )}
                  </div>

                  {/* Core Permissions Flags with Layered Icons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                    <div className="flex items-center gap-2.5 text-white">
                      <div className="w-7 h-7 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 shrink-0">
                        <Layers className="w-3.5 h-3.5" />
                      </div>
                      <span>
                        {plan.included_course_ids?.length || 0} Courses Included
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        plan.live_session_access
                          ? "bg-lime-400/10 border border-lime-400/20 text-lime-400"
                          : "bg-white/[0.03] border border-white/[0.06] text-zinc-600"
                      }`}>
                        <Radio className="w-3.5 h-3.5" />
                      </div>
                      <span className={plan.live_session_access ? "text-white" : "text-zinc-600 line-through"}>
                        Live Architecture Labs
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        plan.downloads_access
                          ? "bg-blue-400/10 border border-blue-400/20 text-blue-400"
                          : "bg-white/[0.03] border border-white/[0.06] text-zinc-600"
                      }`}>
                        <Download className="w-3.5 h-3.5" />
                      </div>
                      <span className={plan.downloads_access ? "text-white" : "text-zinc-600 line-through"}>
                        Framework Repositories
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        plan.priority_support
                          ? "bg-amber-400/10 border border-amber-400/20 text-amber-400"
                          : "bg-white/[0.03] border border-white/[0.06] text-zinc-600"
                      }`}>
                        <Headphones className="w-3.5 h-3.5" />
                      </div>
                      <span className={plan.priority_support ? "text-white" : "text-zinc-600 line-through"}>
                        1-on-1 SDET Support
                      </span>
                    </div>
                  </div>

                  {/* Benefits Bullet Points */}
                  <div className="space-y-2.5 pt-2">
                    <div className="font-mono text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                      Included In This Plan:
                    </div>
                    <ul className="space-y-2 font-sans text-xs text-zinc-300">
                      {plan.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-lime-400 shrink-0 mt-0.5 stroke-[2.5]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Call-to-Action Button with Tactile Feedback */}
                <div className="pt-8">
                  {isCurrentPlan ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-4 bg-[#1a1b24] border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold uppercase rounded-2xl flex items-center justify-center gap-2 cursor-default"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active Plan</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSubscribe(plan)}
                      disabled={isSubscribing}
                      className={`w-full py-4 font-mono text-xs font-bold uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 duration-200 ${
                        isHighlighted
                          ? "bg-[#EFFF4F] text-[#070709] hover:bg-[#EFFF4F]/90 shadow-[0_0_25px_rgba(239,255,79,0.3)] hover:shadow-[0_0_35px_rgba(239,255,79,0.5)]"
                          : isPremium
                          ? "bg-cyan-400 text-[#070709] hover:bg-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)]"
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
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <span>Subscribe Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );

            // Wrap highlighted or premium in radial spotlight container
            if (isHighlighted) {
              return (
                <div
                  key={plan.id}
                  className={`${bentoSpan} bg-gradient-to-b from-lime-400/40 via-zinc-800/40 to-transparent p-[1px] rounded-3xl`}
                >
                  {cardContent}
                </div>
              );
            }

            if (isPremium) {
              return (
                <div
                  key={plan.id}
                  className={`${bentoSpan} bg-gradient-to-b from-cyan-400/40 via-zinc-800/40 to-transparent p-[1px] rounded-3xl`}
                >
                  {cardContent}
                </div>
              );
            }

            return (
              <div key={plan.id} className={bentoSpan}>
                {cardContent}
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
