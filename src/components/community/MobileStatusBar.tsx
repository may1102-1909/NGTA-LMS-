"use client";

import React from "react";
import { Wifi, Battery } from "lucide-react";

export default function MobileStatusBar() {
  return (
    <div className="w-full flex items-center justify-between px-6 pt-3 pb-2 text-white font-medium text-xs tracking-tight select-none">
      <span>12:52</span>
      <div className="flex items-center gap-1.5 opacity-90">
        {/* Cellular Signal Bars */}
        <div className="flex items-end gap-0.5 h-3">
          <span className="w-0.5 h-1 bg-white rounded-full" />
          <span className="w-0.5 h-1.5 bg-white rounded-full" />
          <span className="w-0.5 h-2.5 bg-white rounded-full" />
          <span className="w-0.5 h-3 bg-white rounded-full" />
        </div>
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-4 fill-white" />
      </div>
    </div>
  );
}
