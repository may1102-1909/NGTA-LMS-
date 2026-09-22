"use client";

import React, { useState } from "react";
import { INITIAL_COMMUNITY_POSTS } from "@/lib/mockData";
import { CommunityPost } from "@/types";
import {
  MessageSquare,
  Flame,
  Award,
  Send,
  Hash,
  Sparkles,
  ThumbsUp,
  Share2,
} from "lucide-react";

export default function CommunityPage() {
  const [activeChannel, setActiveChannel] = useState("general-qa");
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [newPostContent, setNewPostContent] = useState("");
  const [gamificationPoints, setGamificationPoints] = useState(420);

  const channels = [
    { id: "general-qa", name: "general-sdet-qa", desc: "General automation architecture discussions" },
    { id: "selenium-arch", name: "selenium-frameworks", desc: "ThreadLocal, Page Factory, Grid setup" },
    { id: "playwright-ts", name: "playwright-typescript", desc: "Modern tracing, auto-waiting, mocks" },
    { id: "code-review", name: "peer-code-reviews", desc: "Submit your framework code for feedback" },
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      channelId: activeChannel,
      authorName: "Tanmay Sharma (Learner)",
      authorRole: "LEARNER",
      content: newPostContent,
      createdAt: "Just now",
      reactions: [{ emoji: "🚀", count: 1 }],
      repliesCount: 0,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setGamificationPoints((prev) => prev + 15);
  };

  const handleAddReaction = (postId: string, emoji: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const existing = p.reactions.find((r) => r.emoji === emoji);
          if (existing) {
            return {
              ...p,
              reactions: p.reactions.map((r) =>
                r.emoji === emoji ? { ...r, count: r.count + 1 } : r
              ),
            };
          }
          return {
            ...p,
            reactions: [...p.reactions, { emoji, count: 1 }],
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1">
            COMMUNITY NETWORK
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            ENGINEERING PEER COMMUNITY
          </h1>
        </div>

        {/* Gamification Reputation Badge */}
        <div className="flex items-center gap-3 border border-[#3E3E43] bg-[#333336] px-4 py-2 shadow-card font-mono text-xs">
          <Award className="w-4 h-4 text-[#EFFF4F]" />
          <span className="text-[#A0A5B5]">YOUR REPUTATION:</span>
          <strong className="text-[#EFFF4F] text-sm">{gamificationPoints} PTS</strong>
          <span className="text-[#5A5F70]">|</span>
          <span className="text-[#EFFF4F] font-bold">TOP 5% SDET</span>
        </div>
      </div>

      {/* Main Grid: Channels List + Posts Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Channels Directory */}
        <div className="lg:col-span-4 border border-[#3E3E43] bg-[#333336] p-5 shadow-card space-y-4">
          <div className="font-mono text-xs uppercase font-bold text-[#5A5F70] border-b border-[#3E3E43] pb-2">
            CHANNELS DIRECTORY
          </div>
          <div className="space-y-1 font-mono text-xs">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`w-full text-left p-2.5 transition-colors border flex items-center justify-between ${
                  activeChannel === ch.id
                    ? "bg-[#EFFF4F] border-[#EFFF4F] text-[#28282B] font-bold"
                    : "border-transparent hover:bg-[#3E3E43] text-[#A0A5B5]"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Hash className="w-3.5 h-3.5" />
                  <span className="truncate">{ch.name}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-[#3E3E43] pt-4 font-mono text-[11px] text-[#5A5F70] space-y-2">
            <div className="font-bold text-white uppercase">COMMUNITY RULES:</div>
            <p>1. Keep discussions technical and focused on QA architecture.</p>
            <p>2. Earn +15 Gamification Points per verified solution provided.</p>
          </div>
        </div>

        {/* Right Column: Feed Stage */}
        <div className="lg:col-span-8 space-y-6">
          {/* Create Post Input */}
          <form
            onSubmit={handleCreatePost}
            className="border border-[#3E3E43] bg-[#333336] p-5 shadow-card space-y-3"
          >
            <div className="flex items-center gap-2 font-mono text-xs text-[#5A5F70]">
              <Sparkles className="w-3.5 h-3.5 text-[#EFFF4F]" />
              <span>POST TO #{activeChannel} (EARN +15 PTS)</span>
            </div>
            <textarea
              rows={3}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Ask an architecture question or share an automation breakthrough..."
              className="w-full p-3 border border-[#3E3E43] bg-[#28282B] font-sans text-sm text-white placeholder:text-[#5A5F70] focus:outline-none focus:border-[#EFFF4F]/50 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 bg-[#EFFF4F] text-[#28282B] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-colors shadow-lemon-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>PUBLISH POST</span>
              </button>
            </div>
          </form>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-[#3E3E43] bg-[#333336] p-6 shadow-card space-y-4"
              >
                <div className="flex justify-between items-start border-b border-[#3E3E43] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-none border border-[#3E3E43] bg-[#28282B] flex items-center justify-center font-mono text-xs font-bold text-[#EFFF4F]">
                      {post.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{post.authorName}</span>
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 border border-[#3E3E43] bg-[#28282B] text-[#5A5F70]">
                          {post.authorRole}
                        </span>
                      </div>
                      <div className="font-mono text-[10px] text-[#5A5F70]">{post.createdAt}</div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#A0A5B5] leading-relaxed font-sans">
                  {post.content}
                </p>

                {/* Reactions and Comments Count */}
                <div className="flex items-center justify-between border-t border-[#3E3E43] pt-3 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    {post.reactions.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => handleAddReaction(post.id, r.emoji)}
                        className="px-2.5 py-1 border border-[#3E3E43] hover:border-[#EFFF4F]/30 text-xs flex items-center gap-1 bg-[#28282B] transition-colors text-[#A0A5B5]"
                      >
                        <span>{r.emoji}</span>
                        <span className="font-bold">{r.count}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => handleAddReaction(post.id, "💡")}
                      className="px-2 py-1 text-[#5A5F70] hover:text-[#EFFF4F] text-xs transition-colors"
                    >
                      + Reaction
                    </button>
                  </div>

                  <div className="text-[#5A5F70] text-[11px] flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.repliesCount} Replies</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
