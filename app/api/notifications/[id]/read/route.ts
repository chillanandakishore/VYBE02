import { NextRequest, NextResponse } from "next/server";
import { dbNotifications } from "@/lib/db-notifications";
import { verifyToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;
    const userId = decoded?.id || "usr_creator_01";

    const success = await dbNotifications.markNotificationRead(userId, id);

    return NextResponse.json({
      success,
      message: success ? "Notification marked read" : "Notification not found",
    });
  } catch (error) {
    console.error("POST /api/notifications/[id]/read error:", error);
    return NextResponse.json({ success: false, message: "Failed to mark notification read" }, { status: 500 });
  }
}
