"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar, { UserProfile } from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WatchlistMovie {
  id: string;
  tmdb_id: number;
  movie_title: string;
  poster_path: string | null;
  added_at: string;
}

interface WatchedMovie {
  id: string;
  tmdb_id: number;
  movie_title: string;
  poster_path: string | null;
  watched_at: string;
}

interface ProfileData extends UserProfile {
  bio: string | null;
}

// ─── Watch Time Ring ──────────────────────────────────────────────────────────

function WatchTimeRing({ hours }: { hours: number }) {
  const maxHours = 1000;
  const pct = Math.min(hours / maxHours, 1);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  // Three segments for the ring
  const seg1 = pct * 0.5 * circumference; // red-orange
  const seg2 = pct * 0.3 * circumference; // yellow-green
  const seg3 = pct * 0.2 * circumference; // blue-purple

  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      {/* Background ring */}
      <circle
        cx="45"
        cy="45"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="7"
      />
      {/* Segment 1: Red-Orange */}
      <circle
        cx="45"
        cy="45"
        r={radius}
        fill="none"
        stroke="#e50914"
        strokeWidth="7"
        strokeDasharray={`${seg1} ${circumference - seg1}`}
        strokeDashoffset="0"
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
      />
      {/* Segment 2: Yellow-Green */}
      <circle
        cx="45"
        cy="45"
        r={radius}
        fill="none"
        stroke="#facc15"
        strokeWidth="7"
        strokeDasharray={`${seg2} ${circumference - seg2}`}
        strokeDashoffset={`${-seg1}`}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
      />
      {/* Segment 3: Blue-Purple */}
      <circle
        cx="45"
        cy="45"
        r={radius}
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="7"
        strokeDasharray={`${seg3} ${circumference - seg3}`}
        strokeDashoffset={`${-(seg1 + seg2)}`}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
      />
    </svg>
  );
}

// ─── Movie Carousel (shared for watched & watchlist) ──────────────────────────

function MovieCarousel({
  title,
  icon,
  movies,
  emptyText,
}: {
  title: string;
  icon: React.ReactNode;
  movies: { tmdb_id: number; movie_title: string; poster_path: string | null }[];
  emptyText: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {icon}
          {title}
        </h3>
        {movies.length > 4 && (
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
        )}
      </div>

      {movies.length === 0 ? (
        <div
          className="rounded-xl py-10 text-center"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-white/30 text-sm">{emptyText}</p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {movies.map((m) => (
            <Link
              key={m.tmdb_id}
              href={`/movie/${m.tmdb_id}`}
              className="shrink-0 w-[120px] group"
              style={{ scrollSnapAlign: "start" }}
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-1.5">
                {m.poster_path ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                    alt={m.movie_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/30 text-xs">
                    No Poster
                  </div>
                )}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-white text-xs font-medium truncate px-0.5">
                {m.movie_title}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Main Profile Page ────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<WatchlistMovie[]>([]);
  const [watchedCount, setWatchedCount] = useState(0);

  // Load profile, watched, and watchlist data
  const loadProfile = useCallback(async () => {
    // Get user
    const { data: { session } } = await supabase.auth.getSession();
    let userId: string | null = null;

    if (session) {
      const { data } = await supabase
        .from("users")
        .select("id, name, first_name, email, profile_image, onboarding_completed, bio, created_at")
        .eq("google_id", session.user.id)
        .single();

      if (data) {
        setUser(data as ProfileData);
        userId = data.id;
        localStorage.setItem("cinecircle_user_id", data.id);
      }
    }

    if (!userId) {
      userId = localStorage.getItem("cinecircle_user_id");
      if (userId) {
        const { data } = await supabase
          .from("users")
          .select("id, name, first_name, email, profile_image, onboarding_completed, bio, created_at")
          .eq("id", userId)
          .single();

        if (data) setUser(data as ProfileData);
        else {
          localStorage.removeItem("cinecircle_user_id");
          router.replace("/");
          return;
        }
      } else {
        router.replace("/");
        return;
      }
    }

    // Load watched movies
    const { data: watched, count: wCount } = await supabase
      .from("watched_movies")
      .select("id, tmdb_id, movie_title, poster_path, watched_at", { count: "exact" })
      .eq("user_id", userId)
      .order("watched_at", { ascending: false });

    if (watched) setWatchedMovies(watched);
    if (wCount !== null) setWatchedCount(wCount);

    // Load watchlist
    const { data: watchlist } = await supabase
      .from("watchlist")
      .select("id, tmdb_id, movie_title, poster_path, added_at")
      .eq("user_id", userId)
      .order("added_at", { ascending: false });

    if (watchlist) setWatchlistMovies(watchlist);

    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  // ── Compute watch time from watched count (assume avg 2h per movie)
  const totalHours = watchedCount * 2;
  const months = Math.floor(totalHours / (24 * 30));
  const days = Math.floor((totalHours % (24 * 30)) / 24);
  const hours = totalHours % 24;

  const userName = user.name || "User";
  const userHandle = `@${(user.first_name || user.name || "user").replace(/\s+/g, "").toLowerCase()}`;
  const userImage = user.profile_image;
  const userInitial = userName.charAt(0).toUpperCase();

  // Demo follower/following counts (social features not yet built)
  const followers = 0;
  const following = 0;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar user={user} />

      <main className="pt-20 pb-32 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* ── Profile Header ──────────────────────────────────────────────── */}
          <div
            className="rounded-2xl overflow-hidden mb-6"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Banner area */}
            <div className="relative h-28 sm:h-36 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, #1a1a2e 0%, #0a0a1a 50%, #1a0a1a 100%)",
                }}
              />
              {/* Subtle film strip decoration */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-1/4 w-20 h-20 border border-white/30 rounded" />
                <div className="absolute top-8 right-1/4 w-16 h-16 border border-white/20 rounded rotate-12" />
              </div>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center -mt-14 relative z-10 px-6 pb-6">
              <div className="relative mb-3">
                {userImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={userImage}
                    alt={userName}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-[#0a0a0a]"
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl ring-4 ring-[#0a0a0a]"
                    style={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    {userInitial}
                  </div>
                )}
                {/* Verified badge */}
                <div
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    border: "2px solid #0a0a0a",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                  </svg>
                </div>
              </div>

              {/* Badge title */}
              <p className="text-amber-400 text-xs font-semibold mb-0.5">
                {watchedCount >= 100 ? "Gold Taste Critic" : watchedCount >= 20 ? "Silver Critic" : "Movie Explorer"}
              </p>
              <p className="text-white/40 text-xs mb-1">{userHandle}</p>

              {/* Name */}
              <h1 className="text-2xl font-bold text-white mb-1">{userName}</h1>

              {/* Bio */}
              <p className="text-white/50 text-sm text-center max-w-xs mb-4">
                {user.bio || "Movie enthusiast on CineCircle."}
              </p>

              {/* Stats row */}
              <div
                className="flex items-center gap-0 rounded-full px-1 py-2 mb-5"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex items-center px-4">
                  <span className="text-white font-bold text-sm">{followers}</span>
                  <span className="text-white/40 text-xs ml-1.5">Followers</span>
                </div>
                <div className="w-px h-4 bg-white/15" />
                <div className="flex items-center px-4">
                  <span className="text-white font-bold text-sm">{following}</span>
                  <span className="text-white/40 text-xs ml-1.5">Following</span>
                </div>
                <div className="w-px h-4 bg-white/15" />
                <div className="flex items-center px-4">
                  <span className="text-white font-bold text-sm">{watchedCount}</span>
                  <span className="text-white/40 text-xs ml-1.5">Watched</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 w-full max-w-xs">
                <button
                  className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  Edit Profile
                </button>
                <button
                  className="flex-1 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  Share Profile
                </button>
              </div>
            </div>
          </div>

          {/* ── Movie Watch Time ────────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-5 mb-6"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🎬</span>
              <h3 className="text-base font-semibold text-white">Movie Watch Time</h3>
              <span className="text-white/30 text-xs">- Your cinematic journey</span>
            </div>

            <div className="flex items-center gap-6">
              {/* Ring chart */}
              <div className="shrink-0">
                <WatchTimeRing hours={totalHours} />
              </div>

              {/* Time stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{months}</p>
                  <p className="text-xs text-white/40 italic">Months</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{days}</p>
                  <p className="text-xs text-white/40 italic">Days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{hours}</p>
                  <p className="text-xs text-white/40 italic">Hours</p>
                </div>
              </div>

              {/* Film reel decoration */}
              <div className="hidden sm:block ml-auto opacity-30">
                <svg width="60" height="60" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="2" />
                  <circle cx="32" cy="32" r="8" stroke="white" strokeWidth="1.5" />
                  <circle cx="32" cy="12" r="4" fill="white" fillOpacity="0.3" />
                  <circle cx="32" cy="52" r="4" fill="white" fillOpacity="0.3" />
                  <circle cx="12" cy="32" r="4" fill="white" fillOpacity="0.3" />
                  <circle cx="52" cy="32" r="4" fill="white" fillOpacity="0.3" />
                  <circle cx="17" cy="17" r="3" fill="white" fillOpacity="0.2" />
                  <circle cx="47" cy="47" r="3" fill="white" fillOpacity="0.2" />
                  <circle cx="47" cy="17" r="3" fill="white" fillOpacity="0.2" />
                  <circle cx="17" cy="47" r="3" fill="white" fillOpacity="0.2" />
                </svg>
              </div>
            </div>
          </div>

          {/* ── Watched Movies ─────────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-5 mb-6"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <MovieCarousel
              title="Watched"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              }
              movies={watchedMovies}
              emptyText="No movies watched yet. Start marking movies as watched!"
            />
          </div>

          {/* ── Watch Later (Watchlist) ─────────────────────────────────────── */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <MovieCarousel
              title="Watch Later"
              icon={<span className="text-lg">🍿</span>}
              movies={watchlistMovies}
              emptyText="Your watch later list is empty. Add movies from the detail page!"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
