"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Layers,
  BookOpen,
  FileText,
  HelpCircle,
  Award,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  Video,
} from "lucide-react";

interface LessonDraft {
  id: string;
  title: string;
  durationMinutes: number;
  videoUrl: string;
  resourcePdfUrl: string;
  content: string;
}

interface ModuleDraft {
  id: string;
  title: string;
  lessons: LessonDraft[];
}

interface QuizQuestionDraft {
  id: string;
  questionText: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export default function NewCourseBuilderPage() {
  const router = useRouter();

  // Step 1: Course Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Automation Testing");
  const [level, setLevel] = useState("Intermediate");
  const [price, setPrice] = useState("1999");

  // Step 2: Content Tree (Modules & Lessons)
  const [modules, setModules] = useState<ModuleDraft[]>([
    {
      id: "mod-1",
      title: "Module 1: Test Automation Fundamentals & Core Architecture",
      lessons: [
        {
          id: "les-1",
          title: "Introduction to Test Frameworks & W3C Standards",
          durationMinutes: 25,
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          resourcePdfUrl: "https://ngta.in/docs/architecture-guide.pdf",
          content: "Overview of enterprise testing architecture and parallel execution runners.",
        },
      ],
    },
  ]);

  // Step 3: Quiz Builder
  const [quizTitle, setQuizTitle] = useState("Comprehensive SDET Evaluation Exam");
  const [passingThreshold, setPassingThreshold] = useState(70);
  const [questions, setQuestions] = useState<QuizQuestionDraft[]>([
    {
      id: "q-1",
      questionText: "Which architecture pattern guarantees thread-isolated WebDriver instances during parallel test runs?",
      options: [
        { id: "opt-1", text: "Singleton pattern with static global driver" },
        { id: "opt-2", text: "ThreadLocal<WebDriver> wrapper pattern" },
        { id: "opt-3", text: "Direct instantiation inside test methods" },
        { id: "opt-4", text: "Synchronized block on every web element locator" },
      ],
      correctAnswer: "opt-2",
      explanation: "ThreadLocal ensures each worker thread maintains an isolated driver context.",
    },
  ]);

  // Step 4: Certificate Rule
  const [certificateTitle, setCertificateTitle] = useState("Certified SDET Professional");
  const [signatoryName, setSignatoryName] = useState("Rahul Kamat (Founder & Lead SDET)");

  // State & Loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Module helpers
  const addModule = () => {
    const newModId = `mod-${Date.now()}`;
    setModules((prev) => [
      ...prev,
      {
        id: newModId,
        title: `Module ${prev.length + 1}: Architecture Expansion`,
        lessons: [
          {
            id: `les-${Date.now()}`,
            title: "Lesson 1: Deep Dive Setup",
            durationMinutes: 20,
            videoUrl: "",
            resourcePdfUrl: "",
            content: "Review curriculum syllabus guidelines.",
          },
        ],
      },
    ]);
  };

  const removeModule = (modId: string) => {
    if (modules.length <= 1) return;
    setModules((prev) => prev.filter((m) => m.id !== modId));
  };

  const addLesson = (modId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== modId) return m;
        return {
          ...m,
          lessons: [
            ...m.lessons,
            {
              id: `les-${Date.now()}`,
              title: `Lesson ${m.lessons.length + 1}: Implementation`,
              durationMinutes: 15,
              videoUrl: "",
              resourcePdfUrl: "",
              content: "Lesson content details.",
            },
          ],
        };
      })
    );
  };

  const removeLesson = (modId: string, lesId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== modId) return m;
        if (m.lessons.length <= 1) return m;
        return {
          ...m,
          lessons: m.lessons.filter((l) => l.id !== lesId),
        };
      })
    );
  };

  // Question helpers
  const addQuestion = () => {
    const qId = `q-${Date.now()}`;
    setQuestions((prev) => [
      ...prev,
      {
        id: qId,
        questionText: "What is the primary role of Page Object Model (POM)?",
        options: [
          { id: "opt-1", text: "Separates UI elements and actions from test assertions" },
          { id: "opt-2", text: "Speeds up network latency" },
          { id: "opt-3", text: "Generates HTML test execution reports" },
          { id: "opt-4", text: "Manages database transactions" },
        ],
        correctAnswer: "opt-1",
        explanation: "POM establishes clean separation of UI locators from test logic.",
      },
    ]);
  };

  const removeQuestion = (qId: string) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== qId));
  };

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please complete course title and curriculum description.");
      return;
    }

    setIsSubmitting(true);

    try {
      // BRD Section 45: Submit Course for Approval -> Status PENDING_APPROVAL
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          price: Number(price) || 1999,
          category,
          level,
          modules: modules.map((m, mIdx) => ({
            id: m.id,
            title: m.title,
            order: mIdx + 1,
            chapters: [
              {
                id: `chap-${mIdx + 1}`,
                title: "Chapter 1",
                lessons: m.lessons.map((l, lIdx) => ({
                  id: l.id,
                  title: l.title,
                  durationMinutes: Number(l.durationMinutes) || 15,
                  videoUrl: l.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  resourcePdfUrl: l.resourcePdfUrl,
                  content: l.content,
                  type: "video",
                  order: lIdx + 1,
                })),
              },
            ],
          })),
          quizData: {
            title: quizTitle,
            passingPercentage: Number(passingThreshold),
            questions,
          },
          certificateRule: {
            certificateTitle,
            passingThreshold: Number(passingThreshold),
            signatoryName,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit course for approval.");
      }

      setSuccessResult(data.course);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit course. Please verify inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white font-sans">
      {/* Top Header */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <Link
              href="/dashboard/instructor"
              className="text-[#A0A5B5] hover:text-[#EFFF4F] flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>INSTRUCTOR STUDIO</span>
            </Link>
            <span>•</span>
            <span className="text-[#EFFF4F]">CURRICULUM BUILDER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <span>Author & Publish New Course</span>
            <Sparkles className="w-6 h-6 text-[#EFFF4F]" />
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A5B5] mt-1">
            Build content tree, configure assessment quizzes & certificate rules, and submit for Admin Approval.
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {successResult && (
        <div className="p-6 bg-[#EFFF4F]/10 border border-[#EFFF4F]/40 rounded-2xl shadow-lemon-sm space-y-4 font-mono text-xs">
          <div className="flex items-center gap-3 text-[#EFFF4F]">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="text-base font-bold uppercase">
              Course Submitted for Admin Approval!
            </h3>
          </div>
          <p className="text-[#A0A5B5]">
            Course <strong className="text-white">"{successResult.title}"</strong> has been saved with status{" "}
            <span className="px-2 py-0.5 bg-[#EFFF4F]/20 text-[#EFFF4F] font-bold border border-[#EFFF4F]/30 rounded">
              {successResult.status}
            </span>
            . In accordance with BRD Section 45, it is queued for admin review and will automatically appear on the public storefront upon approval.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/dashboard/instructor"
              className="px-4 py-2 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-lg shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-colors"
            >
              Back to Creator Dashboard
            </Link>
            <Link
              href="/dashboard/admin/approvals"
              className="px-4 py-2 bg-[#28282B] border border-[#3E3E43] text-white hover:border-[#EFFF4F]/40 font-bold uppercase rounded-lg transition-colors"
            >
              View in Admin Approval Queue
            </Link>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-mono text-xs">
          {errorMessage}
        </div>
      )}

      {!successResult && (
        <form onSubmit={handleSubmitCourse} className="space-y-8">
          {/* Section 1: Course Overview */}
          <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#3E3E43] pb-3">
              <BookOpen className="w-4 h-4 text-[#EFFF4F]" />
              <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                1. General Course Specifications
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                  Course Title <span className="text-[#EFFF4F]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Playwright + TypeScript: Full-Stack Test Engineering"
                  className="w-full px-4 py-2.5 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-sm font-sans text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                  Curriculum Description <span className="text-[#EFFF4F]">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Comprehensive syllabus overview, target audience, prerequisites, and learning outcomes..."
                  className="w-full px-4 py-2.5 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-sm font-sans text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-xs font-mono text-white"
                  >
                    <option value="Automation Testing">Automation Testing</option>
                    <option value="Modern Web Testing">Modern Web Testing</option>
                    <option value="Performance">Performance</option>
                    <option value="Security">Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-xs font-mono text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                    Price (INR)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] focus:outline-none rounded-xl text-xs font-mono text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Content Tree Builder (Modules & Lessons) */}
          <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#3E3E43] pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#EFFF4F]" />
                <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                  2. Curriculum Content Tree ({modules.length} Modules)
                </h2>
              </div>
              <button
                type="button"
                onClick={addModule}
                className="px-3 py-1.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] hover:bg-[#EFFF4F]/20 font-mono text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Module</span>
              </button>
            </div>

            <div className="space-y-6">
              {modules.map((mod, modIdx) => (
                <div
                  key={mod.id}
                  className="p-5 bg-[#28282B] border border-[#3E3E43] rounded-xl space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={mod.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setModules((prev) =>
                          prev.map((m) => (m.id === mod.id ? { ...m, title: val } : m))
                        );
                      }}
                      className="flex-1 px-3 py-1.5 bg-[#333336] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-lg text-sm font-bold text-white font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => removeModule(mod.id)}
                      disabled={modules.length <= 1}
                      className="p-2 text-[#5A5F70] hover:text-red-400 disabled:opacity-30 transition-colors"
                      title="Remove Module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Lessons list */}
                  <div className="space-y-3 pl-3 border-l-2 border-[#3E3E43]">
                    <div className="text-[11px] font-mono text-[#5A5F70] uppercase font-bold">
                      Lessons & Learning Resources ({mod.lessons.length})
                    </div>

                    {mod.lessons.map((les) => (
                      <div
                        key={les.id}
                        className="p-3 bg-[#333336] border border-[#3E3E43] rounded-lg space-y-2 text-xs font-mono"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={les.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setModules((prev) =>
                                prev.map((m) =>
                                  m.id === mod.id
                                    ? {
                                        ...m,
                                        lessons: m.lessons.map((l) =>
                                          l.id === les.id ? { ...l, title: val } : l
                                        ),
                                      }
                                    : m
                                )
                              );
                            }}
                            placeholder="Lesson Title"
                            className="flex-1 px-3 py-1 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded text-white"
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={les.durationMinutes}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setModules((prev) =>
                                  prev.map((m) =>
                                    m.id === mod.id
                                      ? {
                                          ...m,
                                          lessons: m.lessons.map((l) =>
                                            l.id === les.id ? { ...l, durationMinutes: val } : l
                                          ),
                                        }
                                      : m
                                  )
                                );
                              }}
                              className="w-16 px-2 py-1 bg-[#28282B] border border-[#3E3E43] text-center text-white"
                              title="Minutes"
                            />
                            <span className="text-[#5A5F70]">min</span>
                            <button
                              type="button"
                              onClick={() => removeLesson(mod.id, les.id)}
                              disabled={mod.lessons.length <= 1}
                              className="p-1 text-[#5A5F70] hover:text-red-400 disabled:opacity-30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Media Links & Resources */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#28282B] border border-[#3E3E43] rounded">
                            <Video className="w-3.5 h-3.5 text-[#EFFF4F]" />
                            <input
                              type="text"
                              value={les.videoUrl}
                              onChange={(e) => {
                                const val = e.target.value;
                                setModules((prev) =>
                                  prev.map((m) =>
                                    m.id === mod.id
                                      ? {
                                          ...m,
                                          lessons: m.lessons.map((l) =>
                                            l.id === les.id ? { ...l, videoUrl: val } : l
                                          ),
                                        }
                                      : m
                                  )
                                );
                              }}
                              placeholder="Video URL (YouTube/Drive/MP4)"
                              className="w-full bg-transparent focus:outline-none text-white placeholder-[#5A5F70]"
                            />
                          </div>

                          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#28282B] border border-[#3E3E43] rounded">
                            <FileText className="w-3.5 h-3.5 text-[#06B6D4]" />
                            <input
                              type="text"
                              value={les.resourcePdfUrl}
                              onChange={(e) => {
                                const val = e.target.value;
                                setModules((prev) =>
                                  prev.map((m) =>
                                    m.id === mod.id
                                      ? {
                                          ...m,
                                          lessons: m.lessons.map((l) =>
                                            l.id === les.id ? { ...l, resourcePdfUrl: val } : l
                                          ),
                                        }
                                      : m
                                  )
                                );
                              }}
                              placeholder="Learning Resource Link (PDF/Code)"
                              className="w-full bg-transparent focus:outline-none text-white placeholder-[#5A5F70]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addLesson(mod.id)}
                      className="text-xs font-mono text-[#EFFF4F] hover:underline flex items-center gap-1 pt-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Lesson to {mod.title.split(":")[0]}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Assessment Quiz Builder */}
          <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#3E3E43] pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#EFFF4F]" />
                <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                  3. Assessment Quiz Engine ({questions.length} Questions)
                </h2>
              </div>
              <button
                type="button"
                onClick={addQuestion}
                className="px-3 py-1.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] hover:bg-[#EFFF4F]/20 font-mono text-xs font-bold uppercase rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-xs font-mono text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-[#A0A5B5] mb-1">
                  Passing Threshold Percentage (%)
                </label>
                <input
                  type="number"
                  value={passingThreshold}
                  onChange={(e) => setPassingThreshold(Number(e.target.value))}
                  min={50}
                  max={100}
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-xs font-mono text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="p-4 bg-[#28282B] border border-[#3E3E43] rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-[#EFFF4F] font-bold">
                      Q0{qIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={q.questionText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuestions((prev) =>
                          prev.map((item) => (item.id === q.id ? { ...item, questionText: val } : item))
                        );
                      }}
                      className="flex-1 px-3 py-1 bg-[#333336] border border-[#3E3E43] focus:border-[#EFFF4F] rounded text-xs font-sans text-white"
                      placeholder="Question prompt..."
                    />
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      disabled={questions.length <= 1}
                      className="p-1 text-[#5A5F70] hover:text-red-400 disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Options */}
                  <div className="space-y-1.5 pl-6 font-mono text-xs">
                    {q.options.map((opt) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctAnswer === opt.id}
                          onChange={() => {
                            setQuestions((prev) =>
                              prev.map((item) =>
                                item.id === q.id ? { ...item, correctAnswer: opt.id } : item
                              )
                            );
                          }}
                          className="accent-[#EFFF4F]"
                          title="Select as correct option"
                        />
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const val = e.target.value;
                            setQuestions((prev) =>
                              prev.map((item) =>
                                item.id === q.id
                                  ? {
                                      ...item,
                                      options: item.options.map((o) =>
                                        o.id === opt.id ? { ...o, text: val } : o
                                      ),
                                    }
                                  : item
                              )
                            );
                          }}
                          className="flex-1 px-2.5 py-1 bg-[#333336] border border-[#3E3E43] focus:border-[#EFFF4F] rounded text-white text-[11px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Certificate Rule */}
          <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-[#3E3E43] pb-3">
              <Award className="w-4 h-4 text-[#EFFF4F]" />
              <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                4. Certificate Rule & Issuance Policy
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <label className="block font-bold uppercase text-[#A0A5B5] mb-1">
                  Accredited Credential Title
                </label>
                <input
                  type="text"
                  value={certificateTitle}
                  onChange={(e) => setCertificateTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[#A0A5B5] mb-1">
                  Signatory Authority
                </label>
                <input
                  type="text"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#28282B] border border-[#3E3E43] focus:border-[#EFFF4F] rounded-xl text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between border-t border-[#3E3E43] pt-6 font-mono text-xs">
            <div className="text-[#A0A5B5]">
              Course will be submitted with status:{" "}
              <strong className="text-[#EFFF4F]">PENDING_APPROVAL</strong>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-xl shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting to Approval Queue...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Course for Approval</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
