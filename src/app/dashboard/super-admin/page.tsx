"use client";

import React, { useState, useEffect } from "react";
import {
  Key,
  ShieldAlert,
  Users,
  Database,
  Lock,
  Sparkles,
  Check,
  Loader2,
  Server,
  Activity,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface ProfileItem {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
}

const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "INSTRUCTOR",
  "CONTENT_MANAGER",
  "SUPPORT_STAFF",
  "LEARNER",
  "GUEST",
];

export default function SuperAdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setProfiles(json.ops?.allProfiles || []);
          setActivities(json.ops?.recentActivities || []);
        }
      }
    } catch (err) {
      console.error("Failed to load super admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = async (targetProfileId: string, newRole: string) => {
    try {
      setUpdatingId(targetProfileId);
      setSuccessMsg(null);
      setErrorMsg(null);

      const res = await fetch("/api/dashboard/stats", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetProfileId, newRole }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || "Failed to update role");
      }

      setProfiles((prev) =>
        prev.map((p) => (p.id === targetProfileId ? { ...p, role: newRole } : p))
      );
      setSuccessMsg(`User role updated to ${newRole} in Supabase PostgreSQL.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-white font-sans">
      {/* Top Banner */}
      <div className="border-b border-[#26213B] pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="font-mono text-xs text-[#64748B] uppercase tracking-widest mb-1 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-red-500/15 border border-red-500/40 text-red-400 font-bold text-[10px] rounded">
              ROOT GOVERNANCE
            </span>
            <span>•</span>
            <span className="text-[#94A3B8]">SUPER ADMIN MASTER CONSOLE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span>Platform Governance & 7-Role RBAC</span>
            <Key className="w-6 h-6 text-red-400" />
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
            Assign user roles directly into Supabase PostgreSQL, review security audit logs, and monitor infrastructure.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-2 rounded-xl">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-400 font-mono text-xs flex items-center gap-2 rounded-xl">
          <ShieldAlert className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* System Status Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>DATABASE CONNECTION</span>
            <Database className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div className="text-lg font-bold text-emerald-400 font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>CONNECTED (POOLER)</span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">Supabase ap-southeast-1:5432</p>
        </div>

        <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>PRISMA ORM SCHEMA</span>
            <Server className="w-4 h-4 text-[#06B6D4]" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            v6.19.3 SYNCHRONIZED
          </div>
          <p className="text-[11px] text-[#94A3B8]">multiSchema auth + public</p>
        </div>

        <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>PAYMENT RAILS</span>
            <Lock className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-lg font-bold text-[#F59E0B] font-mono">
            RAZORPAY LIVE (INR)
          </div>
          <p className="text-[11px] text-[#94A3B8]">UPI / NetBanking / Cards</p>
        </div>

        <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-mono">
            <span>RBAC ACCESS TIERS</span>
            <Key className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">
            7 BRD ROLES ACTIVE
          </div>
          <p className="text-[11px] text-[#94A3B8]">Middleware protected routes</p>
        </div>
      </div>

      {/* Main Table: RBAC Role Assignment Console */}
      <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#26213B] pb-3">
          <div>
            <h2 className="text-sm font-bold uppercase font-mono tracking-wider text-white">
              7-Role RBAC Assignment Console ({profiles.length} Users)
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Change any user's role on the fly. Persists directly to the Supabase PostgreSQL profiles table.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-[#64748B]">
            Querying all registered user profiles from Supabase...
          </div>
        ) : profiles.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-[#64748B]">
            No user profiles found in database.
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#26213B] text-[#64748B] text-[10px] uppercase">
                  <th className="pb-2">User / Email</th>
                  <th className="pb-2">Current Role</th>
                  <th className="pb-2">Assigned At</th>
                  <th className="pb-2 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26213B]">
                {profiles.map((p) => {
                  const isUpdating = updatingId === p.id;

                  return (
                    <tr key={p.id} className="hover:bg-[#161326] transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-white truncate max-w-[200px]">
                          {p.full_name || "Member"}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] truncate max-w-[200px]">
                          {p.email}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C084FC]">
                          {p.role || "LEARNER"}
                        </span>
                      </td>
                      <td className="py-3 text-[#64748B]">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8B5CF6]" />}
                          <select
                            value={p.role || "LEARNER"}
                            onChange={(e) => handleRoleChange(p.id, e.target.value)}
                            disabled={isUpdating}
                            className="bg-[#0E0C17] border border-[#26213B] focus:border-[#8B5CF6] text-white text-[11px] font-mono rounded px-2.5 py-1.5 focus:outline-none cursor-pointer"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* System Activity Audit Log */}
      <div className="bg-[#120F1D] border border-[#26213B] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#26213B] pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#8B5CF6]" />
            <h2 className="font-mono text-xs uppercase font-bold tracking-wider text-white">
              System Audit Event Log ({activities.length})
            </h2>
          </div>
        </div>

        {activities.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[#64748B]">
            No audit activities logged yet.
          </div>
        ) : (
          <div className="divide-y divide-[#26213B] font-mono text-xs max-h-60 overflow-y-auto">
            {activities.map((act) => (
              <div key={act.id} className="py-2.5 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-[#C084FC] font-bold">[{act.action_type}]</span>
                  <span className="text-[#94A3B8]">User ID: {act.user_id.slice(0, 8)}...</span>
                </div>
                <span className="text-[#64748B]">
                  {new Date(act.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
