import { NextRequest, NextResponse } from "next/server";
import { dbChallenges } from "@/lib/db-challenges";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    if (!body.title || !body.imageUrl) {
      return NextResponse.json({ success: false, message: "Entry title and image URL are required" }, { status: 400 });
    }

    const entry = await dbChallenges.submitChallengeEntry(
      id,
      {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        isCreator: user.isCreator,
      },
      body.title,
      body.imageUrl
    );

    return NextResponse.json({
      success: true,
      message: "Challenge entry submitted successfully!",
      entry,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/challenges/[id]/enter error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to submit challenge entry" }, { status: 500 });
  }
}
