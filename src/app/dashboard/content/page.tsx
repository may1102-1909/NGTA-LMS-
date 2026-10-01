"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Video,
  FileCode,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  UploadCloud,
  FileText,
} from "lucide-react";

export default function ContentManagerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    ops: {
      totalPosts: number;
      totalEnrollments: number;
    };
  } | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setStats(data);
          }
        }
      } catch (err) {
        console.error("Failed to load content manager data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white font-sans">
      {/* Top Banner */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-bold text-[10px] rounded">
              CURRICULUM OPS
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">CONTENT MANAGER WORKSPACE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>Curriculum & Media Engine</span>
            <Layers className="w-6 h-6 text-[#06B6D4]" />
          </h1>
          <p className="text-xs sm:text-sm text-[#A0A5B5] mt-1">
            Author video lessons, manage syllabus modules, upload downloadable resources, and review publishing queues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#06B6D4] to-[#EFFF4F] text-white font-mono text-xs font-bold uppercase rounded-xl hover:brightness-110 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>View Public Storefront</span>
          </Link>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#5A5F70] text-xs font-mono">
            <span>FLAGSHIP COURSE</span>
            <FileCode className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="text-xl font-bold text-white font-mono truncate">
            Selenium Java + AI
          </div>
          <p className="text-[11px] text-[#A0A5B5]">10 Modules • 44 Sections</p>
        </div>

        <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#5A5F70] text-xs font-mono">
            <span>ACTIVE LEARNERS</span>
            <Database className="w-4 h-4 text-[#EFFF4F]" />
          </div>
          <div className="text-3xl font-black text-white font-mono">
            {loading ? "..." : (stats?.ops?.totalEnrollments ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#A0A5B5]">Consuming published content</p>
        </div>

        <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#5A5F70] text-xs font-mono">
            <span>COMMUNITY DISCUSSIONS</span>
            <FileText className="w-4 h-4 text-[#EFFF4F]" />
          </div>
          <div className="text-3xl font-black text-[#EFFF4F] font-mono">
            {loading ? "..." : (stats?.ops?.totalPosts ?? 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-[#A0A5B5]">Live peer technical posts</p>
        </div>

        <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#5A5F70] text-xs font-mono">
            <span>STREAM HEALTH</span>
            <Video className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPERATIONAL</span>
          </div>
          <p className="text-[11px] text-[#A0A5B5]">Adaptive HLS video playback</p>
        </div>
      </div>

      {/* Curriculum Module Sequencing Hub */}
      <div className="bg-[#333336] border border-[#3E3E43] rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#3E3E43] pb-4">
          <div>
            <h2 className="text-lg font-black uppercase text-white font-mono">
              Curriculum Module Publishing Status
            </h2>
            <p className="text-xs text-[#A0A5B5] mt-0.5">
              Live review of course units, self-healing test automation topics, and lesson materials.
            </p>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {[
            {
              mod: "Module 01",
              title: "Core Java & Automation Fundamentals",
              lessons: "12 Lessons • 3.5 Hrs",
              status: "PUBLISHED",
            },
            {
              mod: "Module 02",
              title: "Selenium 4 WebDriver Architecture & Locators",
              lessons: "15 Lessons • 4.2 Hrs",
              status: "PUBLISHED",
            },
            {
              mod: "Module 03",
              title: "Page Object Model (POM) & ThreadLocal Concurrency",
              lessons: "18 Lessons • 5.0 Hrs",
              status: "PUBLISHED",
            },
            {
              mod: "Module 04",
              title: "AI Test Automation & Self-Healing Locators",
              lessons: "10 Lessons • 3.8 Hrs",
              status: "PUBLISHED",
            },
            {
              mod: "Module 05",
              title: "Jenkins CI/CD Pipeline Automation & Cloud Execution",
              lessons: "14 Lessons • 4.5 Hrs",
              status: "PUBLISHED",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#28282B] border border-[#3E3E43] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#06B6D4] font-bold">{item.mod}</span>
                  <span className="text-[#5A5F70]">•</span>
                  <span className="text-white font-bold">{item.title}</span>
                </div>
                <div className="text-[11px] text-[#A0A5B5]">{item.lessons}</div>
              </div>

              <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
