"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
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
  Users,
  Flame,
  Newspaper,
  CheckCircle2,
  Code,
  Share2,
  Send,
  X,
  Play,
  Layers,
  Terminal,
  Cpu,
} from "lucide-react";

import { getCommunityFeed, createPost } from "@/app/actions/community";

interface PostItem {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  spaceName: string;
  spaceIcon: string;
  membershipStatus: "Member" | "Lead" | "Instructor";
  timestamp: string;
  title: string;
  content?: string;
  type: "DEVICE_MOCKUPS" | "CODE_SNIPPET" | "MEDIA_GRID";
  mockupData?: {
    card1: { title: string; subtitle: string; tag: string };
    card2: { title: string; stat: string; label: string };
    card3: { title: string; desc: string; badge: string };
  };
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
  commentsCount: number;
  likesCount: number;
  repostsCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export default function CommunityFeed() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState("For you");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostSpace, setNewPostSpace] = useState("Playwright Masters");
  const [giftToast, setGiftToast] = useState<string | null>(null);

  const filters = [
    { label: "For you" },
    { label: "Trending", emoji: "🔥" },
    { label: "Communities", emoji: "👥" },
    { label: "News", emoji: "📰" },
    { label: "Playwright", emoji: "🎭" },
    { label: "DevOps", emoji: "⚡" },
  ];

  const loadFeed = async () => {
    setIsLoading(true);
    try {
      const res = await getCommunityFeed();
      if (res && res.success && Array.isArray(res.posts)) {
        const mapped: PostItem[] = res.posts.map((p: any) => ({
          id: p.id,
          authorName: p.authorName,
          authorHandle: p.authorHandle,
          authorAvatar: p.authorAvatar || "/avatars/avatar-1.png",
          spaceName: p.spaceName,
          spaceIcon: p.spaceIcon || "👥",
          membershipStatus: p.role,
          timestamp: p.timeAgo,
          title: p.content ? (p.content.split("\n")[0] || "Community Discussion") : "Community Discussion",
          content: p.content,
          type: "MEDIA_GRID",
          commentsCount: p.commentsCount || 0,
          likesCount: p.likesCount || 0,
          repostsCount: p.repostsCount || 0,
          isLiked: p.isLiked,
          isBookmarked: false,
        }));
        setPosts(mapped);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error("Failed to load community feed:", err);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const handleToggleLike = async (id: string) => {
    const targetPost = posts.find((p) => p.id === id);
    if (!targetPost) return;
    const nextLikedState = !targetPost.isLiked;

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            isLiked: nextLikedState,
            likesCount: nextLikedState ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );

    // Persist to user_activities via Prisma API
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await fetch("/api/community/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: id,
          userId: user?.id,
          isLiked: nextLikedState,
        }),
      });
    } catch (err) {
      console.error("Failed to record POST_LIKED in user_activities:", err);
    }
  };

  const handleToggleBookmark = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          return { ...post, isBookmarked: !post.isBookmarked };
        }
        return post;
      })
    );
  };

  const handleRepost = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          return { ...post, repostsCount: post.repostsCount + 1 };
        }
        return post;
      })
    );
  };

  const handleSendGift = (postTitle: string) => {
    setGiftToast(`Tipped 50 XP Rep to "${postTitle.slice(0, 24)}..."! 🎁`);
    setTimeout(() => setGiftToast(null), 3500);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    try {
      const fullContent = newPostContent.trim()
        ? `${newPostTitle.trim()}\n\n${newPostContent.trim()}`
        : newPostTitle.trim();

      const res = await createPost(fullContent);
      if (res && res.success) {
        await loadFeed();
        setNewPostTitle("");
        setNewPostContent("");
        setIsNewPostModalOpen(false);
      } else {
        alert(res?.error || "Failed to publish post. Please sign in.");
      }
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.authorHandle.toLowerCase().includes(query) ||
      p.spaceName.toLowerCase().includes(query) ||
      (p.content && p.content.toLowerCase().includes(query))
    );
  });

  return (
    <div className="relative w-full max-w-2xl mx-auto pb-12 text-white font-sans">
      {/* Toast Notification */}
      {giftToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-mono text-xs font-bold px-4 py-2 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          {giftToast}
        </div>
      )}

      {/* Top Mobile-Styled App Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#26213B] bg-[#0C0A14]/80 backdrop-blur-md sticky top-16 z-20">
        {/* Left: User Avatar with Online Dot */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#26213B] bg-[#120F1D]">
            <Image
              src="/instructor/rahul-kamat.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0C0A14]" />
        </div>

        {/* Center: Sparkle Brand Emblem */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20">
          <div className="w-6 h-6 text-white flex items-center justify-center font-black">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-white"
            >
              <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.627 12 12 0-6.627 5.627-12 12-12-6.627 0-12-5.627-12-12z" />
            </svg>
          </div>
        </div>

        {/* Right: Notifications with Badge */}
        <Link
          href="/notifications"
          className="relative p-2.5 rounded-full bg-[#120F1D] text-[#94A3B8] hover:text-white hover:bg-[#1C172E] transition-colors border border-[#26213B]"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#8B5CF6] text-white font-mono font-bold text-[10px] rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(139,92,246,0.6)]">
            8
          </span>
        </Link>
      </div>

      {/* Header & Search Bar with Ask AI Button */}
      <div className="px-4 pt-4 pb-3 space-y-3">
        <div className="relative flex items-center bg-[#120F1D] border border-[#26213B] rounded-full p-1 pl-4 shadow-inner focus-within:border-[#8B5CF6]/50 transition-all">
          <Search className="w-4 h-4 text-[#64748B] mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Spaces, Channels, or Discussions..."
            className="w-full bg-transparent text-sm text-white placeholder:text-[#64748B] focus:outline-none"
          />

          {/* Ask AI Pill Action Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white hover:opacity-95 transition-all font-medium text-xs shadow-md shrink-0 ml-2"
          >
            <span>Ask</span>
            <Sparkles className="w-3.5 h-3.5 fill-white" />
          </button>
        </div>

        {/* Scrollable Horizontal Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-1 no-scrollbar text-xs">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.label;
            return (
              <button
                key={filter.label}
                onClick={() => setActiveFilter(filter.label)}
                className={`px-4 py-1.5 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#8B5CF6] text-white shadow-[0_0_12px_rgba(139,92,246,0.4)] font-semibold"
                    : "bg-[#120F1D] text-[#94A3B8] hover:text-white hover:bg-[#1C172E] border border-[#26213B]"
                }`}
              >
                <span>{filter.label}</span>
                {filter.emoji && <span>{filter.emoji}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed Cards List */}
      <div className="divide-y divide-[#26213B] pt-2">
        {isLoading ? (
          <div className="py-20 text-center text-[#94A3B8] font-mono text-xs flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
            Loading real community discussions...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center border border-[#26213B] rounded-2xl bg-[#120F1D]/50 backdrop-blur-sm p-8 my-4 mx-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] mb-3">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-white font-semibold text-base mb-1">No community discussions yet</h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto mb-4">
              Be the first to share an SDET framework tip, automation code snippet, or start a discussion.
            </p>
            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Start Discussion
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="p-4 sm:p-5 space-y-3.5 hover:bg-[#120F1D]/50 transition-colors"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#26213B] bg-[#120F1D] shrink-0">
                    <Image
                      src={post.authorAvatar}
                      alt={post.authorName}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <span className="font-semibold text-[#94A3B8]">
                      {post.authorHandle}
                    </span>
                    <span className="text-[#64748B] text-xs">&gt;</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      {post.spaceName}
                      <span className="text-xs">{post.spaceIcon}</span>
                    </span>
                    <span className="text-[#3A2E59]">•</span>
                    <span className="text-[#64748B] text-xs font-mono">
                      {post.timestamp}
                    </span>
                  </div>

                  <div>
                    <span className="inline-block px-2 py-0.5 bg-[#120F1D] text-[#94A3B8] text-[10px] rounded font-medium border border-[#26213B]">
                      {post.membershipStatus}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="p-1.5 text-[#64748B] hover:text-white hover:bg-[#1C172E] rounded-full transition-colors"
                aria-label="More options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Post Title */}
            <h2 className="text-base sm:text-lg font-semibold text-white/95 leading-snug">
              {post.title}
            </h2>

            {/* Post Body Content (Conditional Rendering for Mockup/Code/Text) */}
            {post.type === "DEVICE_MOCKUPS" && post.mockupData && (
              <div className="pt-1">
                {/* 3-Card Glassmorphic Mobile Mockup Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Card 1: Violet Spotlight Theme */}
                  <div className="bg-gradient-to-b from-[#1C172E] via-[#120F1D] to-[#0E0C17] border border-[#8B5CF6]/20 rounded-2xl p-4 flex flex-col justify-between min-h-[220px] shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                      <span className="font-mono text-[10px]">12:52</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
                    </div>

                    <div className="space-y-2 py-4">
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center mx-auto text-xl">
                        🐒
                      </div>
                      <h4 className="text-center font-bold text-white text-xs leading-tight">
                        {post.mockupData.card1.title}
                      </h4>
                      <p className="text-[10px] text-[#94A3B8] text-center line-clamp-2">
                        {post.mockupData.card1.subtitle}
                      </p>
                    </div>

                    <button className="w-full py-1.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-semibold text-[11px] shadow-sm hover:opacity-95 transition-colors">
                      {post.mockupData.card1.tag}
                    </button>
                  </div>

                  {/* Card 2: Cyan/Gold Hero Card */}
                  <div className="bg-gradient-to-b from-[#0E1A1D] via-[#0C1317] to-[#0A0D10] border border-[#06B6D4]/20 rounded-2xl p-4 flex flex-col justify-between min-h-[220px] shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-[#06B6D4]/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                      <span className="font-mono text-[10px]">12:52</span>
                      <Heart className="w-3.5 h-3.5 text-[#06B6D4] fill-[#06B6D4]" />
                    </div>

                    <div className="space-y-2 py-3 text-center">
                      <div className="w-12 h-12 rounded-xl bg-[#06B6D4]/15 border border-[#06B6D4]/30 flex items-center justify-center mx-auto text-xl">
                        🎭
                      </div>
                      <div className="text-[10px] text-[#64748B] uppercase tracking-widest font-mono">
                        {post.mockupData.card2.title}
                      </div>
                      <div className="text-lg font-black text-[#06B6D4] font-mono">
                        {post.mockupData.card2.stat}
                      </div>
                      <p className="text-[10px] text-[#94A3B8]">
                        {post.mockupData.card2.label}
                      </p>
                    </div>

                    <button className="w-full py-1.5 rounded-full bg-[#06B6D4] text-white font-semibold text-[11px] shadow-sm hover:bg-[#06B6D4]/90 transition-colors">
                      View Execution
                    </button>
                  </div>

                  {/* Card 3: Deep Dark SDET Agent Card */}
                  <div className="bg-gradient-to-b from-[#161326] via-[#120F1D] to-[#0C0A14] border border-[#D946EF]/20 rounded-2xl p-4 flex flex-col justify-between min-h-[220px] shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs text-[#94A3B8]">
                      <span className="font-mono text-[10px]">12:52</span>
                      <Heart className="w-3.5 h-3.5 text-[#64748B]" />
                    </div>

                    <div className="space-y-2 py-3 text-center">
                      <div className="w-12 h-12 rounded-xl bg-[#D946EF]/15 border border-[#D946EF]/30 flex items-center justify-center mx-auto text-xl">
                        🤖
                      </div>
                      <h4 className="text-center font-bold text-white text-xs">
                        {post.mockupData.card3.title}
                      </h4>
                      <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                        {post.mockupData.card3.desc}
                      </p>
                    </div>

                    <button className="w-full py-1.5 rounded-full bg-[#1C172E] text-white font-medium text-[11px] border border-[#26213B] hover:bg-[#26213B] transition-colors">
                      {post.mockupData.card3.badge}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {post.type === "CODE_SNIPPET" && post.codeSnippet && (
              <div className="rounded-xl overflow-hidden border border-[#26213B] bg-[#0E0C17] font-mono text-xs">
                <div className="flex items-center justify-between px-3 py-2 bg-[#120F1D] border-b border-[#26213B] text-[11px] text-[#94A3B8]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-[#94A3B8]">{post.codeSnippet.filename}</span>
                  </div>
                  <span className="uppercase text-[10px] text-[#C084FC]">
                    {post.codeSnippet.language}
                  </span>
                </div>
                <pre className="p-3.5 overflow-x-auto text-[#06B6D4] text-xs leading-relaxed">
                  <code>{post.codeSnippet.code}</code>
                </pre>
              </div>
            )}

            {post.content && (
              <p className="text-sm text-[#94A3B8] leading-relaxed font-sans">
                {post.content}
              </p>
            )}

            {/* Engagement Bar */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Comments Pill */}
                <button
                  onClick={() => alert(`Opening comments for: ${post.title}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#120F1D] hover:bg-[#1C172E] text-[#94A3B8] hover:text-white transition-colors border border-[#26213B]"
                >
                  <MessageCircle className="w-4 h-4 text-[#64748B]" />
                  <span className="font-mono text-xs font-semibold">
                    {post.commentsCount}
                  </span>
                </button>

                {/* Likes Pill */}
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors border ${
                    post.isLiked
                      ? "bg-[#D946EF]/10 border-[#D946EF]/30 text-[#D946EF]"
                      : "bg-[#120F1D] border-[#26213B] text-[#94A3B8] hover:text-white hover:bg-[#1C172E]"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      post.isLiked ? "fill-[#D946EF] text-[#D946EF]" : "text-[#64748B]"
                    }`}
                  />
                  <span className="font-mono text-xs font-semibold">
                    {post.likesCount}
                  </span>
                </button>

                {/* Reposts Pill */}
                <button
                  onClick={() => handleRepost(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#120F1D] hover:bg-[#1C172E] text-[#94A3B8] hover:text-white transition-colors border border-[#26213B]"
                >
                  <Repeat className="w-4 h-4 text-[#64748B]" />
                  <span className="font-mono text-xs font-semibold">
                    {post.repostsCount}
                  </span>
                </button>
              </div>

              {/* Right Side: Gift / Tip & Bookmark */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => handleSendGift(post.title)}
                  className="p-2 rounded-full bg-[#120F1D] hover:bg-[#1C172E] text-[#64748B] hover:text-[#F59E0B] transition-colors border border-[#26213B]"
                  title="Send gift / XP tip"
                  aria-label="Send gift"
                >
                  <Gift className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleToggleBookmark(post.id)}
                  className={`p-2 rounded-full transition-colors border ${
                    post.isBookmarked
                      ? "bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#C084FC]"
                      : "bg-[#120F1D] border-[#26213B] text-[#64748B] hover:text-white hover:bg-[#1C172E]"
                  }`}
                  title="Bookmark post"
                  aria-label="Bookmark"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      post.isBookmarked ? "fill-[#C084FC]" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </article>
        )))}
      </div>

      {/* Ask AI Search Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#08070D]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#120F1D] border border-[#26213B] rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#26213B] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/20 text-[#C084FC] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Ask NGTA Community AI</h3>
                  <p className="text-[11px] text-[#64748B]">Instant answers across discussions & spaces</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#0E0C17] rounded-xl text-[#94A3B8] border border-[#26213B]">
                <span className="text-[#C084FC] font-bold block mb-1">Suggested Prompts:</span>
                <ul className="space-y-1 text-[11px]">
                  <li className="hover:text-white cursor-pointer">• How do I setup ThreadLocal WebDriver with TestNG?</li>
                  <li className="hover:text-white cursor-pointer">• What is the difference between Playwright auto-waiting & explicit wait?</li>
                  <li className="hover:text-white cursor-pointer">• Best practices for CI/CD test reporting in GitHub Actions</li>
                </ul>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask any automation architecture question..."
                  className="w-full px-4 py-2.5 bg-[#0E0C17] border border-[#26213B] rounded-xl text-white placeholder:text-[#64748B] text-xs focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 font-mono text-xs">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 rounded-lg text-[#94A3B8] hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert("AI Assistant searched 1,420 community threads!");
                  setIsAiModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-bold hover:opacity-95 transition-colors shadow-rune-purple"
              >
                Search Knowledge Base
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Post Modal */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#08070D]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#120F1D] border border-[#26213B] rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#26213B] pb-3">
              <h3 className="font-bold text-white text-base">Create Space Discussion</h3>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1.5 text-[#64748B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-[11px] text-[#94A3B8] font-mono uppercase">
                  Select Space
                </label>
                <select
                  value={newPostSpace}
                  onChange={(e) => setNewPostSpace(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E0C17] border border-[#26213B] rounded-lg text-white focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="Playwright Masters">Playwright Masters 👥</option>
                  <option value="Crack Designers">Crack Designers 👥</option>
                  <option value="GymMotivation">GymMotivation 👥</option>
                  <option value="DevOps & Docker">DevOps & Docker ⚡</option>
                  <option value="Selenium Architects">Selenium Architects 🏛️</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#94A3B8] font-mono uppercase">
                  Post Headline
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. Clarity > Complexity in Test Frameworks..."
                  required
                  className="w-full px-3 py-2 bg-[#0E0C17] border border-[#26213B] rounded-lg text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#8B5CF6] text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#94A3B8] font-mono uppercase">
                  Discussion Content / Code Highlights
                </label>
                <textarea
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your framework architecture insights, code patterns, or challenges..."
                  className="w-full px-3 py-2 bg-[#0E0C17] border border-[#26213B] rounded-lg text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#8B5CF6] font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white font-bold hover:opacity-95 transition-colors shadow-rune-purple flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to Space</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
