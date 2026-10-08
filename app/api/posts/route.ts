import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { CreatePostPayload } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const community = searchParams.get("community") || undefined;
    const authorId = searchParams.get("authorId") || undefined;
    const saved = searchParams.get("saved") === "true";
    const streamParam = searchParams.get("stream");
    const stream =
      streamParam === "following" || streamParam === "top-vybes" || streamParam === "for-you"
        ? streamParam
        : "for-you";

    // Extract user token if present
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;
    const currentUserId = decoded?.id;

    const result = await db.getPosts({
      limit,
      offset,
      community,
      authorId,
      savedByUserId: saved && currentUserId ? currentUserId : undefined,
      currentUserId,
      stream,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ success: false, message: "Error fetching posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, message: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body: CreatePostPayload = await req.json();

    if (!body.content && (!body.mediaUrls || body.mediaUrls.length === 0) && !body.poll && !body.questionPrompt) {
      return NextResponse.json(
        { success: false, message: "Post content, media, poll, or question is required." },
        { status: 400 }
      );
    }

    // Extract hashtags from content if not provided
    let hashtags = body.hashtags || [];
    if (hashtags.length === 0 && body.content) {
      const matched = body.content.match(/#[a-zA-Z0-9_]+/g);
      if (matched) {
        hashtags = Array.from(new Set(matched));
      }
    }

    const newPost = await db.createPost(decoded.id, {
      ...body,
      hashtags,
    });

    return NextResponse.json({
      success: true,
      message: "Post created successfully!",
      post: newPost,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ success: false, message: "Error creating post" }, { status: 500 });
  }
}
