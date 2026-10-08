"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  ShieldAlert,
  Users,
  FileText,
  Flame,
  Trophy,
  Calendar,
  CheckCircle2,
  XCircle,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Lock,
  Search,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ReportItem } from "@/types";

interface PlatformStats {
  totalUsers: number;
  totalPosts: number;
  totalCommunities: number;
  totalChallenges: number;
  totalEvents: number;
  pendingReports: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "RESOLVED" | "DISMISSED">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"triage" | "system" | "rules">("triage");

  // Moderation filter toggles
  const [aiFilterActive, setAiFilterActive] = useState(true);
  const [spamGuardActive, setSpamGuardActive] = useState(true);
  const [strictRateLimit, setStrictRateLimit] = useState(true);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
      const data = await res.json();
      if (res.ok && data.success) {
        setReports(data.reports || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAction = async (
    reportId: string,
    action: "resolve" | "dismiss" | "delete_post",
    notes?: string
  ) => {
    setActionLoadingId(reportId);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, notes }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.report) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? data.report : r))
        );
        if (stats) {
          setStats({
            ...stats,
            pendingReports: Math.max(0, stats.pendingReports - 1),
          });
        }
        toast({
          type: "success",
          title: "Report Updated",
          message: `Action '${action}' applied to report ${reportId}.`,
        });
      } else {
        toast({ type: "error", title: data.message || "Action failed" });
      }
    } catch (err) {
      console.error(err);
      toast({ type: "error", title: "Network error processing action" });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const targetStr = (r.targetId || r.postId || "").toLowerCase();
    const reasonStr = (r.reason || "").toLowerCase();
    const detailsStr = (r.details || r.postContent || "").toLowerCase();
    const reporterStr = (r.reporterName || "").toLowerCase();
    const matchesSearch =
      targetStr.includes(searchQuery.toLowerCase()) ||
      reasonStr.includes(searchQuery.toLowerCase()) ||
      detailsStr.includes(searchQuery.toLowerCase()) ||
      reporterStr.includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-12">
      {/* Top Admin Security Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" size="sm">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Super Admin Portal
            </Badge>
            <span className="text-[11px] text-neutral-400 font-medium">Role: Platform Owner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Security & Content Moderation
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl leading-relaxed">
            Centralized governance console for community safety, user enforcement, copyright triage, and
            platform telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAdminData}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Platform Volume Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-3.5 bg-neutral-900/60 border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Total Users</span>
            <Users className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <div className="text-xl font-black text-white">{stats?.totalUsers ?? 6}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">+100% Active</span>
        </Card>

        <Card className="p-3.5 bg-neutral-900/60 border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Posts</span>
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">{stats?.totalPosts ?? 14}</div>
          <span className="text-[10px] text-neutral-400">Indexed Feeds</span>
        </Card>

        <Card className="p-3.5 bg-neutral-900/60 border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Communities</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-black text-white">{stats?.totalCommunities ?? 10}</div>
          <span className="text-[10px] text-neutral-400">Interest Hubs</span>
        </Card>

        <Card className="p-3.5 bg-neutral-900/60 border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Challenges</span>
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-white">{stats?.totalChallenges ?? 3}</div>
          <span className="text-[10px] text-emerald-400">Live Sprints</span>
        </Card>

        <Card className="p-3.5 bg-neutral-900/60 border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[10px] uppercase font-bold">Events</span>
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-black text-white">{stats?.totalEvents ?? 3}</div>
          <span className="text-[10px] text-neutral-400">Scheduled</span>
        </Card>

        <Card className="p-3.5 bg-neutral-900/60 border-rose-900/50">
          <div className="flex items-center justify-between text-neutral-400 mb-1">
            <span className="text-[10px] uppercase font-bold text-rose-400">Pending Triage</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-black text-rose-400">
            {stats?.pendingReports ?? reports.filter((r) => r.status === "PENDING").length}
          </div>
          <span className="text-[10px] text-neutral-400">Requires Review</span>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab("triage")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "triage"
              ? "bg-neutral-800 text-white border border-neutral-700"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" /> Moderation Triage Queue
        </button>
        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "system"
              ? "bg-neutral-800 text-white border border-neutral-700"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Sliders className="w-4 h-4 text-violet-400" /> Safety Gateways & AI Filters
        </button>
        <button
          onClick={() => setActiveTab("rules")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "rules"
              ? "bg-neutral-800 text-white border border-neutral-700"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Lock className="w-4 h-4 text-amber-400" /> Platform Security Policy
        </button>
      </div>

      {/* Tab 1: Moderation Queue */}
      {activeTab === "triage" && (
        <div className="space-y-4">
          {/* Queue Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {(["PENDING", "RESOLVED", "DISMISSED", "ALL"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    statusFilter === status
                      ? "bg-violet-600 text-white font-bold"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reports or reason..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-neutral-500 outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Reports List */}
          {isLoading ? (
            <div className="p-16 text-center text-xs text-neutral-500">Loading reports queue...</div>
          ) : filteredReports.length === 0 ? (
            <Card className="p-12 text-center bg-neutral-900/40 border-neutral-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white mb-1">Queue is Clear!</p>
              <p className="text-xs text-neutral-400">
                No reports matching the selected status filter.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <Card
                  key={report.id}
                  className="p-5 bg-neutral-900/50 border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          report.status === "PENDING"
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            : report.status === "RESOLVED" || report.status === "POST_REMOVED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-neutral-800 text-neutral-400"
                        }`}
                      >
                        {report.status}
                      </span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300 uppercase">
                        Target: {report.targetType || "POST"}
                      </span>

                      <span className="text-xs text-rose-400 font-bold">
                        Reason: {report.reason}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-200 leading-relaxed font-sans">
                      {report.details || report.postContent || "No additional description provided."}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-neutral-500">
                      <span>Reported by: <strong className="text-neutral-300">{report.reporterName || "Anonymous"}</strong></span>
                      <span>Target ID: <code className="text-violet-400 bg-neutral-950 px-1 py-0.5 rounded">{report.targetId || report.postId}</code></span>
                      <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>

                    {report.resolutionNotes && (
                      <div className="text-[11px] text-neutral-400 italic bg-neutral-950/60 p-2 rounded-lg border border-neutral-800">
                        Admin Note: {report.resolutionNotes}
                      </div>
                    )}
                  </div>

                  {/* Actions Button Bar */}
                  {report.status === "PENDING" ? (
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        isLoading={actionLoadingId === report.id}
                        onClick={() =>
                          handleAction(report.id, "dismiss", "Report reviewed: Content is within guidelines.")
                        }
                        leftIcon={<XCircle className="w-3.5 h-3.5 text-neutral-400" />}
                      >
                        Dismiss
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        isLoading={actionLoadingId === report.id}
                        onClick={() =>
                          handleAction(report.id, "resolve", "Creator issued warning. Monitoring account.")
                        }
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      >
                        Resolve
                      </Button>

                      {(report.targetType === "POST" || !report.targetType || report.postId) && (
                        <Button
                          variant="outline"
                          size="sm"
                          isLoading={actionLoadingId === report.id}
                          className="border-rose-900/50 text-rose-400 hover:bg-rose-950/40"
                          onClick={() =>
                            handleAction(report.id, "delete_post", "Post violated Terms of Service and was removed.")
                          }
                          leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-400" />}
                        >
                          Delete Post
                        </Button>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-500 italic">Action completed</span>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: System Filters & Gateways */}
      {activeTab === "system" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="p-5 bg-neutral-900/60 border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Automated NSFW Scanner
              </span>
              <button
                onClick={() => setAiFilterActive(!aiFilterActive)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  aiFilterActive ? "bg-violet-600 justify-end" : "bg-neutral-800 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Real-time deep learning vision filter pre-screens image and video uploads before
              publishing to public VYBE feeds.
            </p>
            <div className="pt-2 text-[11px] text-emerald-400 font-semibold">
              Status: Active • 99.98% Accuracy
            </div>
          </Card>

          <Card className="p-5 bg-neutral-900/60 border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Spam & Bot Guard
              </span>
              <button
                onClick={() => setSpamGuardActive(!spamGuardActive)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  spamGuardActive ? "bg-violet-600 justify-end" : "bg-neutral-800 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Detects repetitive comment duplication, external phishing links, and bot-driven engagement
              bursts.
            </p>
            <div className="pt-2 text-[11px] text-emerald-400 font-semibold">
              Status: Active • Zero False Positives Today
            </div>
          </Card>

          <Card className="p-5 bg-neutral-900/60 border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Strict API Rate Limiter
              </span>
              <button
                onClick={() => setStrictRateLimit(!strictRateLimit)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  strictRateLimit ? "bg-violet-600 justify-end" : "bg-neutral-800 justify-start"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Restricts unauthenticated brute-force requests and prevents automated message spam
              against verified creators.
            </p>
            <div className="pt-2 text-[11px] text-emerald-400 font-semibold">
              Status: 120 req/min per IP
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Security & Moderation Policy */}
      {activeTab === "rules" && (
        <Card className="p-6 bg-neutral-900/60 border-neutral-800 space-y-4">
          <h3 className="text-base font-bold text-white">VYBE Community Safety Principles</h3>
          <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <h4 className="font-bold text-violet-300 mb-1">01. Creator Intellectual Property</h4>
              <p className="text-neutral-400">
                Creators own 100% of their media, presets, LUTs, and tutorials. Content scrapers,
                unauthorized re-uploads, and impersonation lead to immediate suspension.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <h4 className="font-bold text-cyan-300 mb-1">02. Community-Driven Self Governance</h4>
              <p className="text-neutral-400">
                Interest Hubs (VYBES) are moderated by elected community leads who can pin topics,
                archive off-topic discussions, and escalate high-severity violations to Platform Admins.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800">
              <h4 className="font-bold text-amber-300 mb-1">03. User Blocking & Muting Isolation</h4>
              <p className="text-neutral-400">
                When a user blocks another member, the blocked user is immediately filtered out of
                messaging channels, post comments, and notification streams.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
