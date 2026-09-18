"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="border-t-2 border-zinc-900 bg-white text-zinc-900 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-zinc-200">
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black tracking-tighter text-zinc-950">NGTA</span>
              <span className="text-[10px] font-bold px-1 bg-zinc-950 text-white">LMS</span>
            </div>
            <p className="text-zinc-600 leading-relaxed font-sans text-xs">
              NextGen Testing Academy is the premier technical training institute for Automation Engineers and SDETs.
            </p>
            <div className="text-[11px] text-zinc-500">
              ISO 9001:2015 ACCREDITED LEARNING STANDARDS
            </div>
          </div>

          <div>
            <div className="font-bold uppercase tracking-wider mb-3 text-zinc-950 border-b border-zinc-900 pb-1 inline-block">
              CURRICULUM
            </div>
            <ul className="space-y-2 text-zinc-600">
              <li><Link href="/courses/selenium-automation-masterclass" className="hover:text-blue-600">Selenium 4 WebDriver</Link></li>
              <li><Link href="/courses/playwright-typescript-end-to-end" className="hover:text-blue-600">Playwright & TypeScript</Link></li>
              <li><Link href="/courses" className="hover:text-blue-600">API Automation (RestAssured)</Link></li>
              <li><Link href="/courses" className="hover:text-blue-600">Performance Testing (JMeter)</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold uppercase tracking-wider mb-3 text-zinc-950 border-b border-zinc-900 pb-1 inline-block">
              ACADEMY RAILS
            </div>
            <ul className="space-y-2 text-zinc-600">
              <li><Link href="/live" className="hover:text-blue-600">Live SDET Bootcamps</Link></li>
              <li><Link href="/community" className="hover:text-blue-600">Peer Code Review Channels</Link></li>
              <li><Link href="/verify" className="hover:text-blue-600">Certificate Verification</Link></li>
              <li><Link href="/consultations" className="hover:text-blue-600">1-on-1 SDET Mentorship</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold uppercase tracking-wider mb-3 text-zinc-950 border-b border-zinc-900 pb-1 inline-block">
              SPECIFICATION
            </div>
            <div className="space-y-1 text-[11px] text-zinc-500">
              <div>BRD SPEC: v1.0 / 31-PAGE</div>
              <div>DESIGN: SWISS INTERNATIONAL</div>
              <div>SECURITY: RBAC LEVEL 4</div>
              <div>PAYMENTS: UPI / RAILS READY</div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-zinc-500 text-[11px] gap-4">
          <div>© {new Date().getFullYear()} NextGen Testing Academy. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-900">PRIVACY POLICY</Link>
            <Link href="/terms" className="hover:text-zinc-900">TERMS OF SERVICE</Link>
            <Link href="/audit" className="hover:text-zinc-900">AUDIT LOGS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
