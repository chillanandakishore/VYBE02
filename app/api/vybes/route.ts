import { NextRequest, NextResponse } from "next/server";
import { dbCommunities } from "@/lib/db-communities";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    const communities = await dbCommunities.getCommunities(decoded?.id);

    return NextResponse.json({
      success: true,
      communities,
    });
  } catch (error) {
    console.error("GET /api/vybes error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch communities" }, { status: 500 });
  }
}
