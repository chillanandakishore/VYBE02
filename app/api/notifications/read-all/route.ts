import { NextRequest, NextResponse } from "next/server";
import { dbNotifications } from "@/lib/db-notifications";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;
    const userId = decoded?.id || "usr_creator_01";

    await dbNotifications.markAllNotificationsRead(userId);

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("POST /api/notifications/read-all error:", error);
    return NextResponse.json({ success: false, message: "Failed to mark notifications read" }, { status: 500 });
  }
}
