"use client";

import React from "react";
import Link from "next/link";
import { CredentialItem } from "@/lib/gamification";
import { ShieldCheck, Award, ExternalLink, Sparkles } from "lucide-react";

interface CredentialCardProps {
  credential: CredentialItem;
  className?: string;
}

export default function CredentialCard({
  credential,
  className = "",
}: CredentialCardProps) {
  const isCertificate = credential.type === "CERTIFICATE";

  return (
    <div
      className={`p-5 font-mono text-xs space-y-3 transition-all rounded-xl ${
        isCertificate
          ? "border border-[#8B5CF6]/50 bg-[#161326] shadow-[0_0_15px_rgba(139,92,246,0.22)]"
          : "border border-dashed border-[#26213B] bg-[#120F1D]"
      } ${className}`}
    >
      {/* Card Header & Status Stamp */}
      <div className="flex items-start justify-between gap-3 border-b border-[#26213B] pb-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isCertificate ? "text-[#C084FC]" : "text-[#64748B]"
              }`}
            >
              {isCertificate
                ? "CERTIFICATE OF COMPLETION"
                : "SKILL BADGE"}
            </span>
          </div>
          <div className="text-[11px] text-[#64748B] font-mono">
            ID: {credential.code}
          </div>
        </div>

        {/* State Icon Indicator */}
        <div
          className={`p-1.5 border rounded-lg ${
            isCertificate
              ? "border-[#8B5CF6]/40 bg-[#8B5CF6]/15 text-[#C084FC] shadow-[0_0_10px_rgba(139,92,246,0.25)]"
              : "border-dashed border-[#26213B] bg-[#161326] text-[#64748B]"
          }`}
        >
          {isCertificate ? (
            <ShieldCheck className="w-4 h-4 text-[#A855F7]" />
          ) : (
            <Award className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Title & Technical Description */}
      <div className="space-y-1">
        <h4 className="font-bold text-sm text-white uppercase tracking-tight leading-snug">
          {credential.title}
        </h4>
        <p className="text-[11px] text-[#94A3B8] font-sans leading-relaxed">
          {credential.description}
        </p>
      </div>

      {/* Metadata Footprint */}
      <div className="pt-2 border-t border-[#26213B] flex items-center justify-between text-[10px] text-[#64748B] tabular-nums">
        <div>
          ISSUED: <span className="font-semibold text-white">{credential.issuedAt}</span>
        </div>

        {isCertificate && credential.verificationId ? (
          <Link
            href={`/verify?certId=${credential.verificationId}`}
            className="text-[#A855F7] hover:underline font-bold flex items-center gap-1 uppercase"
          >
            <span>Verify in Registry</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        ) : (
          <span className="text-[#64748B] uppercase font-bold tracking-wider">
            {credential.tier || "COMPETENCY VERIFIED"}
          </span>
        )}
      </div>
    </div>
  );
}
