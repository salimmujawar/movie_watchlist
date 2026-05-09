import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/follow — follow a user
export async function POST(req: NextRequest) {
  try {
    const { follower_id, following_id } = await req.json();

    if (!follower_id || !following_id) {
      return NextResponse.json({ error: "Missing follower_id or following_id" }, { status: 400 });
    }

    if (follower_id === following_id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const { error } = await supabase
      .from("follows")
      .insert({ follower_id, following_id });

    if (error) {
      // Duplicate follow — treat as success
      if (error.code === "23505") {
        return NextResponse.json({ success: true, action: "already_following" });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, action: "followed" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/follow — unfollow a user
export async function DELETE(req: NextRequest) {
  try {
    const { follower_id, following_id } = await req.json();

    if (!follower_id || !following_id) {
      return NextResponse.json({ error: "Missing follower_id or following_id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", follower_id)
      .eq("following_id", following_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, action: "unfollowed" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
