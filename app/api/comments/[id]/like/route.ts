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
      return NextResponse.json({ success: false, message: "Please sign in to like comments." }, { status: 401 });
    }

    const result = await db.toggleLikeComment(decoded.id, id);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("POST /api/comments/[id]/like error:", error);
    return NextResponse.json({ success: false, message: "Error liking comment" }, { status: 500 });
  }
}
