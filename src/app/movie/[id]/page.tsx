"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar, { UserProfile } from "@/components/Navbar";

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

// ─── Review type ──────────────────────────────────────────────────────────────

interface Review {
  id: string;
  user_id: string;
  tmdb_id: number;
  movie_title: string;
  rating: number;
  review_text: string;
  created_at: string;
  user_name: string;
  user_avatar: string | null;
}

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);

  // Load user profile for navbar
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from("users")
          .select("id, name, first_name, email, profile_image, onboarding_completed")
          .eq("google_id", session.user.id)
          .single();
        if (data) {
          setUser(data as UserProfile);
          return;
        }
      }
      const userId = localStorage.getItem("cinecircle_user_id");
      if (userId) {
        const { data } = await supabase
          .from("users")
          .select("id, name, first_name, email, profile_image, onboarding_completed")
          .eq("id", userId)
          .single();
        if (data) setUser(data as UserProfile);
      }
    };
    loadUser();
  }, []);

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

  // Load existing user state from all tables on mount
  useEffect(() => {
    const userId = localStorage.getItem("cinecircle_user_id");
    if (!userId || !movieId) return;
    const tmdbId = Number(movieId);

    // Load rating from movie_preferences
    supabase
      .from("movie_preferences")
      .select("rating")
      .eq("user_id", userId)
      .eq("tmdb_id", tmdbId)
      .single()
      .then(({ data }) => {
        if (data?.rating) setUserRating(data.rating);
      });

    // Load watchlist status
    supabase
      .from("watchlist")
      .select("id")
      .eq("user_id", userId)
      .eq("tmdb_id", tmdbId)
      .single()
      .then(({ data }) => {
        if (data) setInWatchlist(true);
      });

    // Load watched status
    supabase
      .from("watched_movies")
      .select("id")
      .eq("user_id", userId)
      .eq("tmdb_id", tmdbId)
      .single()
      .then(({ data }) => {
        if (data) setWatched(true);
      });
  }, [movieId]);

  // ── Save rating to movie_preferences ─────────────────────────────────
  const handleRate = useCallback(
    async (star: number) => {
      const newRating = star === userRating ? 0 : star;
      setUserRating(newRating);

      const userId = localStorage.getItem("cinecircle_user_id");
      if (!userId || !movie) return;

      if (newRating === 0) {
        await supabase
          .from("movie_preferences")
          .update({ rating: null })
          .eq("user_id", userId)
          .eq("tmdb_id", movie.id);
        return;
      }

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

      // Also sync to reviews table if a review exists
      if (existingReview && newRating > 0) {
        await supabase
          .from("reviews")
          .update({ rating: newRating, updated_at: new Date().toISOString() })
          .eq("user_id", userId)
          .eq("tmdb_id", movie.id);
        setExistingReview({ ...existingReview, rating: newRating });
        // Update the review in the local list
        setReviews((prev) =>
          prev.map((r) =>
            r.user_id === userId && r.tmdb_id === movie.id
              ? { ...r, rating: newRating }
              : r
          )
        );
      }
    },
    [userRating, movie, existingReview]
  );

  // ── Toggle watchlist ─────────────────────────────────────────────────
  const handleToggleWatchlist = useCallback(async () => {
    const userId = localStorage.getItem("cinecircle_user_id");
    if (!userId || !movie) return;

    if (inWatchlist) {
      // Remove from watchlist
      await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", userId)
        .eq("tmdb_id", movie.id);
      setInWatchlist(false);
    } else {
      // Add to watchlist
      await supabase.from("watchlist").upsert(
        {
          user_id: userId,
          tmdb_id: movie.id,
          movie_title: movie.title,
          movie_genre: movie.genres,
          poster_path: movie.poster_path,
        },
        { onConflict: "user_id,tmdb_id" }
      );
      setInWatchlist(true);
    }
  }, [inWatchlist, movie]);

  // ── Toggle watched ───────────────────────────────────────────────────
  const handleToggleWatched = useCallback(async () => {
    const userId = localStorage.getItem("cinecircle_user_id");
    if (!userId || !movie) return;

    if (watched) {
      // Remove from watched
      await supabase
        .from("watched_movies")
        .delete()
        .eq("user_id", userId)
        .eq("tmdb_id", movie.id);
      setWatched(false);
    } else {
      // Mark as watched
      await supabase.from("watched_movies").upsert(
        {
          user_id: userId,
          tmdb_id: movie.id,
          movie_title: movie.title,
          movie_genre: movie.genres,
          poster_path: movie.poster_path,
        },
        { onConflict: "user_id,tmdb_id" }
      );
      setWatched(true);
    }
  }, [watched, movie]);

  // ── Load reviews for this movie ───────────────────────────────────────
  const loadReviews = useCallback(async () => {
    const tmdbId = Number(movieId);
    if (!tmdbId) return;

    const { data: reviewRows } = await supabase
      .from("reviews")
      .select("id, user_id, tmdb_id, movie_title, rating, review_text, created_at")
      .eq("tmdb_id", tmdbId)
      .order("created_at", { ascending: false });

    if (!reviewRows || reviewRows.length === 0) {
      setReviews([]);
      return;
    }

    // Fetch user names + avatars for each reviewer
    const userIds = Array.from(new Set(reviewRows.map((r: { user_id: string }) => r.user_id)));
    const { data: users } = await supabase
      .from("users")
      .select("id, name, profile_image")
      .in("id", userIds);

    const userMap: Record<string, { name: string; profile_image: string | null }> = {};
    if (users) {
      for (const u of users) {
        userMap[u.id] = { name: u.name, profile_image: u.profile_image };
      }
    }

    const enriched: Review[] = reviewRows.map((r: { id: string; user_id: string; tmdb_id: number; movie_title: string; rating: number; review_text: string; created_at: string }) => ({
      ...r,
      user_name: userMap[r.user_id]?.name || "Unknown",
      user_avatar: userMap[r.user_id]?.profile_image || null,
    }));

    setReviews(enriched);

    // Check if current user already has a review — sync rating to "Your rating"
    const userId = localStorage.getItem("cinecircle_user_id");
    if (userId) {
      const existing = enriched.find((r) => r.user_id === userId);
      if (existing) {
        setExistingReview(existing);
        setUserRating((prev) => (prev === 0 ? existing.rating : prev));
      }
    }
  }, [movieId]);

  // ── Submit / update review ──────────────────────────────────────────────
  const handleSubmitReview = useCallback(async () => {
    const userId = localStorage.getItem("cinecircle_user_id");
    if (!userId || !movie || !reviewText.trim() || reviewRating === 0) return;

    setSubmittingReview(true);
    try {
      const { error } = await supabase.from("reviews").upsert(
        {
          user_id: userId,
          tmdb_id: movie.id,
          movie_title: movie.title,
          rating: reviewRating,
          review_text: reviewText.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,tmdb_id" }
      );

      if (error) {
        console.error("Review submit error:", error.message);
        return;
      }

      // Sync review rating → "Your rating" section + movie_preferences
      setUserRating(reviewRating);
      const { data: existing } = await supabase
        .from("movie_preferences")
        .select("id")
        .eq("user_id", userId)
        .eq("tmdb_id", movie.id)
        .single();

      if (existing) {
        await supabase
          .from("movie_preferences")
          .update({ rating: reviewRating })
          .eq("id", existing.id);
      } else {
        await supabase.from("movie_preferences").insert({
          user_id: userId,
          movie_title: movie.title,
          movie_genre: movie.genres,
          tmdb_id: movie.id,
          preference: "rated",
          rating: reviewRating,
        });
      }

      // Refresh reviews list
      await loadReviews();
      setReviewModalOpen(false);
      setReviewText("");
      setReviewRating(0);
    } finally {
      setSubmittingReview(false);
    }
  }, [movie, reviewText, reviewRating, loadReviews]);

  // ── Open review modal (pre-fill if editing) ─────────────────────────────
  const openReviewModal = useCallback(() => {
    if (existingReview) {
      setReviewText(existingReview.review_text);
      setReviewRating(existingReview.rating);
    } else {
      setReviewText("");
      setReviewRating(0);
    }
    setReviewModalOpen(true);
  }, [existingReview]);

  useEffect(() => {
    if (movieId) fetchMovie();
  }, [movieId, fetchMovie]);

  useEffect(() => {
    if (movieId) loadReviews();
  }, [movieId, loadReviews]);

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
      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <Navbar user={user} />

      {/* ── Backdrop ────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-[350px] sm:h-[420px] mt-[56px]">
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
          className="absolute top-4 left-5 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
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
                    onClick={handleToggleWatchlist}
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
                onClick={handleToggleWatched}
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
                onClick={handleToggleWatchlist}
                className="px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all hover:bg-white/15"
                style={{
                  background: inWatchlist
                    ? "rgba(34, 197, 94, 0.15)"
                    : "rgba(255,255,255,0.1)",
                  border: inWatchlist
                    ? "1px solid rgba(34, 197, 94, 0.4)"
                    : "1px solid rgba(255,255,255,0.2)",
                  color: inWatchlist ? "#4ade80" : "white",
                }}
              >
                {inWatchlist ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                )}
                {inWatchlist ? "In Watchlist" : "Add to List"}
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
            {/* Reviews section */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-base font-semibold text-white">
                  Reviews
                  {reviews.length > 0 && (
                    <span className="text-white/30 text-sm font-normal ml-2">
                      ({reviews.length})
                    </span>
                  )}
                </h4>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r, idx) => {
                    const initials = getInitials(r.user_name);
                    const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                    const isOwn = r.user_id === localStorage.getItem("cinecircle_user_id");
                    const timeAgo = (() => {
                      const diff = Date.now() - new Date(r.created_at).getTime();
                      const mins = Math.floor(diff / 60000);
                      if (mins < 60) return `${mins}m ago`;
                      const hrs = Math.floor(mins / 60);
                      if (hrs < 24) return `${hrs}h ago`;
                      const days = Math.floor(hrs / 24);
                      return `${days}d ago`;
                    })();

                    return (
                      <div key={r.id} className="flex gap-3">
                        {r.user_avatar ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={r.user_avatar}
                            alt={r.user_name}
                            className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/10"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                            style={{ background: avatarBg }}
                          >
                            {initials}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-white">
                              {r.user_name}
                            </span>
                            {isOwn && (
                              <span
                                className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                                style={{
                                  background: "rgba(59,130,246,0.15)",
                                  color: "#3b82f6",
                                }}
                              >
                                You
                              </span>
                            )}
                            <span className="text-[10px] text-white/25 ml-auto">
                              {timeAgo}
                            </span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed mb-1">
                            &ldquo;{r.review_text}&rdquo;
                          </p>
                          <Stars count={r.rating} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-white/30 text-sm mb-1">No reviews yet</p>
                  <p className="text-white/20 text-xs">Be the first to share your thoughts</p>
                </div>
              )}

              <button
                onClick={openReviewModal}
                className="w-full mt-5 py-2.5 rounded-full text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                {existingReview ? "Edit your review" : "Write a review"}
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

      {/* ── Review Modal ─────────────────────────────────────────────────── */}
      {reviewModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ animation: "reviewBackdropIn 0.25s ease-out" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setReviewModalOpen(false)}
          />

          {/* Modal card */}
          <div
            className="relative w-full max-w-md rounded-2xl p-6 z-10"
            style={{
              background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(139,92,246,0.08)",
              animation: "reviewModalIn 0.3s ease-out",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Movie info row */}
            <div className="flex items-center gap-3 mb-5">
              {movie.poster_path && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  className="w-12 h-[72px] rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="text-white font-semibold text-base leading-tight">
                  {existingReview ? "Edit your review" : "Write a review"}
                </h3>
                <p className="text-white/40 text-sm mt-0.5">{movie.title}</p>
              </div>
            </div>

            {/* Star rating */}
            <div className="mb-5">
              <label className="text-sm text-white/60 mb-2 block">
                Your rating
              </label>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={reviewRating}
                  onRate={setReviewRating}
                  size={32}
                />
                {reviewRating > 0 && (
                  <span className="text-white/40 text-sm">
                    {reviewRating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Review text */}
            <div className="mb-5">
              <label className="text-sm text-white/60 mb-2 block">
                Your thoughts
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What did you think of this movie?"
                rows={4}
                maxLength={1000}
                className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <div className="flex justify-end mt-1">
                <span className="text-[11px] text-white/25">
                  {reviewText.length}/1000
                </span>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={handleSubmitReview}
              disabled={submittingReview || !reviewText.trim() || reviewRating === 0}
              className="w-full py-3 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:
                  reviewText.trim() && reviewRating > 0
                    ? "linear-gradient(135deg, #8b5cf6, #6d28d9)"
                    : "rgba(255,255,255,0.1)",
                boxShadow:
                  reviewText.trim() && reviewRating > 0
                    ? "0 4px 20px rgba(139,92,246,0.3)"
                    : "none",
              }}
            >
              {submittingReview
                ? "Submitting..."
                : existingReview
                  ? "Update Review"
                  : "Post Review"}
            </button>
          </div>
        </div>
      )}

      {/* Review modal animations */}
      <style jsx>{`
        @keyframes reviewBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes reviewModalIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
