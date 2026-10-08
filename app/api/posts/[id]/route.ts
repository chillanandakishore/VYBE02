import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    const post = await db.getPostById(id, decoded?.id);
    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("GET /api/posts/[id] error:", error);
    return NextResponse.json({ success: false, message: "Error fetching post" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const success = await db.deletePost(id, decoded.id);
    if (!success) {
      return NextResponse.json(
        { success: false, message: "Post not found or unauthorized to delete" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);
    return NextResponse.json({ success: false, message: "Error deleting post" }, { status: 500 });
  }
}
