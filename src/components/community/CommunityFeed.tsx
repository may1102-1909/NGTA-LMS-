"use client";

import React, { useState } from "react";
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
  Code,
  Share2,
  Send,
  X,
  Play,
  Layers,
  Terminal,
  Cpu,
} from "lucide-react";

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

const INITIAL_FEED_POSTS: PostItem[] = [
  {
    id: "post-1",
    authorName: "Pawpaw",
    authorHandle: "@Pawpaw",
    authorAvatar: "/instructor/rahul-kamat.png",
    spaceName: "Crack Designers",
    spaceIcon: "👥",
    membershipStatus: "Member",
    timestamp: "20m",
    title: "Clarity > Complexity",
    type: "DEVICE_MOCKUPS",
    mockupData: {
      card1: {
        title: "Own the Moments. Forever.",
        subtitle: "A new generation of engineers building resilient automation frameworks.",
        tag: "Get Started",
      },
      card2: {
        title: "Live SDET Grid Runner",
        stat: "99.8% Pass",
        label: "4,029 Parallel Tests Executed",
      },
      card3: {
        title: "AI Self-Healing Engine",
        desc: "Autonomous locator adaptation with 0 manual flaky triage required.",
        badge: "Place Bid / Active",
      },
    },
    commentsCount: 8,
    likesCount: 12,
    repostsCount: 2,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "post-2",
    authorName: "Kanaan",
    authorHandle: "@Kanaan_",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    spaceName: "GymMotivation",
    spaceIcon: "👥",
    membershipStatus: "Member",
    timestamp: "2hr",
    title: "Divine Timing: Zero Flaky Tests in 10,000 Parallel Runs...",
    type: "MEDIA_GRID",
    content: "Consistency beats intensity every single time. Migrated our legacy Selenium Grid to ThreadLocal Playwright workers with auto-waiting. 10k tests executed in 14 minutes flat.",
    commentsCount: 24,
    likesCount: 89,
    repostsCount: 14,
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: "post-3",
    authorName: "Rahul Kamat",
    authorHandle: "@RahulKamat",
    authorAvatar: "/instructor/rahul-kamat.png",
    spaceName: "Playwright Masters",
    spaceIcon: "👥",
    membershipStatus: "Instructor",
    timestamp: "4hr",
    title: "Why Thread.sleep() Destroys Test Frameworks (and how to fix it with Smart Polling)",
    type: "CODE_SNIPPET",
    codeSnippet: {
      language: "typescript",
      filename: "smartWait.spec.ts",
      code: `// ❌ Avoid hardcoded thread blocking
// await page.waitForTimeout(5000);

// ✅ Use Web-First Auto-Waiting with Self-Healing assertions
await expect(page.getByRole("button", { name: "Execute Suite" }))
  .toBeVisible({ timeout: 10_000 });

await page.getByRole("button", { name: "Execute Suite" }).click();
await expect(page.locator(".sdet-status-badge")).toHaveText("VERIFIED");`,
    },
    commentsCount: 42,
    likesCount: 156,
    repostsCount: 31,
    isLiked: false,
    isBookmarked: false,
  },
];

export default function CommunityFeed() {
  const [posts, setPosts] = useState<PostItem[]>(INITIAL_FEED_POSTS);
  const [activeFilter, setActiveFilter] = useState("For you");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostSpace, setNewPostSpace] = useState("Playwright Masters");
  const [activeBottomTab, setActiveBottomTab] = useState("home");
  const [giftToast, setGiftToast] = useState<string | null>(null);

  const filters = [
    { label: "For you" },
    { label: "Trending", emoji: "🔥" },
    { label: "Communities", emoji: "👥" },
    { label: "News", emoji: "📰" },
    { label: "Playwright", emoji: "🎭" },
    { label: "DevOps", emoji: "⚡" },
  ];

  const handleToggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
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

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    const newPost: PostItem = {
      id: `post-${Date.now()}`,
      authorName: "Tanmay Sharma",
      authorHandle: "@tanmay.sdet",
      authorAvatar: "/instructor/rahul-kamat.png",
      spaceName: newPostSpace,
      spaceIcon: "👥",
      membershipStatus: "Member",
      timestamp: "Just now",
      title: newPostTitle,
      content: newPostContent,
      type: "MEDIA_GRID",
      commentsCount: 0,
      likesCount: 1,
      repostsCount: 0,
      isLiked: true,
      isBookmarked: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostContent("");
    setIsNewPostModalOpen(false);
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
    <div className="relative w-full max-w-2xl mx-auto pb-28 text-white font-sans">
      {/* Toast Notification */}
      {giftToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#EFFF4F] text-[#0A0A0C] font-mono text-xs font-bold px-4 py-2 rounded-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          {giftToast}
        </div>
      )}

      {/* Top Mobile-Styled App Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0A0A0C]/80 backdrop-blur-md sticky top-16 z-20">
        {/* Left: User Avatar with Online Dot */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-[#16161A]">
            <Image
              src="/instructor/rahul-kamat.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0A0A0C]" />
        </div>

        {/* Center: Sparkle Brand Emblem (Exact Match to Reference Screenshot) */}
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/10">
          <div className="w-6 h-6 text-black flex items-center justify-center font-black">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-black"
            >
              <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.627 12 12 0-6.627 5.627-12 12-12-6.627 0-12-5.627-12-12z" />
            </svg>
          </div>
        </div>

        {/* Right: Notifications with Red/White Badge */}
        <Link
          href="/notifications"
          className="relative p-2.5 rounded-full bg-[#18181C] text-white/80 hover:text-white hover:bg-[#222228] transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-white text-black font-mono font-bold text-[10px] rounded-full flex items-center justify-center shadow-sm">
            8
          </span>
        </Link>
      </div>

      {/* Header & Search Bar with Ask AI Button */}
      <div className="px-4 pt-4 pb-3 space-y-3">
        <div className="relative flex items-center bg-[#18181C] border border-white/5 rounded-full p-1 pl-4 shadow-inner focus-within:border-white/20 transition-all">
          <Search className="w-4 h-4 text-white/40 mr-2.5 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Spaces, Channels, or Discussions..."
            className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
          />

          {/* Ask AI Pill Action Button */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 transition-all font-medium text-xs shadow-md shrink-0 ml-2"
          >
            <span>Ask</span>
            <Sparkles className="w-3.5 h-3.5 fill-black" />
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
                    ? "bg-white text-black shadow-md font-semibold"
                    : "bg-[#18181C] text-white/70 hover:text-white hover:bg-[#222228] border border-white/5"
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
      <div className="divide-y divide-white/5 pt-2">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="p-4 sm:p-5 space-y-3.5 hover:bg-white/[0.015] transition-colors"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 bg-[#16161A] shrink-0">
                  <Image
                    src={post.authorAvatar}
                    alt={post.authorName}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                    <span className="font-semibold text-white/90">
                      {post.authorHandle}
                    </span>
                    <span className="text-white/40 text-xs">&gt;</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      {post.spaceName}
                      <span className="text-xs">{post.spaceIcon}</span>
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-white/40 text-xs font-mono">
                      {post.timestamp}
                    </span>
                  </div>

                  <div>
                    <span className="inline-block px-2 py-0.5 bg-[#1F1F24] text-white/60 text-[10px] rounded font-medium border border-white/5">
                      {post.membershipStatus}
                    </span>
                  </div>
                </div>
              </div>

              <button
                className="p-1.5 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-colors"
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
                {/* 3-Card Glassmorphic Mobile Mockup Grid matching Screenshot */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Card 1: Green Spotlight Theme */}
                  <div className="bg-gradient-to-b from-[#111A16] via-[#0E1311] to-[#0A0D0C] border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between min-h-[220px] shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="font-mono text-[10px]">12:52</span>
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    </div>

                    <div className="space-y-2 py-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center mx-auto text-xl">
                        🐒
                      </div>
                      <h4 className="text-center font-bold text-white text-xs leading-tight">
                        {post.mockupData.card1.title}
                      </h4>
                      <p className="text-[10px] text-white/50 text-center line-clamp-2">
                        {post.mockupData.card1.subtitle}
                      </p>
                    </div>

                    <button className="w-full py-1.5 rounded-full bg-white text-black font-semibold text-[11px] shadow-sm hover:bg-neutral-200 transition-colors">
                      {post.mockupData.card1.tag}
                    </button>
                  </div>

                  {/* Card 2: Red/Orange Hero Card */}
                  <div className="bg-gradient-to-b from-[#1E1111] via-[#140D0D] to-[#0C0808] border border-rose-500/20 rounded-2xl p-4 flex flex-col justify-between min-h-[220px] shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="font-mono text-[10px]">12:52</span>
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    </div>

                    <div className="space-y-2 py-3 text-center">
                      <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center mx-auto text-xl">
                        🎭
                      </div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono">
                        {post.mockupData.card2.title}
                      </div>
                      <div className="text-lg font-black text-rose-400 font-mono">
                        {post.mockupData.card2.stat}
                      </div>
                      <p className="text-[10px] text-white/60">
                        {post.mockupData.card2.label}
                      </p>
                    </div>

                    <button className="w-full py-1.5 rounded-full bg-rose-500 text-white font-semibold text-[11px] shadow-sm hover:bg-rose-600 transition-colors">
                      View Execution
                    </button>
                  </div>

                  {/* Card 3: Deep Dark NFT / SDET Agent Card */}
                  <div className="bg-gradient-to-b from-[#18181F] via-[#121217] to-[#0A0A0E] border border-indigo-500/20 rounded-2xl p-4 flex flex-col justify-between min-h-[220px] shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span className="font-mono text-[10px]">12:52</span>
                      <Heart className="w-3.5 h-3.5 text-white/40" />
                    </div>

                    <div className="space-y-2 py-3 text-center">
                      <div className="w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center mx-auto text-xl">
                        🤖
                      </div>
                      <h4 className="text-center font-bold text-white text-xs">
                        {post.mockupData.card3.title}
                      </h4>
                      <p className="text-[10px] text-white/50 leading-relaxed">
                        {post.mockupData.card3.desc}
                      </p>
                    </div>

                    <button className="w-full py-1.5 rounded-full bg-[#202028] text-white font-medium text-[11px] border border-white/10 hover:bg-[#282832] transition-colors">
                      {post.mockupData.card3.badge}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {post.type === "CODE_SNIPPET" && post.codeSnippet && (
              <div className="rounded-xl overflow-hidden border border-white/10 bg-[#121216] font-mono text-xs">
                <div className="flex items-center justify-between px-3 py-2 bg-[#18181E] border-b border-white/5 text-[11px] text-white/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-white/70">{post.codeSnippet.filename}</span>
                  </div>
                  <span className="uppercase text-[10px] text-[#EFFF4F]">
                    {post.codeSnippet.language}
                  </span>
                </div>
                <pre className="p-3.5 overflow-x-auto text-emerald-400 text-xs leading-relaxed">
                  <code>{post.codeSnippet.code}</code>
                </pre>
              </div>
            )}

            {post.content && (
              <p className="text-sm text-white/70 leading-relaxed font-sans">
                {post.content}
              </p>
            )}

            {/* Engagement Bar (Matching Screenshot UI/UX) */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Comments Pill */}
                <button
                  onClick={() => alert(`Opening comments for: ${post.title}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181C] hover:bg-[#222228] text-white/70 hover:text-white transition-colors border border-white/5"
                >
                  <MessageCircle className="w-4 h-4 text-white/60" />
                  <span className="font-mono text-xs font-semibold">
                    {post.commentsCount}
                  </span>
                </button>

                {/* Likes Pill */}
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors border ${
                    post.isLiked
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      : "bg-[#18181C] border-white/5 text-white/70 hover:text-white hover:bg-[#222228]"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      post.isLiked ? "fill-rose-500 text-rose-500" : "text-white/60"
                    }`}
                  />
                  <span className="font-mono text-xs font-semibold">
                    {post.likesCount}
                  </span>
                </button>

                {/* Reposts Pill */}
                <button
                  onClick={() => handleRepost(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181C] hover:bg-[#222228] text-white/70 hover:text-white transition-colors border border-white/5"
                >
                  <Repeat className="w-4 h-4 text-white/60" />
                  <span className="font-mono text-xs font-semibold">
                    {post.repostsCount}
                  </span>
                </button>
              </div>

              {/* Right Side: Gift / Tip & Bookmark */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => handleSendGift(post.title)}
                  className="p-2 rounded-full bg-[#18181C] hover:bg-[#222228] text-white/60 hover:text-[#EFFF4F] transition-colors border border-white/5"
                  title="Send gift / XP tip"
                  aria-label="Send gift"
                >
                  <Gift className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleToggleBookmark(post.id)}
                  className={`p-2 rounded-full transition-colors border ${
                    post.isBookmarked
                      ? "bg-[#EFFF4F]/10 border-[#EFFF4F]/30 text-[#EFFF4F]"
                      : "bg-[#18181C] border-white/5 text-white/60 hover:text-white hover:bg-[#222228]"
                  }`}
                  title="Bookmark post"
                  aria-label="Bookmark"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      post.isBookmarked ? "fill-[#EFFF4F]" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Floating Bottom Navigation Bar & Action Button (Matching Screenshot) */}
      <div className="fixed bottom-6 inset-x-0 z-40 pointer-events-none flex justify-center items-center px-4 max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between pointer-events-auto">
          <div className="flex-1" />

          {/* Central Glassmorphic Dock */}
          <nav className="flex items-center gap-1 px-3 py-2 rounded-full bg-[#1A1A1E]/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80">
            <button
              onClick={() => setActiveBottomTab("home")}
              className={`p-2.5 rounded-full transition-all ${
                activeBottomTab === "home"
                  ? "bg-white text-black shadow-md scale-105"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              aria-label="Home"
            >
              <Home className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveBottomTab("discover")}
              className={`p-2.5 rounded-full transition-all ${
                activeBottomTab === "discover"
                  ? "bg-white text-black shadow-md scale-105"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              aria-label="Discover"
            >
              <Compass className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveBottomTab("chat")}
              className={`p-2.5 rounded-full transition-all ${
                activeBottomTab === "chat"
                  ? "bg-white text-black shadow-md scale-105"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              aria-label="Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveBottomTab("profile")}
              className={`p-2.5 rounded-full transition-all ${
                activeBottomTab === "profile"
                  ? "bg-white text-black shadow-md scale-105"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </button>
          </nav>

          {/* Floating + Action Button (Exact Match to Screenshot) */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setIsNewPostModalOpen(true)}
              className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group pointer-events-auto"
              aria-label="Create Post"
            >
              <Plus className="w-6 h-6 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Ask AI Search Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141418] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#EFFF4F]/20 text-[#EFFF4F] flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Ask NGTA Community AI</h3>
                  <p className="text-[11px] text-white/50">Instant answers across discussions & spaces</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1.5 text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-[#1C1C22] rounded-xl text-white/70 border border-white/5">
                <span className="text-[#EFFF4F] font-bold block mb-1">Suggested Prompts:</span>
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
                  className="w-full px-4 py-2.5 bg-[#1C1C22] border border-white/10 rounded-xl text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-[#EFFF4F]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 font-mono text-xs">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 rounded-lg text-white/60 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert("AI Assistant searched 1,420 community threads!");
                  setIsAiModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-[#EFFF4F] text-[#0A0A0C] font-bold hover:bg-[#EFFF4F]/90 transition-colors shadow-lemon-sm"
              >
                Search Knowledge Base
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Post Modal */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#141418] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base">Create Space Discussion</h3>
              <button
                onClick={() => setIsNewPostModalOpen(false)}
                className="p-1.5 text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-[11px] text-white/60 font-mono uppercase">
                  Select Space
                </label>
                <select
                  value={newPostSpace}
                  onChange={(e) => setNewPostSpace(e.target.value)}
                  className="w-full px-3 py-2 bg-[#1C1C22] border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30"
                >
                  <option value="Playwright Masters">Playwright Masters 👥</option>
                  <option value="Crack Designers">Crack Designers 👥</option>
                  <option value="GymMotivation">GymMotivation 👥</option>
                  <option value="DevOps & Docker">DevOps & Docker ⚡</option>
                  <option value="Selenium Architects">Selenium Architects 🏛️</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-white/60 font-mono uppercase">
                  Post Headline
                </label>
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="e.g. Clarity > Complexity in Test Frameworks..."
                  required
                  className="w-full px-3 py-2 bg-[#1C1C22] border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-white/60 font-mono uppercase">
                  Discussion Content / Code Highlights
                </label>
                <textarea
                  rows={4}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share your framework architecture insights, code patterns, or challenges..."
                  className="w-full px-3 py-2 bg-[#1C1C22] border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setIsNewPostModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-colors shadow-md flex items-center gap-1.5"
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
