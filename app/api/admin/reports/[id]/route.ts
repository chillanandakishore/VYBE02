import { NextRequest, NextResponse } from "next/server";
import { dbAdmin } from "@/lib/db-admin";
import { db } from "@/lib/db";
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
      return NextResponse.json({ success: false, message: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { action, postId } = await req.json();
    if (!action) {
      return NextResponse.json({ success: false, message: "Action is required" }, { status: 400 });
    }

    if (action === "DELETE_POST" && postId) {
      await db.deletePost(postId, decoded.id);
    }

    const result = await dbAdmin.updateReportStatus(id, action);

    return NextResponse.json({
      success: true,
      message: `Report marked as ${result.report.status}`,
      report: result.report,
    });
  } catch (error: any) {
    console.error("POST /api/admin/reports/[id] error:", error);
    return NextResponse.json({ success: false, message: error?.message || "Failed to process report" }, { status: 500 });
  }
}
