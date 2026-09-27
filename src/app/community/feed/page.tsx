"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Bell,
  MessageCircle,
  Heart,
  Repeat,
  Gift,
  Bookmark,
  MoreHorizontal,
  Plus,
  Home,
  Compass,
  MessageSquare,
  User,
  Users,
  Flame,
  Newspaper,
  CheckCircle2,
  X,
  Send,
  Zap,
  ArrowRight,
  TrendingUp,
  Hash,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Post {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  spaceName: string;
  spaceIcon: string;
  role: "Member" | "Lead" | "Instructor";
  timeAgo: string;
  content: string;
  type: "MOCKUPS" | "MEDIA";
  mediaUrl?: string;
  mediaCount?: string;
  commentsCount: number;
  likesCount: number;
  repostsCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    authorName: "Pawpaw",
    authorHandle: "@/Pawpaw",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    spaceName: "Crack Designers",
    spaceIcon: "👥",
    role: "Member",
    timeAgo: "20m",
    content: "Clarity > Complexity",
    type: "MOCKUPS",
    commentsCount: 8,
    likesCount: 12,
    repostsCount: 2,
  },
  {
    id: "post-2",
    authorName: "Kanaan",
    authorHandle: "@/Kanaan_",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    spaceName: "GymMotivation",
    spaceIcon: "👥",
    role: "Member",
    timeAgo: "2hr",
    content: "Divine Timing...",
    type: "MEDIA",
    mediaUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    mediaCount: "1/3",
    commentsCount: 15,
    likesCount: 84,
    repostsCount: 6,
  },
  {
    id: "post-3",
    authorName: "Rahul Kamat",
    authorHandle: "@/RahulKamat",
    authorAvatar: "/instructor/rahul-kamat.png",
    spaceName: "Selenium Java + AI Architect",
    spaceIcon: "⚡",
    role: "Instructor",
    timeAgo: "4hr",
    content: "Live Automation Workshop starts this weekend! Check the architecture diagram below.",
    type: "MEDIA",
    mediaUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    commentsCount: 32,
    likesCount: 142,
    repostsCount: 19,
  },
];

const TRENDING_SPACES = [
  { name: "Selenium Frameworks", tag: "#selenium-frameworks", members: "1.4k members", icon: "⚡" },
  { name: "Crack Designers", tag: "#crack-designers", members: "840 members", icon: "🎨" },
  { name: "Playwright Architects", tag: "#playwright-architects", members: "920 members", icon: "🤖" },
  { name: "SDET Interview Prep", tag: "#interview-prep", members: "2.1k members", icon: "🎯" },
];

export default function CommunityFeedPage() {
  const [activeTab, setActiveTab] = useState<"FOR_YOU" | "TRENDING" | "COMMUNITIES" | "NEWS">("FOR_YOU");
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [userProfile, setUserProfile] = useState<{ avatar?: string; name?: string } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [askQuestion, setAskQuestion] = useState("");
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserProfile({
            name: user.user_metadata?.full_name || user.email?.split("@")[0],
            avatar: user.user_metadata?.avatar_url,
          });
        }
      } catch (e) {
        console.warn("Could not load user in community feed:", e);
      }
    }
    loadUser();
  }, []);

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  const handleToggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p
      )
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName: userProfile?.name || "Community Member",
      authorHandle: `@/${(userProfile?.name || "member").replace(/\s+/g, "").toLowerCase()}`,
      authorAvatar:
        userProfile?.avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      spaceName: "Crack Designers",
      spaceIcon: "👥",
      role: "Member",
      timeAgo: "Just now",
      content: newPostText,
      type: "MOCKUPS",
      commentsCount: 0,
      likesCount: 1,
      repostsCount: 0,
      isLiked: true,
    };

    setPosts([newPost, ...posts]);
    setNewPostText("");
    setShowCreateModal(false);
  };

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuestion.trim()) return;
    setAsking(true);
    setAskAnswer(null);

    setTimeout(() => {
      setAsking(false);
      setAskAnswer(
        `Based on community discussions in NextGen Academy, the recommended approach for "${askQuestion}" is to decouple test state with ThreadLocal patterns and leverage Playwright parallel workers.`
      );
    }, 1000);
  };

  const filteredPosts = posts.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.content.toLowerCase().includes(q) ||
        p.spaceName.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q)
      );
    }
    if (activeTab === "TRENDING") return p.likesCount > 20;
    if (activeTab === "COMMUNITIES") return p.spaceName.includes("Designers") || p.spaceName.includes("Architect");
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans text-white">
      {/* Page Header matching LMS standard style */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-bold text-[10px]">
              COMMUNITY SPACES
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">NEXTGEN ACADEMY FEED</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>COMMUNITY SPACES & FEED</span>
            <Zap className="w-8 h-8 text-[#EFFF4F] shrink-0" />
          </h1>
          <p className="text-sm text-[#A0A5B5] mt-2 max-w-2xl">
            Collaborate with peers, share framework designs, and discuss live SDET automation sessions in real-time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAskModalOpen(true)}
            className="px-4 py-2 border border-[#3E3E43] bg-[#333336] text-[#A0A5B5] hover:text-white hover:border-[#EFFF4F]/40 font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#EFFF4F]" />
            <span>Ask Space AI</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2 bg-[#EFFF4F] text-[#28282B] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-all shadow-lemon-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex border border-[#3E3E43] bg-[#333336] font-mono text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab("FOR_YOU")}
            className={`px-4 py-2 uppercase transition-colors shrink-0 ${
              activeTab === "FOR_YOU"
                ? "bg-[#EFFF4F] text-[#28282B]"
                : "text-[#A0A5B5] hover:bg-[#3E3E43]"
            }`}
          >
            FOR YOU
          </button>
          <button
            onClick={() => setActiveTab("TRENDING")}
            className={`px-4 py-2 uppercase border-l border-[#3E3E43] transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === "TRENDING"
                ? "bg-[#EFFF4F] text-[#28282B]"
                : "text-[#A0A5B5] hover:bg-[#3E3E43]"
            }`}
          >
            <span>TRENDING</span>
            <span>🔥</span>
          </button>
          <button
            onClick={() => setActiveTab("COMMUNITIES")}
            className={`px-4 py-2 uppercase border-l border-[#3E3E43] transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === "COMMUNITIES"
                ? "bg-[#EFFF4F] text-[#28282B]"
                : "text-[#A0A5B5] hover:bg-[#3E3E43]"
            }`}
          >
            <span>SPACES</span>
            <span>👥</span>
          </button>
          <button
            onClick={() => setActiveTab("NEWS")}
            className={`px-4 py-2 uppercase border-l border-[#3E3E43] transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === "NEWS"
                ? "bg-[#EFFF4F] text-[#28282B]"
                : "text-[#A0A5B5] hover:bg-[#3E3E43]"
            }`}
          >
            <span>NEWS</span>
            <span>📰</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#A0A5B5] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search spaces or posts..."
            className="w-full pl-9 pr-4 py-2 bg-[#202023] border border-[#3E3E43] text-xs text-white placeholder-[#5A5F70] focus:outline-none focus:border-[#EFFF4F]/50 transition-colors font-sans"
          />
        </div>
      </div>

      {/* Main 2-Column Content Grid: Feed (Left) + Spaces & Trending (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Feed Posts (spans 2 columns) */}
        <div className="lg:col-span-2 space-y-5">
          {filteredPosts.length === 0 ? (
            <div className="border border-[#3E3E43] bg-[#202023] p-12 text-center text-[#A0A5B5] font-mono text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#EFFF4F] mx-auto opacity-60" />
              <p className="text-white font-bold text-sm">No posts found</p>
              <p>Try searching for a different keyword or switch categories.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="border border-[#3E3E43] bg-[#202023] hover:border-[#EFFF4F]/30 p-5 sm:p-6 space-y-4 transition-all shadow-md"
              >
                {/* Post Header: Avatar, Handle, Space, Time, Member, Three dots */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#3E3E43] bg-neutral-800">
                      <Image
                        src={post.authorAvatar}
                        alt={post.authorName}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="font-bold text-white">
                          {post.authorHandle}
                        </span>
                        <span className="text-[#5A5F70]">›</span>
                        <span className="font-bold text-[#EFFF4F] flex items-center gap-1">
                          {post.spaceName} {post.spaceIcon}
                        </span>
                        <span className="text-[#5A5F70]">•</span>
                        <span className="text-[11px] text-[#A0A5B5] font-mono">
                          {post.timeAgo}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A5F70] font-semibold">
                        {post.role}
                      </span>
                    </div>
                  </div>

                  <button className="text-[#A0A5B5] hover:text-white transition-colors p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Post Content */}
                <p className="text-sm sm:text-base text-zinc-100 font-sans leading-relaxed">
                  {post.content}
                </p>

                {/* Post Visual: Mockups or Image */}
                {post.type === "MOCKUPS" ? (
                  /* Responsive Mockup Preview Cards */
                  <div className="w-full bg-[#18181C] border border-[#3E3E43] p-4 flex gap-4 overflow-x-auto no-scrollbar">
                    {/* Card 1: Green/Dark Theme "Own the Moments" */}
                    <div className="w-44 sm:w-52 bg-[#202026] border border-emerald-500/30 p-3.5 flex flex-col justify-between shrink-0 shadow-md">
                      <div className="flex items-center justify-between text-[9px] text-[#A0A5B5] font-mono">
                        <span>12:52</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                      <div className="my-4 text-center">
                        <div className="w-10 h-10 rounded-full mx-auto bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm font-bold mb-2">
                          ✦
                        </div>
                        <p className="text-xs font-bold text-white leading-tight">
                          Own the Moments.
                        </p>
                        <p className="text-[10px] text-[#A0A5B5]">Forever.</p>
                      </div>
                      <div className="w-full py-1.5 bg-white text-black text-[10px] font-bold uppercase rounded text-center">
                        Get Started
                      </div>
                    </div>

                    {/* Card 2: Red Neon NFT Card */}
                    <div className="w-44 sm:w-52 bg-[#26181C] border border-red-500/30 p-3.5 flex flex-col justify-between shrink-0 shadow-md">
                      <div className="flex items-center justify-between text-[9px] text-[#A0A5B5] font-mono">
                        <span>12:52</span>
                        <span className="text-[9px] text-red-400 font-bold">LIVE</span>
                      </div>
                      <div className="my-3 text-center">
                        <div className="w-11 h-11 rounded-full mx-auto bg-gradient-to-tr from-red-600 to-orange-500 p-0.5 mb-1.5 overflow-hidden">
                          <Image
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                            alt="Avatar"
                            width={44}
                            height={44}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <p className="text-xs font-bold text-white">43.2 ETH</p>
                        <p className="text-[10px] text-[#A0A5B5]">Floor Price</p>
                      </div>
                      <div className="w-full py-1.5 bg-red-500 text-white text-[10px] font-bold uppercase rounded text-center">
                        Follow
                      </div>
                    </div>

                    {/* Card 3: 3D Character Card */}
                    <div className="w-44 sm:w-52 bg-[#221C28] border border-purple-500/30 p-3.5 flex flex-col justify-between shrink-0 shadow-md">
                      <div className="flex items-center justify-between text-[9px] text-[#A0A5B5] font-mono">
                        <span>12:52</span>
                        <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                      </div>
                      <div className="my-3 text-center">
                        <div className="w-10 h-10 rounded-full mx-auto bg-purple-500/20 text-purple-300 flex items-center justify-center text-sm font-bold mb-2">
                          👾
                        </div>
                        <p className="text-xs font-bold text-white leading-tight">
                          Aliens Hope
                        </p>
                        <p className="text-[10px] text-[#A0A5B5]">Curated Pack</p>
                      </div>
                      <div className="w-full py-1.5 bg-white/20 text-white text-[10px] font-bold uppercase rounded text-center">
                        Invest Now
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Media preview */
                  <div className="relative w-full aspect-video border border-[#3E3E43] overflow-hidden bg-neutral-900">
                    {post.mediaUrl && (
                      <Image
                        src={post.mediaUrl}
                        alt="Post Media"
                        fill
                        className="object-cover"
                      />
                    )}
                    {post.mediaCount && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-md text-xs text-white font-mono border border-white/20">
                        {post.mediaCount}
                      </span>
                    )}
                  </div>
                )}

                {/* Interactive Action Row: Comments / Likes / Reposts / Gift / Bookmark */}
                <div className="flex items-center justify-between pt-2 border-t border-[#3E3E43] text-[#A0A5B5] text-xs font-mono">
                  <div className="flex items-center gap-5">
                    {/* Comments */}
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </button>

                    {/* Likes */}
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        post.isLiked
                          ? "text-red-400 font-bold"
                          : "hover:text-red-400"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          post.isLiked ? "fill-red-400 text-red-400" : ""
                        }`}
                      />
                      <span>{post.likesCount}</span>
                    </button>

                    {/* Repost */}
                    <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <Repeat className="w-4 h-4" />
                      <span>{post.repostsCount}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Gift */}
                    <button
                      title="Send reward"
                      className="p-1 hover:text-[#EFFF4F] transition-colors"
                    >
                      <Gift className="w-4 h-4" />
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={() => handleToggleBookmark(post.id)}
                      title="Save post"
                      className={`p-1 transition-colors ${
                        post.isBookmarked
                          ? "text-[#EFFF4F]"
                          : "hover:text-white"
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          post.isBookmarked ? "fill-[#EFFF4F]" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Spaces & AI Assistant Sidebar */}
        <div className="space-y-6">
          {/* Trending Spaces Card */}
          <div className="border border-[#3E3E43] bg-[#202023] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#3E3E43]">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#EFFF4F]" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Active Spaces
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#5A5F70]">LIVE</span>
            </div>

            <div className="space-y-3">
              {TRENDING_SPACES.map((space) => (
                <div
                  key={space.tag}
                  className="flex items-center justify-between p-2.5 bg-[#28282B] border border-[#3E3E43] hover:border-[#EFFF4F]/40 transition-colors cursor-pointer group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#EFFF4F] transition-colors">
                      <span>{space.icon}</span>
                      <span>{space.name}</span>
                    </div>
                    <p className="text-[10px] font-mono text-[#5A5F70]">
                      {space.members}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-[#EFFF4F] opacity-0 group-hover:opacity-100 transition-opacity">
                    Join →
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Assistant Card */}
          <div className="border border-[#3E3E43] bg-[#202023] p-5 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#3E3E43]">
              <Sparkles className="w-4 h-4 text-[#EFFF4F]" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Community Space AI
              </span>
            </div>
            <p className="text-xs text-[#A0A5B5] leading-relaxed">
              Have questions about TestNG, Selenium parallel execution, or CI/CD pipelines? Ask the community AI agent.
            </p>
            <button
              onClick={() => setAskModalOpen(true)}
              className="w-full py-2 border border-[#3E3E43] bg-[#28282B] text-white hover:border-[#EFFF4F]/40 hover:text-[#EFFF4F] font-mono text-xs font-bold uppercase transition-colors"
            >
              Ask Question ✨
            </button>
          </div>

          {/* Community Guidelines */}
          <div className="border border-[#3E3E43] bg-[#202023] p-5 space-y-2">
            <span className="font-mono text-[10px] text-[#5A5F70] uppercase tracking-wider block">
              TRIBE PROTOCOL
            </span>
            <p className="text-xs text-[#A0A5B5] leading-relaxed">
              1. Share reproducible code snippets.<br />
              2. Peer reviews earn +35 XP in Leaderboard.<br />
              3. Keep conversations respectful and high signal.
            </p>
          </div>
        </div>
      </div>

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#202023] border border-[#3E3E43] p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#3E3E43]">
              <span className="font-mono text-xs font-bold uppercase text-white tracking-wider">
                Create Space Post
              </span>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#A0A5B5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Share your framework architecture, test breakthrough, or question with the tribe..."
                rows={5}
                className="w-full bg-[#28282B] border border-[#3E3E43] p-3 text-sm text-white placeholder-[#5A5F70] focus:outline-none focus:border-[#EFFF4F]/50 font-sans"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-[#3E3E43] text-xs text-[#A0A5B5] hover:text-white font-mono uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#EFFF4F] text-[#28282B] font-mono text-xs font-bold uppercase hover:bg-[#EFFF4F]/90 transition-all flex items-center gap-1.5 shadow-lemon-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Post</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASK AI MODAL */}
      {askModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#202023] border border-[#3E3E43] p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#3E3E43]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#EFFF4F]" />
                <span className="font-mono text-xs font-bold uppercase text-white tracking-wider">
                  Ask Space AI
                </span>
              </div>
              <button
                onClick={() => setAskModalOpen(false)}
                className="text-[#A0A5B5] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAskAI} className="space-y-3 pt-1">
              <input
                type="text"
                value={askQuestion}
                onChange={(e) => setAskQuestion(e.target.value)}
                placeholder="Ask about Selenium, SDET, Playwright, or test architecture..."
                className="w-full bg-[#28282B] border border-[#3E3E43] px-4 py-2.5 text-xs text-white placeholder-[#5A5F70] focus:outline-none focus:border-[#EFFF4F]/50 font-sans"
              />
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={asking}
                  className="px-5 py-2 bg-[#EFFF4F] text-[#28282B] font-mono text-xs font-bold uppercase hover:bg-[#EFFF4F]/90 transition-all flex items-center gap-1.5 shadow-lemon-sm"
                >
                  {asking ? "Thinking..." : "Ask Community AI"}
                </button>
              </div>
            </form>
            {askAnswer && (
              <div className="mt-4 p-4 bg-[#28282B] border border-[#3E3E43] text-xs text-zinc-300 leading-relaxed font-sans">
                <div className="font-mono font-bold text-[#EFFF4F] mb-1.5 flex items-center gap-1 uppercase tracking-wider text-[11px]">
                  <span>✦ Community AI Response:</span>
                </div>
                {askAnswer}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
