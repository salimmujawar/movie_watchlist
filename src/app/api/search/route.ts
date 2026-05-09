import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * GET /api/search?q=inception&genres=28,878&page=1
 *
 * Searches TMDB for movies matching a text query and/or genre filter.
 * - q: free-text search term (optional)
 * - genres: comma-separated TMDB genre IDs (optional)
 * - page: result page (default 1)
 *
 * When only genres are supplied (no q), uses TMDB /discover/movie.
 * When q is supplied, uses TMDB /search/movie.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() || "";
  const genres = searchParams.get("genres")?.trim() || "";
  const page = searchParams.get("page") || "1";

  if (!query && !genres) {
    return NextResponse.json({ results: [], total_results: 0 });
  }

  try {
    let url: string;

    if (query) {
      // Text search — genres are ignored by TMDB search, we filter client-side
      url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`;
    } else {
      // Genre-only discovery
      url = `${TMDB_BASE_URL}/discover/movie?language=en-US&page=${page}&sort_by=popularity.desc&include_adult=false&with_genres=${genres}`;
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error("TMDB search error:", res.status);
      return NextResponse.json(
        { error: "Search failed" },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Slim the response to what the client needs
    const results = (data.results || []).map(
      (m: {
        id: number;
        title: string;
        overview: string;
        poster_path: string | null;
        backdrop_path: string | null;
        release_date: string;
        vote_average: number;
        genre_ids: number[];
      }) => ({
        tmdb_id: m.id,
        title: m.title,
        overview: m.overview,
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
        release_date: m.release_date,
        vote_average: m.vote_average,
        genre_ids: m.genre_ids,
      })
    );

    return NextResponse.json({
      results,
      total_results: data.total_results || 0,
      page: data.page || 1,
      total_pages: data.total_pages || 0,
    });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
