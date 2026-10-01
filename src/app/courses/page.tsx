"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { INITIAL_COURSES } from "@/lib/mockData";
import {
  Star,
  ArrowUpRight,
  Search,
  Filter,
  Clock,
  BarChart2,
  Lock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [courseProgressMap, setCourseProgressMap] = useState<
    Record<string, { completed: number; total: number; percent: number }>
  >({});

  useEffect(() => {
    async function loadEnrollments() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) return;

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.id) {
          const res = await fetch(`/api/payments/verify?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            const ids: string[] = data.enrolledCourseIds || [];
            setEnrolledCourseIds(ids);

            const map: Record<string, { completed: number; total: number; percent: number }> = {};
            if (Array.isArray(data.enrollments)) {
              data.enrollments.forEach((e: any) => {
                const completed = Number(e.completed_modules ?? 0);
                const total = Number(e.total_modules ?? 10);
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                map[e.course_id] = { completed, total, percent };
              });
            }
            setCourseProgressMap(map);
          }
        }
      } catch (err) {
        console.error("Error loading course enrollments:", err);
      }
    }
    loadEnrollments();
  }, []);

  const categories = ["ALL", "Automation Testing", "Modern Web Testing", "Performance", "Security"];
  const levels = ["ALL", "Beginner", "Intermediate", "Advanced"];

  const filteredCourses = INITIAL_COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory =
      selectedCategory === "ALL" || course.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "ALL" || course.difficultyLevel === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Banner */}
      <div className="border-b border-[#1f2d4d] pb-8 mb-8">
        <div className="font-mono text-xs text-[#8A96A8] uppercase tracking-widest mb-1">
          COURSE CATALOG
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase">
          SDET & TEST AUTOMATION CURRICULA
        </h1>
        <p className="text-[#E5E5E5] mt-2 text-base font-normal max-w-2xl">
          Comprehensive, production-validated syllabi covering architecture, enterprise frameworks, CI/CD integration, and performance benchmarks.
        </p>
      </div>

      {/* Filter Grid Toolbar */}
      <div className="border border-[#1f2d4d] bg-[#14213D] p-4 mb-10 shadow-card grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-[#8A96A8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords (e.g. Selenium, Playwright, CI/CD)..."
            className="w-full pl-9 pr-4 py-2 border border-[#1f2d4d] bg-[#000000] font-mono text-xs text-white placeholder:text-[#8A96A8] focus:outline-none focus:border-[#FCA311]/50"
          />
        </div>

        {/* Category Selector */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-[#1f2d4d] bg-[#000000] font-mono text-xs text-white focus:outline-none focus:border-[#FCA311]/50"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                CATEGORY: {cat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Level Selector */}
        <div className="md:col-span-3">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-3 py-2 border border-[#1f2d4d] bg-[#000000] font-mono text-xs text-white focus:outline-none focus:border-[#FCA311]/50"
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                LEVEL: {lvl.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredCourses.map((course, idx) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
          const progress = courseProgressMap[course.id];

          return (
            <div
              key={course.id}
              className="border border-[#1f2d4d] bg-[#14213D] flex flex-col justify-between shadow-card hover:shadow-card-hover hover:border-[#FCA311]/40 hover:translate-y-[-2px] transition-all"
            >
              <div>
                {/* Card Banner */}
                <div className="relative h-48 border-b border-[#1f2d4d] overflow-hidden bg-[#000000]">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="bg-[#000000]/90 text-[#FCA311] font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-[#1f2d4d]">
                      {course.category}
                    </div>
                    {isEnrolled ? (
                      <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-[10px] uppercase font-bold px-2 py-0.5 flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Enrolled</span>
                      </div>
                    ) : (
                      <div className="bg-[#000000]/90 text-[#E5E5E5] border border-[#1f2d4d] font-mono text-[10px] uppercase font-bold px-2 py-0.5 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-[#8A96A8]" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#14213D] text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-[#1f2d4d] flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#FCA311] fill-[#FCA311]" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 font-mono text-xs text-[#8A96A8]">
                    <span className="flex items-center gap-1">
                      <BarChart2 className="w-3.5 h-3.5" />
                      {course.difficultyLevel}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {course.durationHours} HOURS
                    </span>
                    <span>•</span>
                    <span>{course.studentsCount.toLocaleString()} STUDENTS</span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                    <Link href={`/courses/${course.slug}`} className="hover:text-[#FCA311] transition-colors">
                      {course.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-[#E5E5E5] line-clamp-2">{course.subtitle}</p>

                  <div className="flex items-center gap-2 pt-1 text-xs font-mono text-[#E5E5E5]">
                    <img
                      src={course.instructorAvatarUrl || "/instructor/rahul-kamat.png"}
                      alt={course.instructorName}
                      className="w-5 h-5 rounded-full object-cover border border-[#1f2d4d]"
                    />
                    <span>Instructor: <strong className="text-white">{course.instructorName}</strong></span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] px-2 py-0.5 border border-[#1f2d4d] text-[#8A96A8] bg-[#0d1527]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Real Course Progress Calculation: (completed_modules / total_modules) * 100 */}
                  {isEnrolled && (
                    <div className="pt-3 border-t border-[#1f2d4d] space-y-1.5">
                      <div className="flex justify-between items-center font-mono text-[11px]">
                        <span className="text-[#E5E5E5]">Course Progress</span>
                        <span className="font-bold text-[#FCA311]">
                          {progress?.percent ?? 0}% Completed
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#000000] border border-[#1f2d4d] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-[#FCA311] transition-all duration-300"
                          style={{ width: `${progress?.percent ?? 0}%` }}
                        />
                      </div>
                      <div className="font-mono text-[10px] text-[#8A96A8] flex justify-between">
                        <span>{progress?.completed ?? 0} of {progress?.total ?? 10} modules</span>
                        <span>Status: ACTIVE</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Price and CTA */}
              {isEnrolled ? (
                <div className="p-6 border-t border-[#1f2d4d] bg-[#0d1527] flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ACCESS UNLOCKED</span>
                    </div>
                    <div className="text-xs text-[#E5E5E5] font-mono mt-0.5">
                      Enrolled SDET Track
                    </div>
                  </div>

                  <Link
                    href={`/learn/${course.id}`}
                    className="px-5 py-2.5 bg-[#FCA311] text-[#000000] font-mono text-xs uppercase font-bold hover:bg-[#e0910f] transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>RESUME LEARNING</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="p-6 border-t border-[#1f2d4d] bg-[#0d1527] flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[10px] text-[#8A96A8] uppercase">FEE</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-white font-mono">
                        ₹{course.discountPriceINR.toLocaleString()}
                      </span>
                      <span className="text-xs line-through text-[#8A96A8] font-mono">
                        ₹{course.priceINR.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1.5 bg-[#000000] border border-[#1f2d4d] text-[#E5E5E5] font-mono text-xs font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#8A96A8]" />
                      <span>LOCKED</span>
                    </span>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="px-4 py-2.5 bg-[#FCA311] text-[#000000] font-mono text-xs uppercase font-bold hover:bg-[#FCA311]/90 transition-colors flex items-center gap-1.5 shadow-lemon-sm"
                    >
                      <span>CURRICULUM</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
