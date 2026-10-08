import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    let token = req.cookies.get("vybe_token")?.value;

    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const user = await db.findUserById(payload.id);
    if (!user) {
      const res = NextResponse.json({ success: true, user: null });
      res.cookies.delete("vybe_token");
      return res;
    }

    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ success: false, message: "Error fetching user profile." }, { status: 500 });
  }
}
