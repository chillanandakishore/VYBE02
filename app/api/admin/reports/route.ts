import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "@/lib/db-admin";
import { db } from "@/lib/db";
import { dbCommunities } from "@/lib/db-communities";
import { dbChallenges } from "@/lib/db-challenges";
import { dbEvents } from "@/lib/db-events";

export async function GET(_req: NextRequest) {
  try {
    const reports = await dbAdmin.getReports();
    const users = await db.listUsers();
    const postsResult = await db.getPosts({ limit: 100 });
    const communities = await dbCommunities.getCommunities();
    const challenges = await dbChallenges.getChallenges();
    const events = await dbEvents.getEvents();

    return NextResponse.json({
      success: true,
      reports,
      stats: {
        totalUsers: users.length,
        totalPosts: postsResult.total,
        totalCommunities: communities.length,
        totalChallenges: challenges.length,
        totalEvents: events.length,
        pendingReports: reports.filter((r) => r.status === "PENDING").length,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/reports error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch admin reports" }, { status: 500 });
  }
}
