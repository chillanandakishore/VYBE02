import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please sign in to follow users." },
        { status: 401 }
      );
    }

    if (decoded.id === targetUserId) {
      return NextResponse.json(
        { success: false, message: "You cannot follow yourself." },
        { status: 400 }
      );
    }

    const result = await db.toggleFollowUser(decoded.id, targetUserId);

    return NextResponse.json({
      success: true,
      isFollowing: result.isFollowing,
      followersCount: result.followersCount,
      message: result.isFollowing ? "User followed successfully" : "User unfollowed successfully",
    });
  } catch (error: any) {
    console.error("POST /api/users/[id]/follow error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to toggle follow status" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: targetUserId } = await params;
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: true, isFollowing: false });
    }

    const isFollowing = await db.isFollowingUser(decoded.id, targetUserId);

    return NextResponse.json({
      success: true,
      isFollowing,
    });
  } catch (error) {
    console.error("GET /api/users/[id]/follow error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to check follow status" },
      { status: 500 }
    );
  }
}
