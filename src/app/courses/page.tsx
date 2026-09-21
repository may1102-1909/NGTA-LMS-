"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_COURSES } from "@/lib/mockData";
import { Star, ArrowUpRight, Search, Filter, Clock, BarChart2 } from "lucide-react";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");

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
      <div className="border-b border-[#252A36] pb-8 mb-8">
        <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1">
          COURSE CATALOG
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase">
          SDET & TEST AUTOMATION CURRICULA
        </h1>
        <p className="text-[#A0A5B5] mt-2 text-base font-normal max-w-2xl">
          Comprehensive, production-validated syllabi covering architecture, enterprise frameworks, CI/CD integration, and performance benchmarks.
        </p>
      </div>

      {/* Filter Grid Toolbar */}
      <div className="border border-[#252A36] bg-[#181C26] p-4 mb-10 shadow-card grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-[#5A5F70] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords (e.g. Selenium, Playwright, CI/CD)..."
            className="w-full pl-9 pr-4 py-2 border border-[#252A36] bg-[#10131A] font-mono text-xs text-white placeholder:text-[#5A5F70] focus:outline-none focus:border-[#EFFF4F]/50"
          />
        </div>

        {/* Category Selector */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-[#252A36] bg-[#10131A] font-mono text-xs text-white focus:outline-none focus:border-[#EFFF4F]/50"
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
            className="w-full px-3 py-2 border border-[#252A36] bg-[#10131A] font-mono text-xs text-white focus:outline-none focus:border-[#EFFF4F]/50"
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
        {filteredCourses.map((course, idx) => (
          <div
            key={course.id}
            className="border border-[#252A36] bg-[#181C26] flex flex-col justify-between shadow-card hover:shadow-card-hover hover:border-[#EFFF4F]/30 hover:translate-y-[-2px] transition-all"
          >
            <div>
              {/* Card Banner */}
              <div className="relative h-48 border-b border-[#252A36] overflow-hidden bg-[#10131A]">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-300"
                />
                <div className="absolute top-3 left-3 bg-[#10131A]/90 text-[#EFFF4F] font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-[#252A36]">
                  {course.category}
                </div>
                <div className="absolute top-3 right-3 bg-[#181C26] text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-[#252A36] flex items-center gap-1">
                  <Star className="w-3 h-3 text-[#EFFF4F] fill-[#EFFF4F]" />
                  <span>{course.rating}</span>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 font-mono text-xs text-[#5A5F70]">
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
                  <Link href={`/courses/${course.slug}`} className="hover:text-[#EFFF4F] transition-colors">
                    {course.title}
                  </Link>
                </h3>

                <p className="text-sm text-[#A0A5B5] line-clamp-2">{course.subtitle}</p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2 py-0.5 border border-[#252A36] text-[#5A5F70] bg-[#10131A]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="p-6 border-t border-[#252A36] bg-[#10131A] flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] text-[#5A5F70] uppercase">FEE</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white font-mono">
                    ₹{course.discountPriceINR.toLocaleString()}
                  </span>
                  <span className="text-xs line-through text-[#5A5F70] font-mono">
                    ₹{course.priceINR.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                href={`/courses/${course.slug}`}
                className="px-5 py-2.5 bg-[#EFFF4F] text-[#10131A] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-1.5 shadow-lemon-sm"
              >
                <span>VIEW CURRICULUM</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
