import { NextRequest, NextResponse } from "next/server";
import { dbReels } from "@/lib/db-reels";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    const reels = await dbReels.getReels(decoded?.id);

    return NextResponse.json({
      success: true,
      reels,
    });
  } catch (error) {
    console.error("GET /api/reels error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch reels" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, message: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const user = await db.findUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    if (!body.videoUrl || !body.caption) {
      return NextResponse.json({ success: false, message: "Video URL and caption are required" }, { status: 400 });
    }

    const newReel = await dbReels.createReel(
      {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        creatorStatus: user.creatorStatus,
        isCreator: user.isCreator,
        verified: user.verified,
      },
      body.videoUrl,
      body.thumbnailUrl || "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
      body.caption,
      body.musicTitle || "Original Audio - @" + user.username,
      body.hashtags || []
    );

    return NextResponse.json({
      success: true,
      message: "Reel published successfully!",
      reel: newReel,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reels error:", error);
    return NextResponse.json({ success: false, message: "Failed to publish reel" }, { status: 500 });
  }
}
