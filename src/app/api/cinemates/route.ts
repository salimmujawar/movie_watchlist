import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Seed data for the 10 discoverable CineMates
const CINEMATES_SEED = [
  { googleId: "cinemate_aarav",  name: "Aarav Kapoor",   handle: "@framesbyaarav",       bio: "Lives for Nolan, neon noir & existential sci-fi.",        watched: 428, followers: "1.2K", tags: ["Sci-Fi", "Slow Burn", "Thriller"],              aiSignal: "Top Sci-Fi Curator",         avatarBg: "linear-gradient(135deg, #e50914, #b20710)", initials: "AK" },
  { googleId: "cinemate_zoya",   name: "Zoya Mirza",     handle: "@zoyawatches",         bio: "Rom-coms, rainy films & emotionally damaging endings.",   watched: 312, followers: "842",  tags: ["Romance", "Indie", "Drama"],                    aiSignal: "Trusted by 96 cinephiles",   avatarBg: "linear-gradient(135deg, #ec4899, #be185d)", initials: "ZM" },
  { googleId: "cinemate_ethan",  name: "Ethan Blake",    handle: "@cinemaholic_ethan",   bio: "Marvel by day, A24 by night.",                            watched: 590, followers: "2.8K", tags: ["Superhero", "Dark Comedy", "Psychological"],    aiSignal: "Most Watched This Month",    avatarBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)", initials: "EB" },
  { googleId: "cinemate_sana",   name: "Sana Sheikh",    handle: "@reelwithsana",        bio: "Plot twists > happy endings.",                            watched: 267, followers: "1.1K", tags: ["Mystery", "Thriller", "Crime"],                 aiSignal: "92% Taste Match",            avatarBg: "linear-gradient(135deg, #f59e0b, #d97706)", initials: "SS" },
  { googleId: "cinemate_liam",   name: "Liam Carter",    handle: "@pixelreels",          bio: "Give me time travel and heartbreak.",                     watched: 481, followers: "970",  tags: ["Sci-Fi", "Emotional Drama", "Mind-Bending"],   aiSignal: "Your Friends Follow Them",   avatarBg: "linear-gradient(135deg, #06b6d4, #0284c7)", initials: "LC" },
  { googleId: "cinemate_maya",   name: "Maya Fernandes", handle: "@mayaatthemovies",     bio: "Bollywood classics & comfort movies forever.",            watched: 355, followers: "1.6K", tags: ["Bollywood", "Musical", "Feel-Good"],            aiSignal: "Top Comfort Movie Curator",  avatarBg: "linear-gradient(135deg, #8b5cf6, #6d28d9)", initials: "MF" },
  { googleId: "cinemate_rohan",  name: "Rohan D'Souza", handle: "@rohanrewinds",        bio: "Horror movies are my therapy.",                           watched: 623, followers: "3.1K", tags: ["Horror", "Slasher", "Dark"],                   aiSignal: "Horror Expert Badge",        avatarBg: "linear-gradient(135deg, #ef4444, #b91c1c)", initials: "RD" },
  { googleId: "cinemate_chloe",  name: "Chloe Bennett",  handle: "@scenequeenchloe",     bio: "Obsessed with visually beautiful cinema.",                watched: 294, followers: "780",  tags: ["Aesthetic", "Indie", "Slow Cinema"],            aiSignal: "Critics Choice Creator",     avatarBg: "linear-gradient(135deg, #14b8a6, #0d9488)", initials: "CB" },
  { googleId: "cinemate_yusuf",  name: "Yusuf Khan",     handle: "@midnightframes",      bio: "Neo-noir, gangster films & chaotic antiheroes.",          watched: 510, followers: "2.2K", tags: ["Crime", "Noir", "Action"],                      aiSignal: "88% Taste Compatibility",    avatarBg: "linear-gradient(135deg, #f97316, #c2410c)", initials: "YK" },
  { googleId: "cinemate_elena",  name: "Elena Rossi",    handle: "@elenagoestocinema",   bio: "French films, heartbreak & long monologues.",             watched: 376, followers: "1.4K", tags: ["Foreign Cinema", "Drama", "Art House"],         aiSignal: "Trending Taste Profile",     avatarBg: "linear-gradient(135deg, #6366f1, #4f46e5)", initials: "ER" },
];

// GET /api/cinemates?user_id=xxx — returns CineMates filtered to exclude already-followed users
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  }

  try {
    // Step 1: Get real user IDs for the seeded CineMates
    const googleIds = CINEMATES_SEED.map((m) => m.googleId);
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, google_id")
      .in("google_id", googleIds);

    if (usersError) {
      console.error("[cinemates] users query error:", usersError);
      return NextResponse.json({ error: "Failed to load CineMates" }, { status: 500 });
    }

    // Build google_id → real user ID map
    const idMap: Record<string, string> = {};
    if (users) {
      for (const u of users) {
        idMap[u.google_id] = u.id;
      }
    }

    // Step 2: Get ALL users the current user follows
    const { data: follows, error: followsError } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", userId);

    if (followsError) {
      console.error("[cinemates] follows query error:", followsError);
    }

    const followedSet = new Set(
      (follows || []).map((f: { following_id: string }) => f.following_id)
    );

    // Step 3: Build the response — enriched + filtered
    const mates = CINEMATES_SEED
      .map((m) => ({
        ...m,
        userId: idMap[m.googleId] || null,
      }))
      .filter((m) => {
        // Remove mates whose real userId is in the followed set
        if (m.userId && followedSet.has(m.userId)) return false;
        return true;
      });

    return NextResponse.json({ mates });
  } catch (err) {
    console.error("[cinemates] API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
