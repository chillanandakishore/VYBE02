import { NextRequest, NextResponse } from "next/server";
import { dbReels } from "@/lib/db-reels";
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

    const result = await dbReels.toggleLikeReel(decoded.id, id);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("POST /api/reels/[id]/like error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to like reel" }, { status: 500 });
  }
}
