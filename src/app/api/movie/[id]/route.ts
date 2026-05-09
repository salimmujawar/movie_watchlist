import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const movieId = params.id;

  if (!movieId || isNaN(Number(movieId))) {
    return NextResponse.json({ error: "Invalid movie ID" }, { status: 400 });
  }

  try {
    // Fetch movie details, credits, and similar movies in a single call
    const tmdbUrl = `${TMDB_BASE_URL}/movie/${movieId}?language=en-US&append_to_response=credits,similar`;
    const res = await fetch(tmdbUrl, {
      headers: {
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        Accept: "application/json",
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) {
      console.error("TMDB movie detail error:", res.status);
      return NextResponse.json(
        { error: "Movie not found" },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Extract top 10 cast members
    const cast = (data.credits?.cast || []).slice(0, 10).map(
      (c: {
        id: number;
        name: string;
        character: string;
        profile_path: string | null;
      }) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profile_path: c.profile_path,
      })
    );

    // Get the director
    const director = (data.credits?.crew || []).find(
      (c: { job: string }) => c.job === "Director"
    );

    // Extract similar movies (top 10)
    const similar = (data.similar?.results || []).slice(0, 10).map(
      (m: {
        id: number;
        title: string;
        poster_path: string | null;
        vote_average: number;
        release_date: string;
      }) => ({
        id: m.id,
        title: m.title,
        poster_path: m.poster_path,
        vote_average: m.vote_average,
        release_date: m.release_date,
      })
    );

    // Build clean response
    const movie = {
      id: data.id,
      title: data.title,
      overview: data.overview,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      release_date: data.release_date,
      runtime: data.runtime,
      vote_average: data.vote_average,
      vote_count: data.vote_count,
      genres: (data.genres || []).map((g: { id: number; name: string }) => g.name),
      tagline: data.tagline,
      certification: null as string | null,
      director: director
        ? { id: director.id, name: director.name }
        : null,
      cast,
      similar,
    };

    // Fetch certification and watch providers in parallel
    const [certRes, watchRes] = await Promise.all([
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/release_dates`, {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      }),
      fetch(`${TMDB_BASE_URL}/movie/${movieId}/watch/providers`, {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      }),
    ]);

    // Certification
    if (certRes.ok) {
      const certData = await certRes.json();
      const usRelease = certData.results?.find(
        (r: { iso_3166_1: string }) => r.iso_3166_1 === "US"
      );
      if (usRelease?.release_dates?.[0]?.certification) {
        movie.certification = usRelease.release_dates[0].certification;
      }
    }

    // Watch providers — prefer US, fall back to IN, then GB
    interface WatchProviderEntry {
      provider_id: number;
      provider_name: string;
      logo_path: string | null;
    }

    interface WatchProviderRegion {
      link?: string;
      flatrate?: WatchProviderEntry[];
      rent?: WatchProviderEntry[];
      buy?: WatchProviderEntry[];
      ads?: WatchProviderEntry[];
      free?: WatchProviderEntry[];
    }

    let watchProviders: {
      link: string | null;
      stream: { id: number; name: string; logo: string | null }[];
      rent: { id: number; name: string; logo: string | null }[];
      buy: { id: number; name: string; logo: string | null }[];
    } = { link: null, stream: [], rent: [], buy: [] };

    if (watchRes.ok) {
      const watchData = await watchRes.json();
      const regions: WatchProviderRegion | undefined =
        watchData.results?.US || watchData.results?.IN || watchData.results?.GB;

      if (regions) {
        const mapProviders = (list?: WatchProviderEntry[]) =>
          (list || []).map((p) => ({
            id: p.provider_id,
            name: p.provider_name,
            logo: p.logo_path,
          }));

        watchProviders = {
          link: regions.link || null,
          stream: mapProviders(regions.flatrate || regions.ads || regions.free),
          rent: mapProviders(regions.rent),
          buy: mapProviders(regions.buy),
        };
      }
    }

    return NextResponse.json({ ...movie, watch_providers: watchProviders });
  } catch (err) {
    console.error("Movie detail API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
