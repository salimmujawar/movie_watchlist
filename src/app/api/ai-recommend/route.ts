import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const N8N_WEBHOOK_URL =
  "https://zyrax.app.n8n.cloud/webhook/334f875c-6c15-4851-8053-5e4826e2ed1a";

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

/**
 * GET /api/ai-recommend?user_id=<uuid>
 *
 * Flow:
 *  1. Check if today's cached recommendation exists for this user
 *  2. If cached → return it immediately (no webhook call)
 *  3. If not cached → read preferences, call N8N, cache response, return it
 */
export async function GET(request: NextRequest) {
  const userId = new URL(request.url).searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json(
      { error: "user_id is required" },
      { status: 400 }
    );
  }

  const today = getTodayDate();

  try {
    // ── Step 1: Check daily cache ─────────────────────────────────
    const { data: cached, error: cacheError } = await supabase
      .from("ai_recommendations_cache")
      .select("response_data")
      .eq("user_id", userId)
      .eq("fetch_date", today)
      .single();

    if (!cacheError && cached?.response_data) {
      return NextResponse.json({
        ...cached.response_data,
        source: "cache",
      });
    }

    // ── Step 2: Load user's onboarding preferences ────────────────
    const { data: prefs } = await supabase
      .from("movie_preferences")
      .select("movie_title, movie_genre, preference")
      .eq("user_id", userId);

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

    const preferredGenres = Object.keys(likedGenres).sort(
      (a, b) => likedGenres[b] - likedGenres[a]
    );
    const avoidGenres = Object.keys(dislikedGenres).filter(
      (g) => !likedGenres[g]
    );

    // ── Step 3: Build the N8N payload ─────────────────────────────
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

    // ── Step 4: Call N8N webhook ───────────────────────────────────
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

    // ── Step 5: Cache the response for today ──────────────────────
    const { error: insertError } = await supabase
      .from("ai_recommendations_cache")
      .upsert(
        {
          user_id: userId,
          fetch_date: today,
          response_data: data,
        },
        { onConflict: "user_id,fetch_date" }
      );

    if (insertError) {
      // Log but don't fail — the response is still valid
      console.error("AI recommendation cache insert error:", insertError.message);
    }

    // ── Step 6: Return fresh response ─────────────────────────────
    return NextResponse.json({
      ...data,
      source: "n8n",
    });
  } catch (err) {
    console.error("AI recommend error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
