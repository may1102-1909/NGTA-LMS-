"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Download,
  Share2,
  ExternalLink,
  Search,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { INITIAL_CREDENTIALS, CredentialItem } from "@/lib/gamification";
import CredentialCard from "@/components/gamification/CredentialCard";

export default function CertificatesPage() {
  const [filter, setFilter] = useState<"ALL" | "CERTIFICATE" | "BADGE">("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCredentials = INITIAL_CREDENTIALS.filter((cred) => {
    const matchesFilter = filter === "ALL" ? true : cred.type === filter;
    const matchesSearch =
      cred.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-[#3E3E43] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
              VERIFIED ACCREDITATION
            </span>
            <span>•</span>
            <span className="text-[#A0A5B5]">DIGITAL BADGES & CERTIFICATES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>MY VERIFIED CREDENTIALS</span>
            <Award className="w-8 h-8 text-emerald-400 shrink-0" />
          </h1>
          <p className="text-sm text-[#A0A5B5] mt-2 max-w-3xl">
            All credentials issued by NextGen Testing Academy are cryptographically signed and publicly verifiable by hiring managers and enterprise engineering teams.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <Link
            href="/verify"
            className="px-4 py-2 bg-[#EFFF4F] text-[#28282B] font-bold uppercase hover:bg-[#EFFF4F]/90 transition-colors flex items-center gap-1.5 shadow-lemon-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Public Certificate Registry</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex border border-[#3E3E43] bg-[#333336] font-mono text-xs font-bold w-fit">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 uppercase transition-colors ${
              filter === "ALL"
                ? "bg-[#EFFF4F] text-[#28282B]"
                : "text-[#A0A5B5] hover:bg-[#3E3E43]"
            }`}
          >
            ALL CREDENTIALS ({INITIAL_CREDENTIALS.length})
          </button>
          <button
            onClick={() => setFilter("CERTIFICATE")}
            className={`px-4 py-2 uppercase border-l border-[#3E3E43] transition-colors ${
              filter === "CERTIFICATE"
                ? "bg-[#EFFF4F] text-[#28282B]"
                : "text-[#A0A5B5] hover:bg-[#3E3E43]"
            }`}
          >
            SOLID: CERTIFICATES
          </button>
          <button
            onClick={() => setFilter("BADGE")}
            className={`px-4 py-2 uppercase border-l border-[#3E3E43] transition-colors ${
              filter === "BADGE"
                ? "bg-[#EFFF4F] text-[#28282B]"
                : "text-[#A0A5B5] hover:bg-[#3E3E43]"
            }`}
          >
            DASHED: SKILL BADGES
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#5A5F70] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search credentials..."
            className="w-full pl-9 pr-4 py-2 border border-[#3E3E43] bg-[#333336] font-mono text-xs text-white placeholder:text-[#5A5F70] focus:outline-none focus:border-[#EFFF4F]"
          />
        </div>
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCredentials.map((cred) => (
          <div key={cred.id} className="space-y-3">
            <CredentialCard credential={cred} />
            <div className="flex items-center justify-between text-xs font-mono pt-1">
              <Link
                href={`/verify?certId=NGTA-CERT-course-1-2026-8910`}
                className="text-[#EFFF4F] hover:underline flex items-center gap-1 font-bold text-[11px]"
              >
                <span>Verify Registry</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={() => alert(`Certificate ${cred.title} downloaded!`)}
                className="text-[#A0A5B5] hover:text-white flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3 h-3" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Verification Instructions Callout */}
      <div className="border border-[#3E3E43] bg-[#333336] p-6 rounded-lg font-mono text-xs space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>CRYPTOGRAPHIC VERIFICATION SYSTEM</span>
        </div>
        <p className="text-[#A0A5B5] font-sans text-xs leading-relaxed">
          Every certificate issued by NGTA carries a distinct SHA-256 digital signature and unique serial number. Recruiters can verify the certificate status directly via <Link href="/verify" className="text-[#EFFF4F] underline">/verify</Link> without login credentials.
        </p>
      </div>
    </div>
  );
}
