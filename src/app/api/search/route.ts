import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * Theme → TMDB filter mapping.
 * Each avoid-theme maps to genre exclusions and/or keyword exclusions.
 *
 * TMDB keyword IDs sourced from their keyword API:
 *   gore (6531), blood (10084), graphic violence (312111),
 *   drug use (2360), nudity (1874), profanity (190370)
 */
const THEME_FILTERS: Record<string, { excludeGenres?: number[]; excludeKeywords?: number[] }> = {
  gore:           { excludeGenres: [27],  excludeKeywords: [6531, 10084, 312111] },
  violence:       { excludeKeywords: [312111, 10291] },
  language:       { excludeKeywords: [190370] },
  adult:          { excludeGenres: [27],  excludeKeywords: [1874] },
  drugs:          { excludeKeywords: [2360, 2365] },
  disturbing:     { excludeGenres: [27],  excludeKeywords: [6531, 10084] },
};

/**
 * GET /api/search?q=inception&genres=28,878&max_rating=PG-13&avoid=gore,adult&page=1
 *
 * Two modes:
 *  1. Text search  (q is set)   → TMDB /search/movie — bypasses all filters
 *  2. Discovery     (q is empty) → TMDB /discover/movie — applies genres,
 *     max_rating (US certification), and avoid-theme exclusions
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query     = searchParams.get("q")?.trim() || "";
  const genres    = searchParams.get("genres")?.trim() || "";
  const maxRating = searchParams.get("max_rating")?.trim() || "";
  const avoid     = searchParams.get("avoid")?.trim() || "";
  const page      = searchParams.get("page") || "1";

  if (!query && !genres && !maxRating && !avoid) {
    return NextResponse.json({ results: [], total_results: 0 });
  }

  try {
    let url: string;

    if (query) {
      // ── Direct movie name search — bypass all filters ───────────
      url = `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}&include_adult=false`;
    } else {
      // ── Discovery mode — apply all filters ──────────────────────
      const params = new URLSearchParams({
        language: "en-US",
        page,
        sort_by: "popularity.desc",
        include_adult: "false",
      });

      // Genre filter
      if (genres) {
        params.set("with_genres", genres);
      }

      // Max age rating (US certification system)
      if (maxRating) {
        params.set("certification_country", "US");
        params.set("certification.lte", maxRating);
      }

      // Avoid themes → collect genre & keyword exclusions
      if (avoid) {
        const themes = avoid.split(",").map((t) => t.trim().toLowerCase());
        const excludeGenreSet = new Set<number>();
        const excludeKeywordSet = new Set<number>();

        for (const theme of themes) {
          const filter = THEME_FILTERS[theme];
          if (filter) {
            filter.excludeGenres?.forEach((g) => excludeGenreSet.add(g));
            filter.excludeKeywords?.forEach((k) => excludeKeywordSet.add(k));
          }
        }

        if (excludeGenreSet.size > 0) {
          params.set("without_genres", Array.from(excludeGenreSet).join(","));
        }
        if (excludeKeywordSet.size > 0) {
          params.set("without_keywords", Array.from(excludeKeywordSet).join(","));
        }
      }

      url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
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
