"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import CommunityHeaderNav, { SparkLogo } from "@/components/community/CommunityHeaderNav";
import MobileStatusBar from "@/components/community/MobileStatusBar";
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
    <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center">
      {/* Top 3-Page Switcher Bar */}
      <CommunityHeaderNav />

      {/* Main Container - Framed like reference Screen 3 */}
      <div className="w-full flex-1 flex items-center justify-center p-2 sm:p-6 lg:p-8">
        <div className="w-full max-w-[420px] min-h-[820px] max-h-[90vh] bg-[#121216] border border-white/10 rounded-[44px] shadow-2xl shadow-black/80 flex flex-col justify-between relative overflow-hidden">
          
          {/* Scrollable Feed Container */}
          <div className="w-full flex-1 overflow-y-auto custom-scrollbar pb-24">
            
            {/* 1. Mobile Status Bar */}
            <div className="sticky top-0 bg-[#121216]/95 backdrop-blur-md z-30 pt-1">
              <MobileStatusBar />

              {/* 2. Screen 3 Top Bar: Avatar + SparkLogo + Notification Bell */}
              <div className="flex items-center justify-between px-5 py-2.5">
                {/* User Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/20 bg-neutral-800">
                  <Image
                    src={
                      userProfile?.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    }
                    alt="User Profile"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Center SparkLogo */}
                <SparkLogo className="w-9 h-9" />

                {/* Right Bell with Badge 8 */}
                <Link
                  href="/notifications"
                  className="relative p-2 rounded-full bg-[#1C1C22] border border-white/10 text-white hover:text-[#EFFF4F] transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-black font-black text-[9px] rounded-full flex items-center justify-center shadow-sm">
                    8
                  </span>
                </Link>
              </div>

              {/* 3. Search Bar with "Ask ✨" AI Button */}
              <div className="px-5 py-2">
                <div className="flex items-center gap-2 px-3.5 py-2 bg-[#1C1C22] border border-white/10 rounded-2xl">
                  <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Spaces...."
                    className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <button
                    onClick={() => setAskModalOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium border border-white/15 transition-all shrink-0 active:scale-95"
                  >
                    <span>Ask</span>
                    <Sparkles className="w-3 h-3 text-[#EFFF4F]" />
                  </button>
                </div>
              </div>

              {/* 4. Category Filter Tabs: For you / Trending / Communities / News */}
              <div className="flex items-center gap-2 px-5 py-2 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab("FOR_YOU")}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    activeTab === "FOR_YOU"
                      ? "bg-white text-black shadow-md shadow-white/10"
                      : "bg-[#1C1C22] text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  For you
                </button>
                <button
                  onClick={() => setActiveTab("TRENDING")}
                  className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                    activeTab === "TRENDING"
                      ? "bg-white text-black shadow-md shadow-white/10"
                      : "bg-[#1C1C22] text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  <span>Trending</span>
                  <span>🔥</span>
                </button>
                <button
                  onClick={() => setActiveTab("COMMUNITIES")}
                  className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                    activeTab === "COMMUNITIES"
                      ? "bg-white text-black shadow-md shadow-white/10"
                      : "bg-[#1C1C22] text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  <span>Communities</span>
                  <span>👥</span>
                </button>
                <button
                  onClick={() => setActiveTab("NEWS")}
                  className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
                    activeTab === "NEWS"
                      ? "bg-white text-black shadow-md shadow-white/10"
                      : "bg-[#1C1C22] text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  <span>News</span>
                  <span>📰</span>
                </button>
              </div>
            </div>

            {/* 5. Feed Posts List */}
            <div className="px-5 pt-3 space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#18181E] border border-white/5 rounded-3xl p-4 space-y-3 shadow-lg"
                >
                  {/* Post Header: Avatar, Handle, Space, Time, Member, Three dots */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/15 bg-neutral-800">
                        <Image
                          src={post.authorAvatar}
                          alt={post.authorName}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-semibold text-white">
                            {post.authorHandle}
                          </span>
                          <span className="text-zinc-500">›</span>
                          <span className="font-bold text-white flex items-center gap-1">
                            {post.spaceName} {post.spaceIcon}
                          </span>
                          <span className="text-zinc-500">•</span>
                          <span className="text-[11px] text-zinc-400">
                            {post.timeAgo}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          {post.role}
                        </span>
                      </div>
                    </div>

                    <button className="text-zinc-500 hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <p className="text-xs sm:text-sm text-zinc-200 font-medium">
                    {post.content}
                  </p>

                  {/* Post Visual: Mockups or Image */}
                  {post.type === "MOCKUPS" ? (
                    /* 3 Device UI Mockup Cards (matching Screen 3) */
                    <div className="w-full bg-[#0E0E12] border border-white/10 rounded-2xl p-3 flex gap-2 overflow-x-auto no-scrollbar">
                      {/* Card 1: Green/Dark Theme "Own the Moments" */}
                      <div className="w-28 sm:w-32 bg-[#17171C] border border-emerald-500/20 rounded-xl p-2.5 flex flex-col justify-between shrink-0 shadow-md">
                        <div className="flex items-center justify-between text-[8px] text-zinc-400">
                          <span>12:52</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        </div>
                        <div className="my-3 text-center">
                          <div className="w-8 h-8 rounded-full mx-auto bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold mb-1">
                            ✦
                          </div>
                          <p className="text-[9px] font-bold text-white leading-tight">
                            Own the Moments.
                          </p>
                          <p className="text-[7px] text-zinc-400">Forever.</p>
                        </div>
                        <div className="w-full py-1 bg-white text-black text-[8px] font-bold rounded-full text-center">
                          Get Started
                        </div>
                      </div>

                      {/* Card 2: Red Neon NFT Card */}
                      <div className="w-28 sm:w-32 bg-[#1C1417] border border-red-500/20 rounded-xl p-2.5 flex flex-col justify-between shrink-0 shadow-md">
                        <div className="flex items-center justify-between text-[8px] text-zinc-400">
                          <span>12:52</span>
                          <span className="text-[7px] text-red-400 font-bold">LIVE</span>
                        </div>
                        <div className="my-2 text-center">
                          <div className="w-9 h-9 rounded-full mx-auto bg-gradient-to-tr from-red-600 to-orange-500 p-0.5 mb-1 overflow-hidden">
                            <Image
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                              alt="Avatar"
                              width={36}
                              height={36}
                              className="w-full h-full object-cover rounded-full"
                            />
                          </div>
                          <p className="text-[9px] font-bold text-white">43.2 ETH</p>
                          <p className="text-[7px] text-zinc-400">Floor Price</p>
                        </div>
                        <div className="w-full py-1 bg-red-500 text-white text-[8px] font-bold rounded-full text-center">
                          Follow
                        </div>
                      </div>

                      {/* Card 3: 3D Character Card */}
                      <div className="w-28 sm:w-32 bg-[#1A1820] border border-purple-500/20 rounded-xl p-2.5 flex flex-col justify-between shrink-0 shadow-md">
                        <div className="flex items-center justify-between text-[8px] text-zinc-400">
                          <span>12:52</span>
                          <Heart className="w-2.5 h-2.5 text-pink-400 fill-pink-400" />
                        </div>
                        <div className="my-2 text-center">
                          <div className="w-8 h-8 rounded-full mx-auto bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs font-bold mb-1">
                            👾
                          </div>
                          <p className="text-[8px] font-bold text-white leading-tight">
                            Aliens Hope
                          </p>
                          <p className="text-[7px] text-zinc-400">Curated Pack</p>
                        </div>
                        <div className="w-full py-1 bg-white/20 text-white text-[8px] font-bold rounded-full text-center">
                          Invest Now
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Image preview */
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
                      {post.mediaUrl && (
                        <Image
                          src={post.mediaUrl}
                          alt="Post Media"
                          fill
                          className="object-cover"
                        />
                      )}
                      {post.mediaCount && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-mono">
                          {post.mediaCount}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Interactive Action Row: Comments / Likes / Reposts / Gift / Bookmark */}
                  <div className="flex items-center justify-between pt-1 text-zinc-400 text-xs">
                    <div className="flex items-center gap-4">
                      {/* Comments */}
                      <button className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentsCount}</span>
                      </button>

                      {/* Likes (Interactive!) */}
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
                        className="hover:text-[#EFFF4F] transition-colors"
                      >
                        <Gift className="w-4 h-4" />
                      </button>

                      {/* Bookmark */}
                      <button
                        onClick={() => handleToggleBookmark(post.id)}
                        title="Save post"
                        className={`transition-colors ${
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
              ))}
            </div>

          </div>

          {/* 6. Floating Action Button (FAB) `+` */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="absolute bottom-20 right-5 z-20 w-12 h-12 rounded-full bg-white text-black shadow-2xl shadow-white/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            title="Create Post"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* 7. Floating Bottom Navigation Bar (Dock) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-[340px] bg-[#1E1E26]/95 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 flex items-center justify-between shadow-2xl">
            {/* Home (Active) */}
            <button className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-md">
              <Home className="w-4 h-4 fill-black" />
            </button>

            {/* Compass / Spaces */}
            <Link
              href="/community"
              className="text-zinc-400 hover:text-white p-2 transition-colors"
              title="Welcome Constellation"
            >
              <Compass className="w-5 h-5" />
            </Link>

            {/* Chat */}
            <button
              onClick={() => setAskModalOpen(true)}
              className="text-zinc-400 hover:text-white p-2 transition-colors"
              title="Community Q&A"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            {/* Profile */}
            <Link
              href="/profile"
              className="text-zinc-400 hover:text-white p-2 transition-colors"
              title="Your Profile"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </div>

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#16161C] border border-white/10 rounded-3xl p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-bold text-sm text-white">Create Space Post</span>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4 pt-3">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Share your breakthrough, design mockup, or question with the community..."
                rows={4}
                className="w-full bg-[#202028] border border-white/5 rounded-2xl p-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASK AI MODAL */}
      {askModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#16161C] border border-white/10 rounded-3xl p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#EFFF4F]" />
                <span className="font-bold text-sm text-white">Ask Space AI</span>
              </div>
              <button
                onClick={() => setAskModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAskAI} className="space-y-3 pt-3">
              <input
                type="text"
                value={askQuestion}
                onChange={(e) => setAskQuestion(e.target.value)}
                placeholder="Ask about Selenium, SDET, UI design, or live sessions..."
                className="w-full bg-[#202028] border border-white/5 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={asking}
                  className="px-5 py-2 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all flex items-center gap-1.5"
                >
                  {asking ? "Thinking..." : "Ask Community AI"}
                </button>
              </div>
            </form>
            {askAnswer && (
              <div className="mt-4 p-3.5 bg-[#202028] border border-white/10 rounded-2xl text-xs text-zinc-300 leading-relaxed">
                <div className="font-bold text-white mb-1 flex items-center gap-1">
                  <span>✦ Answer:</span>
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
