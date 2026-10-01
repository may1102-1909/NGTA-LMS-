"use client";

import React, { useState, useEffect } from "react";
import {
  Headphones,
  Search,
  CheckCircle2,
  AlertCircle,
  Users,
  Receipt,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  LifeBuoy,
} from "lucide-react";

interface ProfileItem {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  created_at: string;
}

interface PaymentItem {
  id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  profiles?: {
    email: string;
    full_name?: string;
  };
}

export default function SupportStaffDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);

  useEffect(() => {
    async function loadSupportData() {
      try {
        const res = await fetch("/api/dashboard/stats");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setProfiles(data.ops?.allProfiles || []);
            setPayments(data.creator?.recentPayments || []);
          }
        }
      } catch (err) {
        console.error("Failed to load support desk data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSupportData();
  }, []);

  const filteredUsers = profiles.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.email.toLowerCase().includes(q) ||
      (p.full_name && p.full_name.toLowerCase().includes(q)) ||
      p.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white font-sans">
      {/* Header */}
      <div className="border-b border-[#26213B] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#64748B] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-[10px] rounded">
              HELPDESK & CRM
            </span>
            <span>•</span>
            <span className="text-[#94A3B8]">SUPPORT STAFF WORKSPACE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>Student Support & Account Verification</span>
            <Headphones className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Troubleshoot learner access, verify Razorpay payments, lookup user profiles, and resolve enrollment tickets.
          </p>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-4 shadow-xl flex items-center gap-3">
        <Search className="w-5 h-5 text-[#64748B] shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Lookup student by email, name, or UUID..."
          className="bg-transparent text-sm font-mono text-white placeholder-[#585175] focus:outline-none w-full"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs font-mono text-[#64748B] hover:text-white"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* 2-Column: Student Directory & Payment Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Lookup Table */}
        <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#26213B] pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                Registered Student Directory ({filteredUsers.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-[#64748B]">
              Querying registered students from Supabase...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[#64748B]">
              No student profiles match your lookup query.
            </div>
          ) : (
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#26213B] text-[#64748B] text-[10px] uppercase">
                    <th className="pb-2">Name / Email</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26213B]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#161326] transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-white truncate max-w-[180px]">
                          {u.full_name || "Member"}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] truncate max-w-[180px]">
                          {u.email}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C084FC] font-bold">
                          {u.role || "LEARNER"}
                        </span>
                      </td>
                      <td className="py-3 text-right text-[#64748B]">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payment Inquiries Table */}
        <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#26213B] pb-3">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#06B6D4]" />
              <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
                Live Transaction Verification ({payments.length})
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-[#64748B]">
              Querying payment transactions...
            </div>
          ) : payments.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[#64748B]">
              No transactions recorded in database yet.
            </div>
          ) : (
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#26213B] text-[#64748B] text-[10px] uppercase">
                    <th className="pb-2">Txn ID</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Student</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26213B]">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#161326] transition-colors">
                      <td className="py-3 text-[#C084FC] truncate max-w-[130px]">
                        {p.transaction_id}
                      </td>
                      <td className="py-3 font-bold text-white">
                        ₹{Number(p.amount).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-[#94A3B8] truncate max-w-[140px]">
                        {p.profiles?.full_name || p.profiles?.email || "Student"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
