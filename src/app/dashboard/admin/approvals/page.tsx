"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  HelpCircle,
  Award,
  ExternalLink,
  ChevronLeft,
  Loader2,
  Search,
  BookOpen,
  Sparkles,
} from "lucide-react";

interface PendingCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  category: string;
  level: string;
  instructor_name: string;
  status: "DRAFT" | "PENDING_APPROVAL" | "PUBLISHED" | "REJECTED";
  modules: any[];
  quiz_data: any;
  certificate_rule: any;
  created_at: string;
  instructor?: {
    full_name: string;
    email: string;
  };
}

export default function AdminApprovalsPage() {
  const [courses, setCourses] = useState<PendingCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"PENDING_APPROVAL" | "ALL">("PENDING_APPROVAL");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadCourses = async () => {
    try {
      const url =
        filter === "PENDING_APPROVAL"
          ? "/api/courses?status=PENDING_APPROVAL"
          : "/api/courses";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.courses) {
          setCourses(data.courses);
        }
      }
    } catch (err) {
      console.error("Failed to load approval courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadCourses();
  }, [filter]);

  const handleAction = async (courseId: string, action: "APPROVE" | "REJECT") => {
    setProcessingId(courseId);
    setStatusMessage(null);

    try {
      // BRD Section 45: Admin approves course -> Status changes to PUBLISHED. Course automatically appears on public storefront.
      const res = await fetch("/api/courses/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update course status");
      }

      setStatusMessage(
        action === "APPROVE"
          ? `Course approved and published live to public storefront!`
          : `Course marked as REJECTED.`
      );

      // Refresh list
      await loadCourses();
    } catch (err: any) {
      alert(err.message || "Failed to process course approval");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white font-sans">
      {/* Header */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <Link
              href="/dashboard/admin"
              className="text-[#A0A5B5] hover:text-[#EFFF4F] flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>ADMIN CONSOLE</span>
            </Link>
            <span>•</span>
            <span className="text-[#EFFF4F]">GOVERNANCE & APPROVALS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <span>Course Publishing Approvals</span>
            <ShieldCheck className="w-7 h-7 text-[#EFFF4F]" />
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A5B5] mt-1">
            Review instructor curriculum submissions, content trees, quizzes, and publish directly to public storefront.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setFilter("PENDING_APPROVAL")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filter === "PENDING_APPROVAL"
                ? "bg-[#EFFF4F] text-[#28282B] font-bold border-[#EFFF4F] shadow-lemon-sm"
                : "bg-[#333336] border-[#3E3E43] text-[#A0A5B5] hover:text-white"
            }`}
          >
            Pending ({courses.filter((c) => c.status === "PENDING_APPROVAL").length})
          </button>
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filter === "ALL"
                ? "bg-[#EFFF4F] text-[#28282B] font-bold border-[#EFFF4F] shadow-lemon-sm"
                : "bg-[#333336] border-[#3E3E43] text-[#A0A5B5] hover:text-white"
            }`}
          >
            All Submissions
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 bg-[#EFFF4F]/10 border border-[#EFFF4F]/40 rounded-xl text-[#EFFF4F] font-mono text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <Link
            href="/courses"
            className="underline font-bold hover:text-white flex items-center gap-1"
          >
            <span>View Public Storefront</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Courses List */}
      {loading ? (
        <div className="py-16 text-center font-mono text-xs text-[#5A5F70] flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#EFFF4F]" />
          <span>Loading course submission queue...</span>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-12 text-center space-y-3 font-mono">
          <div className="w-12 h-12 rounded-full bg-[#28282B] border border-[#3E3E43] flex items-center justify-center mx-auto text-[#5A5F70]">
            <CheckCircle2 className="w-6 h-6 text-[#EFFF4F]" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase">
            No courses pending approval
          </h3>
          <p className="text-xs text-[#A0A5B5] max-w-sm mx-auto">
            All submitted courses have been reviewed. Instructors can author new curricula at /dashboard/instructor/courses/new.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map((course) => {
            const moduleList = Array.isArray(course.modules) ? course.modules : [];
            const lessonCount = moduleList.reduce(
              (acc: number, m: any) =>
                acc + (m.chapters ? m.chapters.flatMap((c: any) => c.lessons || []).length : 0),
              0
            );
            const questionCount =
              course.quiz_data && Array.isArray(course.quiz_data.questions)
                ? course.quiz_data.questions.length
                : 0;

            const isPending = course.status === "PENDING_APPROVAL";
            const isProcessing = processingId === course.id;

            return (
              <div
                key={course.id}
                className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-6"
              >
                {/* Header with Title and Status */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#3E3E43] pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2 font-mono text-[10px]">
                      <span
                        className={`px-2 py-0.5 rounded font-bold border ${
                          course.status === "PUBLISHED"
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                            : course.status === "PENDING_APPROVAL"
                            ? "bg-[#EFFF4F]/15 border-[#EFFF4F]/30 text-[#EFFF4F]"
                            : "bg-red-500/15 border-red-500/30 text-red-400"
                        }`}
                      >
                        {course.status}
                      </span>
                      <span className="text-[#5A5F70]">
                        Submitted {new Date(course.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="text-[#A0A5B5]">
                        Author: {course.instructor?.full_name || course.instructor_name}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
                      {course.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#A0A5B5] mt-1 font-sans">
                      {course.description}
                    </p>
                  </div>

                  <div className="text-right font-mono text-xs shrink-0">
                    <div className="text-[#5A5F70] text-[10px] uppercase">Tuition Fee</div>
                    <div className="text-lg font-black text-white">
                      ₹{Number(course.price).toLocaleString()}
                    </div>
                    <div className="text-[#EFFF4F] text-[10px] uppercase font-bold">
                      {course.category}
                    </div>
                  </div>
                </div>

                {/* Content Tree Summary Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#28282B] border border-[#3E3E43] rounded-xl font-mono text-xs">
                  <div>
                    <span className="text-[#5A5F70] text-[10px] block uppercase">Modules</span>
                    <span className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <Layers className="w-4 h-4 text-[#EFFF4F]" />
                      <span>{moduleList.length} Modules</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[#5A5F70] text-[10px] block uppercase">Lessons</span>
                    <span className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <BookOpen className="w-4 h-4 text-[#06B6D4]" />
                      <span>{lessonCount} Lessons</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[#5A5F70] text-[10px] block uppercase">Quiz Exam</span>
                    <span className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <HelpCircle className="w-4 h-4 text-amber-400" />
                      <span>{questionCount} Questions</span>
                    </span>
                  </div>

                  <div>
                    <span className="text-[#5A5F70] text-[10px] block uppercase">Certificate</span>
                    <span className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                      <Award className="w-4 h-4 text-[#EFFF4F]" />
                      <span>Pass: {course.certificate_rule?.passingThreshold || 70}%</span>
                    </span>
                  </div>
                </div>

                {/* Modules Preview Accordion */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-[#5A5F70] uppercase font-bold">
                    Curriculum Tree Preview
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    {moduleList.map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className="px-3 py-2 bg-[#28282B] border border-[#3E3E43] rounded flex items-center justify-between"
                      >
                        <span className="text-white truncate font-medium">{m.title}</span>
                        <span className="text-[10px] text-[#A0A5B5] shrink-0 ml-2">
                          {m.chapters?.[0]?.lessons?.length || 0} Lessons
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#3E3E43] pt-4 font-mono text-xs">
                  <span className="text-[#5A5F70]">
                    Course Slug: <code className="text-[#A0A5B5]">{course.slug}</code>
                  </span>

                  <div className="flex items-center gap-3">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleAction(course.id, "REJECT")}
                          disabled={isProcessing}
                          className="px-4 py-2 border border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold uppercase rounded-lg transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(course.id, "APPROVE")}
                          disabled={isProcessing}
                          className="px-6 py-2 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-lg shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Publishing...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Approve & Publish to Storefront</span>
                            </>
                          )}
                        </button>
                      </>
                    ) : course.status === "PUBLISHED" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>PUBLISHED ON STOREFRONT</span>
                        </span>
                        <Link
                          href="/courses"
                          className="px-3 py-1.5 bg-[#28282B] border border-[#3E3E43] hover:border-[#EFFF4F]/40 text-[#EFFF4F] rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>View Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAction(course.id, "APPROVE")}
                        disabled={isProcessing}
                        className="px-4 py-2 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-lg shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-colors"
                      >
                        Re-Approve & Publish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
