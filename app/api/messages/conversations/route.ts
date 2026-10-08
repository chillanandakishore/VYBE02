import { NextRequest, NextResponse } from "next/server";
import { dbMessages } from "@/lib/db-messages";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    const conversations = await dbMessages.getConversations(decoded?.id);

    return NextResponse.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("GET /api/messages/conversations error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch conversations" }, { status: 500 });
  }
}
