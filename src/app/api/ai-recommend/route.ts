import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const N8N_WEBHOOK_URL =
  "https://zyrax.app.n8n.cloud/webhook/334f875c-6c15-4851-8053-5e4826e2ed1a";

/**
 * GET /api/ai-recommend?user_id=<uuid>
 *
 * 1. Reads the user's onboarding movie_preferences from Supabase
 * 2. Derives preferred genres, liked movies, avoid genres
 * 3. Sends the payload to the N8N AI webhook
 * 4. Returns the recommendation response
 */
export async function GET(request: NextRequest) {
  const userId = new URL(request.url).searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json(
      { error: "user_id is required" },
      { status: 400 }
    );
  }

  try {
    // ── Step 1: Load user's onboarding preferences ────────────────
    const { data: prefs } = await supabase
      .from("movie_preferences")
      .select("movie_title, movie_genre, preference")
      .eq("user_id", userId);

    // Build preference payload from swipe data
    const likedGenres: Record<string, number> = {};
    const dislikedGenres: Record<string, number> = {};
    const favouriteMovies: { title: string }[] = [];

    if (prefs) {
      for (const p of prefs) {
        const genres: string[] = p.movie_genre || [];
        if (p.preference === "liked") {
          favouriteMovies.push({ title: p.movie_title });
          for (const g of genres) {
            likedGenres[g] = (likedGenres[g] || 0) + 1;
          }
        } else {
          for (const g of genres) {
            dislikedGenres[g] = (dislikedGenres[g] || 0) + 1;
          }
        }
      }
    }

    // Derive preferred genres (liked >= 1 time) and avoid genres (only disliked)
    const preferredGenres = Object.keys(likedGenres).sort(
      (a, b) => likedGenres[b] - likedGenres[a]
    );
    const avoidGenres = Object.keys(dislikedGenres).filter(
      (g) => !likedGenres[g]
    );

    // ── Step 2: Build the N8N payload ─────────────────────────────
    const payload = {
      preferences: {
        preferred_genres:
          preferredGenres.length > 0
            ? preferredGenres
            : ["Science Fiction", "Drama", "Thriller"],
        movie_era: "mixed",
        avoid_genres: avoidGenres,
        favourite_movies:
          favouriteMovies.length > 0
            ? favouriteMovies
            : [{ title: "Interstellar" }, { title: "Inception" }],
        content_restrictions: {
          max_age_rating: "PG-13",
          avoid_themes: ["Gore", "Strong language"],
        },
      },
    };

    // ── Step 3: Call N8N webhook ───────────────────────────────────
    const webhookRes = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!webhookRes.ok) {
      console.error("N8N webhook error:", webhookRes.status);
      return NextResponse.json(
        { error: "AI recommendation service unavailable" },
        { status: 502 }
      );
    }

    const data = await webhookRes.json();

    // ── Step 4: Return the response ───────────────────────────────
    return NextResponse.json(data);
  } catch (err) {
    console.error("AI recommend error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
