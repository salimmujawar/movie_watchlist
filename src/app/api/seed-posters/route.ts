import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

/**
 * One-time utility: fetches real poster paths from TMDB
 * for all watched_movies and watchlist rows with NULL poster_path.
 *
 * Usage: GET /api/seed-posters (hit once after running migration 009)
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;

async function fetchPoster(tmdbId: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.poster_path || null;
  } catch {
    return null;
  }
}

export async function GET() {
  const results: { table: string; tmdb_id: number; poster_path: string | null; status: string }[] = [];

  // ── Watched movies with missing posters ──
  const { data: watchedRows } = await supabase
    .from("watched_movies")
    .select("id, tmdb_id")
    .is("poster_path", null);

  if (watchedRows) {
    for (const row of watchedRows) {
      const poster = await fetchPoster(row.tmdb_id);
      if (poster) {
        await supabase
          .from("watched_movies")
          .update({ poster_path: poster })
          .eq("id", row.id);
        results.push({ table: "watched_movies", tmdb_id: row.tmdb_id, poster_path: poster, status: "updated" });
      } else {
        results.push({ table: "watched_movies", tmdb_id: row.tmdb_id, poster_path: null, status: "not_found" });
      }
      // Small delay to respect TMDB rate limits
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  // ── Watchlist items with missing posters ──
  const { data: watchlistRows } = await supabase
    .from("watchlist")
    .select("id, tmdb_id")
    .is("poster_path", null);

  if (watchlistRows) {
    for (const row of watchlistRows) {
      const poster = await fetchPoster(row.tmdb_id);
      if (poster) {
        await supabase
          .from("watchlist")
          .update({ poster_path: poster })
          .eq("id", row.id);
        results.push({ table: "watchlist", tmdb_id: row.tmdb_id, poster_path: poster, status: "updated" });
      } else {
        results.push({ table: "watchlist", tmdb_id: row.tmdb_id, poster_path: null, status: "not_found" });
      }
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  return NextResponse.json({
    message: `Processed ${results.length} movies`,
    updated: results.filter((r) => r.status === "updated").length,
    not_found: results.filter((r) => r.status === "not_found").length,
    results,
  });
}
