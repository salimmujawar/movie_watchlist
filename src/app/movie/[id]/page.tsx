"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  genres: string[];
  tagline: string;
  certification: string | null;
  director: { id: number; name: string } | null;
  cast: CastMember[];
  similar: SimilarMovie[];
}

// ─── Demo circle reviews (static for now) ──────────────────────────────────────

const CIRCLE_REVIEWS = [
  {
    initials: "RK",
    name: "Rahul Kumar",
    badge: "Expert",
    badgeColor: "#22c55e",
    review: "One of the best films in its genre. Absolutely stunning performances.",
    stars: 5,
    avatarBg: "linear-gradient(135deg, #e50914, #b20710)",
  },
  {
    initials: "SV",
    name: "Sneha Verma",
    badge: "Critic",
    badgeColor: "#3b82f6",
    review: "Great pacing and cinematography. A few slow moments but overall brilliant.",
    stars: 4,
    avatarBg: "linear-gradient(135deg, #f59e0b, #d97706)",
  },
  {
    initials: "MA",
    name: "Mohammed Ali",
    badge: "Reviewer",
    badgeColor: "#8b5cf6",
    review: "Rewatchable every year. The performances are timeless.",
    stars: 5,
    avatarBg: "linear-gradient(135deg, #06b6d4, #0284c7)",
  },
  {
    initials: "PL",
    name: "Priya Lal",
    badge: "Reviewer",
    badgeColor: "#8b5cf6",
    review: "Still the gold standard. A must-watch for everyone.",
    stars: 5,
    avatarBg: "linear-gradient(135deg, #ec4899, #be185d)",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatRuntime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  "linear-gradient(135deg, #22c55e, #15803d)",
  "linear-gradient(135deg, #f59e0b, #d97706)",
  "linear-gradient(135deg, #ef4444, #b91c1c)",
  "linear-gradient(135deg, #8b5cf6, #6d28d9)",
  "linear-gradient(135deg, #ec4899, #be185d)",
  "linear-gradient(135deg, #06b6d4, #0284c7)",
  "linear-gradient(135deg, #f97316, #c2410c)",
  "linear-gradient(135deg, #14b8a6, #0d9488)",
  "linear-gradient(135deg, #6366f1, #4f46e5)",
];

// ─── Star Rating Component ─────────────────────────────────────────────────────

function StarRating({
  rating,
  onRate,
  size = 32,
}: {
  rating: number;
  onRate?: (star: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
          style={{ cursor: onRate ? "pointer" : "default" }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={star <= (hover || rating) ? "#f59e0b" : "none"}
            stroke={star <= (hover || rating) ? "#f59e0b" : "#555"}
            strokeWidth="1.5"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ─── Compact Star Display ──────────────────────────────────────────────────────

function Stars({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < count ? "#f59e0b" : "none"}
          stroke={i < count ? "#f59e0b" : "#555"}
          strokeWidth="1.5"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

// ─── Similar Movies Carousel ───────────────────────────────────────────────────

function SimilarCarousel({
  movies,
  directorName,
}: {
  movies: SimilarMovie[];
  directorName: string | null;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  if (movies.length === 0) return null;

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {directorName ? `More from ${directorName}` : "Similar Movies"}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {movies.map((m) => (
          <Link
            key={m.id}
            href={`/movie/${m.id}`}
            className="shrink-0 w-[130px] group cursor-pointer"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2">
              {m.poster_path ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/30 text-xs">
                  No Poster
                </div>
              )}
              {/* Rating badge */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-bold"
                style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#facc15">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
                <span className="text-white">{m.vote_average.toFixed(1)}</span>
              </div>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-white text-xs font-medium truncate">{m.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Main Page Component ───────────────────────────────────────────────────────

export default function MovieDetailPage() {
  const router = useRouter();
  const params = useParams();
  const movieId = params.id as string;

  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watched, setWatched] = useState(false);

  const fetchMovie = useCallback(async () => {
    try {
      const res = await fetch(`/api/movie/${movieId}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setMovie(data);
    } catch {
      console.error("Failed to load movie");
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  // Load existing user rating from movie_preferences
  useEffect(() => {
    const userId = localStorage.getItem("cinecircle_user_id");
    if (!userId || !movieId) return;

    supabase
      .from("movie_preferences")
      .select("rating, preference")
      .eq("user_id", userId)
      .eq("tmdb_id", Number(movieId))
      .single()
      .then(({ data }) => {
        if (data?.rating) setUserRating(data.rating);
        if (data?.preference === "liked") setWatched(true);
      });
  }, [movieId]);

  // Save rating to movie_preferences
  const handleRate = useCallback(
    async (star: number) => {
      const newRating = star === userRating ? 0 : star;
      setUserRating(newRating);

      const userId = localStorage.getItem("cinecircle_user_id");
      if (!userId || !movie) return;

      if (newRating === 0) {
        // User cleared their rating — remove the row if it was a 'rated' only entry
        // but keep it if it was liked/disliked from onboarding
        await supabase
          .from("movie_preferences")
          .update({ rating: null })
          .eq("user_id", userId)
          .eq("tmdb_id", movie.id);
        return;
      }

      // Upsert: if a preference already exists for this movie, add/update rating
      // If not, create a new 'rated' entry
      const { data: existing } = await supabase
        .from("movie_preferences")
        .select("id")
        .eq("user_id", userId)
        .eq("tmdb_id", movie.id)
        .single();

      if (existing) {
        await supabase
          .from("movie_preferences")
          .update({ rating: newRating })
          .eq("id", existing.id);
      } else {
        await supabase.from("movie_preferences").insert({
          user_id: userId,
          movie_title: movie.title,
          movie_genre: movie.genres,
          tmdb_id: movie.id,
          preference: "rated",
          rating: newRating,
        });
      }
    },
    [userRating, movie]
  );

  useEffect(() => {
    if (movieId) fetchMovie();
  }, [movieId, fetchMovie]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <p className="text-white/50 text-lg">Movie not found</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 rounded-full text-sm text-white border border-white/20 hover:bg-white/10 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const year = movie.release_date?.split("-")[0] || "";
  const circleRating = 4.9; // Demo value
  const circleCount = 15; // Demo value

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ── Backdrop ────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[350px] sm:h-[420px]">
        {movie.backdrop_path ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-white/5 to-[#0a0a0a]" />
        )}
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/40" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-5 left-5 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-40 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left Column ─────────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Title + Poster row */}
            <div className="flex gap-6 items-start">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                  {movie.title}
                </h1>

                {/* Ratings row */}
                <div className="flex items-center gap-4 mb-4 flex-wrap">
                  {/* TMDB rating */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-green-400">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-sm text-white/40">/10</span>
                    <span className="text-xs text-white/30 ml-1 block">
                      TMDB Community
                    </span>
                  </div>

                  <div className="w-px h-8 bg-white/15" />

                  {/* Circle rating (demo) */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">
                      {circleRating}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" className="mb-0.5">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                    <span className="text-xs text-white/30 ml-1">
                      from {circleCount} friends
                    </span>
                  </div>
                </div>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {year && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium text-white/70 border border-white/15 bg-white/5">
                      {year}
                    </span>
                  )}
                  {movie.genres.length > 0 && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium text-white/70 border border-white/15 bg-white/5">
                      {movie.genres.join(" · ")}
                    </span>
                  )}
                  {movie.runtime > 0 && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium text-white/70 border border-white/15 bg-white/5">
                      {formatRuntime(movie.runtime)}
                    </span>
                  )}
                  {movie.certification && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium text-white/70 border border-white/15 bg-white/5">
                      {movie.certification}
                    </span>
                  )}
                  <button
                    onClick={() => setInWatchlist(!inWatchlist)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      background: inWatchlist
                        ? "rgba(34, 197, 94, 0.15)"
                        : "rgba(255,255,255,0.05)",
                      color: inWatchlist ? "#4ade80" : "rgba(255,255,255,0.5)",
                      border: inWatchlist
                        ? "1px solid rgba(34, 197, 94, 0.4)"
                        : "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {inWatchlist ? "✓ In your watchlist" : "+ Add to watchlist"}
                  </button>
                </div>
              </div>

              {/* Poster (desktop) */}
              {movie.poster_path && (
                <div className="hidden sm:block shrink-0 w-[160px] rounded-xl overflow-hidden shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>

            {/* Overview */}
            <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              {movie.overview}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <button
                onClick={() => setWatched(!watched)}
                className="px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all"
                style={{
                  background: watched
                    ? "linear-gradient(135deg, #15803d, #166534)"
                    : "linear-gradient(135deg, #22c55e, #16a34a)",
                  boxShadow: "0 4px 16px rgba(34,197,94,0.3)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {watched ? "Watched" : "Mark Watched"}
              </button>

              <button
                onClick={() => setInWatchlist(!inWatchlist)}
                className="px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all hover:bg-white/15"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add to List
              </button>

              <button
                className="px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all hover:bg-white/15"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share
              </button>
            </div>

            {/* ── Cast ──────────────────────────────────────────────────────── */}
            {movie.cast.length > 0 && (
              <section className="mb-10">
                <h3 className="text-lg font-semibold text-white mb-4">Cast</h3>
                <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                  {movie.cast.map((person, i) => (
                    <div key={person.id} className="flex flex-col items-center shrink-0 w-[72px]">
                      {person.profile_path ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                          alt={person.name}
                          className="w-14 h-14 rounded-full object-cover mb-2 ring-2 ring-white/10"
                        />
                      ) : (
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center mb-2 text-white font-bold text-sm ring-2 ring-white/10"
                          style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                        >
                          {getInitials(person.name)}
                        </div>
                      )}
                      <p className="text-white text-[11px] font-medium text-center leading-tight truncate w-full">
                        {person.name}
                      </p>
                      <p className="text-white/40 text-[10px] text-center leading-tight truncate w-full">
                        {person.character}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Similar / More from Director ──────────────────────────────── */}
            <SimilarCarousel
              movies={movie.similar}
              directorName={movie.director?.name || null}
            />
          </div>

          {/* ── Right Sidebar ───────────────────────────────────────────────── */}
          <div className="w-full lg:w-[340px] shrink-0 space-y-6 lg:mt-0 mt-4">
            {/* What your circle thinks */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h4 className="text-base font-semibold text-white mb-4">
                What your circle thinks
              </h4>

              <div className="space-y-4">
                {CIRCLE_REVIEWS.map((r) => (
                  <div key={r.name} className="flex gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                      style={{ background: r.avatarBg }}
                    >
                      {r.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-white">
                          {r.name}
                        </span>
                        <span
                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                          style={{
                            background: `${r.badgeColor}25`,
                            color: r.badgeColor,
                          }}
                        >
                          {r.badge}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 leading-relaxed mb-1">
                        &ldquo;{r.review}&rdquo;
                      </p>
                      <Stars count={r.stars} />
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="w-full mt-5 py-2.5 rounded-full text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                Write a review
              </button>
            </div>

            {/* Your rating */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h4 className="text-base font-semibold text-white mb-3">
                Your rating
              </h4>
              <div className="flex flex-col items-center">
                <StarRating
                  rating={userRating}
                  onRate={handleRate}
                  size={36}
                />
                <p className="text-white/40 text-xs mt-2">
                  {userRating > 0
                    ? `${userRating} / 5 stars · Tap to change`
                    : "Tap a star to rate"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-20" />
    </div>
  );
}
