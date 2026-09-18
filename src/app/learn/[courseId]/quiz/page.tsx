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

  // Calculate score
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
    <div className="min-h-screen bg-zinc-950 text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 font-mono text-xs">
          <Link
            href={`/learn/${course.id}`}
            className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>BACK TO PLAYER</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-zinc-500">ATTEMPT: {attemptCount}/{quiz.maxAttempts}</span>
            <span className="text-zinc-500">|</span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Clock className="w-3.5 h-3.5" /> {quiz.timeLimitMinutes} MIN PASSING BENCHMARK: {quiz.passingPercentage}%
            </span>
          </div>
        </div>

        {/* Assessment Header (Swiss Typography) */}
        <div className="border-2 border-zinc-700 bg-zinc-900 p-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] space-y-2">
          <div className="font-mono text-xs text-blue-400 uppercase tracking-widest">
            [EXAM // TECHNICAL EVALUATION]
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            {quiz.title}
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm font-sans">
            Validating core SDET competency, W3C WebDriver architecture, and thread isolation principles for {course.title}.
          </p>
        </div>

        {/* Results Banner (shown on submission) */}
        {isSubmitted && (
          <div
            className={`border-2 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4 animate-in fade-in duration-200 ${
              isPassed
                ? "bg-emerald-950/80 border-emerald-500 text-emerald-100"
                : "bg-red-950/80 border-red-500 text-red-100"
            }`}
          >
            <div className="flex items-center gap-3">
              {isPassed ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400" />
              )}
              <div>
                <h3 className="text-xl font-bold uppercase font-mono">
                  {isPassed ? "ASSESSMENT PASSED — COMPETENCY CERTIFIED" : "SCORE BELOW PASSING THRESHOLD"}
                </h3>
                <div className="font-mono text-xs mt-0.5">
                  FINAL SCORE: <strong>{percentageScore}%</strong> ({correctCount} of {totalQuestions} correct) • REQUIRED: {quiz.passingPercentage}%
                </div>
              </div>
            </div>

            {isPassed ? (
              <div className="border-t border-emerald-700/60 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
                <div>
                  <span className="text-emerald-300">ACCREDITED CERTIFICATE ISSUED:</span>{" "}
                  <strong className="text-white">{certificateId}</strong>
                </div>
                <Link
                  href={`/verify?certId=${certificateId}`}
                  className="px-4 py-2.5 bg-emerald-500 text-zinc-950 font-bold uppercase hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Award className="w-4 h-4" />
                  <span>VIEW & VERIFY CREDENTIAL</span>
                </Link>
              </div>
            ) : (
              <div className="border-t border-red-700/60 pt-4 flex items-center justify-between font-mono text-xs">
                <span>Please review lesson materials and try again.</span>
                <button
                  onClick={handleRetake}
                  className="px-4 py-2 bg-red-800 text-white font-bold hover:bg-red-700 transition-colors flex items-center gap-1"
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
                className="border-2 border-zinc-800 bg-zinc-900 p-6 space-y-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex justify-between items-center font-mono text-xs text-zinc-500">
                  <span>QUESTION 0{idx + 1} OF 0{totalQuestions}</span>
                  <span className="uppercase text-[10px] px-1.5 py-0.5 border border-zinc-700 text-zinc-300">
                    {q.type.replace("_", " ")}
                  </span>
                </div>

                <p className="text-base font-semibold text-zinc-100 font-sans">
                  {q.questionText}
                </p>

                {/* Options Grid */}
                <div className="space-y-2 font-mono text-xs">
                  {q.options?.map((opt) => {
                    const isSelected = userAnswer === opt.id;
                    let optionStyle = "border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-500";

                    if (isSubmitted) {
                      if (opt.id === q.correctAnswer) {
                        optionStyle = "border-emerald-500 bg-emerald-950/50 text-emerald-200 font-bold";
                      } else if (isSelected) {
                        optionStyle = "border-red-500 bg-red-950/50 text-red-200";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-blue-500 bg-blue-950/40 text-blue-200 font-bold";
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
                  <div className="p-3 bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 font-sans space-y-1">
                    <span className="font-mono text-[10px] uppercase font-bold text-zinc-500 block">
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
          <div className="border-t-2 border-zinc-800 pt-6 flex justify-end">
            <button
              onClick={() => setIsSubmitted(true)}
              disabled={Object.keys(selectedAnswers).length < totalQuestions}
              className="px-8 py-3.5 bg-blue-600 text-white font-mono text-xs uppercase font-bold hover:bg-blue-500 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
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
