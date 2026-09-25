import React from "react";
import Link from "next/link";
import { INITIAL_COURSES, INITIAL_LIVE_SESSIONS } from "@/lib/mockData";
import { ArrowUpRight, ShieldCheck, PlayCircle, Star, Terminal, Zap, Users } from "lucide-react";
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

      // Query Database for Enrollment: Check if a record exists in the payments table using Prisma
      if (user?.id) {
        for (const course of INITIAL_COURSES) {
          const courseId = course.id;
          try {
            const payment = await prisma.payments.findFirst({
              where: {
                user_id: user.id,
                course_id: courseId,
                status: "SUCCESS",
              },
            });
            enrollmentMap[courseId] = !!payment;
          } catch (dbErr) {
            console.error(`Database error checking enrollment for ${courseId}:`, dbErr);
          }
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
    <div className="w-full">
      {/* SECTION 1: HERO */}
      <section className="border-b border-[#3E3E43] bg-[#28282B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-[#3E3E43] font-mono text-xs uppercase tracking-widest bg-[#333336] text-[#A0A5B5]">
              <span className="w-2 h-2 bg-[#EFFF4F]"></span>
              <span>NEXTGEN TESTING ACADEMY • SPRING 2026</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.95] uppercase">
              ENGINEERED FOR <br />
              <span className="text-[#EFFF4F]">HIGH-VELOCITY</span> <br />
              SDET MASTERY.
            </h1>

            <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs uppercase font-bold tracking-wider">
              <Link
                href="/courses"
                className="px-6 py-3.5 bg-[#EFFF4F] text-[#28282B] hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-2 shadow-lemon-sm"
              >
                <span>EXPLORE COURSE CATALOG</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/verify"
                className="px-6 py-3.5 border border-[#3E3E43] text-[#A0A5B5] hover:border-[#EFFF4F] hover:text-[#EFFF4F] transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>VERIFY CERTIFICATE</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STATS GRID */}
      <section className="border-b border-[#3E3E43] bg-[#333336] text-white font-mono">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#3E3E43]">
          <div className="p-6 sm:p-8">
            <div className="text-xs text-[#5A5F70] uppercase tracking-widest">ACTIVE LEARNERS</div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#EFFF4F] mt-2">10,000+</div>
            <div className="text-xs text-[#5A5F70] mt-1">ENROLLED ENGINEERS</div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="text-xs text-[#5A5F70] uppercase tracking-widest">SUCCESS RATE</div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#EFFF4F] mt-2">99.4%</div>
            <div className="text-xs text-[#5A5F70] mt-1">COURSE SATISFACTION</div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="text-xs text-[#5A5F70] uppercase tracking-widest">HANDS-ON LABS</div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#EFFF4F] mt-2">150+</div>
            <div className="text-xs text-[#5A5F70] mt-1">REAL-WORLD PROJECTS</div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="text-xs text-[#5A5F70] uppercase tracking-widest">HIRING PARTNERS</div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-[#EFFF4F] mt-2">120+</div>
            <div className="text-xs text-[#5A5F70] mt-1">TOP TECH COMPANIES</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STOREFRONT CATALOG */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#3E3E43] gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-[#5A5F70] mb-1">
              FEATURED TRACKS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              FEATURED ENGINEERING CURRICULA
            </h2>
          </div>
          <Link
            href="/courses"
            className="font-mono text-xs uppercase font-bold text-[#EFFF4F] hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>VIEW ALL 14 TRACKS</span>
            <ArrowUpRight className="w-4 h-4" />
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
      <section className="border-t border-[#3E3E43] bg-[#28282B] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-[#3E3E43] bg-[#333336] p-8 sm:p-12 shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Instructor Avatar Photo */}
            <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left space-y-4">
              <div className="relative">
                <img
                  src="/instructor/rahul-kamat.png"
                  alt="Rahul Kamat"
                  className="w-44 h-44 sm:w-52 sm:h-52 rounded-xl object-cover border-2 border-[#EFFF4F]/30 shadow-lemon-md"
                />
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 sm:left-4 sm:translate-x-0 bg-[#28282B] text-[#EFFF4F] border border-[#EFFF4F]/40 font-mono text-[10px] uppercase font-bold px-3 py-1 shadow-sm whitespace-nowrap">
                  17+ YRS QA EXPERIENCE
                </span>
              </div>
            </div>

            {/* Instructor Bio & Credentials */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-[#5A5F70] mb-1">
                  MEET YOUR LEAD INSTRUCTOR & FOUNDER
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  RAHUL KAMAT
                </h3>
                <p className="font-mono text-sm text-[#EFFF4F] mt-1">
                  Lead SDET & Founder @ NextGen Testing Academy (NGTA)
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#A0A5B5] leading-relaxed font-normal">
                Rahul Kamat is an enterprise test automation leader with over 17 years of hands-on Quality Assurance experience. Having mentored over 10,000+ QA engineers and career switchers worldwide, his signature curriculum bridges manual testing to high-velocity automation architecture with Selenium, Java, CI/CD pipelines, and cutting-edge AI-assisted test engineering.
              </p>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 font-mono text-xs">
                <div className="border border-[#3E3E43] bg-[#28282B] p-3">
                  <div className="text-[10px] text-[#5A5F70]">STUDENTS</div>
                  <div className="text-lg font-black text-white mt-0.5">10,000+</div>
                </div>
                <div className="border border-[#3E3E43] bg-[#28282B] p-3">
                  <div className="text-[10px] text-[#5A5F70]">EXPERIENCE</div>
                  <div className="text-lg font-black text-[#EFFF4F] mt-0.5">17+ Years</div>
                </div>
                <div className="border border-[#3E3E43] bg-[#28282B] p-3">
                  <div className="text-[10px] text-[#5A5F70]">RATING</div>
                  <div className="text-lg font-black text-white mt-0.5">★ 4.9 / 5.0</div>
                </div>
                <div className="border border-[#3E3E43] bg-[#28282B] p-3">
                  <div className="text-[10px] text-[#5A5F70]">SPECIALTY</div>
                  <div className="text-lg font-black text-[#EFFF4F] mt-0.5">Selenium + AI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: LEARNING JOURNEY WORKFLOW */}
      <section className="bg-[#333336] border-y border-[#3E3E43] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="font-mono text-xs uppercase tracking-widest text-[#5A5F70] mb-1">
              LEARNING JOURNEY
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              HOW YOU LEARN AT NEXTGEN TESTING ACADEMY
            </h2>
            <p className="text-sm text-[#A0A5B5] mt-2 font-mono">
              A structured, project-driven path from automation fundamentals to senior SDET:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
            <div className="border border-[#3E3E43] p-4 bg-[#28282B] space-y-2 hover:border-[#EFFF4F]/30 transition-colors">
              <div className="text-[#EFFF4F] font-bold">01. DISCOVER</div>
              <div className="font-sans font-bold text-white">Browse Catalog</div>
              <p className="font-sans text-[11px] text-[#A0A5B5]">Explore modules, syllabus, prerequisites, and SDET tracks.</p>
            </div>
            <div className="border border-[#3E3E43] p-4 bg-[#28282B] space-y-2 hover:border-[#EFFF4F]/30 transition-colors">
              <div className="text-[#EFFF4F] font-bold">02. ENROLL</div>
              <div className="font-sans font-bold text-white">Instant Access</div>
              <p className="font-sans text-[11px] text-[#A0A5B5]">Seamless checkout with instant unlock to all course resources.</p>
            </div>
            <div className="border border-[#3E3E43] p-4 bg-[#28282B] space-y-2 hover:border-[#EFFF4F]/30 transition-colors">
              <div className="text-[#EFFF4F] font-bold">03. LEARN</div>
              <div className="font-sans font-bold text-white">Video Lessons</div>
              <p className="font-sans text-[11px] text-[#A0A5B5]">Deep-dive architecture walkthroughs and live coding demonstrations.</p>
            </div>
            <div className="border border-[#3E3E43] p-4 bg-[#28282B] space-y-2 hover:border-[#EFFF4F]/30 transition-colors">
              <div className="text-[#EFFF4F] font-bold">04. PRACTICE</div>
              <div className="font-sans font-bold text-white">Hands-On Labs</div>
              <p className="font-sans text-[11px] text-[#A0A5B5]">Build enterprise test suites with real Git repositories and CI/CD.</p>
            </div>
            <div className="border border-[#3E3E43] p-4 bg-[#28282B] space-y-2 hover:border-[#EFFF4F]/30 transition-colors">
              <div className="text-[#EFFF4F] font-bold">05. EVALUATE</div>
              <div className="font-sans font-bold text-white">Quizzes & Code Reviews</div>
              <p className="font-sans text-[11px] text-[#A0A5B5]">Validate understanding with technical quizzes and peer feedback.</p>
            </div>
            <div className="border border-[#EFFF4F]/30 p-4 bg-[#28282B] space-y-2 shadow-lemon-sm">
              <div className="text-[#EFFF4F] font-bold">06. CERTIFY</div>
              <div className="font-sans font-bold text-white">Digital Certificate</div>
              <p className="font-sans text-[11px] text-[#A0A5B5]">Earn a shareable, verifiable credential for your LinkedIn and CV.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: LIVE WORKSHOPS & COMMUNITY PREVIEW */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Live Sessions */}
          <div className="border border-[#3E3E43] p-6 sm:p-8 bg-[#333336] shadow-card space-y-6">
            <div className="flex justify-between items-center border-b border-[#3E3E43] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EFFF4F] animate-ping"></span>
                <span className="font-mono text-xs uppercase font-bold text-white">LIVE SDET BOOTCAMPS</span>
              </div>
              <Link href="/live" className="font-mono text-xs text-[#EFFF4F] hover:underline">VIEW ALL</Link>
            </div>

            <div className="space-y-4">
              {INITIAL_LIVE_SESSIONS.map((session) => (
                <div key={session.id} className="border border-[#3E3E43] p-4 hover:border-[#EFFF4F]/30 transition-colors bg-[#28282B]">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] bg-[#333336] px-2 py-0.5 border border-[#3E3E43] text-[#A0A5B5]">
                      {session.date} • {session.startTime}
                    </span>
                    <span className="font-mono text-[10px] text-[#EFFF4F] font-bold">
                      CAPACITY: {session.capacity}
                    </span>
                  </div>
                  <h4 className="font-bold text-white mt-2 text-base">{session.title}</h4>
                  <div className="font-mono text-xs text-[#5A5F70] mt-1">Instructor: {session.instructorName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Community & Discussions */}
          <div className="border border-[#3E3E43] p-6 sm:p-8 bg-[#333336] shadow-card space-y-6">
            <div className="flex justify-between items-center border-b border-[#3E3E43] pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#EFFF4F]" />
                <span className="font-mono text-xs uppercase font-bold text-white">PEER COMMUNITY</span>
              </div>
              <Link href="/community" className="font-mono text-xs text-[#EFFF4F] hover:underline">JOIN CHANNEL</Link>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-[#28282B] border border-[#3E3E43] space-y-2">
                <div className="flex justify-between text-[#5A5F70] text-[11px]">
                  <span className="font-bold text-white">#selenium-architecture</span>
                  <span>Active 12m ago</span>
                </div>
                <p className="font-sans text-xs text-[#A0A5B5]">
                  "How do you configure dynamic timeout back-offs when tests run inside Kubernetes runner pods?"
                </p>
                <div className="text-[10px] text-[#EFFF4F] font-bold">8 Responses • SDET Review Active</div>
              </div>

              <div className="p-4 bg-[#28282B] border border-[#3E3E43] space-y-2">
                <div className="flex justify-between text-[#5A5F70] text-[11px]">
                  <span className="font-bold text-white">#playwright-tricks</span>
                  <span>Active 45m ago</span>
                </div>
                <p className="font-sans text-xs text-[#A0A5B5]">
                  "Mastered route interception for auth mocks today. Saved 10 API calls per test suite."
                </p>
                <div className="text-[10px] text-[#EFFF4F] font-bold">+15 Gamification Points Awarded</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
