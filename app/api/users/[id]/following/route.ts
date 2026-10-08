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

    const following = await db.getUserFollowing(targetUserId, decoded?.id);

    return NextResponse.json({
      success: true,
      following,
      total: following.length,
    });
  } catch (error) {
    console.error("GET /api/users/[id]/following error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch following" },
      { status: 500 }
    );
  }
}
