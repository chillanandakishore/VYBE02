"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Users,
  DollarSign,
  Award,
  ArrowUpRight,
  Film,
  Download,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function CreatorDashboardPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [activeTab, setActiveTab] = useState<"analytics" | "monetization" | "content">("analytics");

  // Simulated live creator KPIs
  const stats = {
    followers: 12480,
    followersChange: "+18.4%",
    profileViews: 48200,
    profileViewsChange: "+24.1%",
    postViews: 342000,
    reelViews: 1240000,
    totalLikes: 89400,
    totalComments: 6320,
    totalShares: 14800,
    totalSaves: 19400,
    engagementRate: 8.6,
    estimatedEarnings: 840,
  };

  const topContent = [
    {
      id: "c1",
      title: "DaVinci Resolve 19 Film Look PowerGrade Breakdown",
      type: "Reel",
      views: "420.5K",
      watchTime: "88%",
      likes: "34.2K",
      shares: "6.8K",
      ctr: "12.4%",
    },
    {
      id: "c2",
      title: "Night Street Photography in Shinjuku: 35mm f/1.4",
      type: "Post",
      views: "184.2K",
      watchTime: "--",
      likes: "18.9K",
      shares: "2.4K",
      ctr: "9.2%",
    },
    {
      id: "c3",
      title: "Why Modern Color Science Needs Custom LUT Curves",
      type: "Post",
      views: "92.1K",
      watchTime: "--",
      likes: "11.4K",
      shares: "1.9K",
      ctr: "8.1%",
    },
    {
      id: "c4",
      title: "Anamorphic Bokeh vs Spherical Bokeh Blind Test",
      type: "Reel",
      views: "284.0K",
      watchTime: "92%",
      likes: "24.5K",
      shares: "5.1K",
      ctr: "14.1%",
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary" size="sm">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" /> CREATOR MODE ACTIVE
            </Badge>
            <span className="text-xs text-neutral-400">
              @{user?.username || "creator"} • Level 4 Verified
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Creator Studio & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Real-time telemetry, audience growth attribution, engagement benchmarks, and monetization
            pipelines.
          </p>
        </div>

        {/* Action Buttons & Time Range Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-1 flex items-center text-xs">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? "bg-violet-600 text-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast({
                type: "success",
                title: "Media Kit Exported",
                message: "VYBE verified creator analytics report downloaded as PDF.",
              })
            }
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Media Kit
          </Button>

          <Link href="/studio">
            <Button variant="gradient" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
              AI Studio
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "analytics"
              ? "bg-neutral-800 text-white border border-neutral-700"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <TrendingUp className="w-4 h-4 text-violet-400" /> Performance & Growth
        </button>
        <button
          onClick={() => setActiveTab("monetization")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "monetization"
              ? "bg-neutral-800 text-white border border-neutral-700"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-400" /> Creator Monetization
        </button>
        <button
          onClick={() => setActiveTab("content")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "content"
              ? "bg-neutral-800 text-white border border-neutral-700"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Film className="w-4 h-4 text-cyan-400" /> Content Breakdown
        </button>
      </div>

      {/* Tab 1: Analytics & Growth */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-neutral-900/50 border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-xs font-medium">Audience Size</span>
                <Users className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {stats.followers.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> {stats.followersChange} this month
              </span>
            </Card>

            <Card className="p-4 bg-neutral-900/50 border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-xs font-medium">Reel Impressions</span>
                <Film className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">1.24M</div>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> +32.8% algorithmic boost
              </span>
            </Card>

            <Card className="p-4 bg-neutral-900/50 border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-xs font-medium">Engagement Rate</span>
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">{stats.engagementRate}%</div>
              <span className="text-[11px] text-violet-400 font-semibold mt-1 block">
                Top 5% in Cinematography
              </span>
            </Card>

            <Card className="p-4 bg-neutral-900/50 border-neutral-800">
              <div className="flex items-center justify-between text-neutral-400 mb-2">
                <span className="text-xs font-medium">Profile Views</span>
                <Eye className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {stats.profileViews.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-0.5 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> {stats.profileViewsChange}
              </span>
            </Card>
          </div>

          {/* Engagement Breakdown Bar */}
          <Card className="p-5 bg-neutral-900/60 border-neutral-800">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">
              Cumulative Interaction Telemetry
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <Heart className="w-4 h-4 text-rose-500 mx-auto mb-1" />
                <span className="text-lg font-black text-white block">89.4K</span>
                <span className="text-[11px] text-neutral-400">Likes</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <MessageSquare className="w-4 h-4 text-cyan-500 mx-auto mb-1" />
                <span className="text-lg font-black text-white block">6.32K</span>
                <span className="text-[11px] text-neutral-400">Comments</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <Share2 className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <span className="text-lg font-black text-white block">14.8K</span>
                <span className="text-[11px] text-neutral-400">Shares</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                <Bookmark className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="text-lg font-black text-white block">19.4K</span>
                <span className="text-[11px] text-neutral-400">Saves</span>
              </div>
            </div>
          </Card>

          {/* 30-Day Growth Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-5 bg-neutral-900/60 border-neutral-800 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Daily Impressions Velocity</h3>
                  <p className="text-xs text-neutral-400">Rolling 30-day views distribution</p>
                </div>
                <span className="text-xs font-bold text-violet-400">Avg. 41.2K / day</span>
              </div>

              {/* Responsive Bar Chart Simulation */}
              <div className="h-44 flex items-end gap-1.5 pt-6 pb-2 px-2 border-b border-neutral-800">
                {[
                  35, 42, 48, 55, 62, 58, 65, 70, 68, 75, 82, 90, 85, 95, 100, 88, 92, 110, 105,
                  115, 120, 118, 125, 130, 140, 135, 145, 150, 160, 175,
                ].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    <div
                      style={{ height: `${(val / 175) * 100}%` }}
                      className="w-full rounded-t-sm bg-gradient-to-t from-violet-700 to-cyan-400 group-hover:brightness-125 transition-all cursor-pointer"
                    />
                    <div className="absolute -top-7 hidden group-hover:block bg-neutral-950 text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-neutral-700 shadow-xl whitespace-nowrap z-20">
                      Day {idx + 1}: {val}K
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-2">
                <span>30 Days Ago</span>
                <span>Mid Month</span>
                <span>Today</span>
              </div>
            </Card>

            {/* Audience Demographics */}
            <Card className="p-5 bg-neutral-900/60 border-neutral-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Audience Top Geographies</h3>
              <div className="space-y-3">
                {[
                  { country: "India", pct: 38, flag: "🇮🇳" },
                  { country: "United States", pct: 28, flag: "🇺🇸" },
                  { country: "Germany", pct: 14, flag: "🇩🇪" },
                  { country: "United Kingdom", pct: 12, flag: "🇬🇧" },
                  { country: "Japan", pct: 8, flag: "🇯🇵" },
                ].map((geo) => (
                  <div key={geo.country} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300">
                        {geo.flag} {geo.country}
                      </span>
                      <span className="font-bold text-white">{geo.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${geo.pct}%` }}
                        className="h-full bg-violet-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
                Peak viewer activity: <strong className="text-white">6:00 PM – 11:30 PM IST</strong>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Creator Monetization Hub */}
      {activeTab === "monetization" && (
        <div className="space-y-6">
          {/* Earnings summary card */}
          <Card className="p-6 bg-gradient-to-r from-violet-950/40 via-neutral-900 to-cyan-950/30 border-neutral-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Ready for Creator Payouts
                </span>
                <div className="text-3xl font-black text-white">$840.00 USD</div>
                <p className="text-xs text-neutral-400 mt-1">
                  Accrued from Preset Marketplace sales and monthly supporter tips.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="gradient"
                  size="md"
                  onClick={() =>
                    toast({
                      type: "info",
                      title: "Stripe Connect Ready",
                      message: "Payout initiated to your linked checking account.",
                    })
                  }
                  leftIcon={<DollarSign className="w-4 h-4" />}
                >
                  Withdraw Earnings
                </Button>
                <Link href="/marketplace">
                  <Button variant="outline" size="md">
                    Manage Store Items
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Monetization Channels Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-5 bg-neutral-900/60 border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="primary" size="sm">
                  Active
                </Badge>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-base font-bold text-white">Digital Marketplace</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Sell DaVinci PowerGrades, Lightroom Presets, Blender 3D nodes, and video templates with
                instant global delivery.
              </p>
              <div className="pt-2 border-t border-neutral-800 flex justify-between text-xs">
                <span className="text-neutral-400">Total Products:</span>
                <span className="font-bold text-white">4 Published</span>
              </div>
            </Card>

            <Card className="p-5 bg-neutral-900/60 border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" size="sm">
                  Configured
                </Badge>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-base font-bold text-white">Creator Subscriptions</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Offer exclusive subscriber-only feed posts, behind-the-scenes raw assets, and Discord/VYBE
                private discussions.
              </p>
              <div className="pt-2 border-t border-neutral-800 flex justify-between text-xs">
                <span className="text-neutral-400">Active Subscribers:</span>
                <span className="font-bold text-white">38 Patrons</span>
              </div>
            </Card>

            <Card className="p-5 bg-neutral-900/60 border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" size="sm">
                  Brand Deals
                </Badge>
                <Lock className="w-4 h-4 text-neutral-500" />
              </div>
              <h4 className="text-base font-bold text-white">Sponsorship Marketplace</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Receive inbound campaign offers from camera gear makers, software companies, and lifestyle
                brands.
              </p>
              <div className="pt-2 border-t border-neutral-800 flex justify-between text-xs">
                <span className="text-neutral-400">Inbound Requests:</span>
                <span className="font-bold text-cyan-400">2 In Review</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 3: Content Breakdown Table */}
      {activeTab === "content" && (
        <Card className="bg-neutral-900/50 border-neutral-800 overflow-hidden">
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">High-Impact Content Performance</h3>
            <span className="text-xs text-neutral-400">Ranked by algorithm reach score</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/60 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                <tr>
                  <th className="p-3.5">Content Title</th>
                  <th className="p-3.5">Format</th>
                  <th className="p-3.5">Impressions</th>
                  <th className="p-3.5">Retention</th>
                  <th className="p-3.5">Likes</th>
                  <th className="p-3.5">Shares</th>
                  <th className="p-3.5">CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                {topContent.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-3.5 font-bold text-white max-w-xs truncate">{item.title}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.type === "Reel"
                            ? "bg-rose-500/20 text-rose-300"
                            : "bg-cyan-500/20 text-cyan-300"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3.5 font-semibold text-white">{item.views}</td>
                    <td className="p-3.5 text-neutral-400">{item.watchTime}</td>
                    <td className="p-3.5 text-neutral-400">{item.likes}</td>
                    <td className="p-3.5 text-neutral-400">{item.shares}</td>
                    <td className="p-3.5 font-bold text-emerald-400">{item.ctr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
