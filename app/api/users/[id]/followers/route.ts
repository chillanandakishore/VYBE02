import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    const followers = await db.getUserFollowers(targetUserId, decoded?.id);

    return NextResponse.json({
      success: true,
      followers,
      total: followers.length,
    });
  } catch (error) {
    console.error("GET /api/users/[id]/followers error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch followers" },
      { status: 500 }
    );
  }
}
