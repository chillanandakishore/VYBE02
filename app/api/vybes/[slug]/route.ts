import { NextRequest, NextResponse } from "next/server";
import { dbCommunities } from "@/lib/db-communities";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    const community = await dbCommunities.getCommunityBySlug(slug, decoded?.id);

    if (!community) {
      return NextResponse.json({ success: false, message: "Community not found" }, { status: 404 });
    }

    // Also get posts for this community
    const postsData = await db.getPosts({ community: community.name, currentUserId: decoded?.id });

    return NextResponse.json({
      success: true,
      community,
      posts: postsData.posts,
    });
  } catch (error) {
    console.error("GET /api/vybes/[slug] error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch community details" }, { status: 500 });
  }
}

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

    const user = await db.findUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const community = await dbCommunities.getCommunityBySlug(slug);
    if (!community) {
      return NextResponse.json({ success: false, message: "Community not found" }, { status: 404 });
    }

    const body = await req.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, message: "Title and content are required" }, { status: 400 });
    }

    const discussion = await dbCommunities.createDiscussion(
      community.id,
      {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      body.title,
      body.content
    );

    return NextResponse.json({
      success: true,
      message: "Discussion thread started!",
      discussion,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/vybes/[slug] error:", error);
    return NextResponse.json({ success: false, message: "Failed to create discussion" }, { status: 500 });
  }
}
