import { NextRequest, NextResponse } from "next/server";
import { dbEvents } from "@/lib/db-events";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    const events = await dbEvents.getEvents(decoded?.id);

    return NextResponse.json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded || !decoded.id) {
      return NextResponse.json({ success: false, message: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const user = await db.findUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    if (!body.title || !body.date || !body.location) {
      return NextResponse.json({ success: false, message: "Title, date, and location are required" }, { status: 400 });
    }

    const newEvent = await dbEvents.createEvent(
      {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
      body.title,
      body.description || "",
      body.category || "General",
      body.coverImage,
      body.date,
      body.time || "TBD",
      body.location,
      !!body.isVirtual,
      body.meetingUrl
    );

    return NextResponse.json({
      success: true,
      message: "Event published successfully!",
      event: newEvent,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ success: false, message: "Failed to create event" }, { status: 500 });
  }
}
