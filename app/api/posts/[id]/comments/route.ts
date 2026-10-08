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

    const comments = await db.getComments(id, decoded?.id);
    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error("GET /api/posts/[id]/comments error:", error);
    return NextResponse.json({ success: false, message: "Error fetching comments" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, message: "Please sign in to comment." }, { status: 401 });
    }

    const { content, parentId } = await req.json();
    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, message: "Comment content cannot be empty." }, { status: 400 });
    }

    const comment = await db.createComment(decoded.id, id, content.trim(), parentId);
    return NextResponse.json({ success: true, comment }, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts/[id]/comments error:", error);
    return NextResponse.json({ success: false, message: "Error creating comment" }, { status: 500 });
  }
}
