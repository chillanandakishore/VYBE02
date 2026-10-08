import { NextRequest, NextResponse } from "next/server";
import { dbChallenges } from "@/lib/db-challenges";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    const challenges = await dbChallenges.getChallenges(decoded?.id);

    return NextResponse.json({
      success: true,
      challenges,
    });
  } catch (error) {
    console.error("GET /api/challenges error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch challenges" }, { status: 500 });
  }
}
