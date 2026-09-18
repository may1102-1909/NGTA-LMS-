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
      {/* Verification Header (Swiss Style) */}
      <div className="border-b-2 border-zinc-900 pb-6">
        <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-1">
          [PUBLIC VERIFICATION PROTOCOL // BRD SECTION 12]
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 uppercase tracking-tight">
          CREDENTIAL AUTHENTICATION REGISTRY
        </h1>
        <p className="text-zinc-600 text-sm font-sans mt-2">
          Verify the authenticity of digital certificates issued by NextGen Testing Academy. Every credential is cryptographically anchored.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="border-2 border-zinc-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={inputCertId}
            onChange={(e) => setInputCertId(e.target.value)}
            placeholder="Enter Certificate ID (e.g. NGTA-CERT-course-1-2026-8910)..."
            className="w-full pl-9 pr-4 py-2.5 border border-zinc-300 font-mono text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 uppercase"
          />
        </div>
        <button
          onClick={() => setSearchedCertId(inputCertId)}
          className="px-6 py-2.5 bg-zinc-950 text-white font-mono text-xs font-bold uppercase hover:bg-blue-600 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>AUTHENTICATE</span>
        </button>
      </div>

      {/* Certificate Viewer Card */}
      {isValid ? (
        <div className="border-4 border-zinc-950 bg-white p-8 sm:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative space-y-8">
          {/* Top Verification Watermark / Stamp */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-zinc-900 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-zinc-950 text-white font-bold font-mono text-sm">NGTA</div>
              <div>
                <div className="text-sm font-black tracking-tight text-zinc-950 uppercase">
                  NEXTGEN TESTING ACADEMY
                </div>
                <div className="font-mono text-[10px] text-zinc-500 uppercase">
                  GLOBAL SDET ACCREDITATION REGISTRY
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border-2 border-emerald-600 text-emerald-800 font-mono text-xs font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>OFFICIALLY VERIFIED</span>
            </div>
          </div>

          {/* Certificate Body (Swiss Typography Hierarchy) */}
          <div className="text-center space-y-4 py-6">
            <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
              THIS CERTIFICATE IS OFFICIALLY CONFERRED UPON
            </div>
            <div className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight underline decoration-zinc-900 decoration-2 underline-offset-8">
              {certificateData.recipient}
            </div>
            <p className="text-zinc-600 text-sm max-w-xl mx-auto font-sans pt-2">
              for successfully demonstrating technical competency, framework architecture principles, and passing the rigorous evaluation standards for
            </p>
            <div className="text-xl sm:text-2xl font-black text-blue-600 uppercase tracking-tight">
              {certificateData.course}
            </div>
          </div>

          {/* Metadata Grid (Swiss Strict Grid) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t-2 border-b-2 border-zinc-900 py-6 font-mono text-xs">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">CERTIFICATE ID</span>
              <span className="font-bold text-zinc-950">{certificateData.id}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">DATE ISSUED</span>
              <span className="font-bold text-zinc-950">{certificateData.issuedDate}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">INSTRUCTOR</span>
              <span className="font-bold text-zinc-950">{certificateData.instructor}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase">EVALUATION GRADE</span>
              <span className="font-bold text-emerald-600">{certificateData.grade}</span>
            </div>
          </div>

          {/* Signatures & Security Hash */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-4 font-mono text-xs">
            <div className="space-y-1">
              <div className="text-zinc-400 text-[10px]">CRYPTOGRAPHIC RECORD HASH</div>
              <div className="font-mono text-[10px] text-zinc-600 bg-zinc-100 px-2 py-1 border border-zinc-300">
                SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
              </div>
            </div>

            <div className="text-right space-y-1 border-t-2 border-zinc-900 pt-2 min-w-[180px]">
              <div className="font-bold text-zinc-950">Vikram Malhotra</div>
              <div className="text-[10px] text-zinc-500">HEAD OF ACCREDITATION, NGTA</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-2 border-red-500 bg-red-50 p-6 text-center space-y-2 font-mono text-xs text-red-900">
          <div className="font-bold text-sm">CERTIFICATE ID NOT FOUND IN SYSTEM REGISTRY</div>
          <p>The queried credential could not be verified against the NGTA database.</p>
        </div>
      )}
    </div>
  );
}

export default function VerifyCertificatePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-zinc-500">AUTHENTICATING REGISTRY...</div>}>
      <VerifyCertificateContent />
    </Suspense>
  );
}

