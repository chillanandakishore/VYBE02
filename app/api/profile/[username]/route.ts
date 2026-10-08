import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    const user = await db.findUserByUsername(username);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const { passwordHash: _, ...safeUser } = user;
    const isFollowing = decoded?.id ? await db.isFollowingUser(decoded.id, safeUser.id) : false;
    const userPosts = await db.getPosts({
      authorId: safeUser.id,
      currentUserId: decoded?.id,
    });

    return NextResponse.json({
      success: true,
      user: {
        ...safeUser,
        isFollowing,
      },
      posts: userPosts.posts,
      totalPosts: userPosts.total,
    });
  } catch (error) {
    console.error("GET /api/profile/[username] error:", error);
    return NextResponse.json({ success: false, message: "Error fetching user profile" }, { status: 500 });
  }
}
