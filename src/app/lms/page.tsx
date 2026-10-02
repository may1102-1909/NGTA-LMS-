import React from "react";
import Link from "next/link";
import { INITIAL_COURSES, INITIAL_LIVE_SESSIONS } from "@/lib/mockData";
import { ArrowUpRight, ShieldCheck, PlayCircle, Star, Terminal, Zap, Users, Sparkles } from "lucide-react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import CourseCard from "@/components/CourseCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let user: any = null;
  const enrollmentMap: Record<string, boolean> = {};

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      // Fetch Live User Session: Get the current logged-in user's id from Supabase Auth using @supabase/ssr
      const cookieStore = await cookies();
      const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options)
                );
              } catch {
                // Ignored in Server Component
              }
            },
          },
        }
      );

      const { data } = await supabase.auth.getUser();
      user = data?.user || null;

      // Query Database for Enrollment: Check if an active record exists in enrollments or payments
      if (user?.id) {
        try {
          const [userEnrollments, userPayments] = await Promise.all([
            prisma.enrollments.findMany({
              where: { user_id: user.id, status: "ACTIVE" },
              select: { course_id: true },
            }),
            prisma.payments.findMany({
              where: { user_id: user.id, status: "SUCCESS" },
              select: { course_id: true },
            }),
          ]);

          const enrolledIds = new Set([
            ...userEnrollments.map((e: any) => e.course_id),
            ...userPayments.map((p: any) => p.course_id),
          ]);

          for (const course of INITIAL_COURSES) {
            enrollmentMap[course.id] = enrolledIds.has(course.id);
          }
        } catch (dbErr) {
          console.error("Database error checking enrollments on LMS page:", dbErr);
        }
      }
    }
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    console.error("Error checking session/enrollment on LMS page:", err);
  }
  return (
    <div className="w-full bg-[#070709] text-white selection:bg-lime-400 selection:text-black">
      {/* SECTION 1: HERO */}
      <section className="relative border-b border-white/[0.08] overflow-hidden py-20 lg:py-32">
        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
        
        {/* Ambient radial glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-lime-500/10 via-emerald-950/5 to-transparent blur-[120px] pointer-events-none -z-10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-400/10 border border-lime-400/30 font-mono text-xs uppercase tracking-widest text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.12)]">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span>CODE-LEVEL SDET ARENA • ZERO FLUFF</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight leading-[0.95] bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Engineered For <br />
              <span className="text-[#EFFF4F] drop-shadow-[0_0_35px_rgba(239,255,79,0.35)]">High-Velocity</span> <br />
              SDET Mastery.
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed max-w-2xl">
              Stop memorizing brittle selectors. Build battle-tested automation infrastructure with live CI/CD runners, enterprise Selenium, Playwright, and LLM test orchestration.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs uppercase font-bold tracking-wider">
              <Link
                href="/courses"
                className="px-7 py-4 bg-[#EFFF4F] text-[#070709] hover:bg-[#EFFF4F]/90 transition-all flex items-center gap-2.5 rounded-2xl shadow-[0_0_25px_rgba(239,255,79,0.3)] hover:shadow-[0_0_35px_rgba(239,255,79,0.45)] active:scale-95 duration-150 group"
              >
                <span>EXPLORE COURSE CATALOG</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link
                href="/verify"
                className="px-7 py-4 border border-white/15 bg-white/[0.03] text-zinc-300 hover:border-lime-400/50 hover:text-white transition-all flex items-center gap-2.5 rounded-2xl active:scale-95 duration-150 backdrop-blur-md"
              >
                <ShieldCheck className="w-4 h-4 text-lime-400" />
                <span>VERIFY CERTIFICATE</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ASYMMETRICAL STATS BENTO GRID */}
      <section className="border-b border-white/[0.08] bg-[#0a0a0e] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 font-mono">
            {/* Bento Card 1: Active Learners (col-span-4) */}
            <div className="lg:col-span-4 cyber-card rounded-3xl p-7 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 uppercase tracking-widest">ACTIVE LEARNERS</span>
                <div className="w-8 h-8 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-6">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">10,000+</div>
                <div className="text-xs text-zinc-400 mt-1 font-sans">Enrolled Automation Engineers</div>
              </div>
            </div>

            {/* Bento Card 2: Success Rate Spotlight (col-span-4) */}
            <div className="lg:col-span-4 bg-gradient-to-b from-lime-400/35 via-zinc-800/30 to-transparent p-[1px] rounded-3xl shadow-[0_0_30px_rgba(163,230,53,0.08)]">
              <div className="bg-[#0e0f14]/95 rounded-3xl p-7 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-lime-400 uppercase tracking-widest font-bold">SUCCESS RATE</span>
                  <div className="w-8 h-8 rounded-xl bg-lime-400/20 border border-lime-400/40 flex items-center justify-center text-lime-400">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-6">
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-[#EFFF4F]">99.4%</div>
                  <div className="text-xs text-zinc-300 mt-1 font-sans">Curriculum Completion & Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Hands-On Labs (col-span-4) */}
            <div className="lg:col-span-4 cyber-card rounded-3xl p-7 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 uppercase tracking-widest">HANDS-ON LABS</span>
                <div className="w-8 h-8 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                  <Terminal className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-6">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">150+</div>
                <div className="text-xs text-zinc-400 mt-1 font-sans">Real-World CI/CD & Grid Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STOREFRONT CATALOG */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/[0.08] gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-lime-400 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
              <span>FEATURED TRACKS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Engineering Curricula
            </h2>
          </div>
          <Link
            href="/courses"
            className="font-mono text-xs uppercase font-bold text-[#EFFF4F] hover:text-white flex items-center gap-1.5 transition-colors group"
          >
            <span>VIEW ALL 14 TRACKS</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INITIAL_COURSES.map((course, idx) => (
            <CourseCard
              key={course.id}
              course={course}
              idx={idx}
              initialIsEnrolled={!!enrollmentMap[course.id]}
              userId={user?.id || null}
            />
          ))}
        </div>
      </section>

      {/* SECTION 3.5: INSTRUCTOR SPOTLIGHT */}
      <section className="border-t border-b border-white/[0.08] bg-[#09090d] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-b from-zinc-800/50 via-zinc-800/20 to-transparent rounded-3xl p-[1px] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            <div className="bg-[#0e0f14]/95 rounded-3xl p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Instructor Avatar Photo */}
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
                <div className="relative">
                  <img
                    src="/instructor/rahul-kamat.png"
                    alt="Rahul Kamat"
                    className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover border-2 border-lime-400/40 shadow-[0_0_30px_rgba(163,230,53,0.15)]"
                  />
                  <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 bg-[#070709] text-lime-400 border border-lime-400/40 font-mono text-[10px] uppercase font-bold px-3.5 py-1 rounded-full shadow-md whitespace-nowrap">
                    17+ YRS QA EXPERIENCE
                  </span>
                </div>
              </div>

              {/* Instructor Bio & Credentials */}
              <div className="lg:col-span-8 space-y-5">
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                    <span>LEAD INSTRUCTOR & FOUNDER</span>
                  </div>
                  <h3 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                    RAHUL KAMAT
                  </h3>
                  <p className="font-mono text-sm text-[#EFFF4F] mt-1 font-semibold">
                    Lead SDET & Founder @ NextGen Testing Academy (NGTA)
                  </p>
                </div>

                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
                  Rahul Kamat is an enterprise test automation leader with over 17 years of hands-on Quality Assurance experience. Having mentored over 10,000+ QA engineers and career switchers worldwide, his signature curriculum bridges manual testing to high-velocity automation architecture with Selenium, Java, CI/CD pipelines, and cutting-edge AI-assisted test engineering.
                </p>

                {/* Badges / Metrics Bento Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2 font-mono text-xs">
                  <div className="cyber-card rounded-2xl p-4 border border-white/[0.08]">
                    <div className="text-[10px] text-zinc-500 uppercase">STUDENTS</div>
                    <div className="text-xl font-black text-white mt-0.5">10,000+</div>
                  </div>
                  <div className="cyber-card rounded-2xl p-4 border border-white/[0.08]">
                    <div className="text-[10px] text-zinc-500 uppercase">EXPERIENCE</div>
                    <div className="text-xl font-black text-[#EFFF4F] mt-0.5">17+ Years</div>
                  </div>
                  <div className="cyber-card rounded-2xl p-4 border border-white/[0.08]">
                    <div className="text-[10px] text-zinc-500 uppercase">RATING</div>
                    <div className="text-xl font-black text-white mt-0.5">★ 4.9 / 5.0</div>
                  </div>
                  <div className="cyber-card rounded-2xl p-4 border border-white/[0.08]">
                    <div className="text-[10px] text-zinc-500 uppercase">SPECIALTY</div>
                    <div className="text-xl font-black text-[#EFFF4F] mt-0.5">Selenium + AI</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: ASYMMETRIC LEARNING JOURNEY BENTO */}
      <section className="py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14 space-y-2">
          <div className="font-mono text-xs uppercase tracking-widest text-lime-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400" />
            <span>EXECUTION BLUEPRINT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            How You Level Up At NGTA
          </h2>
          <p className="text-sm text-zinc-400 font-sans max-w-xl">
            A structured, project-driven path from automation fundamentals to high-level SDET mastery:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
          <div className="cyber-card rounded-3xl p-7 space-y-3">
            <div className="text-2xl font-black text-lime-400">01.</div>
            <div className="font-sans font-bold text-white text-base">Scope & Discover</div>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed">Explore enterprise modules, automation roadmaps, prerequisites, and SDET tracks.</p>
          </div>
          <div className="cyber-card rounded-3xl p-7 space-y-3">
            <div className="text-2xl font-black text-lime-400">02.</div>
            <div className="font-sans font-bold text-white text-base">Instant Unlock</div>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed">Seamless checkout with instant, perpetual unlock to full course repositories and tools.</p>
          </div>
          <div className="cyber-card rounded-3xl p-7 space-y-3">
            <div className="text-2xl font-black text-lime-400">03.</div>
            <div className="font-sans font-bold text-white text-base">Deep Architectural Drill</div>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed">Deep-dive architecture walkthroughs, test design patterns, and live coding demonstrations.</p>
          </div>
          <div className="cyber-card rounded-3xl p-7 space-y-3">
            <div className="text-2xl font-black text-lime-400">04.</div>
            <div className="font-sans font-bold text-white text-base">Forge Hands-On Labs</div>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed">Build production test suites against real Git repositories, Docker containers, and CI pipelines.</p>
          </div>
          <div className="cyber-card rounded-3xl p-7 space-y-3">
            <div className="text-2xl font-black text-lime-400">05.</div>
            <div className="font-sans font-bold text-white text-base">Benchmark & Review</div>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed">Validate code architecture with technical quizzes, automated grading, and peer code reviews.</p>
          </div>
          {/* Step 6 Spotlight Bento Card */}
          <div className="bg-gradient-to-b from-lime-400/40 via-zinc-800/30 to-transparent p-[1px] rounded-3xl shadow-[0_0_30px_rgba(163,230,53,0.1)]">
            <div className="bg-[#0e0f14]/95 rounded-3xl p-7 space-y-3 h-full flex flex-col justify-between">
              <div>
                <div className="text-2xl font-black text-[#EFFF4F]">06.</div>
                <div className="font-sans font-bold text-white text-base flex items-center gap-2">
                  <span>Certify & Flex</span>
                  <Sparkles className="w-4 h-4 text-[#EFFF4F]" />
                </div>
                <p className="font-sans text-xs text-zinc-300 leading-relaxed mt-1">Earn a cryptographic, verifiable digital certificate ready for LinkedIn, resumes, and hiring managers.</p>
              </div>
              <div className="pt-2 text-[10px] text-lime-400 font-bold uppercase tracking-wider">
                ★ 100% Industry Recognized
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: LIVE WORKSHOPS & COMMUNITY PREVIEW */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Sessions Card */}
          <div className="cyber-card rounded-3xl p-7 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-ping" />
                <span className="font-mono text-xs uppercase font-bold text-white tracking-wider">LIVE SDET BOOTCAMPS</span>
              </div>
              <Link href="/courses" className="font-mono text-xs text-[#EFFF4F] hover:underline">VIEW ALL</Link>
            </div>

            <div className="space-y-3.5">
              {INITIAL_LIVE_SESSIONS.map((session) => (
                <div key={session.id} className="p-4 rounded-2xl bg-[#070709]/80 border border-white/[0.06] hover:border-lime-400/40 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] bg-white/[0.05] px-2.5 py-1 rounded-full text-zinc-300 border border-white/10">
                      {session.date} • {session.startTime}
                    </span>
                    <span className="font-mono text-[10px] text-lime-400 font-bold">
                      CAPACITY: {session.capacity}
                    </span>
                  </div>
                  <h4 className="font-bold text-white mt-2.5 text-sm sm:text-base">{session.title}</h4>
                  <div className="font-mono text-xs text-zinc-400 mt-1">Instructor: {session.instructorName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Community & Discussions Card */}
          <div className="cyber-card rounded-3xl p-7 sm:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-lime-400" />
                <span className="font-mono text-xs uppercase font-bold text-white tracking-wider">PEER COMMUNITY</span>
              </div>
              <Link href="/community" className="font-mono text-xs text-[#EFFF4F] hover:underline">JOIN CHANNEL</Link>
            </div>

            <div className="space-y-3.5 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#070709]/80 border border-white/[0.06] hover:border-lime-400/40 transition-all space-y-2">
                <div className="flex justify-between text-zinc-400 text-[11px]">
                  <span className="font-bold text-white">#selenium-architecture</span>
                  <span>Active 12m ago</span>
                </div>
                <p className="font-sans text-xs text-zinc-300 leading-relaxed">
                  "How do you configure dynamic timeout back-offs when tests run inside Kubernetes runner pods?"
                </p>
                <div className="text-[10px] text-lime-400 font-bold">8 Responses • SDET Review Active</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#070709]/80 border border-white/[0.06] hover:border-lime-400/40 transition-all space-y-2">
                <div className="flex justify-between text-zinc-400 text-[11px]">
                  <span className="font-bold text-white">#playwright-tricks</span>
                  <span>Active 45m ago</span>
                </div>
                <p className="font-sans text-xs text-zinc-300 leading-relaxed">
                  "Mastered route interception for auth mocks today. Saved 10 API calls per test suite."
                </p>
                <div className="text-[10px] text-lime-400 font-bold">+15 Gamification Points Awarded</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
