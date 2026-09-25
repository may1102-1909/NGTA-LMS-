"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Course } from "@/types";
import { Star, ArrowUpRight, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

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
          } else {
            setIsEnrolled(false);
          }
        } else {
          setUserId(null);
          setIsEnrolled(false);
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
    <div className="border border-[#3E3E43] bg-[#333336] flex flex-col justify-between hover:border-[#EFFF4F]/30 hover:translate-y-[-2px] transition-all shadow-card hover:shadow-card-hover">
      <div>
        {/* Course Header Banner / Thumbnail */}
        <div className="relative h-48 border-b border-[#3E3E43] overflow-hidden bg-[#28282B]">
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-300"
          />
          <div className="absolute top-3 left-3 bg-[#28282B]/90 text-[#EFFF4F] font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-[#3E3E43]">
            {course.category}
          </div>
          <div className="absolute top-3 right-3 bg-[#333336] text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-[#3E3E43] flex items-center gap-1">
            <Star className="w-3 h-3 text-[#EFFF4F] fill-[#EFFF4F]" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Course Content Info */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 font-mono text-xs text-[#5A5F70]">
            <span>INDEX: 0{idx + 1}</span>
            <span>•</span>
            <span>{course.difficultyLevel}</span>
            <span>•</span>
            <span>{course.durationHours} HRS</span>
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
            <Link
              href={`/courses/${course.slug}`}
              className="hover:text-[#EFFF4F] transition-colors"
            >
              {course.title}
            </Link>
          </h3>

          <p className="text-sm text-[#A0A5B5] line-clamp-2">
            {course.subtitle}
          </p>

          <div className="flex items-center gap-2 pt-1 text-xs font-mono text-[#A0A5B5]">
            <img
              src={course.instructorAvatarUrl || "/instructor/rahul-kamat.png"}
              alt={course.instructorName}
              className="w-5 h-5 rounded-full object-cover border border-[#3E3E43]"
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
                className="font-mono text-[10px] px-2 py-0.5 border border-[#3E3E43] text-[#5A5F70] bg-[#28282B]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Course Footer & Pricing */}
      <div className="p-6 border-t border-[#3E3E43] bg-[#28282B] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] text-[#5A5F70] uppercase">
            ENROLLMENT FEE
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">
              ₹{course.discountPriceINR.toLocaleString()}
            </span>
            <span className="text-xs line-through text-[#5A5F70] font-mono">
              ₹{course.priceINR.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Dynamic Enrollment Action */}
        {isEnrolled ? (
          <div className="flex items-center gap-2">
            <span className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>ENROLLED IN COURSE</span>
            </span>
            <Link
              href={`/learn/${course.id}`}
              className="px-4 py-2 bg-cyan-400 text-[#10131A] font-mono text-xs uppercase font-bold hover:bg-cyan-300 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>RESUME LEARNING</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleEnrollNow}
              disabled={isProcessing}
              className="px-4 py-2.5 bg-[#EFFF4F] text-[#28282B] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-1.5 shadow-lemon-sm disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <span>ENROLL NOW - ₹{course.discountPriceINR.toLocaleString()}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
            <Link
              href={`/courses/${course.slug}`}
              className="px-3 py-2.5 border border-[#3E3E43] text-[#A0A5B5] font-mono text-xs uppercase font-bold hover:border-[#EFFF4F] hover:text-[#EFFF4F] transition-colors flex items-center gap-1"
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
