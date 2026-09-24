"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Settings,
  User,
  Shield,
  Bell,
  Code,
  Save,
  CheckCircle2,
  Key,
  ExternalLink,
  Flame,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"PROFILE" | "PREFERENCES" | "SECURITY">("PROFILE");
  const [name, setName] = useState("Tanmay Sharma");
  const [handle, setHandle] = useState("tanmay.sdet");
  const [email, setEmail] = useState("tanmay.sharma@example.com");
  const [bio, setBio] = useState("Aspiring SDET & Test Automation Architect. Currently mastering Selenium 4, ThreadLocal parallel execution, and AI self-healing locators.");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-bold text-[10px]">
              ACCOUNT CONFIGURATION
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">STUDENT PROFILE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>SETTINGS & PROFILE</span>
            <Settings className="w-8 h-8 text-[#EFFF4F] shrink-0" />
          </h1>
          <p className="text-sm text-[#A0A5B5] mt-2 max-w-2xl">
            Manage your personal profile details, learning streak preferences, public registry verification handle, and notification options.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/dashboard"
            className="px-4 py-2 border border-[#3E3E43] bg-[#333336] text-[#A0A5B5] hover:text-[#EFFF4F] hover:border-[#EFFF4F]/40 font-bold uppercase transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border border-[#3E3E43] bg-[#333336] font-mono text-xs font-bold w-fit">
        <button
          onClick={() => setActiveTab("PROFILE")}
          className={`px-4 py-2 uppercase transition-colors flex items-center gap-2 ${
            activeTab === "PROFILE"
              ? "bg-[#EFFF4F] text-[#28282B]"
              : "text-[#A0A5B5] hover:bg-[#3E3E43]"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>PROFILE DETAILS</span>
        </button>
        <button
          onClick={() => setActiveTab("PREFERENCES")}
          className={`px-4 py-2 uppercase border-l border-[#3E3E43] transition-colors flex items-center gap-2 ${
            activeTab === "PREFERENCES"
              ? "bg-[#EFFF4F] text-[#28282B]"
              : "text-[#A0A5B5] hover:bg-[#3E3E43]"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>LEARNING PREFERENCES</span>
        </button>
        <button
          onClick={() => setActiveTab("SECURITY")}
          className={`px-4 py-2 uppercase border-l border-[#3E3E43] transition-colors flex items-center gap-2 ${
            activeTab === "SECURITY"
              ? "bg-[#EFFF4F] text-[#28282B]"
              : "text-[#A0A5B5] hover:bg-[#3E3E43]"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>SECURITY & INTEGRATIONS</span>
        </button>
      </div>

      {/* Tab 1: Profile Details */}
      {activeTab === "PROFILE" && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="border border-[#3E3E43] bg-[#333336] p-6 space-y-5 rounded-lg shadow-card font-mono text-xs">
            <div className="border-b border-[#3E3E43] pb-3 flex items-center justify-between">
              <h3 className="font-bold text-white uppercase text-sm">PERSONAL INFORMATION</h3>
              <span className="text-[10px] text-[#EFFF4F]">VERIFIED LEARNER</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-[#A0A5B5] uppercase block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#3E3E43] bg-[#28282B] text-white focus:outline-none focus:border-[#EFFF4F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-[#A0A5B5] uppercase block">Candidate Handle</label>
                <div className="flex">
                  <span className="px-3 py-2 border border-r-0 border-[#3E3E43] bg-[#202023] text-[#5A5F70]">@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#3E3E43] bg-[#28282B] text-white focus:outline-none focus:border-[#EFFF4F]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] text-[#A0A5B5] uppercase block">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-[#3E3E43] bg-[#28282B] text-white focus:outline-none focus:border-[#EFFF4F]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] text-[#A0A5B5] uppercase block">Bio & Learning Goals</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 border border-[#3E3E43] bg-[#28282B] text-white focus:outline-none focus:border-[#EFFF4F] font-sans text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {saved && (
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Changes saved successfully!</span>
                </div>
              )}
              {!saved && <div />}

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#EFFF4F] text-[#28282B] font-bold uppercase hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-1.5 shadow-lemon-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Preferences */}
      {activeTab === "PREFERENCES" && (
        <div className="border border-[#3E3E43] bg-[#333336] p-6 space-y-5 rounded-lg shadow-card font-mono text-xs">
          <div className="border-b border-[#3E3E43] pb-3">
            <h3 className="font-bold text-white uppercase text-sm">LEARNING CADENCE & NOTIFICATIONS</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-[#3E3E43] bg-[#28282B]">
              <div>
                <div className="font-bold text-white">Daily Streak Reminder</div>
                <div className="text-[11px] text-[#A0A5B5] font-sans">
                  Send reminder notification at 7:00 PM IST if no lesson completed.
                </div>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#EFFF4F] w-4 h-4 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-3 border border-[#3E3E43] bg-[#28282B]">
              <div>
                <div className="font-bold text-white">Live Workshop Alerts</div>
                <div className="text-[11px] text-[#A0A5B5] font-sans">
                  Receive email invites 1 hour before live weekend bootcamp sessions start.
                </div>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#EFFF4F] w-4 h-4 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-3 border border-[#3E3E43] bg-[#28282B]">
              <div>
                <div className="font-bold text-white">Community Discussion Mentions</div>
                <div className="text-[11px] text-[#A0A5B5] font-sans">
                  Notify when instructors or peers reply to your code review queries.
                </div>
              </div>
              <input type="checkbox" defaultChecked className="accent-[#EFFF4F] w-4 h-4 cursor-pointer" />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Integrations */}
      {activeTab === "SECURITY" && (
        <div className="border border-[#3E3E43] bg-[#333336] p-6 space-y-5 rounded-lg shadow-card font-mono text-xs">
          <div className="border-b border-[#3E3E43] pb-3">
            <h3 className="font-bold text-white uppercase text-sm">GITHUB & API INTEGRATIONS</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-[#3E3E43] bg-[#28282B] space-y-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <Code className="w-4 h-4 text-[#EFFF4F]" />
                <span>GitHub Personal Access Token (For Automated PR Grading)</span>
              </div>
              <input
                type="password"
                defaultValue="ghp_************************************"
                className="w-full px-3 py-2 border border-[#3E3E43] bg-[#202023] text-white focus:outline-none focus:border-[#EFFF4F]"
              />
              <p className="text-[11px] text-[#5A5F70] font-sans">
                Used strictly by the automated code grader to check test pass rates and report generator artifacts.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
