"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { INITIAL_COURSES } from "@/lib/mockData";
import { supabase } from "@/lib/supabaseClient";
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
    async function checkExistingPayment() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const res = await fetch(
          `/api/payments/verify?courseId=${course.id}${user?.id ? `&userId=${user.id}` : ""}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.isEnrolled) {
            setIsEnrolled(true);
            return;
          }
        }
        if (typeof window !== "undefined") {
          const stored = JSON.parse(localStorage.getItem("ngta_enrollments") || "[]");
          if (stored.includes(course.id)) {
            setIsEnrolled(true);
          }
        }
      } catch (err) {
        console.error("Error checking course payment status:", err);
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
      const { data: { user } } = await supabase.auth.getUser();

      // Persist to Prisma payments & user_activities via API route
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.id,
          amount: course.discountPriceINR,
          userId: user?.id,
          userEmail: user?.email,
          userName: user?.user_metadata?.full_name || user?.email?.split("@")[0],
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Payment verification failed");
      }

      setIsProcessing(false);
      setPaymentSuccess(true);
      setIsEnrolled(true);

      if (typeof window !== "undefined") {
        const stored = JSON.parse(localStorage.getItem("ngta_enrollments") || "[]");
        if (!stored.includes(course.id)) {
          stored.push(course.id);
          localStorage.setItem("ngta_enrollments", JSON.stringify(stored));
        }
      }

      setTimeout(() => {
        setIsCheckoutOpen(false);
        router.push(`/learn/${course.id}`);
      }, 1500);
    } catch (err) {
      console.error("Payment verification failed:", err);
      setIsProcessing(false);
      alert("Payment verification error. Please check connection and try again.");
    }
  };

  return (
    <div className="w-full">
      {/* Course Banner Header */}
      <section className="bg-[#28282B] border-b border-[#3E3E43] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-[#5A5F70] uppercase">
                <span className="px-2 py-0.5 border border-[#3E3E43] bg-[#333336] font-bold text-[#EFFF4F]">
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

              <p className="text-base sm:text-lg text-[#A0A5B5] leading-relaxed font-normal">
                {course.subtitle}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <img
                  src={course.instructorAvatarUrl || "/instructor/rahul-kamat.png"}
                  alt={course.instructorName}
                  className="w-9 h-9 rounded-full object-cover border border-[#3E3E43]"
                />
                <div className="font-mono text-xs text-[#A0A5B5]">
                  INSTRUCTOR: <strong className="text-white">{course.instructorName}</strong> • {course.instructorTitle}
                </div>
              </div>
            </div>

            {/* Pricing Card */}
            <div className="lg:col-span-4 border border-[#3E3E43] bg-[#333336] p-6 space-y-5 shadow-card">
              <div className="relative aspect-video overflow-hidden border border-[#3E3E43] bg-[#28282B] -mx-6 -mt-6 mb-2">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="font-mono text-[10px] text-[#5A5F70] uppercase tracking-widest">
                  ALL-INCLUSIVE ENROLLMENT
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black font-mono text-white">
                    ₹{course.discountPriceINR.toLocaleString()}
                  </span>
                  <span className="text-sm line-through text-[#5A5F70] font-mono">
                    ₹{course.priceINR.toLocaleString()}
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#EFFF4F]/10 text-[#EFFF4F] border border-[#EFFF4F]/30 font-bold">
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
                    className="w-full py-3.5 bg-cyan-400 text-[#10131A] font-mono text-xs uppercase font-bold hover:bg-cyan-300 transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                  >
                    <span>RESUME LEARNING</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 bg-[#EFFF4F] text-[#28282B] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-colors shadow-lemon-sm flex items-center justify-center gap-2"
                >
                  <span>ENROLL VIA UPI / CARDS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <div className="space-y-2 border-t border-[#3E3E43] pt-4 font-mono text-xs text-[#A0A5B5]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#5A5F70]" />
                  <span>{course.durationHours} Hours Self-Paced Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5A5F70]" />
                  <span>Verifiable Digital Certificate Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-[#5A5F70]" />
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
            <div className="border border-[#3E3E43] bg-[#333336] p-6 shadow-card space-y-4">
              <div className="font-mono text-xs uppercase font-bold text-[#5A5F70]">
                LEARNING OBJECTIVES
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white">
                WHAT YOU WILL ARCHITECT
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {course.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#A0A5B5] font-sans">
                    <CheckCircle2 className="w-4 h-4 text-[#EFFF4F] shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Accordion */}
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b border-[#3E3E43] pb-2">
                <div>
                  <div className="font-mono text-xs uppercase text-[#5A5F70]">COURSE SYLLABUS</div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                    CURRICULUM & MODULES
                  </h3>
                </div>
                <span className="font-mono text-xs text-[#5A5F70]">
                  {course.modules.length} MODULES • ALL LESSONS UNLOCKED
                </span>
              </div>

              <div className="space-y-3">
                {course.modules.map((mod, modIdx) => (
                  <div
                    key={mod.id}
                    className="border border-[#3E3E43] bg-[#333336] shadow-card"
                  >
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left font-mono text-sm font-bold bg-[#28282B] hover:bg-[#3E3E43] transition-colors border-b border-[#3E3E43]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#EFFF4F]">0{modIdx + 1}.</span>
                        <span className="text-white">{mod.title}</span>
                      </div>
                      {openModules[mod.id] ? (
                        <ChevronDown className="w-4 h-4 text-[#5A5F70]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[#5A5F70]" />
                      )}
                    </button>

                    {openModules[mod.id] && (
                      <div className="divide-y divide-[#3E3E43]">
                        {mod.chapters.map((chap) => (
                          <div key={chap.id} className="p-4 bg-[#333336] space-y-2">
                            <div className="font-mono text-[11px] uppercase font-bold text-[#5A5F70]">
                              CHAPTER: {chap.title}
                            </div>
                            <div className="space-y-1.5 pl-2">
                              {chap.lessons.map((les) => (
                                <div
                                  key={les.id}
                                  className="flex items-center justify-between py-1.5 px-3 hover:bg-[#28282B] border border-transparent hover:border-[#3E3E43] transition-colors text-xs"
                                >
                                  <div className="flex items-center gap-2 text-[#A0A5B5]">
                                    {les.type === "video" && (
                                      <PlayCircle className="w-3.5 h-3.5 text-[#EFFF4F]" />
                                    )}
                                    {les.type === "quiz" && (
                                      <HelpCircle className="w-3.5 h-3.5 text-[#EFFF4F]" />
                                    )}
                                    {les.type === "document" && (
                                      <FileText className="w-3.5 h-3.5 text-[#5A5F70]" />
                                    )}
                                    <span className="font-medium">{les.title}</span>
                                  </div>
                                  <span className="font-mono text-[11px] text-[#5A5F70]">
                                    {les.durationMinutes}m
                                  </span>
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
            <div className="border border-[#3E3E43] bg-[#333336] p-6 shadow-card space-y-4">
              <div className="font-mono text-xs uppercase font-bold text-[#5A5F70]">
                YOUR INSTRUCTOR
              </div>
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <img
                  src={course.instructorAvatarUrl || "/instructor/rahul-kamat.png"}
                  alt={course.instructorName}
                  className="w-24 h-24 rounded-lg object-cover border border-[#3E3E43] shrink-0"
                />
                <div className="space-y-2">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h4 className="text-xl font-bold text-white">{course.instructorName}</h4>
                    <span className="text-xs text-[#EFFF4F] font-mono font-bold bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 px-2 py-0.5">
                      17+ Years Experience
                    </span>
                  </div>
                  <p className="text-xs text-[#A0A5B5] font-mono">{course.instructorTitle}</p>
                  <p className="text-sm text-[#A0A5B5] font-sans leading-relaxed">
                    {course.instructorBio || "Founder and Lead SDET Instructor at NextGen Testing Academy (NGTA)."}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-1 font-mono text-xs text-[#5A5F70]">
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
            <div className="border border-[#3E3E43] bg-[#333336] p-5 space-y-3 shadow-card">
              <div className="font-bold text-white uppercase border-b border-[#3E3E43] pb-2">
                PREREQUISITES
              </div>
              <ul className="space-y-2 text-[#A0A5B5] list-disc pl-4 font-sans text-xs">
                {course.prerequisites.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="border border-[#3E3E43] bg-[#333336] p-5 space-y-3 shadow-card">
              <div className="font-bold text-white uppercase border-b border-[#3E3E43] pb-2">
                TARGET AUDIENCE
              </div>
              <ul className="space-y-2 text-[#A0A5B5] list-disc pl-4 font-sans text-xs">
                {course.targetAudience.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            <ChallengeStepLog maxVisible={6} />

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-[#5A5F70] uppercase text-[10px] tracking-wider border-b border-[#3E3E43] pb-1">
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
        <div className="fixed inset-0 z-50 bg-[#28282B]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#333336] border border-[#3E3E43] shadow-lemon-md p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start border-b border-[#3E3E43] pb-3">
              <div>
                <div className="font-mono text-[10px] text-[#5A5F70] uppercase">
                  SECURE CHECKOUT
                </div>
                <h4 className="text-xl font-black text-white uppercase">ORDER CHECKOUT</h4>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 hover:bg-[#3E3E43] border border-[#3E3E43] text-[#A0A5B5] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-[#28282B] border border-[#3E3E43] space-y-1 font-mono text-xs">
              <div className="text-[#5A5F70]">ITEM: {course.title}</div>
              <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-[#3E3E43]">
                <span>TOTAL PAYABLE:</span>
                <span>₹{course.discountPriceINR.toLocaleString()} INR</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-xs font-bold text-[#A0A5B5]">SELECT PAYMENT RAILS:</div>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-2.5 border text-center flex flex-col items-center gap-1 transition-colors ${
                    paymentMethod === "UPI"
                      ? "border-[#EFFF4F] bg-[#EFFF4F] text-[#28282B] font-bold"
                      : "border-[#3E3E43] hover:border-[#EFFF4F]/30 text-[#A0A5B5]"
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
                      ? "border-[#EFFF4F] bg-[#EFFF4F] text-[#28282B] font-bold"
                      : "border-[#3E3E43] hover:border-[#EFFF4F]/30 text-[#A0A5B5]"
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
                      ? "border-[#EFFF4F] bg-[#EFFF4F] text-[#28282B] font-bold"
                      : "border-[#3E3E43] hover:border-[#EFFF4F]/30 text-[#A0A5B5]"
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>NETBANKING</span>
                </button>
              </div>
            </div>

            {paymentMethod === "UPI" && (
              <div className="space-y-2 font-mono text-xs">
                <label className="text-[#5A5F70] block">VIRTUAL PAYMENT ADDRESS (UPI ID):</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-2 border border-[#3E3E43] bg-[#28282B] text-white focus:outline-none focus:border-[#EFFF4F]/50"
                  placeholder="name@upi"
                />
                <div className="text-[10px] text-[#5A5F70]">
                  Supported: Google Pay, PhonePe, Paytm, CRED, BHIM.
                </div>
              </div>
            )}

            {paymentMethod === "CARD" && (
              <div className="space-y-2 font-mono text-xs">
                <input
                  type="text"
                  placeholder="Card Number (Rupay / Visa / Mastercard)"
                  className="w-full p-2 border border-[#3E3E43] bg-[#28282B] text-white focus:outline-none focus:border-[#EFFF4F]/50"
                  defaultValue="4312 •••• •••• 8910"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="MM/YY" className="p-2 border border-[#3E3E43] bg-[#28282B] text-white" defaultValue="08/29" />
                  <input type="password" placeholder="CVV" className="p-2 border border-[#3E3E43] bg-[#28282B] text-white" defaultValue="•••" />
                </div>
              </div>
            )}

            {paymentSuccess ? (
              <div className="p-3 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-mono text-xs text-center font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                PAYMENT CONFIRMED! REDIRECTING TO LEARNER PLAYER...
              </div>
            ) : (
              <button
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full py-3.5 bg-[#EFFF4F] text-[#28282B] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-colors shadow-lemon-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>AUTHENTICATING PAYMENT GATEWAY...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>PAY ₹{course.discountPriceINR.toLocaleString()} & START LEARNING</span>
                  </>
                )}
              </button>
            )}

            <div className="font-mono text-[10px] text-center text-[#5A5F70]">
              256-Bit SSL Encrypted • Instant Access Upon Confirmation
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
