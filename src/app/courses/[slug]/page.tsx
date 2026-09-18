"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { INITIAL_COURSES } from "@/lib/mockData";
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

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const course = INITIAL_COURSES.find((c) => c.slug === slug) || INITIAL_COURSES[0];

  // State for Accordion
  const [openModules, setOpenModules] = useState<{ [key: string]: boolean }>({
    "mod-1": true,
    "mod-2": true,
  });

  // State for Indian Rail Payment Modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NET_BANKING">("UPI");
  const [upiId, setUpiId] = useState("sdet.aspirant@okhdfcbank");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const toggleModule = (id: string) => {
    setOpenModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      // Save enrollment record to localStorage to simulate persistent backend state
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
    }, 1200);
  };

  return (
    <div className="w-full">
      {/* Course Banner Header (Swiss Style) */}
      <section className="bg-white border-b-2 border-zinc-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 uppercase">
                <span className="px-2 py-0.5 border border-zinc-900 bg-zinc-100 font-bold text-zinc-900">
                  {course.category}
                </span>
                <span>•</span>
                <span>LEVEL: {course.difficultyLevel}</span>
                <span>•</span>
                <span>UPDATED: {course.updatedAt}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 uppercase tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-zinc-700 leading-relaxed font-normal">
                {course.subtitle}
              </p>

              <div className="flex items-center gap-4 pt-2 font-mono text-xs text-zinc-600">
                <div>
                  INSTRUCTOR: <strong className="text-zinc-900">{course.instructorName}</strong> ({course.instructorTitle})
                </div>
              </div>
            </div>

            {/* Sticky Pricing Card */}
            <div className="lg:col-span-4 border-2 border-zinc-900 bg-zinc-50 p-6 space-y-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              <div className="space-y-1">
                <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
                  ALL-INCLUSIVE ENROLLMENT
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black font-mono text-zinc-950">
                    ₹{course.discountPriceINR.toLocaleString()}
                  </span>
                  <span className="text-sm line-through text-zinc-400 font-mono">
                    ₹{course.priceINR.toLocaleString()}
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                    50% OFF
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3.5 bg-blue-600 text-white font-mono text-xs uppercase font-bold hover:bg-blue-700 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
              >
                <span>ENROLL VIA UPI / CARDS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-2 border-t border-zinc-300 pt-4 font-mono text-xs text-zinc-700">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{course.durationHours} Hours Self-Paced Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Verifiable Digital Certificate Included</span>
                </div>
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
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
          {/* Left Column: Objectives & Curriculum Breakdown */}
          <div className="lg:col-span-8 space-y-12">
            {/* Objectives */}
            <div className="border-2 border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="font-mono text-xs uppercase font-bold text-zinc-500">
                [01 // LEARNING GOALS]
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-zinc-950">
                WHAT YOU WILL ARCHITECT
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {course.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-zinc-800 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Accordion (Module -> Chapter -> Lesson) */}
            <div className="space-y-4">
              <div className="flex justify-between items-end border-b-2 border-zinc-900 pb-2">
                <div>
                  <div className="font-mono text-xs uppercase text-zinc-500">[02 // SYLLABUS]</div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-950">
                    COURSE CURRICULUM
                  </h3>
                </div>
                <span className="font-mono text-xs text-zinc-600">
                  {course.modules.length} MODULES • ALL CHAPTERS UNLOCKED
                </span>
              </div>

              <div className="space-y-3">
                {course.modules.map((mod, modIdx) => (
                  <div
                    key={mod.id}
                    className="border-2 border-zinc-900 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    {/* Module Header Button */}
                    <button
                      onClick={() => toggleModule(mod.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left font-mono text-sm font-bold bg-zinc-50 hover:bg-zinc-100 transition-colors border-b border-zinc-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-blue-600">0{modIdx + 1}.</span>
                        <span className="text-zinc-950">{mod.title}</span>
                      </div>
                      {openModules[mod.id] ? (
                        <ChevronDown className="w-4 h-4 text-zinc-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                      )}
                    </button>

                    {/* Chapters & Lessons */}
                    {openModules[mod.id] && (
                      <div className="divide-y divide-zinc-200">
                        {mod.chapters.map((chap) => (
                          <div key={chap.id} className="p-4 bg-white space-y-2">
                            <div className="font-mono text-[11px] uppercase font-bold text-zinc-400">
                              CHAPTER: {chap.title}
                            </div>
                            <div className="space-y-1.5 pl-2">
                              {chap.lessons.map((les) => (
                                <div
                                  key={les.id}
                                  className="flex items-center justify-between py-1.5 px-3 hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-colors text-xs"
                                >
                                  <div className="flex items-center gap-2 text-zinc-800">
                                    {les.type === "video" && (
                                      <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
                                    )}
                                    {les.type === "quiz" && (
                                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                                    )}
                                    {les.type === "document" && (
                                      <FileText className="w-3.5 h-3.5 text-zinc-600" />
                                    )}
                                    <span className="font-medium">{les.title}</span>
                                  </div>
                                  <span className="font-mono text-[11px] text-zinc-500">
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
          </div>

          {/* Right Column: Prerequisites & Audience */}
          <div className="lg:col-span-4 space-y-6 font-mono text-xs">
            <div className="border-2 border-zinc-900 bg-white p-5 space-y-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-bold text-zinc-950 uppercase border-b border-zinc-200 pb-2">
                PREREQUISITES
              </div>
              <ul className="space-y-2 text-zinc-700 list-disc pl-4 font-sans text-xs">
                {course.prerequisites.map((p, idx) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>

            <div className="border-2 border-zinc-900 bg-white p-5 space-y-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-bold text-zinc-950 uppercase border-b border-zinc-200 pb-2">
                TARGET AUDIENCE
              </div>
              <ul className="space-y-2 text-zinc-700 list-disc pl-4 font-sans text-xs">
                {course.targetAudience.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* INDIAN PAYMENT RAILS CHECKOUT MODAL (BRD Section 15) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border-2 border-zinc-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-3">
              <div>
                <div className="font-mono text-[10px] text-zinc-500 uppercase">
                  SECURE INDIAN PAYMENT RAILS // NGTA
                </div>
                <h4 className="text-xl font-black text-zinc-950 uppercase">ORDER CHECKOUT</h4>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 hover:bg-zinc-100 border border-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Order Summary */}
            <div className="p-3 bg-zinc-50 border border-zinc-200 space-y-1 font-mono text-xs">
              <div className="text-zinc-500">ITEM: {course.title}</div>
              <div className="flex justify-between font-bold text-zinc-900 text-sm pt-1 border-t border-zinc-200">
                <span>TOTAL PAYABLE:</span>
                <span>₹{course.discountPriceINR.toLocaleString()} INR</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <div className="font-mono text-xs font-bold text-zinc-700">SELECT PAYMENT RAILS:</div>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`p-2.5 border text-center flex flex-col items-center gap-1 ${
                    paymentMethod === "UPI"
                      ? "border-zinc-950 bg-zinc-950 text-white font-bold"
                      : "border-zinc-300 hover:border-zinc-900 text-zinc-800"
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI / QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  className={`p-2.5 border text-center flex flex-col items-center gap-1 ${
                    paymentMethod === "CARD"
                      ? "border-zinc-950 bg-zinc-950 text-white font-bold"
                      : "border-zinc-300 hover:border-zinc-900 text-zinc-800"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>CARDS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("NET_BANKING")}
                  className={`p-2.5 border text-center flex flex-col items-center gap-1 ${
                    paymentMethod === "NET_BANKING"
                      ? "border-zinc-950 bg-zinc-950 text-white font-bold"
                      : "border-zinc-300 hover:border-zinc-900 text-zinc-800"
                  }`}
                >
                  <Building className="w-4 h-4" />
                  <span>NETBANKING</span>
                </button>
              </div>
            </div>

            {/* Method Input Details */}
            {paymentMethod === "UPI" && (
              <div className="space-y-2 font-mono text-xs">
                <label className="text-zinc-600 block">VIRTUAL PAYMENT ADDRESS (UPI ID):</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full p-2 border border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                  placeholder="name@upi"
                />
                <div className="text-[10px] text-zinc-500">
                  Supported: Google Pay, PhonePe, Paytm, CRED, BHIM.
                </div>
              </div>
            )}

            {paymentMethod === "CARD" && (
              <div className="space-y-2 font-mono text-xs">
                <input
                  type="text"
                  placeholder="Card Number (Rupay / Visa / Mastercard)"
                  className="w-full p-2 border border-zinc-900 focus:outline-none"
                  defaultValue="4312 •••• •••• 8910"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="p-2 border border-zinc-900"
                    defaultValue="08/29"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    className="p-2 border border-zinc-900"
                    defaultValue="•••"
                  />
                </div>
              </div>
            )}

            {/* Pay Button / Status */}
            {paymentSuccess ? (
              <div className="p-3 bg-emerald-50 border border-emerald-500 text-emerald-900 font-mono text-xs text-center font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                PAYMENT CONFIRMED! REDIRECTING TO LEARNER PLAYER...
              </div>
            ) : (
              <button
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full py-3.5 bg-zinc-950 text-white font-mono text-xs uppercase font-bold hover:bg-blue-600 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center justify-center gap-2"
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

            <div className="font-mono text-[10px] text-center text-zinc-400">
              MOCKABLE ADAPTER ACTIVE (BRD SECTION 50) // ZERO EXTERNAL BLOCKERS
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
