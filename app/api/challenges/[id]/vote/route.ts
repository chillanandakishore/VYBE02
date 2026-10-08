import { NextRequest, NextResponse } from "next/server";
import { dbChallenges } from "@/lib/db-challenges";
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

    const { entryId } = await req.json();
    if (!entryId) {
      return NextResponse.json({ success: false, message: "Entry ID is required" }, { status: 400 });
    }

    const result = await dbChallenges.voteChallengeEntry(decoded.id, id, entryId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("POST /api/challenges/[id]/vote error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to vote on challenge entry" }, { status: 500 });
  }
}
