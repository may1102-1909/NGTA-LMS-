"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import RoleSelectionModal, { RoleOption } from "@/components/auth/RoleSelectionModal";

export default function LoginButton({
  className = "inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#06B6D4] text-white font-bold text-sm uppercase tracking-wider rounded-full hover:brightness-110 transition-all hover:scale-105 shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-white/25 group cursor-pointer",
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
