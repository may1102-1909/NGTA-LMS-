"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { INITIAL_QUIZ, INITIAL_COURSES } from "@/lib/mockData";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  ArrowRight,
  RefreshCw,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function QuizAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;

  const course = INITIAL_COURSES.find((c) => c.id === courseId) || INITIAL_COURSES[0];
  const quiz = INITIAL_QUIZ;

  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [attemptCount, setAttemptCount] = useState(1);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const totalQuestions = quiz.questions.length;
  let correctCount = 0;
  quiz.questions.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctAnswer) {
      correctCount += 1;
    }
  });

  const percentageScore = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = percentageScore >= quiz.passingPercentage;
  const certificateId = `NGTA-CERT-${course.id}-2026-8910`;

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setAttemptCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#28282B] text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-[#3E3E43] pb-4 font-mono text-xs">
          <Link
            href={`/learn/${course.id}`}
            className="flex items-center gap-1 text-[#5A5F70] hover:text-[#EFFF4F] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>BACK TO PLAYER</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[#5A5F70]">ATTEMPT: {attemptCount}/{quiz.maxAttempts}</span>
            <span className="text-[#3E3E43]">|</span>
            <span className="flex items-center gap-1 text-[#EFFF4F] font-bold">
              <Clock className="w-3.5 h-3.5" /> {quiz.timeLimitMinutes} MIN PASSING BENCHMARK: {quiz.passingPercentage}%
            </span>
          </div>
        </div>

        {/* Assessment Header */}
        <div className="border border-[#3E3E43] bg-[#333336] p-6 shadow-card space-y-2">
          <div className="font-mono text-xs text-[#EFFF4F] uppercase tracking-widest">
            [EXAM // TECHNICAL EVALUATION]
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            {quiz.title}
          </h1>
          <p className="text-[#A0A5B5] text-xs sm:text-sm font-sans">
            Validating core SDET competency, W3C WebDriver architecture, and thread isolation principles for {course.title}.
          </p>
        </div>

        {/* Results Banner */}
        {isSubmitted && (
          <div
            className={`border p-6 shadow-card space-y-4 animate-in fade-in duration-200 ${
              isPassed
                ? "bg-[#EFFF4F]/5 border-[#EFFF4F]/30 text-[#EFFF4F]"
                : "bg-red-500/5 border-red-500/30 text-red-400"
            }`}
          >
            <div className="flex items-center gap-3">
              {isPassed ? (
                <CheckCircle2 className="w-8 h-8 text-[#EFFF4F]" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400" />
              )}
              <div>
                <h3 className="text-xl font-bold uppercase font-mono">
                  {isPassed ? "ASSESSMENT PASSED — COMPETENCY CERTIFIED" : "SCORE BELOW PASSING THRESHOLD"}
                </h3>
                <div className="font-mono text-xs mt-0.5 text-[#A0A5B5]">
                  FINAL SCORE: <strong className="text-white">{percentageScore}%</strong> ({correctCount} of {totalQuestions} correct) • REQUIRED: {quiz.passingPercentage}%
                </div>
              </div>
            </div>

            {isPassed ? (
              <div className="border-t border-[#3E3E43] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <span className="text-[#A0A5B5]">ACCREDITED CERTIFICATE ISSUED:</span>{" "}
                  <strong className="text-white">{certificateId}</strong>
                </div>
                <Link
                  href={`/verify?certId=${certificateId}`}
                  className="px-4 py-2.5 bg-[#EFFF4F] text-[#28282B] font-bold uppercase hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-1.5 shadow-lemon-sm"
                >
                  <Award className="w-4 h-4" />
                  <span>VIEW & VERIFY CREDENTIAL</span>
                </Link>
              </div>
            ) : (
              <div className="border-t border-[#3E3E43] pt-4 flex items-center justify-between font-mono text-xs">
                <span className="text-[#A0A5B5]">Please review lesson materials and try again.</span>
                <button
                  onClick={handleRetake}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 font-bold hover:bg-red-500/30 transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>RETAKE ASSESSMENT</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {quiz.questions.map((q, idx) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = isSubmitted && userAnswer === q.correctAnswer;
            const isWrong = isSubmitted && userAnswer && userAnswer !== q.correctAnswer;

            return (
              <div
                key={q.id}
                className="border border-[#3E3E43] bg-[#333336] p-6 space-y-4 shadow-card"
              >
                <div className="flex justify-between items-center font-mono text-xs text-[#5A5F70]">
                  <span>QUESTION 0{idx + 1} OF 0{totalQuestions}</span>
                  <span className="uppercase text-[10px] px-1.5 py-0.5 border border-[#3E3E43] text-[#A0A5B5]">
                    {q.type.replace("_", " ")}
                  </span>
                </div>

                <p className="text-base font-semibold text-white font-sans">
                  {q.questionText}
                </p>

                {/* Options Grid */}
                <div className="space-y-2 font-mono text-xs">
                  {q.options?.map((opt) => {
                    const isSelected = userAnswer === opt.id;
                    let optionStyle = "border-[#3E3E43] bg-[#28282B] text-[#A0A5B5] hover:border-[#EFFF4F]/30";

                    if (isSubmitted) {
                      if (opt.id === q.correctAnswer) {
                        optionStyle = "border-[#EFFF4F]/50 bg-[#EFFF4F]/10 text-[#EFFF4F] font-bold";
                      } else if (isSelected) {
                        optionStyle = "border-red-500/50 bg-red-500/10 text-red-400";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-[#EFFF4F]/50 bg-[#EFFF4F]/10 text-[#EFFF4F] font-bold";
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(q.id, opt.id)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-3 border transition-colors flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 flex items-center justify-center border border-current text-[10px]">
                            {isSelected ? "●" : ""}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submission */}
                {isSubmitted && (
                  <div className="p-3 bg-[#28282B] border border-[#3E3E43] text-xs text-[#A0A5B5] font-sans space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#5A5F70] block">
                      EXPLANATION:
                    </span>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit Bar */}
        {!isSubmitted && (
          <div className="border-t border-[#3E3E43] pt-6 flex justify-end">
            <button
              onClick={() => setIsSubmitted(true)}
              disabled={Object.keys(selectedAnswers).length < totalQuestions}
              className="px-8 py-3.5 bg-[#EFFF4F] text-[#28282B] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-colors shadow-lemon-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>SUBMIT ASSESSMENT ANSWERS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
