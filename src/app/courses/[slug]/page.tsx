"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { INITIAL_COURSES } from "@/lib/mockData";
import { createBrowserClient } from "@supabase/ssr";
import {
  CheckCircle2,
  PlayCircle,
  FileText,
  HelpCircle,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CreditCard,
  Smartphone,
  Building,
  Lock,
  X,
} from "lucide-react";
import ChallengeStepLog from "@/components/gamification/ChallengeStepLog";
import CredentialCard from "@/components/gamification/CredentialCard";
import { INITIAL_CREDENTIALS } from "@/lib/gamification";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const course = INITIAL_COURSES.find((c) => c.slug === slug) || INITIAL_COURSES[0];

  const [openModules, setOpenModules] = useState<{ [key: string]: boolean }>({
    "mod-1": true,
    "mod-2": true,
  });

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NET_BANKING">("UPI");
  const [upiId, setUpiId] = useState("sdet.aspirant@okhdfcbank");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // Fetch existing successful payments for the logged-in user via Prisma endpoint
  useEffect(() => {
    // Clear legacy mock storage to prevent cross-account enrollment leaks
    if (typeof window !== "undefined") {
      localStorage.removeItem("ngta_enrollments");
    }

    async function checkExistingPayment() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) {
          setIsEnrolled(false);
          return;
        }

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user?.id) {
          setIsEnrolled(false);
          return;
        }

        const res = await fetch(
          `/api/payments/verify?courseId=${course.id}&userId=${user.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setIsEnrolled(Boolean(data.isEnrolled));
        } else {
          setIsEnrolled(false);
        }
      } catch (err) {
        console.error("Error checking course payment status:", err);
        setIsEnrolled(false);
      }
    }
    checkExistingPayment();
  }, [course.id]);

  const toggleModule = (id: string) => {
    setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase credentials missing");
      }

      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id) {
        // Redirect to Google login if user is not authenticated
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=/courses/${course.slug}`,
          },
        });
        return;
      }

      // Persist to Prisma payments & user_activities via API route
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          courseId: course.id,
          amount: course.discountPriceINR,
          userId: user.id,
          userEmail: user.email,
          userName: user.user_metadata?.full_name || user.email?.split("@")[0],
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Payment verification failed (${res.status})`);
      }

      setIsProcessing(false);
      setPaymentSuccess(true);
      setIsEnrolled(true);
      router.refresh();

      setTimeout(() => {
        setIsCheckoutOpen(false);
        router.push(`/learn/${course.id}`);
      }, 1500);
    } catch (err: any) {
      console.error("Payment verification failed:", err);
      setIsProcessing(false);
      alert(err?.message || "Payment verification error. Please check connection and try again.");
    }
  };

  return (
    <div className="w-full">
      {/* Course Banner Header */}
      <section className="bg-[#000000] border-b border-[#1f2d4d] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-[#8A96A8] uppercase">
                <span className="px-2 py-0.5 border border-[#1f2d4d] bg-[#14213D] font-bold text-[#FCA311]">
                  {course.category}
                </span>
                <span>•</span>
                <span>LEVEL: {course.difficultyLevel}</span>
                <span>•</span>
                <span>UPDATED: {course.updatedAt}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-[#E5E5E5] leading-relaxed font-normal">
                {course.subtitle}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <img
                  src={course.instructorAvatarUrl || "/instructor/rahul-kamat.png"}
                  alt={course.instructorName}
                  className="w-9 h-9 rounded-full object-cover border border-[#1f2d4d]"
                />
                <div className="font-mono text-xs text-[#E5E5E5]">
                  INSTRUCTOR: <strong className="text-white">{course.instructorName}</strong> • {course.instructorTitle}
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:col-span-4 border border-[#1f2d4d] bg-[#14213D] p-6 space-y-5 shadow-card">
              <div className="relative aspect-video overflow-hidden border border-[#1f2d4d] bg-[#000000] -mx-6 -mt-6 mb-2">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="font-mono text-[10px] text-[#8A96A8] uppercase tracking-widest">
                  ALL-INCLUSIVE ENROLLMENT
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black font-mono text-white">
                    ₹{course.discountPriceINR.toLocaleString()}
                  </span>
                  <span className="text-sm line-through text-[#8A96A8] font-mono">
                    ₹{course.priceINR.toLocaleString()}
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#FCA311]/10 text-[#FCA311] border border-[#FCA311]/30 font-bold">
                    50% OFF
                  </span>
                </div>
              </div>

              {isEnrolled ? (
                <div className="space-y-2">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ENROLLED IN COURSE</span>
                  </div>
                  <Link
                    href={`/learn/${course.id}`}
                    className="w-full py-3.5 bg-[#FCA311] text-[#000000] font-mono text-xs uppercase font-bold hover:bg-[#e0910f] transition-colors shadow-lg shadow-[#FCA311]/20 flex items-center justify-center gap-2"
                  >
                    <span>RESUME LEARNING</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-2 bg-[#000000] border border-[#1f2d4d] text-[#E5E5E5] font-mono text-xs font-bold flex items-center justify-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-[#8A96A8]" />
                    <span>STATUS: LOCKED (NOT ENROLLED)</span>
                  </div>
                  <RazorpayCheckoutButton
                    courseId={course.id}
                    courseTitle={course.title}
                    amountINR={course.discountPriceINR}
                    className="w-full py-3.5 bg-[#FCA311] text-[#000000] font-mono text-xs uppercase font-bold hover:bg-[#FCA311]/90 transition-colors shadow-lemon-sm flex items-center justify-center gap-2 cursor-pointer"
                    buttonText="ENROLL VIA UPI / CARDS"
                    onSuccess={() => setIsEnrolled(true)}
                  />
                </div>
              )}

              <div className="space-y-2 border-t border-[#1f2d4d] pt-4 font-mono text-xs text-[#E5E5E5]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#8A96A8]" />
                  <span>{course.durationHours} Hours Self-Paced Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8A96A8]" />
                  <span>Verifiable Digital Certificate Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-[#8A96A8]" />
                  <span>24/7 Dedicated QA Channel Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Curriculum */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            {/* Objectives */}
            <div className="border border-[#1f2d4d] bg-[#14213D] p-6 shadow-card space-y-4">
              <div className="font-mono text-xs uppercase font-bold text-[#8A96A8]">
                LEARNING OBJECTIVES
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">
                WHAT YOU WILL ARCHITECT
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {course.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#E5E5E5] font-sans">
                    <CheckCircle2 className="w-4 h-4 text-[#FCA311] shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Accordion */}
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-[#1f2d4d] pb-2">
                <div>
                  <div className="font-mono text-xs uppercase text-[#8A96A8]">COURSE SYLLABUS</div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                    CURRICULUM & MODULES
                  </h3>
                </div>
                {isEnrolled ? (
                  <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{course.modules.length} MODULES • ALL LESSONS ENROLLED & UNLOCKED</span>
                  </span>
                ) : (
                  <span className="font-mono text-xs text-[#E5E5E5] flex items-center gap-1.5 font-bold">
                    <Lock className="w-3.5 h-3.5 text-[#8A96A8]" />
                    <span>{course.modules.length} MODULES • ENROLL TO UNLOCK</span>
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {course.modules.map((mod, modIdx) => (
                  <div
                    key={mod.id}
                    className="border border-[#1f2d4d] bg-[#14213D] shadow-card"
                  >
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left font-mono text-sm font-bold bg-[#000000] hover:bg-[#1f2d4d] transition-colors border-b border-[#1f2d4d]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#FCA311]">0{modIdx + 1}.</span>
                        <span className="text-white">{mod.title}</span>
                      </div>
                      {openModules[mod.id] ? (
                        <ChevronDown className="w-4 h-4 text-[#8A96A8]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#8A96A8]" />
                      )}
                    </button>

                    {openModules[mod.id] && (
                      <div className="divide-y divide-[#1f2d4d]">
                        {mod.chapters.map((chap) => (
                          <div key={chap.id} className="p-4 bg-[#14213D] space-y-2">
                            <div className="font-mono text-[11px] uppercase font-bold text-[#8A96A8]">
                              CHAPTER: {chap.title}
                            </div>
                            <div className="space-y-1.5 pl-2">
                              {chap.lessons.map((les) => (
                                <div
                                  key={les.id}
                                  className="flex items-center justify-between py-1.5 px-3 hover:bg-[#000000] border border-transparent hover:border-[#1f2d4d] transition-colors text-xs"
                                >
                                  <div className="flex items-center gap-2 text-[#E5E5E5]">
                                    {isEnrolled ? (
                                      les.type === "video" ? (
                                        <PlayCircle className="w-3.5 h-3.5 text-[#FCA311]" />
                                      ) : les.type === "quiz" ? (
                                        <HelpCircle className="w-3.5 h-3.5 text-[#FCA311]" />
                                      ) : (
                                        <FileText className="w-3.5 h-3.5 text-[#8A96A8]" />
                                      )
                                    ) : (
                                      <Lock className="w-3.5 h-3.5 text-[#8A96A8]" />
                                    )}
                                    <span className="font-medium">{les.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {!isEnrolled && (
                                      <span className="text-[10px] font-mono text-[#8A96A8] uppercase">
                                        Locked
                                      </span>
                                    )}
                                    <span className="font-mono text-[11px] text-[#8A96A8]">
                                      {les.durationMinutes}m
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor Spotlight */}
            <div className="border border-[#1f2d4d] bg-[#14213D] p-6 shadow-card space-y-4">
              <div className="font-mono text-xs uppercase font-bold text-[#8A96A8]">
                YOUR INSTRUCTOR
              </div>
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={course.instructorAvatarUrl || "/instructor/rahul-kamat.png"}
                  alt={course.instructorName}
                  className="w-24 h-24 rounded-lg object-cover border border-[#1f2d4d] shrink-0"
                />
                <div className="space-y-2">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h4 className="text-xl font-bold text-white">{course.instructorName}</h4>
                    <span className="text-xs text-[#FCA311] font-mono font-bold bg-[#FCA311]/10 border border-[#FCA311]/30 px-2 py-0.5">
                      17+ Years Experience
                    </span>
                  </div>
                  <p className="text-xs text-[#E5E5E5] font-mono">{course.instructorTitle}</p>
                  <p className="text-sm text-[#E5E5E5] font-sans leading-relaxed">
                    {course.instructorBio || "Founder and Lead SDET Instructor at NextGen Testing Academy (NGTA)."}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-1 font-mono text-xs text-[#8A96A8]">
                    <span>★ 4.9 Instructor Rating</span>
                    <span>•</span>
                    <span>10,000+ Students Mentored</span>
                    <span>•</span>
                    <span>1,840+ Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6 font-mono text-xs">
            <div className="border border-[#1f2d4d] bg-[#14213D] p-5 space-y-3 shadow-card">
              <div className="font-bold text-white uppercase border-b border-[#1f2d4d] pb-2">
                PREREQUISITES
              </div>
              <ul className="space-y-2 text-[#E5E5E5] list-disc pl-4 font-sans text-xs">
                {course.prerequisites.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="border border-[#1f2d4d] bg-[#14213D] p-5 space-y-3 shadow-card">
              <div className="font-bold text-white uppercase border-b border-[#1f2d4d] pb-2">
                TARGET AUDIENCE
              </div>
              <ul className="space-y-2 text-[#E5E5E5] list-disc pl-4 font-sans text-xs">
                {course.targetAudience.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            <ChallengeStepLog maxVisible={6} />

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-[#8A96A8] uppercase text-[10px] tracking-wider border-b border-[#1f2d4d] pb-1">
                <span>COURSE ACCREDITATION & BADGES</span>
                <span>UNLOCKABLE</span>
              </div>
              <div className="space-y-3">
                {INITIAL_CREDENTIALS.slice(0, 2).map((cred) => (
                  <CredentialCard key={cred.id} credential={cred} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAYMENT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#14213D] border border-[#1f2d4d] shadow-lemon-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-[#1f2d4d] pb-3">
              <div>
                <div className="font-mono text-[10px] text-[#8A96A8] uppercase">
                  SECURE CHECKOUT
                </div>
                <h4 className="text-xl font-black text-white uppercase">ORDER CHECKOUT</h4>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 hover:bg-[#1f2d4d] border border-[#1f2d4d] text-[#E5E5E5] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-[#000000] border border-[#1f2d4d] space-y-1 font-mono text-xs">
              <div className="text-[#8A96A8]">ITEM: {course.title}</div>
              <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-[#1f2d4d]">
                <span>TOTAL PAYABLE:</span>
                <span>₹{course.discountPriceINR.toLocaleString()} INR</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs font-bold text-[#E5E5E5]">SELECT PAYMENT RAILS:</div>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-2.5 border text-center flex flex-col items-center gap-1 transition-colors ${
                    paymentMethod === "UPI"
                      ? "border-[#FCA311] bg-[#FCA311] text-[#000000] font-bold"
                      : "border-[#1f2d4d] hover:border-[#FCA311]/40 text-[#E5E5E5]"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  className={`p-2.5 border text-center flex flex-col items-center gap-1 transition-colors ${
                    paymentMethod === "CARD"
                      ? "border-[#FCA311] bg-[#FCA311] text-[#000000] font-bold"
                      : "border-[#1f2d4d] hover:border-[#FCA311]/40 text-[#E5E5E5]"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>CARDS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("NET_BANKING")}
                  className={`p-2.5 border text-center flex flex-col items-center gap-1 transition-colors ${
                    paymentMethod === "NET_BANKING"
                      ? "border-[#FCA311] bg-[#FCA311] text-[#000000] font-bold"
                      : "border-[#1f2d4d] hover:border-[#FCA311]/40 text-[#E5E5E5]"
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>NETBANKING</span>
                </button>
              </div>
            </div>

            {paymentMethod === "UPI" && (
              <div className="space-y-2 font-mono text-xs">
                <label className="text-[#8A96A8] block">VIRTUAL PAYMENT ADDRESS (UPI ID):</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-2 border border-[#1f2d4d] bg-[#000000] text-white focus:outline-none focus:border-[#FCA311]/50"
                  placeholder="name@upi"
                />
                <div className="text-[10px] text-[#8A96A8]">
                  Supported: Google Pay, PhonePe, Paytm, CRED, BHIM.
                </div>
              </div>
            )}

            {paymentMethod === "CARD" && (
              <div className="space-y-2 font-mono text-xs">
                <input
                  type="text"
                  placeholder="Card Number (Rupay / Visa / Mastercard)"
                  className="w-full p-2 border border-[#1f2d4d] bg-[#000000] text-white focus:outline-none focus:border-[#FCA311]/50"
                  defaultValue="4312 •••• •••• 8910"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="MM/YY" className="p-2 border border-[#1f2d4d] bg-[#000000] text-white" defaultValue="08/29" />
                  <input type="password" placeholder="CVV" className="p-2 border border-[#1f2d4d] bg-[#000000] text-white" defaultValue="•••" />
                </div>
              </div>
            )}

            {paymentSuccess ? (
              <div className="p-3 bg-[#FCA311]/10 border border-[#FCA311]/30 text-[#FCA311] font-mono text-xs text-center font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                PAYMENT CONFIRMED! REDIRECTING TO LEARNER PLAYER...
              </div>
            ) : (
              <RazorpayCheckoutButton
                courseId={course.id}
                courseTitle={course.title}
                amountINR={course.discountPriceINR}
                className="w-full py-3.5 bg-[#FCA311] text-[#000000] font-mono text-xs uppercase font-bold hover:bg-[#FCA311]/90 transition-colors shadow-lemon-sm flex items-center justify-center gap-2 cursor-pointer"
                buttonText={`PAY ₹${course.discountPriceINR.toLocaleString()} & START LEARNING`}
                onSuccess={() => {
                  setPaymentSuccess(true);
                  setIsEnrolled(true);
                  setTimeout(() => {
                    setIsCheckoutOpen(false);
                  }, 1500);
                }}
              />
            )}

            <div className="font-mono text-[10px] text-center text-[#8A96A8]">
              256-Bit SSL Encrypted • Instant Access Upon Confirmation
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
