import { NextRequest, NextResponse } from "next/server";
import { dbNotifications } from "@/lib/db-notifications";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;
    if (!decoded?.id) {
      return NextResponse.json({ success: true, notifications: [], unreadCount: 0 });
    }
    const userId = decoded.id;

    const data = await dbNotifications.getNotifications(userId);

    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch notifications" }, { status: 500 });
  }
}
