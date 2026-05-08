import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Server-side Supabase client (no browser polyfills needed)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
}

export async function GET(request: NextRequest) {
  const today = getTodayDate();

  // Try to detect user's region from Vercel geolocation header
  const country = request.headers.get("x-vercel-ip-country") || "global";
  const region = country.length === 2 ? country : "global";

  try {
    // ── Step 1: Check cache — do we have today's trending for this region? ──
    const { data: cached, error: cacheError } = await supabase
      .from("trending_movies")
      .select("*")
      .eq("region", region)
      .eq("fetch_date", today)
      .order("rank", { ascending: true })
      .limit(10);

    if (!cacheError && cached && cached.length > 0) {
      return NextResponse.json({ movies: cached, source: "cache", region });
    }

    // Also check global cache if region-specific not found
    if (region !== "global") {
      const { data: globalCached } = await supabase
        .from("trending_movies")
        .select("*")
        .eq("region", "global")
        .eq("fetch_date", today)
        .order("rank", { ascending: true })
        .limit(10);

      if (globalCached && globalCached.length > 0) {
        return NextResponse.json({
          movies: globalCached,
          source: "cache",
          region: "global",
        });
      }
    }

    // ── Step 2: Fetch from TMDB API (v4 Bearer auth) ─────────────────────
    const tmdbUrl = `${TMDB_BASE_URL}/trending/movie/day?language=en-US`;
    const tmdbResponse = await fetch(tmdbUrl, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!tmdbResponse.ok) {
      console.error("TMDB API error:", tmdbResponse.status);
      return NextResponse.json(
        { error: "Failed to fetch trending movies" },
        { status: 502 }
      );
    }

    const tmdbData = await tmdbResponse.json();
    const movies: TMDBMovie[] = tmdbData.results.slice(0, 10);

    // ── Step 3: Store in Supabase for caching ──────────────────────────────
    const rows = movies.map((movie, index) => ({
      tmdb_id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      genre_ids: movie.genre_ids,
      popularity: movie.popularity,
      rank: index + 1,
      region: "global",
      fetch_date: today,
    }));

    // Upsert to avoid conflicts if another request already cached today
    const { error: insertError } = await supabase
      .from("trending_movies")
      .upsert(rows, { onConflict: "tmdb_id,region,fetch_date" });

    if (insertError) {
      console.error("Cache insert error:", insertError.message);
      // Still return the data even if caching fails
    }

    // ── Step 4: Return the fresh data ──────────────────────────────────────
    return NextResponse.json({
      movies: rows,
      source: "tmdb",
      region: "global",
    });
  } catch (err) {
    console.error("Trending API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
