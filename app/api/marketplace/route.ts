import { NextRequest, NextResponse } from "next/server";
import { dbMarketplace } from "@/lib/db-marketplace";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;

    const products = await dbMarketplace.getProducts(category);

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET /api/marketplace error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch marketplace products" }, { status: 500 });
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
    if (!body.title || !body.description) {
      return NextResponse.json({ success: false, message: "Title and description are required" }, { status: 400 });
    }

    const newProduct = await dbMarketplace.createProduct(
      {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        isCreator: user.isCreator,
      },
      body.title,
      body.description,
      parseFloat(body.price) || 0,
      body.category || "TEMPLATES",
      body.thumbnailUrl,
      body.features || []
    );

    return NextResponse.json({
      success: true,
      message: "Digital product published to creator marketplace!",
      product: newProduct,
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/marketplace error:", error);
    return NextResponse.json({ success: false, message: "Failed to publish digital product" }, { status: 500 });
  }
}
