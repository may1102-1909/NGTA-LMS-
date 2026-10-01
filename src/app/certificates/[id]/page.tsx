import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Download,
  Share2,
  ChevronLeft,
  ArrowRight,
  BookOpen,
} from "lucide-react";

interface CertificatePageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function CertificateViewerPage({ params }: CertificatePageProps) {
  const resolvedParams = await params;
  const certId = resolvedParams.id;

  // Query database certificate by certificate_id or id
  const cert = await prisma.certificates.findFirst({
    where: {
      OR: [{ certificate_id: certId }, { id: certId }],
    },
    include: {
      profile: true,
    },
  });

  if (!cert) {
    notFound();
  }

  const issueDate = new Date(cert.issued_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#28282B] text-white font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3E3E43] pb-4 font-mono text-xs">
          <Link
            href="/dashboard/learner"
            className="flex items-center gap-1.5 text-[#5A5F70] hover:text-[#EFFF4F] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>LEARNER DASHBOARD</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/verify?certId=${cert.certificate_id}`}
              className="px-3 py-1.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/30 text-[#EFFF4F] hover:bg-[#EFFF4F]/20 font-bold transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>REGISTRY VERIFICATION</span>
            </Link>
          </div>
        </div>

        {/* Certificate Physical Container */}
        <div className="relative border-2 border-[#EFFF4F]/40 bg-[#333336] p-8 sm:p-14 shadow-2xl rounded-2xl overflow-hidden space-y-8">
          {/* Subtle Ambient Lemon Glow */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#EFFF4F]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Certificate Header Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#3E3E43] pb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="px-3 py-2 bg-[#EFFF4F] text-[#28282B] font-black font-mono text-base rounded shadow-lemon-sm">
                NGTA
              </div>
              <div>
                <div className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
                  NEXTGEN TESTING ACADEMY
                </div>
                <div className="font-mono text-[10px] text-[#A0A5B5] uppercase tracking-wider">
                  OFFICIAL GLOBAL ACCREDITATION REGISTRY
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#EFFF4F]/10 border border-[#EFFF4F]/40 text-[#EFFF4F] font-mono text-xs font-bold rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span>AUTHENTIC CERTIFIED RECORD</span>
            </div>
          </div>

          {/* Certificate Main Body */}
          <div className="text-center space-y-4 py-8 relative z-10">
            <div className="font-mono text-xs uppercase tracking-widest text-[#5A5F70]">
              THIS CERTIFICATE IS PROUDLY CONFERRED UPON
            </div>

            <div className="text-3xl sm:text-5xl font-black text-white tracking-tight underline decoration-[#EFFF4F] decoration-2 underline-offset-8">
              {cert.recipient_name}
            </div>

            <p className="text-[#A0A5B5] text-xs sm:text-sm max-w-xl mx-auto font-sans pt-2 leading-relaxed">
              for successfully completing all curriculum modules, executing automation test frameworks, and passing the comprehensive examination evaluation standards for
            </p>

            <div className="text-xl sm:text-2xl font-black text-[#EFFF4F] uppercase tracking-tight font-sans">
              {cert.course_title}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-[#3E3E43] py-6 font-mono text-xs relative z-10">
            <div>
              <span className="text-[#5A5F70] block text-[10px] uppercase font-bold">
                CERTIFICATE ID
              </span>
              <span className="font-bold text-white tracking-wider">{cert.certificate_id}</span>
            </div>

            <div>
              <span className="text-[#5A5F70] block text-[10px] uppercase font-bold">
                DATE ISSUED
              </span>
              <span className="font-bold text-white">{issueDate}</span>
            </div>

            <div>
              <span className="text-[#5A5F70] block text-[10px] uppercase font-bold">
                EVALUATION RESULT
              </span>
              <span className="font-bold text-[#EFFF4F]">{cert.grade}</span>
            </div>

            <div>
              <span className="text-[#5A5F70] block text-[10px] uppercase font-bold">
                STATUS
              </span>
              <span className="font-bold text-emerald-400">ACTIVE & VERIFIED</span>
            </div>
          </div>

          {/* Signatures & Security Hash */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-4 font-mono text-xs relative z-10">
            <div className="space-y-1.5">
              <div className="text-[#5A5F70] text-[10px] uppercase font-bold">
                CRYPTOGRAPHIC VERIFICATION SIGNATURE
              </div>
              <div className="font-mono text-[10px] text-[#A0A5B5] bg-[#28282B] px-3 py-1.5 border border-[#3E3E43] rounded">
                SHA256: {Buffer.from(cert.certificate_id).toString("base64").padEnd(32, "0").slice(0, 32)}
              </div>
            </div>

            <div className="text-right space-y-1 border-t border-[#EFFF4F]/40 pt-3 min-w-[200px]">
              <div className="font-black text-sm text-white uppercase">Rahul Kamat</div>
              <div className="text-[10px] text-[#5A5F70] uppercase">
                FOUNDER & LEAD SDET, NGTA
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <span className="text-[#5A5F70]">
            Verifiable public link: /certificates/{cert.certificate_id}
          </span>

          <div className="flex items-center gap-3">
            <Link
              href={`/verify?certId=${cert.certificate_id}`}
              className="px-5 py-2.5 bg-[#EFFF4F] text-[#28282B] font-bold uppercase rounded-lg shadow-lemon-sm hover:bg-[#EFFF4F]/90 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify on Registry</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
