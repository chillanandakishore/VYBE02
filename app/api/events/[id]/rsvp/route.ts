import { NextRequest, NextResponse } from "next/server";
import { dbEvents } from "@/lib/db-events";
import { verifyToken } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, message: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const result = await dbEvents.toggleRsvpEvent(decoded.id, id);

    return NextResponse.json({
      success: true,
      ...result,
      message: result.isAttending ? "RSVP confirmed! Added to your schedule." : "RSVP cancelled.",
    });
  } catch (error: any) {
    console.error("POST /api/events/[id]/rsvp error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to update RSVP" }, { status: 500 });
  }
}
