"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import RoleSelectionModal, { RoleOption } from "@/components/auth/RoleSelectionModal";

export default function LoginButton({
  className = "inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#EFFF4F] text-[#28282B] hover:bg-[#EFFF4F]/90 font-mono font-bold text-xs uppercase tracking-wider rounded transition-all hover:scale-[1.02] shadow-lemon-glow border border-[#EFFF4F]/40 group cursor-pointer",
  label = "ENTER LMS PLATFORM ->",
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
