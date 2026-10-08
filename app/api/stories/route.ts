import { NextRequest, NextResponse } from "next/server";
import { dbStories } from "@/lib/db-stories";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    const stories = await dbStories.getStories(decoded?.id);

    return NextResponse.json({
      success: true,
      stories,
    });
  } catch (error) {
    console.error("GET /api/stories error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch stories" }, { status: 500 });
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
    if (!body.mediaUrl) {
      return NextResponse.json({ success: false, message: "Story media URL is required" }, { status: 400 });
    }

    const story = await dbStories.createStory(
      {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        isCreator: user.isCreator,
        hasActiveStory: true,
      },
      body.mediaUrl,
      body.caption,
      body.mediaType || "IMAGE"
    );

    return NextResponse.json({
      success: true,
      message: "Story posted! It will remain live for 24 hours.",
      story,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/stories error:", error);
    return NextResponse.json({ success: false, message: "Failed to create story" }, { status: 500 });
  }
}
