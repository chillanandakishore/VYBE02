import { NextRequest, NextResponse } from "next/server";
import { dbCommunities } from "@/lib/db-communities";
import { verifyToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, message: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const community = await dbCommunities.getCommunityBySlug(slug);
    if (!community) {
      return NextResponse.json({ success: false, message: "Community not found" }, { status: 404 });
    }

    const result = await dbCommunities.toggleJoinCommunity(decoded.id, community.id);

    return NextResponse.json({
      success: true,
      ...result,
      message: result.isJoined ? `Joined ${community.name} community!` : `Left ${community.name}`,
    });
  } catch (error: any) {
    console.error("POST /api/vybes/[slug]/join error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to join community" }, { status: 500 });
  }
}
