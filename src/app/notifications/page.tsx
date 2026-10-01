"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Trash2,
  Check,
} from "lucide-react";
import PushNotificationButton from "@/components/PushNotificationButton";
import { createBrowserClient } from "@supabase/ssr";

interface NotificationItem {
  id: string;
  type: "STREAK" | "COURSE" | "LIVE" | "CERTIFICATE" | "COMMUNITY";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkText?: string;
  linkHref?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "STREAK",
    title: "Daily Streak Active! 🔥",
    message: "You've maintained your learning streak today. Complete 1 lesson in Selenium Java to hit day 8!",
    timestamp: "10 minutes ago",
    read: false,
    linkText: "Resume Learning",
    linkHref: "/learn/course-1",
  },
  {
    id: "notif-2",
    type: "LIVE",
    title: "Upcoming Live SDET Bootcamp Session",
    message: "Live SDET Enterprise Automation Bootcamp with Rahul Kamat starts this Saturday at 10:00 AM IST.",
    timestamp: "2 hours ago",
    read: false,
    linkText: "View Session Details",
    linkHref: "/courses",
  },
  {
    id: "notif-3",
    type: "COURSE",
    title: "New Quiz Available: ThreadLocal Driver Architecture",
    message: "Test your parallel cross-browser execution mastery in Module 1.3 quiz.",
    timestamp: "5 hours ago",
    read: false,
    linkText: "Take Quiz",
    linkHref: "/learn/course-1/quiz",
  },
  {
    id: "notif-4",
    type: "CERTIFICATE",
    title: "Credential Ready for Verification",
    message: "Your 'Selenium Java + AI Automation Architect' credential has been issued to the public registry.",
    timestamp: "1 day ago",
    read: true,
    linkText: "Verify Certificate",
    linkHref: "/certificates",
  },
  {
    id: "notif-5",
    type: "COMMUNITY",
    title: "Rahul Kamat commented in #selenium-frameworks",
    message: "Check out the recommended solution for ThreadLocal memory leak prevention in TestNG.",
    timestamp: "2 days ago",
    read: true,
    linkText: "Open Discussion",
    linkHref: "/community",
  },
];

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "COURSE" | "LIVE">("ALL");
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);

  // Fetch logged-in user's active enrollments from Supabase database
  useEffect(() => {
    async function checkUserEnrollments() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) return;

        const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.id) {
          const res = await fetch(`/api/payments/verify?userId=${user.id}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.enrolledCourseIds)) {
              setEnrolledCourseIds(data.enrolledCourseIds);
            }
          }
        }
      } catch (err) {
        console.warn("Could not check enrollments in notifications:", err);
      }
    }

    checkUserEnrollments();
  }, []);

  // Helper to resolve link: redirects unenrolled users to /courses
  const resolveNotificationLink = (linkHref?: string) => {
    if (!linkHref) return "";

    if (linkHref.startsWith("/learn/")) {
      const parts = linkHref.split("/");
      const courseId = parts[2]; // e.g. "course-1"
      const isEnrolled = enrolledCourseIds.includes(courseId);

      // If user hasn't enrolled in this course, redirect to /courses
      if (!isEnrolled) {
        return "/courses";
      }
    }

    return linkHref;
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.read;
    if (filter === "COURSE") return n.type === "COURSE" || n.type === "STREAK";
    if (filter === "LIVE") return n.type === "LIVE";
    return true;
  });

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "STREAK":
        return <Flame className="w-4 h-4 text-orange-400" />;
      case "LIVE":
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      case "CERTIFICATE":
        return <Award className="w-4 h-4 text-emerald-400" />;
      case "COURSE":
        return <BookOpen className="w-4 h-4 text-[#FCA311]" />;
      default:
        return <Bell className="w-4 h-4 text-[#E5E5E5]" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#1f2d4d] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#8A96A8] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span>NOTIFICATION CENTER</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-[#FCA311] text-[#000000] font-bold text-[10px] rounded-full">
                {unreadCount} NEW
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            NOTIFICATIONS & ALERTS
          </h1>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3.5 py-1.5 border border-[#1f2d4d] bg-[#14213D] text-[#E5E5E5] hover:text-[#FCA311] hover:border-[#FCA311]/40 font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Web Push Notification Settings Banner */}
      <div className="p-4 sm:p-5 bg-[#14213D] border border-[#1f2d4d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase">
            <Bell className="w-4 h-4 text-[#FCA311]" />
            <span>Browser Push Alerts</span>
          </div>
          <p className="text-xs text-[#E5E5E5]">
            Receive real-time notifications for live bootcamps, instructor replies, and daily streak milestones directly on your device.
          </p>
        </div>
        <PushNotificationButton showTestButton={true} />
      </div>

      {/* Filter Tabs */}
      <div className="flex border border-[#1f2d4d] bg-[#14213D] font-mono text-xs font-bold w-fit">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 uppercase transition-colors ${
            filter === "ALL"
              ? "bg-[#FCA311] text-[#000000]"
              : "text-[#E5E5E5] hover:bg-[#1f2d4d]"
          }`}
        >
          ALL ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`px-4 py-2 uppercase border-l border-[#1f2d4d] transition-colors ${
            filter === "UNREAD"
              ? "bg-[#FCA311] text-[#000000]"
              : "text-[#E5E5E5] hover:bg-[#1f2d4d]"
          }`}
        >
          UNREAD ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("COURSE")}
          className={`px-4 py-2 uppercase border-l border-[#1f2d4d] transition-colors ${
            filter === "COURSE"
              ? "bg-[#FCA311] text-[#000000]"
              : "text-[#E5E5E5] hover:bg-[#1f2d4d]"
          }`}
        >
          COURSES & STREAKS
        </button>
        <button
          onClick={() => setFilter("LIVE")}
          className={`px-4 py-2 uppercase border-l border-[#1f2d4d] transition-colors ${
            filter === "LIVE"
              ? "bg-[#FCA311] text-[#000000]"
              : "text-[#E5E5E5] hover:bg-[#1f2d4d]"
          }`}
        >
          LIVE SESSIONS
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="border border-[#1f2d4d] bg-[#14213D] p-12 text-center text-[#E5E5E5] font-mono text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#FCA311] mx-auto opacity-60" />
            <p className="text-white font-bold text-sm">All caught up!</p>
            <p>You have no notifications matching this filter.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`border p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors ${
                notif.read
                  ? "border-[#1f2d4d] bg-[#000000]"
                  : "border-[#FCA311]/40 bg-[#14213D] shadow-lemon-sm"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <div className="p-2 border border-[#1f2d4d] bg-[#000000] rounded mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white font-sans">
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#FCA311]" />
                    )}
                  </div>
                  <p className="text-xs text-[#E5E5E5] font-sans leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] font-mono text-[#8A96A8] block">
                    {notif.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1f2d4d]">
                {notif.linkHref && notif.linkText && (
                  <Link
                    href={resolveNotificationLink(notif.linkHref)}
                    className="px-3.5 py-1.5 bg-[#FCA311] text-[#000000] font-mono text-xs uppercase font-bold hover:bg-[#FCA311]/90 transition-colors flex items-center gap-1 shadow-lemon-sm font-black"
                  >
                    <span>{notif.linkText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}

                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    title="Mark as read"
                    className="p-1.5 text-[#8A96A8] hover:text-white transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => removeNotification(notif.id)}
                  title="Delete notification"
                  className="p-1.5 text-[#8A96A8] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
