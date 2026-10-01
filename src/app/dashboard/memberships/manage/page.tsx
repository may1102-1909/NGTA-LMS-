"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Users,
  CheckCircle2,
  Lock,
  ChevronLeft,
  Sparkles,
  Loader2,
  Radio,
  Layers,
  Download,
  Headphones,
  Save,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface MembershipPlan {
  id?: string;
  name: string;
  description: string;
  tier: "FREE" | "BASIC" | "PRO" | "PREMIUM";
  monthly_price: number;
  annual_price: number;
  trial_period_days: number;
  benefits: string[];
  included_course_ids: string[];
  community_access: boolean;
  live_session_access: boolean;
  downloads_access: boolean;
  priority_support: boolean;
  instructor_id?: string | null;
  user_memberships?: { id: string; user_id: string; state: string }[];
}

export default function MembershipManagementPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("GUEST");
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState<"FREE" | "BASIC" | "PRO" | "PREMIUM">("PRO");
  const [monthlyPrice, setMonthlyPrice] = useState("999");
  const [annualPrice, setAnnualPrice] = useState("9999");
  const [trialDays, setTrialDays] = useState("14");
  const [benefitsText, setBenefitsText] = useState(
    "Full access to QA forum\nLive weekly masterclass sessions\nDownloadable project starter templates"
  );
  const [includedCourses, setIncludedCourses] = useState<string[]>(["course-1"]);
  const [communityAccess, setCommunityAccess] = useState(true);
  const [liveSessionAccess, setLiveSessionAccess] = useState(true);
  const [downloadsAccess, setDownloadsAccess] = useState(true);
  const [prioritySupport, setPrioritySupport] = useState(false);
  const [instructorPayoutId, setInstructorPayoutId] = useState("");

  const availableCourses = [
    { id: "course-1", title: "Selenium Java + AI Masterclass" },
    { id: "course-2", title: "Modern Web Testing & Cypress" },
    { id: "course-3", title: "Advanced Performance Benchmarking" },
  ];

  // Verify Role: SUPER_ADMIN or INSTRUCTOR only
  useEffect(() => {
    async function checkRoleAndLoad() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          router.replace("/memberships?error=403");
          return;
        }

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) {
          router.replace("/memberships?error=403");
          return;
        }

        setCurrentUser(user);

        // Fetch user profile from Supabase
        const profRes = await fetch(`/api/student-profile?userId=${user.id}`);
        let role = "GUEST";
        if (profRes.ok) {
          const profData = await profRes.json();
          role = (profData.role || user.user_metadata?.role || "GUEST").toUpperCase();
        }

        setUserRole(role);

        // STAGE 2: SUPER_ADMIN and INSTRUCTOR only. All other roles -> 403 redirect
        if (role !== "SUPER_ADMIN" && role !== "INSTRUCTOR") {
          router.replace("/memberships?error=403");
          return;
        }

        if (role === "INSTRUCTOR") {
          setInstructorPayoutId(user.id);
        }

        // Fetch plans
        const res = await fetch("/api/memberships");
        if (res.ok) {
          const data = await res.json();
          if (data.memberships) {
            setPlans(data.memberships);
          }
        }
      } catch (err) {
        console.error("Access verification error:", err);
        router.replace("/memberships?error=403");
      } finally {
        setLoading(false);
      }
    }

    checkRoleAndLoad();
  }, [router]);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setTier("PRO");
    setMonthlyPrice("999");
    setAnnualPrice("9999");
    setTrialDays("14");
    setBenefitsText("Full access to QA forum\nLive weekly masterclass sessions\nDownloadable project starter templates");
    setIncludedCourses(["course-1"]);
    setCommunityAccess(true);
    setLiveSessionAccess(true);
    setDownloadsAccess(true);
    setPrioritySupport(false);
    if (userRole === "INSTRUCTOR" && currentUser?.id) {
      setInstructorPayoutId(currentUser.id);
    } else {
      setInstructorPayoutId("");
    }
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setEditingId(plan.id || null);
    setName(plan.name);
    setDescription(plan.description);
    setTier(plan.tier);
    setMonthlyPrice(String(plan.monthly_price));
    setAnnualPrice(String(plan.annual_price));
    setTrialDays(String(plan.trial_period_days));
    setBenefitsText(plan.benefits.join("\n"));
    setIncludedCourses(plan.included_course_ids || []);
    setCommunityAccess(plan.community_access);
    setLiveSessionAccess(plan.live_session_access);
    setDownloadsAccess(plan.downloads_access);
    setPrioritySupport(plan.priority_support);
    setInstructorPayoutId(plan.instructor_id || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      alert("Please provide plan name and description.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    const benefitsArray = benefitsText
      .split("\n")
      .map((b) => b.trim())
      .filter((b) => b.length > 0);

    try {
      const res = await fetch("/api/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          name: name.trim(),
          description: description.trim(),
          tier,
          monthly_price: Number(monthlyPrice),
          annual_price: Number(annualPrice),
          trial_period_days: Number(trialDays),
          benefits: benefitsArray,
          included_course_ids: includedCourses,
          community_access: communityAccess,
          live_session_access: liveSessionAccess,
          downloads_access: downloadsAccess,
          priority_support: prioritySupport,
          instructor_id: instructorPayoutId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save plan");
      }

      setSuccessMessage(
        editingId
          ? `Membership plan "${name}" updated successfully!`
          : `New membership plan "${name}" created successfully!`
      );

      resetForm();

      // Refresh list
      const updatedRes = await fetch("/api/memberships");
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setPlans(updatedData.memberships || []);
      }
    } catch (err: any) {
      alert(err.message || "Failed to save membership plan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCourse = (cId: string) => {
    setIncludedCourses((prev) =>
      prev.includes(cId) ? prev.filter((id) => id !== cId) : [...prev, cId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#28282B] flex items-center justify-center font-mono text-xs text-white">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#EFFF4F]" />
          <span>Verifying role credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white font-sans">
      {/* Header */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <Link
              href={userRole === "SUPER_ADMIN" ? "/dashboard/super-admin" : "/dashboard/instructor"}
              className="text-[#A0A5B5] hover:text-[#EFFF4F] flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{userRole === "SUPER_ADMIN" ? "SUPER ADMIN DESK" : "CREATOR STUDIO"}</span>
            </Link>
            <span>•</span>
            <span className="text-[#EFFF4F]">MEMBERSHIP GOVERNANCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <span>Membership Plans & Creator Payouts</span>
            <ShieldCheck className="w-7 h-7 text-[#EFFF4F]" />
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A5B5] mt-1">
            Author subscription tiers, map Razorpay instructor payouts, grant course access, and manage live permissions.
          </p>
        </div>

        <Link
          href="/memberships"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#28282B] border border-[#3E3E43] hover:border-[#EFFF4F]/40 text-[#EFFF4F] font-mono text-xs font-bold uppercase rounded-xl transition-all"
        >
          <span>View Public Storefront</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {successMessage && (
        <div className="p-4 bg-[#EFFF4F]/10 border border-[#EFFF4F]/40 rounded-xl text-[#EFFF4F] font-mono text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Form on Left, Existing Plans on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form: Plan Authoring */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#3E3E43] pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#EFFF4F]" />
                <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                  {editingId ? "Edit Membership Plan" : "Create New Membership Plan"}
                </h2>
              </div>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs font-mono text-[#A0A5B5] hover:text-white underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#A0A5B5] font-bold uppercase mb-1">
                  Plan Name <span className="text-[#EFFF4F]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pro Engineer Tier"
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-white font-sans text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[#A0A5B5] font-bold uppercase mb-1">
                  Description <span className="text-[#EFFF4F]">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Summary of target learner, cohort value, and curriculum scope..."
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-white font-sans text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A0A5B5] font-bold uppercase mb-1">
                    Membership Tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e: any) => setTier(e.target.value)}
                    className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white"
                  >
                    <option value="FREE">FREE</option>
                    <option value="BASIC">BASIC</option>
                    <option value="PRO">PRO</option>
                    <option value="PREMIUM">PREMIUM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A0A5B5] font-bold uppercase mb-1">
                    Trial Period (Days)
                  </label>
                  <input
                    type="number"
                    value={trialDays}
                    onChange={(e) => setTrialDays(e.target.value)}
                    min={0}
                    max={60}
                    className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#A0A5B5] font-bold uppercase mb-1">
                    Monthly Price (INR)
                  </label>
                  <input
                    type="number"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(e.target.value)}
                    min={0}
                    className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#A0A5B5] font-bold uppercase mb-1">
                    Annual Price (INR)
                  </label>
                  <input
                    type="number"
                    value={annualPrice}
                    onChange={(e) => setAnnualPrice(e.target.value)}
                    min={0}
                    className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white"
                  />
                </div>
              </div>

              {/* Access Permissions Toggles */}
              <div className="p-3 bg-[#28282B] border border-[#3E3E43] rounded-xl space-y-2">
                <span className="text-[10px] text-[#5A5F70] uppercase font-bold block">
                  Access Permissions Matrix
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={communityAccess}
                      onChange={(e) => setCommunityAccess(e.target.checked)}
                      className="accent-[#EFFF4F]"
                    />
                    <span>Community Channel Access</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={liveSessionAccess}
                      onChange={(e) => setLiveSessionAccess(e.target.checked)}
                      className="accent-[#EFFF4F]"
                    />
                    <span>Live Cohorts / Masterclasses</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={downloadsAccess}
                      onChange={(e) => setDownloadsAccess(e.target.checked)}
                      className="accent-[#EFFF4F]"
                    />
                    <span>Downloadable Framework Assets</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prioritySupport}
                      onChange={(e) => setPrioritySupport(e.target.checked)}
                      className="accent-[#EFFF4F]"
                    />
                    <span>Priority Support & Review</span>
                  </label>
                </div>
              </div>

              {/* Included Courses */}
              <div className="p-3 bg-[#28282B] border border-[#3E3E43] rounded-xl space-y-2">
                <span className="text-[10px] text-[#5A5F70] uppercase font-bold block">
                  Included Courses (Auto-Enrolled)
                </span>
                <div className="space-y-1.5 text-[11px]">
                  {availableCourses.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includedCourses.includes(c.id)}
                        onChange={() => toggleCourse(c.id)}
                        className="accent-[#EFFF4F]"
                      />
                      <span className="text-white">{c.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instructor Payout ID (Razorpay Route / Creator Split) */}
              <div>
                <label className="block text-[#A0A5B5] font-bold uppercase mb-1 flex items-center justify-between">
                  <span>Instructor Payout Mapping</span>
                  {userRole === "INSTRUCTOR" && (
                    <span className="text-[#EFFF4F] text-[10px]">
                      Locked to your Instructor ID
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={instructorPayoutId}
                  onChange={(e) => setInstructorPayoutId(e.target.value)}
                  disabled={userRole === "INSTRUCTOR"}
                  placeholder="UUID of Instructor receiving Razorpay Route payout..."
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white disabled:opacity-60 text-xs"
                />
              </div>

              {/* Benefits (One per line) */}
              <div>
                <label className="block text-[#A0A5B5] font-bold uppercase mb-1">
                  Plan Benefits (One bullet per line)
                </label>
                <textarea
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white font-sans text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-xl shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Membership Plan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{editingId ? "Update Plan" : "Publish Membership Plan"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* List of Existing Plans */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#3E3E43] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#EFFF4F]" />
                <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                  Active Membership Tiers ({plans.length})
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {plans.map((p) => {
                const subCount = p.user_memberships?.length || 0;
                return (
                  <div
                    key={p.id}
                    className="p-5 bg-[#28282B] border border-[#3E3E43] rounded-xl space-y-3 font-mono text-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFFF4F]/10 text-[#EFFF4F] border border-[#EFFF4F]/30">
                            {p.tier}
                          </span>
                          <span className="text-[#A0A5B5] text-[11px]">
                            {subCount} Active Subscriber{subCount === 1 ? "" : "s"}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white font-sans">{p.name}</h3>
                        <p className="text-xs text-[#A0A5B5] font-sans mt-0.5">{p.description}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-white">
                          ₹{Number(p.monthly_price).toLocaleString()}/mo
                        </div>
                        <div className="text-[10px] text-[#5A5F70]">
                          ₹{Number(p.annual_price).toLocaleString()}/yr
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[10px] text-[#A0A5B5] border-t border-[#3E3E43] pt-2">
                      <span>Courses: {p.included_course_ids?.length || 0}</span>
                      <span>•</span>
                      <span>Live: {p.live_session_access ? "Yes" : "No"}</span>
                      <span>•</span>
                      <span>Downloads: {p.downloads_access ? "Yes" : "No"}</span>
                      <span>•</span>
                      <span>Trial: {p.trial_period_days}d</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#3E3E43] pt-2">
                      <span className="text-[10px] text-[#5A5F70] truncate max-w-[200px]">
                        Payout: {p.instructor_id || "Platform Default"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleEditPlan(p)}
                        className="px-3 py-1 bg-[#333336] hover:bg-[#3E3E43] border border-[#3E3E43] text-white rounded flex items-center gap-1 text-[11px] transition-colors"
                      >
                        <Edit className="w-3 h-3 text-[#EFFF4F]" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
