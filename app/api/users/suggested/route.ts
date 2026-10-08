import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("vybe_token")?.value;
    const decoded = token ? verifyToken(token) : null;
    const currentUserId = decoded?.id;

    const allUsers = await db.listUsers();
    const currentUser = currentUserId ? await db.findUserById(currentUserId) : null;
    const userInterests = currentUser?.interests || [];

    // Filter out current user
    const candidates = allUsers.filter((u) => u.id !== currentUserId);

    // Decorate candidates with follow status and calculate affinity score
    const scoredCandidates = await Promise.all(
      candidates.map(async (u) => {
        const isFollowing = currentUserId
          ? await db.isFollowingUser(currentUserId, u.id)
          : false;

        // Interest overlap
        const sharedInterests = u.interests.filter((interest) =>
          userInterests.includes(interest)
        );

        let score = (u.followersCount || 0) * 0.1;
        if (u.isCreator) score += 50;
        score += sharedInterests.length * 20;

        return {
          ...u,
          isFollowing,
          affinityScore: score,
          sharedInterests,
        };
      })
    );

    // Sort by affinity and creator status
    scoredCandidates.sort((a, b) => b.affinityScore - a.affinityScore);

    return NextResponse.json({
      success: true,
      users: scoredCandidates.slice(0, 8),
    });
  } catch (error) {
    console.error("GET /api/users/suggested error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch suggested users" },
      { status: 500 }
    );
  }
}
