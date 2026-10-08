import { NextRequest, NextResponse } from "next/server";
import { dbMessages } from "@/lib/db-messages";
import { verifyToken } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params;
    const conv = await dbMessages.getConversationById(conversationId);

    if (!conv) {
      return NextResponse.json({ success: false, message: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      conversation: conv,
      messages: conv.messages,
    });
  } catch (error) {
    console.error("GET /api/messages/[conversationId] error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch conversation" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { conversationId } = await params;
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;
    if (!decoded?.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const senderId = decoded.id;

    const body = await req.json();
    if (!body.text && !body.mediaUrl) {
      return NextResponse.json({ success: false, message: "Message content or media required" }, { status: 400 });
    }

    const newMsg = await dbMessages.sendMessage(
      conversationId,
      senderId,
      body.text || "",
      body.mediaUrl,
      body.mediaType,
      body.voiceDurationSeconds
    );

    return NextResponse.json({
      success: true,
      message: "Message sent",
      chatMessage: newMsg,
    }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/messages/[conversationId] error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to send message" }, { status: 500 });
  }
}
