"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Sparkles,
  Zap,
  Globe,
  Lock,
  Layers,
  Award,
  RefreshCw,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import GamerPersona3D from "@/components/GamerPersona3D";
import { AVATAR_OPTIONS } from "@/lib/avatars";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"PROFILE" | "PREFERENCES" | "SECURITY">("PROFILE");
  const [name, setName] = useState("Alex Vance");
  const [handle, setHandle] = useState("alex_sdet");
  const [avatarUrl, setAvatarUrl] = useState("/avatars/avatar-1.png");
  const [email, setEmail] = useState("alex.vance@testingacademy.io");
  const [bio, setBio] = useState(
    "Automating complex distributed systems with Playwright, Selenium, and CI/CD pipelines. Zero-tolerance for flaky tests."
  );
  const [track, setTrack] = useState("Full-Stack SDET & Automation Architect");
  const [streakReminder, setStreakReminder] = useState(true);
  const [workshopAlerts, setWorkshopAlerts] = useState(true);
  const [communityMentions, setCommunityMentions] = useState(true);
  const [leaderboardVisible, setLeaderboardVisible] = useState(true);
  const [githubToken, setGithubToken] = useState("ghp_************************************");
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Load profile from Supabase & API
  useEffect(() => {
    async function loadStudentProfile() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) return;

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);
          if (user.email) setEmail(user.email);
          const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "";
          if (fullName) setName(fullName);

          const res = await fetch(`/api/student-profile?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data.profile) {
              if (data.profile.username) setHandle(data.profile.username);
              if (data.profile.avatar_url) setAvatarUrl(data.profile.avatar_url);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load student profile in settings:", err);
      }
    }

    loadStudentProfile();

    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        if (e.detail.username) setHandle(e.detail.username);
        if (e.detail.avatar_url) setAvatarUrl(e.detail.avatar_url);
      }
    };

    window.addEventListener("student-profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("student-profile-updated", handleProfileUpdate);
    };
  }, []);

  const handleAvatarChange = (newUrl: string) => {
    setAvatarUrl(newUrl);
    window.dispatchEvent(
      new CustomEvent("student-profile-updated", {
        detail: { avatar_url: newUrl, username: handle },
      })
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (userId) {
        await fetch("/api/student-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            username: handle,
            avatar_url: avatarUrl,
          }),
        });
      }
    } catch (err) {
      console.warn("Error persisting student profile:", err);
    } finally {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Top Breadcrumb & Page Header */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1.5 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-bold text-[10px] rounded">
              SYSTEM CONFIG // V2.4
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">STUDENT IDENTITY & GAMER PERSONA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>SETTINGS & PERSONA</span>
            <Settings className="w-7 h-7 text-[#EFFF4F] shrink-0 animate-spin-slow" />
          </h1>
          <p className="text-sm text-[#A0A5B5] mt-1.5 max-w-2xl font-sans">
            Customize your credentials, engineering track, and live 3D gamer persona. Changes sync across all SDET leaderboards, code reviews, and community channels.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/dashboard"
            className="px-4 py-2 border border-[#3E3E43] bg-[#28282B] text-[#A0A5B5] hover:text-[#EFFF4F] hover:border-[#EFFF4F]/40 font-bold uppercase transition-colors rounded-lg flex items-center gap-1.5 shadow-sm"
          >
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Account, Profile, and Preference Information (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Navigation Tabs */}
          <div className="flex border border-[#3E3E43] bg-[#222225] font-mono text-xs font-bold rounded-xl overflow-hidden w-fit shadow-md">
            <button
              onClick={() => setActiveTab("PROFILE")}
              className={`px-4 py-2.5 uppercase transition-all flex items-center gap-2 ${
                activeTab === "PROFILE"
                  ? "bg-[#EFFF4F] text-[#28282B] shadow-lemon-sm"
                  : "text-[#A0A5B5] hover:bg-[#2C2C30] hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>[01] IDENTITY & INFO</span>
            </button>
            <button
              onClick={() => setActiveTab("PREFERENCES")}
              className={`px-4 py-2.5 uppercase border-l border-[#3E3E43] transition-all flex items-center gap-2 ${
                activeTab === "PREFERENCES"
                  ? "bg-[#EFFF4F] text-[#28282B] shadow-lemon-sm"
                  : "text-[#A0A5B5] hover:bg-[#2C2C30] hover:text-white"
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>[02] CADENCE</span>
            </button>
            <button
              onClick={() => setActiveTab("SECURITY")}
              className={`px-4 py-2.5 uppercase border-l border-[#3E3E43] transition-all flex items-center gap-2 ${
                activeTab === "SECURITY"
                  ? "bg-[#EFFF4F] text-[#28282B] shadow-lemon-sm"
                  : "text-[#A0A5B5] hover:bg-[#2C2C30] hover:text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>[03] SECURITY & KEYS</span>
            </button>
          </div>

          {/* Tab 1: Profile & Identity */}
          {activeTab === "PROFILE" && (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Account Credentials Card */}
              <div className="border border-[#3E3E43] bg-[#222225] p-6 space-y-5 rounded-2xl shadow-card font-mono text-xs">
                <div className="border-b border-[#3E3E43] pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#EFFF4F]" />
                    <h2 className="font-bold text-white uppercase text-sm">PERSONAL INFORMATION</h2>
                  </div>
                  <span className="px-2 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] text-[10px] font-bold rounded">
                    VERIFIED CANDIDATE
                  </span>
                </div>

                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#A0A5B5] uppercase font-bold tracking-wider block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Vance"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#3E3E43] bg-[#1A1A1D] text-white focus:outline-none focus:border-[#EFFF4F] focus:ring-1 focus:ring-[#EFFF4F] font-sans text-sm transition-all"
                    />
                  </div>

                  {/* Candidate Handle */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-[#A0A5B5] uppercase font-bold tracking-wider block">
                      Candidate Handle
                    </label>
                    <div className="flex rounded-lg overflow-hidden border border-[#3E3E43] focus-within:border-[#EFFF4F] focus-within:ring-1 focus-within:ring-[#EFFF4F] transition-all">
                      <span className="px-3.5 py-2.5 bg-[#141416] text-[#EFFF4F] font-mono font-bold select-none border-r border-[#3E3E43]">
                        @
                      </span>
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                        placeholder="alex_sdet"
                        className="w-full px-3 py-2 bg-[#1A1A1D] text-white focus:outline-none font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] text-[#A0A5B5] uppercase font-bold tracking-wider block">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#3E3E43] bg-[#1A1A1D] text-white focus:outline-none focus:border-[#EFFF4F] font-mono text-xs"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                      </span>
                    </div>
                  </div>

                  {/* Track / Specialization */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-[10px] text-[#A0A5B5] uppercase font-bold tracking-wider block">
                      Specialization Track & Goal
                    </label>
                    <select
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#3E3E43] bg-[#1A1A1D] text-white focus:outline-none focus:border-[#EFFF4F] font-sans text-xs cursor-pointer"
                    >
                      <option value="Full-Stack SDET & Automation Architect">Full-Stack SDET & Automation Architect</option>
                      <option value="Playwright & Next.js End-to-End Testing">Playwright & Next.js End-to-End Testing</option>
                      <option value="Selenium Grid & ThreadSafe Java Systems">Selenium Grid & ThreadSafe Java Systems</option>
                      <option value="Performance & Security Penetration QA">Performance & Security Penetration QA</option>
                      <option value="AI-Driven Autonomous Test Generation">AI-Driven Autonomous Test Generation</option>
                    </select>
                  </div>

                  {/* Bio & Mission */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-[#A0A5B5] uppercase font-bold tracking-wider block">
                        Bio & Engineering Manifesto
                      </label>
                      <span className="text-[10px] text-[#5A5F70] font-mono">
                        {bio.length}/280
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={280}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Briefly describe your testing philosophy, stack, or target role..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#3E3E43] bg-[#1A1A1D] text-white focus:outline-none focus:border-[#EFFF4F] font-sans text-xs leading-relaxed"
                    />
                  </div>
                </div>

                {/* Quick Avatar Selector Strip */}
                <div className="pt-2 border-t border-[#3E3E43] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white uppercase text-xs block">
                        3D AVATAR SELECTION
                      </span>
                      <p className="text-[11px] text-[#A0A5B5] font-sans">
                        Choose your persona image to project into the 3D hologram stage.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent("open-student-onboarding"))}
                      className="text-[11px] text-[#EFFF4F] hover:underline font-mono uppercase font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Full Selector
                    </button>
                  </div>

                  <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                    {AVATAR_OPTIONS.slice(0, 9).map((opt) => {
                      const isSelected = avatarUrl === opt.url;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleAvatarChange(opt.url)}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                            isSelected
                              ? "border-[#EFFF4F] ring-2 ring-[#EFFF4F]/40 scale-105"
                              : "border-[#3E3E43] hover:border-white/50 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={opt.url}
                            alt={opt.label}
                            width={54}
                            height={54}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#EFFF4F] text-[#1E1E22] rounded-full flex items-center justify-center font-bold text-[8px]">
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form Actions & Save Button */}
                <div className="pt-4 border-t border-[#3E3E43] flex items-center justify-between">
                  {saved ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Changes saved & 3D persona synchronized!</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#5A5F70] font-mono">
                      * Updates stream immediately to right 3D viewport
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-[#EFFF4F] text-[#1E1E22] font-mono font-bold text-xs uppercase hover:bg-[#EFFF4F]/90 transition-all flex items-center gap-2 shadow-lemon-sm rounded-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isSaving ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Tab 2: Cadence & Preferences */}
          {activeTab === "PREFERENCES" && (
            <div className="border border-[#3E3E43] bg-[#222225] p-6 space-y-5 rounded-2xl shadow-card font-mono text-xs">
              <div className="border-b border-[#3E3E43] pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#EFFF4F]" />
                  <h2 className="font-bold text-white uppercase text-sm">LEARNING CADENCE & NOTIFICATIONS</h2>
                </div>
                <span className="text-[10px] text-[#A0A5B5]">COMMUNICATION PREFERENCES</span>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between p-4 rounded-xl border border-[#3E3E43] bg-[#1A1A1D] transition-colors hover:border-[#4E4E55]">
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#EFFF4F]" />
                      <span>Daily Streak Guardian</span>
                    </div>
                    <div className="text-[11px] text-[#A0A5B5] font-sans mt-0.5">
                      Receive an alert at 7:00 PM IST if you haven't solved your daily SDET test scenario.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={streakReminder}
                    onChange={(e) => setStreakReminder(e.target.checked)}
                    className="accent-[#EFFF4F] w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-[#3E3E43] bg-[#1A1A1D] transition-colors hover:border-[#4E4E55]">
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#EFFF4F]" />
                      <span>Live Workshop & Bootcamp Reminders</span>
                    </div>
                    <div className="text-[11px] text-[#A0A5B5] font-sans mt-0.5">
                      Receive calendar alerts 1 hour before weekend live debugging workshops start.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={workshopAlerts}
                    onChange={(e) => setWorkshopAlerts(e.target.checked)}
                    className="accent-[#EFFF4F] w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-[#3E3E43] bg-[#1A1A1D] transition-colors hover:border-[#4E4E55]">
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#EFFF4F]" />
                      <span>Public Leaderboard & Persona Visibility</span>
                    </div>
                    <div className="text-[11px] text-[#A0A5B5] font-sans mt-0.5">
                      Display your 3D persona, streak flame, and rank tier on the global cohort leaderboard.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={leaderboardVisible}
                    onChange={(e) => setLeaderboardVisible(e.target.checked)}
                    className="accent-[#EFFF4F] w-4 h-4 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-[#3E3E43] bg-[#1A1A1D] transition-colors hover:border-[#4E4E55]">
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#EFFF4F]" />
                      <span>Code Review & Peer Mentions</span>
                    </div>
                    <div className="text-[11px] text-[#A0A5B5] font-sans mt-0.5">
                      Notify whenever instructors or students tag your handle in automation PR critiques.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={communityMentions}
                    onChange={(e) => setCommunityMentions(e.target.checked)}
                    className="accent-[#EFFF4F] w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Security & Integrations */}
          {activeTab === "SECURITY" && (
            <div className="border border-[#3E3E43] bg-[#222225] p-6 space-y-5 rounded-2xl shadow-card font-mono text-xs">
              <div className="border-b border-[#3E3E43] pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#EFFF4F]" />
                  <h2 className="font-bold text-white uppercase text-sm">DEVELOPER & CI/CD CREDENTIALS</h2>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">256-BIT ENCRYPTED</span>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-[#3E3E43] bg-[#1A1A1D] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold">
                      <Code className="w-4 h-4 text-[#EFFF4F]" />
                      <span>GitHub Personal Access Token</span>
                    </div>
                    <span className="text-[10px] text-[#A0A5B5] uppercase">SCOPES: `repo:status`, `read:org`</span>
                  </div>

                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#3E3E43] bg-[#141416] text-white focus:outline-none focus:border-[#EFFF4F] font-mono text-xs"
                  />
                  <p className="text-[11px] text-[#5A5F70] font-sans leading-relaxed">
                    Used strictly by NGTA's Automated Grader to fetch your test repo commit SHA, run Selenium/Playwright suites inside isolated test containers, and publish test pass badges.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#3E3E43] bg-[#1A1A1D] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-white font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Supabase Multi-Factor Authentication (MFA)</span>
                    </div>
                    <p className="text-[11px] text-[#A0A5B5] font-sans">
                      Protect your test certifications and candidate registry status with Authenticator App 2FA.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-3.5 py-2 rounded-lg border border-[#3E3E43] bg-[#222225] text-[#EFFF4F] font-bold text-xs uppercase hover:border-[#EFFF4F]/50 transition-colors"
                  >
                    Configure
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: THE LIVE 3D GAMER PERSONA (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-4">
          <div className="border border-[#3E3E43] bg-[#222225] p-5 rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#EFFF4F]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3 border-b border-[#3E3E43] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#EFFF4F]" />
                <h2 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  LIVE 3D GAMER PERSONA
                </h2>
              </div>
              <span className="px-2 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-mono text-[9px] font-bold uppercase rounded">
                INTERACTIVE WEBGL
              </span>
            </div>

            <p className="text-xs text-[#A0A5B5] font-sans mb-4">
              Real-time 3D simulation with dynamic WebGL holographic core, mouse perspective tilt, and live telemetry synchronization.
            </p>

            {/* Embedded 3D Gamer Persona Component */}
            <GamerPersona3D
              name={name}
              handle={handle}
              email={email}
              avatarUrl={avatarUrl}
              bio={bio}
              onAvatarChange={handleAvatarChange}
              onHandleChange={(newHandle) => setHandle(newHandle)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
