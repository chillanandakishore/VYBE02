import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, generateToken } from "@/lib/auth";
import { LoginPayload } from "@/types/auth";

export async function POST(req: NextRequest) {
  try {
    const body: LoginPayload = await req.json();
    const { loginIdentifier, password } = body;

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { success: false, message: "Please enter your username/email and password." },
        { status: 400 }
      );
    }

    const userRecord = await db.findUserByIdentifier(loginIdentifier);
    if (!userRecord) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials. User not found." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, userRecord.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password. Please try again." },
        { status: 401 }
      );
    }

    // Exclude passwordHash from user object
    const { passwordHash: _, ...safeUser } = userRecord;
    const token = generateToken(safeUser);

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully.",
      user: safeUser,
      token,
    });

    response.cookies.set("vybe_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
