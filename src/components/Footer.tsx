"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <footer className="border-t border-[#252A36] bg-[#0C0E14] text-white font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#252A36]">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="NGTA LMS Logo"
                width={28}
                height={28}
                className="w-7 h-7 object-contain rounded-md"
              />
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black tracking-tighter text-white">NGTA</span>
                <span className="text-[10px] font-bold px-1 bg-[#EFFF4F] text-[#10131A]">LMS</span>
              </div>
            </div>
            <p className="text-[#A0A5B5] leading-relaxed font-sans text-xs">
              NextGen Testing Academy is the premier technical training institute for Automation Engineers and SDETs.
            </p>
            <div className="text-[11px] text-[#5A5F70]">
              Empowering engineers worldwide with production-ready skills.
            </div>
          </div>

          <div>
            <div className="font-bold uppercase tracking-wider mb-3 text-[#EFFF4F] border-b border-[#EFFF4F]/20 pb-1 inline-block">
              CURRICULUM
            </div>
            <ul className="space-y-2 text-[#A0A5B5]">
              <li><Link href="/courses/selenium-automation-masterclass" className="hover:text-[#EFFF4F] transition-colors">Selenium Java + AI Masterclass</Link></li>
              <li><Link href="/courses/playwright-typescript-end-to-end" className="hover:text-[#EFFF4F] transition-colors">Full-Stack QA & SDET Masterclass</Link></li>
              <li><Link href="/courses" className="hover:text-[#EFFF4F] transition-colors">API Automation (RestAssured)</Link></li>
              <li><Link href="/courses" className="hover:text-[#EFFF4F] transition-colors">Performance Testing (JMeter)</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold uppercase tracking-wider mb-3 text-[#EFFF4F] border-b border-[#EFFF4F]/20 pb-1 inline-block">
              PROGRAMS
            </div>
            <ul className="space-y-2 text-[#A0A5B5]">
              <li><Link href="/live" className="hover:text-[#EFFF4F] transition-colors">Live SDET Bootcamps</Link></li>
              <li><Link href="/community" className="hover:text-[#EFFF4F] transition-colors">Peer Code Review Channels</Link></li>
              <li><Link href="/verify" className="hover:text-[#EFFF4F] transition-colors">Certificate Verification</Link></li>
              <li><Link href="/courses" className="hover:text-[#EFFF4F] transition-colors">1-on-1 SDET Mentorship</Link></li>
            </ul>
          </div>

          <div>
            <div className="font-bold uppercase tracking-wider mb-3 text-[#EFFF4F] border-b border-[#EFFF4F]/20 pb-1 inline-block">
              COMMUNITY & SUPPORT
            </div>
            <ul className="space-y-2 text-[#A0A5B5]">
              <li><Link href="/community" className="hover:text-[#EFFF4F] transition-colors">Discord Community</Link></li>
              <li><Link href="/verify" className="hover:text-[#EFFF4F] transition-colors">Verify Certificate</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#EFFF4F] transition-colors">Student Dashboard</Link></li>
              <li><Link href="/community" className="hover:text-[#EFFF4F] transition-colors">Help & FAQs</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-[#5A5F70] text-[11px] gap-4">
          <div>© {new Date().getFullYear()} NextGen Testing Academy. All rights reserved.</div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#EFFF4F] transition-colors">PRIVACY POLICY</Link>
            <Link href="/terms" className="hover:text-[#EFFF4F] transition-colors">TERMS OF SERVICE</Link>
            <Link href="/community" className="hover:text-[#EFFF4F] transition-colors">CONTACT SUPPORT</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
