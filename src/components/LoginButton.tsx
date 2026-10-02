"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import RoleSelectionModal, { RoleOption } from "@/components/auth/RoleSelectionModal";

export default function LoginButton({
  className = "inline-flex items-center gap-3 px-8 py-4 bg-[#EFFF4F] text-[#070709] hover:bg-[#EFFF4F]/95 font-mono font-bold text-xs uppercase tracking-wider rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(239,255,79,0.35)] hover:shadow-[0_0_45px_rgba(239,255,79,0.5)] border border-[#EFFF4F]/50 group cursor-pointer",
  label = "ENTER THE ARENA ->",
  defaultRole = "LEARNER",
}: {
  className?: string;
  label?: string;
  defaultRole?: RoleOption;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={className}
        type="button"
      >
        <span>{label}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      <RoleSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultRole={defaultRole}
      />
    </>
  );
}
