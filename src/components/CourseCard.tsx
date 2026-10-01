"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Course } from "@/types";
import { Star, ArrowUpRight, ArrowRight, CheckCircle2, Loader2, Lock } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";

interface CourseCardProps {
  course: Course;
  idx: number;
  initialIsEnrolled?: boolean;
  userId?: string | null;
}

export default function CourseCard({
  course,
  idx,
  initialIsEnrolled = false,
  userId: initialUserId = null,
}: CourseCardProps) {
  const router = useRouter();
  const [isEnrolled, setIsEnrolled] = useState<boolean>(initialIsEnrolled);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(initialUserId);

  // Sync state if initialIsEnrolled changes from SSR
  useEffect(() => {
    setIsEnrolled(initialIsEnrolled);
  }, [initialIsEnrolled]);

  // Fetch live user session and check enrollment dynamically via Supabase Auth & DB
  useEffect(() => {
    // Clear legacy mock storage to prevent cross-account enrollment leaks
    if (typeof window !== "undefined") {
      localStorage.removeItem("ngta_enrollments");
    }

    async function syncSessionAndEnrollment() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) return;

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.id) {
          setUserId(user.id);
          const res = await fetch(
            `/api/payments/verify?courseId=${course.id}&userId=${user.id}`
          );
          if (res.ok) {
            const data = await res.json();
            setIsEnrolled(Boolean(data.isEnrolled));
            if (data.enrollment) {
              setProgressPercent(data.enrollment.progress_percent ?? 0);
            }
          } else {
            setIsEnrolled(false);
            setProgressPercent(0);
          }
        } else {
          setUserId(null);
          setIsEnrolled(false);
          setProgressPercent(0);
        }
      } catch (err) {
        console.error("Error checking live enrollment session:", err);
      }
    }

    syncSessionAndEnrollment();
  }, [course.id, initialIsEnrolled]);

  // Payment Handler: When user clicks "Enroll Now" and completes payment
  const handleEnrollNow = async () => {
    setIsProcessing(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey) {
        alert("Supabase authentication configuration is missing.");
        return;
      }

      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const activeUserId = user?.id || userId;

      if (!activeUserId) {
        // Redirect to Google login if user is not authenticated
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback?next=/lms`,
          },
        });
        return;
      }

      // Insert row into public.payments with user_id, course_id, amount, and status: 'SUCCESS'
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          courseId: course.id || "course-1",
          amount: course.discountPriceINR || 1999,
          userId: activeUserId,
          userEmail: user?.email,
          userName:
            user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Learner",
          status: "SUCCESS",
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Payment failed (${res.status})`);
      }

      // Update state and refresh path so UI switches to 'Enrolled' instantly
      setIsEnrolled(true);
      router.refresh();
    } catch (err: any) {
      console.error("Failed to process enrollment:", err);
      alert(err?.message || "Payment processing encountered an error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="border border-[#26213B] bg-[#120F1D] flex flex-col justify-between hover:border-[#8B5CF6]/50 hover:translate-y-[-2px] transition-all shadow-card hover:shadow-card-hover rounded-xl overflow-hidden">
      <div>
        {/* Course Header Banner / Thumbnail */}
        <div className="relative h-48 border-b border-[#26213B] overflow-hidden bg-[#0E0C17]">
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-all duration-300"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="bg-[#08070D]/90 text-[#C084FC] font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 border border-[#26213B] rounded shadow-sm">
              {course.category}
            </div>
            {isEnrolled ? (
              <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 flex items-center gap-1 shadow-sm rounded">
                <CheckCircle2 className="w-3 h-3" />
                <span>Enrolled</span>
              </div>
            ) : (
              <div className="bg-[#08070D]/90 text-[#94A3B8] border border-[#26213B] font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 flex items-center gap-1 rounded">
                <Lock className="w-3 h-3 text-[#64748B]" />
                <span>Locked</span>
              </div>
            )}
          </div>
          <div className="absolute top-3 right-3 bg-[#161326] text-white font-mono text-[10px] uppercase font-bold px-2.5 py-0.5 border border-[#26213B] flex items-center gap-1 rounded shadow-sm">
            <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Course Content Info */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 font-mono text-xs text-[#64748B]">
            <span>INDEX: 0{idx + 1}</span>
            <span>•</span>
            <span>{course.difficultyLevel}</span>
            <span>•</span>
            <span>{course.durationHours} HRS</span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
            <Link
              href={`/courses/${course.slug}`}
              className="hover:text-[#A855F7] transition-colors"
            >
              {course.title}
            </Link>
          </h3>

          <p className="text-sm text-[#94A3B8] line-clamp-2">
            {course.subtitle}
          </p>

          <div className="flex items-center gap-2 pt-1 text-xs font-mono text-[#94A3B8]">
            <img
              src={course.instructorAvatarUrl || "/instructor/rahul-kamat.png"}
              alt={course.instructorName}
              className="w-5 h-5 rounded-full object-cover border border-[#26213B]"
            />
            <span>
              Instructor:{" "}
              <strong className="text-white">{course.instructorName}</strong>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2 py-0.5 border border-[#26213B] text-[#94A3B8] bg-[#161326] rounded"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Real progress calculation: (completed_modules / total_modules) * 100 */}
          {isEnrolled && (
            <div className="pt-3 border-t border-[#26213B] space-y-1.5">
              <div className="flex justify-between items-center font-mono text-[11px]">
                <span className="text-[#94A3B8]">Course Progress</span>
                <span className="font-bold text-[#C084FC]">{progressPercent}% Completed</span>
              </div>
              <div className="w-full h-1.5 bg-[#08070D] border border-[#26213B] overflow-hidden rounded-full">
                <div
                  className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#06B6D4] transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Footer & Pricing */}
      <div className="p-6 border-t border-[#26213B] bg-[#161326] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] text-[#64748B] uppercase">
            ENROLLMENT FEE
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">
              ₹{course.discountPriceINR.toLocaleString()}
            </span>
            <span className="text-xs line-through text-[#64748B] font-mono">
              ₹{course.priceINR.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Dynamic Enrollment Action */}
        {isEnrolled ? (
          <div className="flex items-center gap-2">
            <span className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ENROLLED</span>
            </span>
            <Link
              href={`/learn/${course.id}`}
              className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-mono text-xs uppercase font-bold hover:brightness-110 transition-all flex items-center gap-1.5 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.35)]"
            >
              <span>RESUME QUEST</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1.5 bg-[#08070D] border border-[#26213B] text-[#94A3B8] font-mono text-xs font-bold flex items-center gap-1 rounded-lg">
              <Lock className="w-3.5 h-3.5 text-[#64748B]" />
              <span>LOCKED</span>
            </span>
            <RazorpayCheckoutButton
              courseId={course.id}
              courseTitle={course.title}
              amountINR={course.discountPriceINR}
              onSuccess={() => {
                setIsEnrolled(true);
              }}
            />
            <Link
              href={`/courses/${course.slug}`}
              className="px-3 py-2.5 border border-[#26213B] text-[#94A3B8] font-mono text-xs uppercase font-bold hover:border-[#8B5CF6] hover:text-[#C084FC] transition-colors flex items-center gap-1 rounded-lg bg-[#120F1D]"
            >
              <span>CURRICULUM</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
