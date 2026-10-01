import React from "react";

export function SparkLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-white text-[#08070D] shadow-lg shadow-white/20 hover:scale-105 transition-transform ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/5 h-3/5">
        <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
      </svg>
    </div>
  );
}

export default SparkLogo;
