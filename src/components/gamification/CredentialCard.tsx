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
      className={`p-5 font-mono text-xs space-y-3 transition-all ${
        isCertificate
          ? "border border-[#FCA311]/40 bg-[#14213D] shadow-lemon-sm"
          : "border border-dashed border-[#1f2d4d] bg-[#000000]"
      } ${className}`}
    >
      {/* Card Header & Status Stamp */}
      <div className="flex items-start justify-between gap-3 border-b border-[#1f2d4d] pb-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isCertificate ? "text-[#FCA311]" : "text-[#8A96A8]"
              }`}
            >
              {isCertificate
                ? "CERTIFICATE OF COMPLETION"
                : "SKILL BADGE"}
            </span>
          </div>
          <div className="text-[11px] text-[#8A96A8] font-mono">
            ID: {credential.code}
          </div>
        </div>

        {/* State Icon Indicator */}
        <div
          className={`p-1.5 border ${
            isCertificate
              ? "border-[#FCA311]/30 bg-[#FCA311]/10 text-[#FCA311]"
              : "border-dashed border-[#1f2d4d] bg-[#14213D] text-[#8A96A8]"
          }`}
        >
          {isCertificate ? (
            <ShieldCheck className="w-4 h-4" />
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
        <p className="text-[11px] text-[#E5E5E5] font-sans leading-relaxed">
          {credential.description}
        </p>
      </div>

      {/* Metadata Footprint */}
      <div className="pt-2 border-t border-[#1f2d4d] flex items-center justify-between text-[10px] text-[#8A96A8] tabular-nums">
        <div>
          ISSUED: <span className="font-semibold text-white">{credential.issuedAt}</span>
        </div>

        {isCertificate && credential.verificationId ? (
          <Link
            href={`/verify?certId=${credential.verificationId}`}
            className="text-[#FCA311] hover:underline font-bold flex items-center gap-1 uppercase"
          >
            <span>Verify in Registry</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        ) : (
          <span className="text-[#8A96A8] uppercase font-bold tracking-wider">
            {credential.tier || "COMPETENCY VERIFIED"}
          </span>
        )}
      </div>
    </div>
  );
}
