"use client";

import React, { useState } from "react";
import { ChallengeTask, INITIAL_CHALLENGE_TASKS } from "@/lib/gamification";
import { Terminal, Check, Square, ChevronDown, ChevronUp } from "lucide-react";

interface ChallengeStepLogProps {
  tasks?: ChallengeTask[];
  onTaskToggle?: (dayNumber: number) => void;
  maxVisible?: number;
  className?: string;
}

export default function ChallengeStepLog({
  tasks = INITIAL_CHALLENGE_TASKS,
  onTaskToggle,
  maxVisible = 10,
  className = "",
}: ChallengeStepLogProps) {
  const [taskList, setTaskList] = useState<ChallengeTask[]>(tasks);
  const [showAll, setShowAll] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ChallengeTask | null>(null);

  const completedCount = taskList.filter((t) => t.isCompleted).length;
  const totalCount = taskList.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  const handleToggle = (dayNumber: number) => {
    setTaskList((prev) =>
      prev.map((t) =>
        t.dayNumber === dayNumber
          ? {
              ...t,
              isCompleted: !t.isCompleted,
              completedAt: !t.isCompleted ? new Date().toISOString() : undefined,
            }
          : t
      )
    );

    if (onTaskToggle) {
      onTaskToggle(dayNumber);
    }
  };

  const displayedTasks = showAll ? taskList : taskList.slice(0, maxVisible);

  return (
    <div
      className={`border-2 border-zinc-900 bg-white p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4 font-mono ${className}`}
    >
      {/* CLI Header & Section Label */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-zinc-900 pb-3">
        <div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
            [30-DAY SDET CHALLENGE // BRD SECTION 23]
          </div>
          <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            <span>CLI CHALLENGE STEP-LOG</span>
          </h3>
        </div>

        {/* Progress Telemetry Counter */}
        <div className="text-right tabular-nums">
          <div className="text-xs font-bold text-zinc-900">
            {String(completedCount).padStart(2, "0")}/{String(totalCount).padStart(2, "0")} COMPLETED [{completionPercentage}%]
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold">
            {totalCount - completedCount} DAYS REMAINING
          </div>
        </div>
      </div>

      {/* Thin, segmented status-bar style progress indicators (not rounded pill bars) */}
      <div className="space-y-1">
        <div className="w-full h-2 bg-zinc-200 border border-zinc-900 flex overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => {
            const isFilled = i < completedCount;
            return (
              <div
                key={i}
                className={`flex-1 border-r border-zinc-900 last:border-r-0 transition-colors ${
                  isFilled ? "bg-blue-600" : "bg-zinc-200"
                }`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-[9px] text-zinc-500 tabular-nums">
          <span>DAY 01</span>
          <span>DAY 15</span>
          <span>DAY 30</span>
        </div>
      </div>

      {/* Vertical Terminal Checklist */}
      <div className="border border-zinc-900 bg-zinc-950 text-zinc-100 p-4 space-y-1.5 shadow-inner">
        <div className="text-[10px] text-zinc-500 border-b border-zinc-800 pb-2 mb-2 flex justify-between">
          <span>RUN: ngta challenge --track=sdet-30-days</span>
          <span>STATUS: EXECUTION_CADENCE</span>
        </div>

        <div className="space-y-1 max-h-72 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#52525b #18181b" }}>
          {displayedTasks.map((task) => {
            const dayFormatted = String(task.dayNumber).padStart(2, "0");
            const isDone = task.isCompleted;

            return (
              <div
                key={task.dayNumber}
                onClick={() => setSelectedTask(selectedTask?.dayNumber === task.dayNumber ? null : task)}
                className={`group flex items-start justify-between p-1.5 cursor-pointer hover:bg-zinc-900 transition-colors border-l-2 ${
                  isDone
                    ? "border-l-emerald-500 text-zinc-300"
                    : "border-l-zinc-700 text-zinc-400"
                }`}
              >
                {/* Format: "DAY 01 ▸ Install Java [✓]" */}
                <div className="flex items-baseline gap-2 truncate">
                  <span className="text-zinc-500 text-[11px] font-bold shrink-0">
                    DAY {dayFormatted}
                  </span>
                  <span className="text-blue-400 shrink-0">▸</span>
                  <span
                    className={`text-xs truncate ${
                      isDone ? "text-zinc-200" : "text-zinc-400"
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10px] text-zinc-500 tabular-nums">
                    +{task.pointsReward} PTS
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(task.dayNumber);
                    }}
                    className={`font-mono text-xs px-1 hover:text-white transition-colors ${
                      isDone ? "text-emerald-400 font-bold" : "text-zinc-600"
                    }`}
                    title={isDone ? "Mark as incomplete" : "Mark as completed"}
                  >
                    {isDone ? "[✓]" : "[ ]"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Task Command Snippet Inspection */}
        {selectedTask && (
          <div className="mt-3 p-2.5 bg-zinc-900 border border-zinc-700 text-[11px] space-y-1">
            <div className="text-zinc-400 font-bold uppercase text-[10px]">
              DAY {String(selectedTask.dayNumber).padStart(2, "0")} COMMAND & TELEMETRY:
            </div>
            <div className="font-mono text-emerald-400 bg-black/60 p-2 border border-zinc-800 break-all select-all">
              $ {selectedTask.commandSnippet || "javac -version && java Main"}
            </div>
          </div>
        )}
      </div>

      {/* Toggle View More/Less */}
      <div className="flex justify-between items-center text-xs pt-1">
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 hover:text-blue-800 font-bold uppercase flex items-center gap-1"
        >
          <span>
            {showAll
              ? "SHOW LESS (-20 DAYS)"
              : `VIEW FULL 30-DAY LOG (+${totalCount - maxVisible} DAYS)`}
          </span>
          {showAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <span className="text-[10px] text-zinc-400 uppercase">
          BRD §23 AUTONOMOUS CHALLENGE
        </span>
      </div>
    </div>
  );
}
