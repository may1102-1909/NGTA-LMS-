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
          ? "border border-[#EFFF4F]/30 bg-[#181C26] shadow-lemon-sm"
          : "border border-dashed border-[#252A36] bg-[#10131A]"
      } ${className}`}
    >
      {/* Card Header & Status Stamp */}
      <div className="flex items-start justify-between gap-3 border-b border-[#252A36] pb-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isCertificate ? "text-[#EFFF4F]" : "text-[#5A5F70]"
              }`}
            >
              {isCertificate
                ? "[ACCREDITED CERTIFICATE // VERIFIED]"
                : "[SKILL BADGE // EARNED]"}
            </span>
          </div>
          <div className="text-[11px] text-[#5A5F70] font-mono">
            ID: {credential.code}
          </div>
        </div>

        {/* State Icon Indicator */}
        <div
          className={`p-1.5 border ${
            isCertificate
              ? "border-[#EFFF4F]/30 bg-[#EFFF4F]/10 text-[#EFFF4F]"
              : "border-dashed border-[#252A36] bg-[#181C26] text-[#5A5F70]"
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
        <p className="text-[11px] text-[#A0A5B5] font-sans leading-relaxed">
          {credential.description}
        </p>
      </div>

      {/* Metadata Footprint */}
      <div className="pt-2 border-t border-[#252A36] flex items-center justify-between text-[10px] text-[#5A5F70] tabular-nums">
        <div>
          ISSUED: <span className="font-semibold text-white">{credential.issuedAt}</span>
        </div>

        {isCertificate && credential.verificationId ? (
          <Link
            href={`/verify?certId=${credential.verificationId}`}
            className="text-[#EFFF4F] hover:underline font-bold flex items-center gap-1 uppercase"
          >
            <span>Verify in Registry</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        ) : (
          <span className="text-[#5A5F70] uppercase font-bold tracking-wider">
            {credential.tier || "COMPETENCY VERIFIED"}
          </span>
        )}
      </div>
    </div>
  );
}
