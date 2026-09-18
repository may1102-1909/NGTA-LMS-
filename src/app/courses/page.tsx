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
      {/* Header Banner (Swiss Typographic Hierarchy) */}
      <div className="border-b-2 border-zinc-900 pb-8 mb-8">
        <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-1">
          [CATALOG // REGISTRY]
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 uppercase">
          SDET & TEST AUTOMATION CURRICULA
        </h1>
        <p className="text-zinc-600 mt-2 text-base font-normal max-w-2xl">
          Comprehensive, production-validated syllabi covering architecture, enterprise frameworks, CI/CD integration, and performance benchmarks.
        </p>
      </div>

      {/* Swiss Filter Grid Toolbar (BRD Section 36) */}
      <div className="border-2 border-zinc-900 bg-white p-4 mb-10 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords (e.g. Selenium, Playwright, CI/CD)..."
            className="w-full pl-9 pr-4 py-2 border border-zinc-300 font-mono text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
          />
        </div>

        {/* Category Selector */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 font-mono text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 bg-white"
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
            className="w-full px-3 py-2 border border-zinc-300 font-mono text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 bg-white"
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
            className="border-2 border-zinc-900 bg-white flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-transform"
          >
            <div>
              {/* Card Banner */}
              <div className="relative h-48 border-b-2 border-zinc-900 overflow-hidden bg-zinc-100">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute top-3 left-3 bg-zinc-950 text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-zinc-800">
                  {course.category}
                </div>
                <div className="absolute top-3 right-3 bg-white text-zinc-950 font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-zinc-900 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{course.rating}</span>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
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

                <h3 className="text-xl font-bold text-zinc-950 tracking-tight leading-snug">
                  <Link href={`/courses/${course.slug}`} className="hover:text-blue-600 transition-colors">
                    {course.title}
                  </Link>
                </h3>

                <p className="text-sm text-zinc-600 line-clamp-2">{course.subtitle}</p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2 py-0.5 border border-zinc-300 text-zinc-700 bg-zinc-50"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price and CTA */}
            <div className="p-6 border-t-2 border-zinc-900 bg-zinc-50 flex items-center justify-between">
              <div>
                <div className="font-mono text-[10px] text-zinc-500 uppercase">FEE</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-zinc-950 font-mono">
                    ₹{course.discountPriceINR.toLocaleString()}
                  </span>
                  <span className="text-xs line-through text-zinc-400 font-mono">
                    ₹{course.priceINR.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link
                href={`/courses/${course.slug}`}
                className="px-5 py-2.5 bg-zinc-950 text-white font-mono text-xs uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
