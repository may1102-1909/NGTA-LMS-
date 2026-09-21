import React from "react";
import Link from "next/link";
import { INITIAL_COURSES, INITIAL_LIVE_SESSIONS } from "@/lib/mockData";
import { ArrowUpRight, CheckCircle2, ShieldCheck, PlayCircle, Star, Terminal, Zap, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* SECTION 1: HERO */}
      <section className="border-b border-[#252A36] bg-[#10131A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Typography & Intent */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-[#252A36] font-mono text-xs uppercase tracking-widest bg-[#181C26] text-[#A0A5B5]">
                <span className="w-2 h-2 bg-[#EFFF4F]"></span>
                <span>NEXTGEN TESTING ACADEMY • SPRING 2026</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.95] uppercase">
                ENGINEERED FOR <br />
                <span className="text-[#EFFF4F]">HIGH-VELOCITY</span> <br />
                SDET MASTERY.
              </h1>

              <p className="text-lg sm:text-xl text-[#A0A5B5] max-w-2xl font-normal leading-relaxed">
                Master enterprise test automation, performance engineering, and modern SDET architecture with hands-on bootcamps, real-world labs, and industry-recognized certifications.
              </p>

              <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs uppercase font-bold tracking-wider">
                <Link
                  href="/courses"
                  className="px-6 py-3.5 bg-[#EFFF4F] text-[#10131A] hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-2 shadow-lemon-sm"
                >
                  <span>EXPLORE COURSE CATALOG</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/verify"
                  className="px-6 py-3.5 border border-[#252A36] text-[#A0A5B5] hover:border-[#EFFF4F] hover:text-[#EFFF4F] transition-colors flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>VERIFY CERTIFICATE</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Key Highlights Box */}
            <div className="lg:col-span-4 border border-[#252A36] bg-[#181C26] p-6 space-y-5 shadow-card">
              <div className="flex justify-between items-center border-b border-[#252A36] pb-3 font-mono text-xs">
                <span className="font-bold text-[#EFFF4F] uppercase">PLATFORM HIGHLIGHTS</span>
                <span className="text-[#5A5F70]">SDET ACCREDITED</span>
              </div>

              <div className="space-y-3 font-mono text-xs text-[#A0A5B5]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#EFFF4F] shrink-0 mt-0.5" />
                  <span><strong className="text-white">Hands-On Labs:</strong> Selenium 4 & Playwright</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#EFFF4F] shrink-0 mt-0.5" />
                  <span><strong className="text-white">Instant Access:</strong> UPI, Cards & NetBanking</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#EFFF4F] shrink-0 mt-0.5" />
                  <span><strong className="text-white">Structured Learning:</strong> Step-by-step curriculum</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#EFFF4F] shrink-0 mt-0.5" />
                  <span><strong className="text-white">Gamification:</strong> Streaks, Leaderboards & Badges</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#EFFF4F] shrink-0 mt-0.5" />
                  <span><strong className="text-white">Mentorship:</strong> 1-on-1 Code Reviews & Guidance</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#252A36] font-mono text-[11px] text-[#5A5F70]">
                VERIFIED SDET CURRICULUM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: STATS GRID */}
      <section className="border-b border-[#252A36] bg-[#181C26] text-white font-mono">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#252A36]">
          <div className="p-6 sm:p-8">
            <div className="text-xs text-[#5A5F70] uppercase tracking-widest">ACTIVE LEARNERS</div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">10,000+</div>
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b border-[#252A36] gap-4">
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
            <div
              key={course.id}
              className="border border-[#252A36] bg-[#181C26] flex flex-col justify-between hover:border-[#EFFF4F]/30 hover:translate-y-[-2px] transition-all shadow-card hover:shadow-card-hover"
            >
              <div>
                {/* Course Header Banner / Thumbnail */}
                <div className="relative h-48 border-b border-[#252A36] overflow-hidden bg-[#10131A]">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-[#10131A]/90 text-[#EFFF4F] font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-[#252A36]">
                    {course.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#181C26] text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-[#252A36] flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#EFFF4F] fill-[#EFFF4F]" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Course Content Info */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 font-mono text-xs text-[#5A5F70]">
                    <span>INDEX: 0{idx + 1}</span>
                    <span>•</span>
                    <span>{course.difficultyLevel}</span>
                    <span>•</span>
                    <span>{course.durationHours} HRS</span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight leading-snug">
                    <Link href={`/courses/${course.slug}`} className="hover:text-[#EFFF4F] transition-colors">
                      {course.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-[#A0A5B5] line-clamp-2">
                    {course.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] px-2 py-0.5 border border-[#252A36] text-[#5A5F70] bg-[#10131A]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Footer & Pricing */}
              <div className="p-6 border-t border-[#252A36] bg-[#10131A] flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] text-[#5A5F70] uppercase">ENROLLMENT FEE</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white font-mono">
                      ₹{course.discountPriceINR.toLocaleString()}
                    </span>
                    <span className="text-xs line-through text-[#5A5F70] font-mono">
                      ₹{course.priceINR.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/courses/${course.slug}`}
                  className="px-4 py-2.5 bg-[#EFFF4F] text-[#10131A] font-mono text-xs uppercase font-bold hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-1.5 shadow-lemon-sm"
                >
                  <span>CURRICULUM</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: LEARNING JOURNEY WORKFLOW */}
      <section className="bg-[#181C26] border-y border-[#252A36] py-16">
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
            <div className="border border-[#252A36] p-4 bg-[#10131A] space-y-2 hover:border-[#EFFF4F]/30 transition-colors">
              <div className="text-[#EFFF4F] font-bold">01. DISCOVER</div>
              <div className="font-sans font-bold text-white">Browse Catalog</div>
              <p className="font-sans text-[11px] text-[#A0A5B5]">Explore modules, syllabus, prerequisites, and SDET tracks.</p>
            </div>
            <div className="border border-[#252A36] p-4 bg-[#10131A] space-y-2 hover:border-[#EFFF4F]/30 transition-colors">
              <div className="text-[#EFFF4F] font-bold">02. ENROLL</div>
              <div className="font-sans font-bold text-white">Instant Access</div>
              <p className="font-sans text-[11px] text-[#A0A5B5]">Seamless checkout with instant unlock to all course resources.</p>
            </div>
            <div className="border border-[#252A36] p-4 bg-[#10131A] space-y-2 hover:border-[#EFFF4F]/30 transition-colors">
              <div className="text-[#EFFF4F] font-bold">03. LEARN</div>
              <div className="font-sans font-bold text-white">Video Lessons</div>
              <p className="font-sans text-[11px] text-[#A0A5B5]">Deep-dive architecture walkthroughs and live coding demonstrations.</p>
            </div>
            <div className="border border-[#252A36] p-4 bg-[#10131A] space-y-2 hover:border-[#EFFF4F]/30 transition-colors">
              <div className="text-[#EFFF4F] font-bold">04. PRACTICE</div>
              <div className="font-sans font-bold text-white">Hands-On Labs</div>
              <p className="font-sans text-[11px] text-[#A0A5B5]">Build enterprise test suites with real Git repositories and CI/CD.</p>
            </div>
            <div className="border border-[#252A36] p-4 bg-[#10131A] space-y-2 hover:border-[#EFFF4F]/30 transition-colors">
              <div className="text-[#EFFF4F] font-bold">05. EVALUATE</div>
              <div className="font-sans font-bold text-white">Quizzes & Code Reviews</div>
              <p className="font-sans text-[11px] text-[#A0A5B5]">Validate understanding with technical quizzes and peer feedback.</p>
            </div>
            <div className="border border-[#EFFF4F]/30 p-4 bg-[#10131A] space-y-2 shadow-lemon-sm">
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
          <div className="border border-[#252A36] p-6 sm:p-8 bg-[#181C26] shadow-card space-y-6">
            <div className="flex justify-between items-center border-b border-[#252A36] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EFFF4F] animate-ping"></span>
                <span className="font-mono text-xs uppercase font-bold text-white">LIVE SDET BOOTCAMPS</span>
              </div>
              <Link href="/live" className="font-mono text-xs text-[#EFFF4F] hover:underline">VIEW ALL</Link>
            </div>

            <div className="space-y-4">
              {INITIAL_LIVE_SESSIONS.map((session) => (
                <div key={session.id} className="border border-[#252A36] p-4 hover:border-[#EFFF4F]/30 transition-colors bg-[#10131A]">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] bg-[#181C26] px-2 py-0.5 border border-[#252A36] text-[#A0A5B5]">
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
          <div className="border border-[#252A36] p-6 sm:p-8 bg-[#181C26] shadow-card space-y-6">
            <div className="flex justify-between items-center border-b border-[#252A36] pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#EFFF4F]" />
                <span className="font-mono text-xs uppercase font-bold text-white">PEER COMMUNITY</span>
              </div>
              <Link href="/community" className="font-mono text-xs text-[#EFFF4F] hover:underline">JOIN CHANNEL</Link>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-[#10131A] border border-[#252A36] space-y-2">
                <div className="flex justify-between text-[#5A5F70] text-[11px]">
                  <span className="font-bold text-white">#selenium-architecture</span>
                  <span>Active 12m ago</span>
                </div>
                <p className="font-sans text-xs text-[#A0A5B5]">
                  "How do you configure dynamic timeout back-offs when tests run inside Kubernetes runner pods?"
                </p>
                <div className="text-[10px] text-[#EFFF4F] font-bold">8 Responses • SDET Review Active</div>
              </div>

              <div className="p-4 bg-[#10131A] border border-[#252A36] space-y-2">
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
