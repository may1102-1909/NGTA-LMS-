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
          ? // Solid border = verified certificate
            "border-2 border-zinc-900 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          : // Dashed border = badge (lighter-weight, non-verified achievement)
            "border-2 border-dashed border-zinc-800 bg-zinc-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
      } ${className}`}
    >
      {/* Card Header & Status Stamp */}
      <div className="flex items-start justify-between gap-3 border-b border-zinc-200 pb-2.5">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isCertificate ? "text-emerald-700" : "text-zinc-600"
              }`}
            >
              {isCertificate
                ? "[ACCREDITED CERTIFICATE // VERIFIED]"
                : "[SKILL BADGE // EARNED]"}
            </span>
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">
            ID: {credential.code}
          </div>
        </div>

        {/* State Icon Indicator */}
        <div
          className={`p-1.5 border ${
            isCertificate
              ? "border-zinc-900 bg-emerald-100 text-emerald-800"
              : "border-dashed border-zinc-700 bg-zinc-200 text-zinc-800"
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
        <h4 className="font-bold text-sm text-zinc-950 uppercase tracking-tight leading-snug">
          {credential.title}
        </h4>
        <p className="text-[11px] text-zinc-600 font-sans leading-relaxed">
          {credential.description}
        </p>
      </div>

      {/* Metadata Footprint */}
      <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500 tabular-nums">
        <div>
          ISSUED: <span className="font-semibold text-zinc-800">{credential.issuedAt}</span>
        </div>

        {isCertificate && credential.verificationId ? (
          <Link
            href={`/verify?certId=${credential.verificationId}`}
            className="text-blue-600 hover:underline font-bold flex items-center gap-1 uppercase"
          >
            <span>Verify in Registry</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        ) : (
          <span className="text-zinc-500 uppercase font-bold tracking-wider">
            {credential.tier || "COMPETENCY VERIFIED"}
          </span>
        )}
      </div>
    </div>
  );
}
