import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) return null;

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (err) {
    console.warn("Auth check error in memberships API:", err);
    return null;
  }
}

const DEFAULT_MEMBERSHIP_SEEDS = [
  {
    name: "Free Community Tier",
    description: "Full community discussion access, public forum discussions, and open testing resources.",
    tier: "FREE" as const,
    monthly_price: 0,
    annual_price: 0,
    trial_period_days: 0,
    benefits: [
      "Access to public Discord-style QA community channels",
      "Read public bug reports & test automation articles",
      "Participate in community leaderboard challenges",
      "Standard community response support",
    ],
    included_course_ids: [],
    community_access: true,
    live_session_access: false,
    downloads_access: false,
    priority_support: false,
  },
  {
    name: "Basic SDET Tier",
    description: "Core automation tracks, downloadable framework templates, and test assets.",
    tier: "BASIC" as const,
    monthly_price: 499,
    annual_price: 4999,
    trial_period_days: 7,
    benefits: [
      "Everything in Free Community Tier",
      "Full access to Starter SDET curriculum tracks",
      "Downloadable Maven/TestNG project starter templates",
      "Access to verified test problem repository",
      "Direct code review in student forum",
    ],
    included_course_ids: ["course-1"],
    community_access: true,
    live_session_access: false,
    downloads_access: true,
    priority_support: false,
  },
  {
    name: "Pro Engineer Tier",
    description: "Interactive live cohort masterclasses, AI testing tools, and framework teardowns.",
    tier: "PRO" as const,
    monthly_price: 999,
    annual_price: 9999,
    trial_period_days: 14,
    benefits: [
      "Everything in Basic SDET Tier",
      "Bi-weekly live workshop broadcasts & interactive Q&A",
      "Post-session full HD video recordings & slides",
      "All included courses (Selenium 4, Playwright, CI/CD)",
      "Verifiable digital certification upon quiz completion",
      "Priority response time in private mentor channels",
    ],
    included_course_ids: ["course-1", "course-2"],
    community_access: true,
    live_session_access: true,
    downloads_access: true,
    priority_support: false,
  },
  {
    name: "Premium VIP Accelerator",
    description: "Complete unconstrained access, 1-on-1 mentorship, live session archives, and enterprise interview prep.",
    tier: "PREMIUM" as const,
    monthly_price: 1999,
    annual_price: 19999,
    trial_period_days: 14,
    benefits: [
      "Everything in Pro Engineer Tier",
      "1-on-1 monthly architecture & career consultation slot",
      "Dedicated high-priority VIP ticket & chat channel",
      "Immediate access to all upcoming academy releases",
      "Enterprise framework review by Lead SDET Instructor",
      "Verifiable Credential with Distinction Badge",
    ],
    included_course_ids: ["course-1", "course-2", "course-3"],
    community_access: true,
    live_session_access: true,
    downloads_access: true,
    priority_support: true,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = await getAuthUser();
    const userId = searchParams.get("userId") || user?.id;

    // 1. Fetch all memberships from database
    let plans = await prisma.memberships.findMany({
      orderBy: { monthly_price: "asc" },
      include: {
        user_memberships: {
          select: {
            id: true,
            user_id: true,
            state: true,
          },
        },
      },
    });

    // Auto-seed default 4 tiers if empty
    if (plans.length === 0) {
      for (const seed of DEFAULT_MEMBERSHIP_SEEDS) {
        await prisma.memberships.create({
          data: seed,
        });
      }

      plans = await prisma.memberships.findMany({
        orderBy: { monthly_price: "asc" },
        include: {
          user_memberships: {
            select: {
              id: true,
              user_id: true,
              state: true,
            },
          },
        },
      });
    }

    // 2. Fetch active user subscription if logged in
    let activeSubscription = null;
    let currentUserRole = "GUEST";

    if (userId) {
      const profile = await prisma.profiles.findUnique({
        where: { id: userId },
      });
      if (profile) {
        currentUserRole = profile.role;
      }

      const userSub = await prisma.user_memberships.findFirst({
        where: {
          user_id: userId,
          state: { in: ["ACTIVE", "TRIAL", "PAST_DUE"] },
        },
        orderBy: { created_at: "desc" },
        include: {
          membership: true,
        },
      });

      if (userSub) {
        activeSubscription = userSub;
      }
    }

    return NextResponse.json({
      success: true,
      memberships: plans,
      activeSubscription,
      currentUserRole,
    });
  } catch (error: any) {
    console.error("Error fetching memberships:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch memberships" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    const body = await request.json();

    const {
      id,
      name,
      description,
      tier = "BASIC",
      monthly_price = 499,
      annual_price = 4999,
      trial_period_days = 0,
      benefits = [],
      included_course_ids = [],
      community_access = true,
      live_session_access = false,
      downloads_access = false,
      priority_support = false,
    } = body;

    let targetInstructorId = body.instructor_id;

    // Check authorization: SUPER_ADMIN or INSTRUCTOR only
    let userRole = "GUEST";
    if (user?.id) {
      const prof = await prisma.profiles.findUnique({
        where: { id: user.id },
      });
      if (prof) {
        userRole = prof.role;
      }
    }

    const isSuperAdmin = userRole === "SUPER_ADMIN";
    const isInstructor = userRole === "INSTRUCTOR";

    if (!isSuperAdmin && !isInstructor) {
      return NextResponse.json(
        { error: "Access Denied: Only SUPER_ADMIN and INSTRUCTOR can configure memberships (403 Forbidden)." },
        { status: 403 }
      );
    }

    if (isInstructor && !targetInstructorId) {
      targetInstructorId = user?.id;
    }

    if (!name || !description) {
      return NextResponse.json(
        { error: "Plan name and description are required" },
        { status: 400 }
      );
    }

    const payload = {
      name,
      description,
      tier,
      monthly_price: Number(monthly_price),
      annual_price: Number(annual_price),
      trial_period_days: Number(trial_period_days),
      benefits: Array.isArray(benefits) ? benefits : [benefits],
      included_course_ids: Array.isArray(included_course_ids) ? included_course_ids : [],
      community_access: Boolean(community_access),
      live_session_access: Boolean(live_session_access),
      downloads_access: Boolean(downloads_access),
      priority_support: Boolean(priority_support),
      instructor_id: targetInstructorId || null,
    };

    let result;
    if (id) {
      result = await prisma.memberships.update({
        where: { id },
        data: payload,
      });
    } else {
      result = await prisma.memberships.create({
        data: payload,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Membership plan saved successfully.",
      membership: result,
    });
  } catch (error: any) {
    console.error("Error creating/updating membership plan:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save membership plan" },
      { status: 500 }
    );
  }
}
