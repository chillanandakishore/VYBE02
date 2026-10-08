import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";
import { RegisterPayload } from "@/types/auth";

export async function POST(req: NextRequest) {
  try {
    const body: RegisterPayload = await req.json();
    const { username, displayName, email, password, interests } = body;

    // Validation
    if (!username || !displayName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All required fields must be provided." },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { success: false, message: "Username must be between 3 and 20 characters." },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { success: false, message: "Username can only contain letters, numbers, and underscores." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check existing
    const existingEmail = await db.findUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const existingUsername = await db.findUserByUsername(username);
    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: "This username is already taken. Please choose another." },
        { status: 409 }
      );
    }

    // Hash password & create user
    const passwordHash = await hashPassword(password);
    const newUser = await db.createUser({
      email,
      username: username.toLowerCase(),
      displayName,
      passwordHash,
      interests: Array.isArray(interests) && interests.length > 0 ? interests : ["Technology"],
      isCreator: false,
      creatorStatus: "none",
      bio: "Joined the VYBE community! Exploring new horizons.",
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
      coverImageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
    });

    const token = generateToken(newUser);

    const response = NextResponse.json(
      {
        success: true,
        message: "Welcome to VYBE! Account created successfully.",
        user: newUser,
        token,
      },
      { status: 201 }
    );

    // Set HTTP-only cookie
    response.cookies.set("vybe_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during registration." },
      { status: 500 }
    );
  }
}
