import React from "react";
import Link from "next/link";
import { INITIAL_COURSES, INITIAL_LIVE_SESSIONS } from "@/lib/mockData";
import { ArrowUpRight, CheckCircle2, ShieldCheck, PlayCircle, Star, Terminal, Zap, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* SECTION 1: HERO (SWISS ASYMMETRIC GRID) */}
      <section className="border-b-2 border-zinc-900 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Typography & Intent */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 border border-zinc-900 font-mono text-xs uppercase tracking-widest bg-zinc-100">
                <span className="w-2 h-2 bg-blue-600"></span>
                <span>SYS_RELEASE: v1.0.0 // NEXTGEN TESTING ACADEMY</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-zinc-950 tracking-tighter leading-[0.95] uppercase">
                ENGINEERED FOR <br />
                <span className="text-blue-600 underline decoration-4 underline-offset-8">HIGH-VELOCITY</span> <br />
                SDET MASTERY.
              </h1>

              <p className="text-lg sm:text-xl text-zinc-700 max-w-2xl font-normal leading-relaxed">
                Autonomous, industry-standard Learning Management System delivering end-to-end automation architecture, live hands-on bootcamps, and cryptographically verifiable digital credentials.
              </p>

              <div className="pt-4 flex flex-wrap gap-4 font-mono text-xs uppercase font-bold tracking-wider">
                <Link
                  href="/courses"
                  className="px-6 py-3.5 bg-zinc-950 text-white hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span>EXPLORE COURSE CATALOG</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/verify"
                  className="px-6 py-3.5 border-2 border-zinc-950 text-zinc-950 hover:bg-zinc-100 transition-colors flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>VERIFY CERTIFICATE</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Key Technical Specs Box */}
            <div className="lg:col-span-4 border-2 border-zinc-900 bg-zinc-50 p-6 space-y-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-center border-b border-zinc-300 pb-3 font-mono text-xs">
                <span className="font-bold text-zinc-900 uppercase">[SPEC_SUMMARY]</span>
                <span className="text-zinc-500">ISO/IEC 25010</span>
              </div>

              <div className="space-y-3 font-mono text-xs text-zinc-800">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>W3C Standard</strong> WebDriver Architecture</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Live Indian Rails:</strong> UPI, Cards & NetBanking</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Drip Learning:</strong> Automated lesson unlock engine</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Gamification:</strong> Streaks, Leaderboards, Badges</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>7 Primary Roles:</strong> RBAC Least-Privilege</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-300 font-mono text-[11px] text-zinc-500">
                NGTA LMS ENGINE // AUTONOMOUS RUNTIME
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SYSTEM TELEMETRY / STATS GRID */}
      <section className="border-b-2 border-zinc-900 bg-zinc-950 text-white font-mono">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          <div className="p-6 sm:p-8">
            <div className="text-xs text-zinc-400 uppercase tracking-widest">[01 / AUDIENCE]</div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">10,000+</div>
            <div className="text-xs text-zinc-400 mt-1">REGISTERED SDET CANDIDATES</div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="text-xs text-zinc-400 uppercase tracking-widest">[02 / PASS RATE]</div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-400 mt-2">99.4%</div>
            <div className="text-xs text-zinc-400 mt-1">ASSESSMENT SATISFACTION</div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="text-xs text-zinc-400 uppercase tracking-widest">[03 / LATENCY]</div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-blue-400 mt-2">&lt; 200ms</div>
            <div className="text-xs text-zinc-400 mt-1">API RESPONSE TELEMETRY</div>
          </div>
          <div className="p-6 sm:p-8">
            <div className="text-xs text-zinc-400 uppercase tracking-widest">[04 / UPTIME]</div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-amber-400 mt-2">99.9%</div>
            <div className="text-xs text-zinc-400 mt-1">SYSTEM AVAILABILITY TARGET</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: STOREFRONT CATALOG (BRD SECTION 13) */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-4 border-b-2 border-zinc-900 gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-1">
              [CATALOG // FEATURED TRACKS]
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 uppercase tracking-tight">
              FEATURED ENGINEERING CURRICULA
            </h2>
          </div>
          <Link
            href="/courses"
            className="font-mono text-xs uppercase font-bold text-blue-600 hover:text-zinc-900 flex items-center gap-1"
          >
            <span>VIEW ALL 14 TRACKS</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INITIAL_COURSES.map((course, idx) => (
            <div
              key={course.id}
              className="border-2 border-zinc-900 bg-white flex flex-col justify-between hover:translate-y-[-2px] transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div>
                {/* Course Header Banner / Thumbnail */}
                <div className="relative h-48 border-b-2 border-zinc-900 overflow-hidden bg-zinc-100">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-zinc-950 text-white font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-zinc-800">
                    {course.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-white text-zinc-950 font-mono text-[10px] uppercase font-bold px-2 py-0.5 border border-zinc-900 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                {/* Course Content Info */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
                    <span>INDEX: 0{idx + 1}</span>
                    <span>•</span>
                    <span>{course.difficultyLevel}</span>
                    <span>•</span>
                    <span>{course.durationHours} HRS</span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-950 tracking-tight leading-snug">
                    <Link href={`/courses/${course.slug}`} className="hover:text-blue-600 transition-colors">
                      {course.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-zinc-600 line-clamp-2">
                    {course.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] px-2 py-0.5 border border-zinc-300 text-zinc-700 bg-zinc-50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Footer & Pricing */}
              <div className="p-6 border-t-2 border-zinc-900 bg-zinc-50 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] text-zinc-500 uppercase">ENROLLMENT FEE</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-zinc-950 font-mono">
                      ₹{course.discountPriceINR.toLocaleString()}
                    </span>
                    <span className="text-xs line-through text-zinc-400 font-mono">
                      ₹{course.priceINR.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/courses/${course.slug}`}
                  className="px-4 py-2.5 bg-zinc-950 text-white font-mono text-xs uppercase font-bold hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span>CURRICULUM</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: BRD SECTION 44 ACCEPTANCE SCENARIO WORKFLOW DEMO */}
      <section className="bg-white border-y-2 border-zinc-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-1">
              [ACCEPTANCE PROTOCOL // BRD SECTION 44]
            </div>
            <h2 className="text-3xl font-black text-zinc-950 uppercase tracking-tight">
              PRIMARY END-TO-END AUTONOMOUS LEARNING PIPELINE
            </h2>
            <p className="text-sm text-zinc-600 mt-2 font-mono">
              The exact automated sequence implemented and validated end-to-end:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 font-mono text-xs">
            <div className="border-2 border-zinc-900 p-4 bg-zinc-50 space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-blue-600 font-bold">01. DISCOVER</div>
              <div className="font-sans font-bold text-zinc-900">Browse Catalog</div>
              <p className="font-sans text-[11px] text-zinc-600">Explore modules, syllabus, prerequisites, and SDET tracks.</p>
            </div>
            <div className="border-2 border-zinc-900 p-4 bg-zinc-50 space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-blue-600 font-bold">02. COMMERCE</div>
              <div className="font-sans font-bold text-zinc-900">UPI / Rails Checkout</div>
              <p className="font-sans text-[11px] text-zinc-600">Simulated Indian payment with instant confirmation.</p>
            </div>
            <div className="border-2 border-zinc-900 p-4 bg-zinc-50 space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-blue-600 font-bold">03. ENROLL</div>
              <div className="font-sans font-bold text-zinc-900">Dashboard Unlock</div>
              <p className="font-sans text-[11px] text-zinc-600">Immediate access to course player and curriculum assets.</p>
            </div>
            <div className="border-2 border-zinc-900 p-4 bg-zinc-50 space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-blue-600 font-bold">04. LEARN</div>
              <div className="font-sans font-bold text-zinc-900">Progress Telemetry</div>
              <p className="font-sans text-[11px] text-zinc-600">Playback position tracking and drip release checks.</p>
            </div>
            <div className="border-2 border-zinc-900 p-4 bg-zinc-50 space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-blue-600 font-bold">05. ASSESS</div>
              <div className="font-sans font-bold text-zinc-900">Automated Quiz</div>
              <p className="font-sans text-[11px] text-zinc-600">Multi-question assessment with instant passing score check.</p>
            </div>
            <div className="border-2 border-zinc-900 p-4 bg-zinc-950 text-white p-4 space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-emerald-400 font-bold">06. CERTIFY</div>
              <div className="font-sans font-bold text-white">Verifiable Credential</div>
              <p className="font-sans text-[11px] text-zinc-300">Instant certificate with public verification URL & QR.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: LIVE WORKSHOPS & COMMUNITY PREVIEW */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Live Sessions */}
          <div className="border-2 border-zinc-900 p-6 sm:p-8 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                <span className="font-mono text-xs uppercase font-bold text-zinc-950">[LIVE SDET BOOTCAMPS]</span>
              </div>
              <Link href="/live" className="font-mono text-xs text-blue-600 hover:underline">VIEW ALL</Link>
            </div>

            <div className="space-y-4">
              {INITIAL_LIVE_SESSIONS.map((session) => (
                <div key={session.id} className="border border-zinc-200 p-4 hover:border-zinc-900 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] bg-zinc-100 px-2 py-0.5 border border-zinc-300 text-zinc-800">
                      {session.date} • {session.startTime}
                    </span>
                    <span className="font-mono text-[10px] text-emerald-600 font-bold">
                      CAPACITY: {session.capacity}
                    </span>
                  </div>
                  <h4 className="font-bold text-zinc-900 mt-2 text-base">{session.title}</h4>
                  <div className="font-mono text-xs text-zinc-500 mt-1">Instructor: {session.instructorName}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Community & Discussions */}
          <div className="border-2 border-zinc-900 p-6 sm:p-8 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-mono text-xs uppercase font-bold text-zinc-950">[PEER COMMUNITY]</span>
              </div>
              <Link href="/community" className="font-mono text-xs text-blue-600 hover:underline">JOIN CHANNEL</Link>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex justify-between text-zinc-500 text-[11px]">
                  <span className="font-bold text-zinc-900">#selenium-architecture</span>
                  <span>Active 12m ago</span>
                </div>
                <p className="font-sans text-xs text-zinc-700">
                  "How do you configure dynamic timeout back-offs when tests run inside Kubernetes runner pods?"
                </p>
                <div className="text-[10px] text-blue-600 font-bold">8 Responses • SDET Review Active</div>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex justify-between text-zinc-500 text-[11px]">
                  <span className="font-bold text-zinc-900">#playwright-tricks</span>
                  <span>Active 45m ago</span>
                </div>
                <p className="font-sans text-xs text-zinc-700">
                  "Mastered route interception for auth mocks today. Saved 10 API calls per test suite."
                </p>
                <div className="text-[10px] text-emerald-600 font-bold">+15 Gamification Points Awarded</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
