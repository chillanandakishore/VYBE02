import { NextRequest, NextResponse } from "next/server";
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
      return NextResponse.json({ success: false, message: "Please sign in to report content." }, { status: 401 });
    }

    const { reason } = await req.json();
    await db.reportPost(decoded.id, id, reason || "Inappropriate content");

    return NextResponse.json({
      success: true,
      message: "Post reported. Our safety and moderation team will review this promptly.",
    });
  } catch (error) {
    console.error("POST /api/posts/[id]/report error:", error);
    return NextResponse.json({ success: false, message: "Error reporting post" }, { status: 500 });
  }
}
