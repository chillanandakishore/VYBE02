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
      return NextResponse.json({ success: false, message: "Please sign in to vote in polls." }, { status: 401 });
    }

    const { optionId } = await req.json();
    if (!optionId) {
      return NextResponse.json({ success: false, message: "optionId is required." }, { status: 400 });
    }

    const result = await db.votePoll(decoded.id, id, optionId);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("POST /api/posts/[id]/poll error:", error);
    return NextResponse.json({ success: false, message: "Error voting in poll" }, { status: 500 });
  }
}
