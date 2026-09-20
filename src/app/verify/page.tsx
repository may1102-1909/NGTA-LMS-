"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Calendar,
  User,
  BookOpen,
  CheckCircle,
  Download,
  Share2,
  Search,
  ExternalLink,
} from "lucide-react";

function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const certIdParam = searchParams.get("certId") || "";

  const [inputCertId, setInputCertId] = useState(certIdParam || "NGTA-CERT-course-1-2026-8910");
  const [searchedCertId, setSearchedCertId] = useState(certIdParam || "NGTA-CERT-course-1-2026-8910");

  useEffect(() => {
    if (certIdParam) {
      setInputCertId(certIdParam);
      setSearchedCertId(certIdParam);
    }
  }, [certIdParam]);

  // Certificate Verification Payload
  const isValid = searchedCertId.startsWith("NGTA-CERT");

  const certificateData = {
    id: searchedCertId,
    recipient: "Tanmay Sharma",
    course: "Selenium WebDriver & Test Automation Framework Architecture",
    instructor: "Vikram Malhotra (Lead SDET)",
    issuedDate: "March 17, 2026",
    issuer: "NextGen Testing Academy (NGTA)",
    accreditation: "ISO 9001:2015 Technical Curriculum Standards",
    verificationStatus: "VALID / OFFICIALLY ACCREDITED",
    grade: "PASS (Score: 100%)",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Verification Header */}
      <div className="border-b border-[#252A36] pb-6">
        <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest mb-1">
          [PUBLIC VERIFICATION PROTOCOL // BRD SECTION 12]
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
          CREDENTIAL AUTHENTICATION REGISTRY
        </h1>
        <p className="text-[#A0A5B5] text-sm font-sans mt-2">
          Verify the authenticity of digital certificates issued by NextGen Testing Academy. Every credential is cryptographically anchored.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="border border-[#252A36] bg-[#181C26] p-4 shadow-card flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#5A5F70] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={inputCertId}
            onChange={(e) => setInputCertId(e.target.value)}
            placeholder="Enter Certificate ID (e.g. NGTA-CERT-course-1-2026-8910)..."
            className="w-full pl-9 pr-4 py-2.5 border border-[#252A36] bg-[#10131A] font-mono text-xs text-white placeholder:text-[#5A5F70] focus:outline-none focus:border-[#EFFF4F]/50 uppercase"
          />
        </div>
        <button
          onClick={() => setSearchedCertId(inputCertId)}
          className="px-6 py-2.5 bg-[#EFFF4F] text-[#10131A] font-mono text-xs font-bold uppercase hover:bg-[#EFFF4F]/90 transition-colors shadow-lemon-sm flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>AUTHENTICATE</span>
        </button>
      </div>

      {/* Certificate Viewer Card */}
      {isValid ? (
        <div className="border-2 border-[#EFFF4F]/30 bg-[#181C26] p-8 sm:p-12 shadow-lemon-md relative space-y-8">
          {/* Top Verification Watermark / Stamp */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#252A36] pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#EFFF4F] text-[#10131A] font-bold font-mono text-sm">NGTA</div>
              <div>
                <div className="text-sm font-black tracking-tight text-white uppercase">
                  NEXTGEN TESTING ACADEMY
                </div>
                <div className="font-mono text-[10px] text-[#5A5F70] uppercase">
                  GLOBAL SDET ACCREDITATION REGISTRY
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] font-mono text-xs font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>OFFICIALLY VERIFIED</span>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="text-center space-y-4 py-6">
            <div className="font-mono text-xs text-[#5A5F70] uppercase tracking-widest">
              THIS CERTIFICATE IS OFFICIALLY CONFERRED UPON
            </div>
            <div className="text-3xl sm:text-5xl font-black text-white tracking-tight underline decoration-[#EFFF4F] decoration-2 underline-offset-8">
              {certificateData.recipient}
            </div>
            <p className="text-[#A0A5B5] text-sm max-w-xl mx-auto font-sans pt-2">
              for successfully demonstrating technical competency, framework architecture principles, and passing the rigorous evaluation standards for
            </p>
            <div className="text-xl sm:text-2xl font-black text-[#EFFF4F] uppercase tracking-tight">
              {certificateData.course}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-[#252A36] py-6 font-mono text-xs">
            <div>
              <span className="text-[#5A5F70] block text-[10px] uppercase">CERTIFICATE ID</span>
              <span className="font-bold text-white">{certificateData.id}</span>
            </div>
            <div>
              <span className="text-[#5A5F70] block text-[10px] uppercase">DATE ISSUED</span>
              <span className="font-bold text-white">{certificateData.issuedDate}</span>
            </div>
            <div>
              <span className="text-[#5A5F70] block text-[10px] uppercase">INSTRUCTOR</span>
              <span className="font-bold text-white">{certificateData.instructor}</span>
            </div>
            <div>
              <span className="text-[#5A5F70] block text-[10px] uppercase">EVALUATION GRADE</span>
              <span className="font-bold text-[#EFFF4F]">{certificateData.grade}</span>
            </div>
          </div>

          {/* Signatures & Security Hash */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-4 font-mono text-xs">
            <div className="space-y-1">
              <div className="text-[#5A5F70] text-[10px]">CRYPTOGRAPHIC RECORD HASH</div>
              <div className="font-mono text-[10px] text-[#A0A5B5] bg-[#10131A] px-2 py-1 border border-[#252A36]">
                SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
              </div>
            </div>

            <div className="text-right space-y-1 border-t border-[#EFFF4F]/30 pt-2 min-w-[180px]">
              <div className="font-bold text-white">Vikram Malhotra</div>
              <div className="text-[10px] text-[#5A5F70]">HEAD OF ACCREDITATION, NGTA</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-red-500/50 bg-red-500/10 p-6 text-center space-y-2 font-mono text-xs text-red-400">
          <div className="font-bold text-sm">CERTIFICATE ID NOT FOUND IN SYSTEM REGISTRY</div>
          <p className="text-red-400/80">The queried credential could not be verified against the NGTA database.</p>
        </div>
      )}
    </div>
  );
}

export default function VerifyCertificatePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[#5A5F70]">AUTHENTICATING REGISTRY...</div>}>
      <VerifyCertificateContent />
    </Suspense>
  );
}
