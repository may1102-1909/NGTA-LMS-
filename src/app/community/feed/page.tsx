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
  Loader2,
  CornerDownRight,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface CommentItem {
  id: string;
  postId: string;
  content: string;
  createdAt: string;
  author: {
    id?: string;
    name: string;
    avatar: string | null;
    role?: string;
  };
}

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
    commentsCount: 2,
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
    commentsCount: 1,
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
    commentsCount: 3,
    likesCount: 142,
    repostsCount: 19,
  },
];

const INITIAL_SEED_COMMENTS: Record<string, CommentItem[]> = {
  "post-1": [
    {
      id: "seed-1",
      postId: "post-1",
      content: "Simplicity is the ultimate sophistication. Clean token system here!",
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      author: {
        name: "Rahul Kamat",
        avatar: "/instructor/rahul-kamat.png",
      },
    },
    {
      id: "seed-2",
      postId: "post-1",
      content: "Love the high contrast dark mode aesthetics.",
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      author: {
        name: "Sarah Jenkins",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      },
    },
  ],
  "post-2": [
    {
      id: "seed-3",
      postId: "post-2",
      content: "Consistency beats intensity every single day. Keep crushing it!",
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      author: {
        name: "Devon Miles",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      },
    },
  ],
  "post-3": [
    {
      id: "seed-4",
      postId: "post-3",
      content: "Will the recording be available in the LMS portal after the live stream?",
      createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      author: {
        name: "Tanmay Sharma",
        avatar: null,
      },
    },
  ],
};

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
  const [userProfile, setUserProfile] = useState<{ id?: string; email?: string; name?: string; avatar?: string } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [askQuestion, setAskQuestion] = useState("");
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);

  // Comments state
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [postComments, setPostComments] = useState<Record<string, CommentItem[]>>(INITIAL_SEED_COMMENTS);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadUserAndLikes() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        let currentUserId = user?.id;
        if (user) {
          setUserProfile({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split("@")[0],
            avatar: user.user_metadata?.avatar_url,
          });
        }

        // Fetch persisted likes from Supabase database user_activities table via API
        const likesRes = await fetch(`/api/community/likes${currentUserId ? `?userId=${currentUserId}` : ""}`);
        if (likesRes.ok) {
          const likesData = await likesRes.json();
          if (likesData?.likedPostIds && Array.isArray(likesData.likedPostIds)) {
            const likedSet = new Set(likesData.likedPostIds);
            setPosts((prev) =>
              prev.map((p) => ({
                ...p,
                isLiked: likedSet.has(p.id) || p.isLiked,
              }))
            );
          }
        }
        // Fetch student custom persona & username if enrolled as STUDENT
        const studentRes = await fetch(`/api/student-profile${currentUserId ? `?userId=${currentUserId}` : ""}`);
        if (studentRes.ok) {
          const studentData = await studentRes.json();
          if (studentData?.profile) {
            setUserProfile((prev) => ({
              ...prev,
              name: studentData.profile.username,
              avatar: studentData.profile.avatar_url,
              role: "Student",
            }));
          }
        }
      } catch (e) {
        console.warn("Could not load user/likes in community feed:", e);
      }
    }
    loadUserAndLikes();

    // Listen to real-time persona updates from onboarding modal
    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        setUserProfile((prev) => ({
          ...prev,
          name: e.detail.username,
          avatar: e.detail.avatar_url,
          role: "Student",
        }));
      }
    };
    window.addEventListener("student-profile-updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("student-profile-updated", handleProfileUpdate);
    };
  }, []);

  // Fetch comments for a specific post
  const fetchCommentsForPost = async (postId: string) => {
    try {
      setLoadingComments((prev) => ({ ...prev, [postId]: true }));
      const res = await fetch(`/api/community/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.comments)) {
          setPostComments((prev) => {
            const seed = INITIAL_SEED_COMMENTS[postId] || [];
            // Merge seed and database comments uniquely by id
            const existingIds = new Set(data.comments.map((c: CommentItem) => c.id));
            const filteredSeed = seed.filter((s) => !existingIds.has(s.id));
            return {
              ...prev,
              [postId]: [...filteredSeed, ...data.comments],
            };
          });
        }
      }
    } catch (err) {
      console.warn(`Error fetching comments for ${postId}:`, err);
    } finally {
      setLoadingComments((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Toggle comments drawer for a post
  const handleToggleComments = (postId: string) => {
    const isNowExpanded = !expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: isNowExpanded }));
    if (isNowExpanded) {
      fetchCommentsForPost(postId);
    }
  };

  // Save like to Supabase user_activities table
  const handleToggleLike = async (postId: string) => {
    // 1. Optimistic UI update
    let newLikedState = false;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          newLikedState = !p.isLiked;
          return {
            ...p,
            isLiked: newLikedState,
            likesCount: newLikedState ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );

    // 2. Persist to Supabase database user_activities table
    try {
      const res = await fetch("/api/community/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          userId: userProfile?.id,
          userEmail: userProfile?.email,
          userName: userProfile?.name,
          isLiked: newLikedState,
        }),
      });

      if (!res.ok) {
        console.warn("Non-ok response from /api/community/likes");
      }
    } catch (err) {
      console.error("Error saving like to Supabase user_activities:", err);
    }
  };

  // Submit comment to Supabase comments table
  const handleSubmitComment = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    try {
      setSubmittingComment((prev) => ({ ...prev, [postId]: true }));

      const res = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          content: commentText,
          userId: userProfile?.id,
          userEmail: userProfile?.email,
          userName: userProfile?.name,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to post comment");
      }

      // Add newly saved comment to local state
      const createdComment: CommentItem = data.comment;
      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), createdComment],
      }));

      // Increment commentsCount in post
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
        )
      );

      // Clear input
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err: any) {
      console.error("Error submitting comment:", err);
      alert(err.message || "Failed to submit comment. Please ensure you are logged in.");
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
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
      authorName: userProfile?.name || "Student",
      authorHandle: `@/${(userProfile?.name || "student").replace(/\s+/g, "").toLowerCase()}`,
      authorAvatar:
        userProfile?.avatar ||
        "/avatars/avatar-1.png",
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

    // Also persist like for author's own new post in user_activities
    fetch("/api/community/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: newPost.id,
        userId: userProfile?.id,
        userEmail: userProfile?.email,
        userName: userProfile?.name,
        isLiked: true,
      }),
    }).catch(console.warn);
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
                      {post.role === "Instructor" ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[9px] uppercase tracking-wider rounded font-mono w-fit">
                          ★ Official Instructor
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#5A5F70] font-semibold">
                          {post.role}
                        </span>
                      )}
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
                    {/* Comments Toggle Button */}
                    <button
                      onClick={() => handleToggleComments(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        expandedComments[post.id]
                          ? "text-[#EFFF4F] font-bold"
                          : "hover:text-white"
                      }`}
                      title="View & Add Comments"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentsCount}</span>
                    </button>

                    {/* Likes Button (Persisted to Supabase user_activities table!) */}
                    <button
                      onClick={() => handleToggleLike(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        post.isLiked
                          ? "text-red-400 font-bold"
                          : "hover:text-red-400"
                      }`}
                      title={post.isLiked ? "Unlike post" : "Like post"}
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

                {/* EXPANDABLE COMMENTS THREAD (Persisted directly to Supabase comments table) */}
                {expandedComments[post.id] && (
                  <div className="pt-4 border-t border-[#3E3E43]/80 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs font-mono text-[#A0A5B5]">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <CornerDownRight className="w-3.5 h-3.5 text-[#EFFF4F]" />
                        <span>Thread Discussion</span>
                      </span>
                      {loadingComments[post.id] && (
                        <span className="flex items-center gap-1 text-[11px] text-[#5A5F70]">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Loading replies...</span>
                        </span>
                      )}
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3 pl-3 border-l-2 border-[#3E3E43]">
                      {(postComments[post.id] || []).length === 0 ? (
                        <p className="text-xs text-[#5A5F70] italic py-1">
                          No replies yet. Be the first to share your thoughts!
                        </p>
                      ) : (
                        (postComments[post.id] || []).map((comment) => (
                          <div
                            key={comment.id}
                            className="p-3 bg-[#1C1C20] border border-[#3E3E43] rounded space-y-1.5"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full overflow-hidden bg-neutral-800 border border-[#3E3E43] flex items-center justify-center text-[10px] font-bold text-white">
                                  {comment.author.avatar ? (
                                    <Image
                                      src={comment.author.avatar}
                                      alt={comment.author.name}
                                      width={24}
                                      height={24}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    comment.author.name.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <span className="font-bold text-white font-sans text-xs">
                                  {comment.author.name}
                                </span>
                                {comment.author.role === "INSTRUCTOR" && (
                                  <span className="px-1.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[9px] uppercase tracking-wider rounded font-mono">
                                    ★ Instructor
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-[#5A5F70]">
                                {new Date(comment.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-[#C5C8D4] font-sans leading-relaxed pl-8">
                              {comment.content}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* New Comment Input Form */}
                    <form
                      onSubmit={(e) => handleSubmitComment(post.id, e)}
                      className="flex items-center gap-2 pt-2"
                    >
                      <input
                        type="text"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        placeholder={`Reply in #${post.spaceName}...`}
                        className="flex-1 px-3.5 py-2.5 bg-[#18181C] border border-[#3E3E43] text-xs text-white placeholder-[#5A5F70] focus:outline-none focus:border-[#EFFF4F]/50 font-sans transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={
                          !commentInputs[post.id]?.trim() ||
                          submittingComment[post.id]
                        }
                        className="px-4 py-2.5 bg-[#EFFF4F] text-[#28282B] hover:bg-[#EFFF4F]/90 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs font-bold uppercase transition-all shadow-lemon-sm flex items-center gap-1.5 shrink-0"
                      >
                        {submittingComment[post.id] ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Send className="w-3.5 h-3.5" />
                        )}
                        <span>Reply</span>
                      </button>
                    </form>
                  </div>
                )}
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
              2. Comments add to your community reputation score.<br />
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
