import { NextRequest, NextResponse } from "next/server";
import { dbSearch } from "@/lib/db-search";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;

    const results = await dbSearch.searchAll(q, decoded?.id);

    return NextResponse.json({
      success: true,
      query: q,
      ...results,
    });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json({ success: false, message: "Search failed" }, { status: 500 });
  }
}
