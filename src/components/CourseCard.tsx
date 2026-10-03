"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Course } from "@/types";
import { Star, ArrowUpRight, ArrowRight, CheckCircle2, Loader2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
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
    <div className="border border-white/[0.08] bg-[#0e0f14]/85 backdrop-blur-xl rounded-3xl overflow-hidden flex flex-col justify-between hover:border-lime-400/40 hover:bg-[#13141c] hover:shadow-[0_0_30px_rgba(163,230,53,0.08)] transition-all duration-300">
      <div>
        {/* Course Header Banner / Thumbnail */}
        <div className="relative h-48 border-b border-white/[0.08] overflow-hidden bg-[#070709]">
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover opacity-85 hover:opacity-100 hover:scale-105 transition-all duration-500"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <div className="bg-[#070709]/90 text-lime-400 font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border border-lime-400/30 backdrop-blur-md shadow-sm">
              {course.category}
            </div>
            {isEnrolled ? (
              <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm backdrop-blur-md">
                <CheckCircle2 className="w-3 h-3" />
                <span>Enrolled</span>
              </div>
            ) : (
              <div className="bg-[#070709]/90 text-zinc-400 border border-white/10 font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
                <Lock className="w-3 h-3 text-zinc-500" />
                <span>Locked</span>
              </div>
            )}
          </div>
          <div className="absolute top-3 right-3 bg-[#070709]/90 text-white font-mono text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 backdrop-blur-md shadow-sm">
            <Star className="w-3 h-3 text-lime-400 fill-lime-400" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Course Content Info */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
            <span className="text-lime-400 font-bold">0{idx + 1}</span>
            <span>•</span>
            <span>{course.difficultyLevel}</span>
            <span>•</span>
            <span>{course.durationHours} HRS</span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
            <Link
              href={`/courses/${course.slug}`}
              className="hover:text-lime-400 transition-colors"
            >
              {course.title}
            </Link>
          </h3>

          <p className="text-sm text-zinc-400 line-clamp-2 font-sans">
            {course.subtitle}
          </p>

          <div className="flex items-center gap-2 pt-1 text-xs font-mono text-zinc-300">
            <img
              src={course.instructorAvatarUrl || "/instructor/rahul-kamat.png"}
              alt={course.instructorName}
              className="w-5 h-5 rounded-full object-cover border border-white/20"
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
                className="font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-white/[0.08] text-zinc-400 bg-white/[0.03]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Real progress calculation: (completed_modules / total_modules) * 100 */}
          {isEnrolled && (
            <div className="pt-3 border-t border-white/[0.08] space-y-1.5">
              <div className="flex justify-between items-center font-mono text-[11px]">
                <span className="text-zinc-400">Course Progress</span>
                <span className="font-bold text-lime-400">{progressPercent}% Completed</span>
              </div>
              <div className="w-full h-1.5 bg-[#070709] border border-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-lime-400 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Course Footer & Pricing */}
      <div className="p-6 border-t border-white/[0.08] bg-[#070709]/80 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
            ENROLLMENT FEE
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">
              ₹{course.discountPriceINR.toLocaleString()}
            </span>
            <span className="text-xs line-through text-zinc-500 font-mono">
              ₹{course.priceINR.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Dynamic Enrollment Action */}
        {isEnrolled ? (
          <div className="flex items-center gap-2">
            <span className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ENROLLED</span>
            </span>
            <Link
              href={`/learn/${course.id}`}
              className="px-4 py-2.5 bg-cyan-400 text-[#070709] font-mono text-xs uppercase font-bold hover:bg-cyan-300 transition-colors flex items-center gap-1.5 rounded-xl shadow-sm active:scale-95"
            >
              <span>RESUME</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1.5 bg-white/[0.04] border border-white/10 text-zinc-400 font-mono text-xs font-bold flex items-center gap-1 rounded-xl">
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
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
              className="px-3.5 py-2.5 border border-white/15 bg-white/[0.03] text-zinc-300 font-mono text-xs uppercase font-bold hover:border-lime-400 hover:text-lime-400 transition-colors flex items-center gap-1 rounded-xl active:scale-95"
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
