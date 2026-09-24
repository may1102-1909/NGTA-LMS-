"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on CRT retro landing page, render pure full-screen stage without LMS chrome
  if (pathname === "/") {
    return <>{children}</>;
  }

  // If on dedicated full-screen video player classroom route (Image 2)
  if (pathname.startsWith("/learn/")) {
    return (
      <div className="min-h-screen flex flex-col bg-[#28282B] text-white">
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#28282B] text-white font-sans">
      {/* Left Vertical Navigation Sidebar (Image 1) */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar (Image 1 & replaced Image 3) */}
        <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Page View Body */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
