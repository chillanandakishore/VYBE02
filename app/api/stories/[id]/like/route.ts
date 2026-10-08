import { NextRequest, NextResponse } from "next/server";
import { dbStories } from "@/lib/db-stories";
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

    const result = await dbStories.toggleLikeStory(decoded.id, id);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("POST /api/stories/[id]/like error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to like story" }, { status: 500 });
  }
}
