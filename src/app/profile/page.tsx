"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
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

  const seg1 = pct * 0.5 * circumference;
  const seg2 = pct * 0.3 * circumference;
  const seg3 = pct * 0.2 * circumference;

  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      <circle cx="45" cy="45" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
      <circle cx="45" cy="45" r={radius} fill="none" stroke="#e50914" strokeWidth="7"
        strokeDasharray={`${seg1} ${circumference - seg1}`} strokeDashoffset="0" strokeLinecap="round" transform="rotate(-90 45 45)" />
      <circle cx="45" cy="45" r={radius} fill="none" stroke="#facc15" strokeWidth="7"
        strokeDasharray={`${seg2} ${circumference - seg2}`} strokeDashoffset={`${-seg1}`} strokeLinecap="round" transform="rotate(-90 45 45)" />
      <circle cx="45" cy="45" r={radius} fill="none" stroke="#8b5cf6" strokeWidth="7"
        strokeDasharray={`${seg3} ${circumference - seg3}`} strokeDashoffset={`${-(seg1 + seg2)}`} strokeLinecap="round" transform="rotate(-90 45 45)" />
    </svg>
  );
}

// ─── Movie Card (matches home page TrendingMovieCard style) ───────────────────

function ProfileMovieCard({ movie }: { movie: { tmdb_id: number; movie_title: string; poster_path: string | null } }) {
  return (
    <Link href={`/movie/${movie.tmdb_id}`} className="shrink-0 w-[160px] sm:w-[180px] group cursor-pointer">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2">
        {movie.poster_path ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.movie_title}
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
      <div className="px-1">
        <p className="text-white text-sm font-medium truncate">{movie.movie_title}</p>
      </div>
    </Link>
  );
}

// ─── Movie Carousel (matches home page carousel pattern) ──────────────────────

function ProfileCarousel({
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [checkScroll, movies]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h3>
        {movies.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-20 hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-20 hover:bg-white/10"
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
        <p className="text-white/30 text-sm py-4">{emptyText}</p>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto overflow-y-visible pb-2 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory", msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          {movies.map((m) => (
            <div key={m.tmdb_id} style={{ scrollSnapAlign: "start" }}>
              <ProfileMovieCard movie={m} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Main Profile Page ────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchedMovies, setWatchedMovies] = useState<WatchedMovie[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<WatchlistMovie[]>([]);
  const [watchedCount, setWatchedCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const loadProfile = useCallback(async () => {
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
        else { localStorage.removeItem("cinecircle_user_id"); router.replace("/"); return; }
      } else { router.replace("/"); return; }
    }

    const { data: watched, count: wCount } = await supabase
      .from("watched_movies")
      .select("id, tmdb_id, movie_title, poster_path, watched_at", { count: "exact" })
      .eq("user_id", userId)
      .order("watched_at", { ascending: false });
    if (watched) setWatchedMovies(watched);
    if (wCount !== null) setWatchedCount(wCount);

    const { data: watchlist } = await supabase
      .from("watchlist")
      .select("id, tmdb_id, movie_title, poster_path, added_at")
      .eq("user_id", userId)
      .order("added_at", { ascending: false });
    if (watchlist) setWatchlistMovies(watchlist);

    // Load follower/following counts
    const { data: followerRows } = await supabase
      .from("follows")
      .select("id")
      .eq("following_id", userId);
    setFollowerCount(followerRows?.length ?? 0);

    const { data: followingRows } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", userId);
    setFollowingCount(followingRows?.length ?? 0);

    setLoading(false);
  }, [router]);

  // Re-fetch every time we navigate to this page (pathname changes trigger re-render)
  useEffect(() => { loadProfile(); }, [loadProfile, pathname]);

  // Also re-fetch when tab becomes visible (e.g. switching back from another tab)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") loadProfile();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [loadProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const totalHours = watchedCount * 2;
  const months = Math.floor(totalHours / (24 * 30));
  const days = Math.floor((totalHours % (24 * 30)) / 24);
  const hours = totalHours % 24;

  const userName = user.name || "User";
  const userHandle = `@${(user.first_name || user.name || "user").replace(/\s+/g, "").toLowerCase()}`;
  const userImage = user.profile_image;
  const userInitial = userName.charAt(0).toUpperCase();
  const badgeTitle = watchedCount >= 100 ? "Gold Taste Critic" : watchedCount >= 20 ? "Silver Critic" : "Movie Explorer";

  const followers = followerCount;
  const following = followingCount;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar user={user} />

      {/* ── Profile Hero Banner ────────────────────────────────────────────── */}
      <div className="relative w-full h-[220px] sm:h-[260px] mt-[56px]">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #0d0d1a 40%, #1a0a1a 70%, #0a0a0a 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>

      {/* ── Profile Content ────────────────────────────────────────────────── */}
      <main className="relative z-10 -mt-28 pb-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          {/* ── Avatar + Info Row ──────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 mb-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              {userImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={userImage}
                  alt={userName}
                  className="w-28 h-28 rounded-full object-cover ring-4 ring-[#0a0a0a]"
                />
              ) : (
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center text-white font-bold text-3xl ring-4 ring-[#0a0a0a]"
                  style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                >
                  {userInitial}
                </div>
              )}
              {/* Verified badge */}
              <div
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  border: "3px solid #0a0a0a",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </div>
            </div>

            {/* Name + Handle + Bio */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{userName}</h1>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}
                >
                  {badgeTitle}
                </span>
              </div>
              <p className="text-white/40 text-sm mb-2">{userHandle}</p>
              <p className="text-white/50 text-sm max-w-md">
                {user.bio || "Movie enthusiast on CineCircle."}
              </p>
            </div>

            {/* Action Buttons (desktop right side) */}
            <div className="flex gap-3 shrink-0">
              <button
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:bg-white/15"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                Edit Profile
              </button>
              <button
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:bg-white/15"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                Share Profile
              </button>
            </div>
          </div>

          {/* ── Stats Row ──────────────────────────────────────────────────── */}
          <div className="flex items-center gap-6 sm:gap-8 mb-8 justify-center sm:justify-start">
            <div className="text-center sm:text-left">
              <span className="text-xl font-bold text-white">{followers}</span>
              <span className="text-white/40 text-sm ml-1.5">Followers</span>
            </div>
            <div className="w-px h-5 bg-white/15" />
            <div className="text-center sm:text-left">
              <span className="text-xl font-bold text-white">{following}</span>
              <span className="text-white/40 text-sm ml-1.5">Following</span>
            </div>
            <div className="w-px h-5 bg-white/15" />
            <div className="text-center sm:text-left">
              <span className="text-xl font-bold text-white">{watchedCount}</span>
              <span className="text-white/40 text-sm ml-1.5">Watched</span>
            </div>
          </div>

          {/* ── Movie Watch Time ───────────────────────────────────────────── */}
          <section className="py-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-1">
              <span className="text-red-500">&#9679;</span>
              Movie Watch Time
            </h3>
            <p className="text-white/30 text-sm mb-5">Your cinematic journey</p>

            <div className="flex items-center gap-8">
              <div className="shrink-0">
                <WatchTimeRing hours={totalHours} />
              </div>

              <div className="flex gap-8 sm:gap-12">
                <div>
                  <p className="text-3xl font-bold text-white">{months}</p>
                  <p className="text-xs text-white/40 mt-0.5">Months</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{days}</p>
                  <p className="text-xs text-white/40 mt-0.5">Days</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{hours}</p>
                  <p className="text-xs text-white/40 mt-0.5">Hours</p>
                </div>
              </div>

              {/* Film reel decoration */}
              <div className="hidden md:block ml-auto opacity-20">
                <svg width="70" height="70" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="1.5" />
                  <circle cx="32" cy="32" r="8" stroke="white" strokeWidth="1" />
                  <circle cx="32" cy="12" r="4" fill="white" fillOpacity="0.3" />
                  <circle cx="32" cy="52" r="4" fill="white" fillOpacity="0.3" />
                  <circle cx="12" cy="32" r="4" fill="white" fillOpacity="0.3" />
                  <circle cx="52" cy="32" r="4" fill="white" fillOpacity="0.3" />
                  <circle cx="17" cy="17" r="3" fill="white" fillOpacity="0.15" />
                  <circle cx="47" cy="47" r="3" fill="white" fillOpacity="0.15" />
                  <circle cx="47" cy="17" r="3" fill="white" fillOpacity="0.15" />
                  <circle cx="17" cy="47" r="3" fill="white" fillOpacity="0.15" />
                </svg>
              </div>
            </div>
          </section>

          {/* ── Watched Movies ─────────────────────────────────────────────── */}
          <ProfileCarousel
            title="Watched"
            icon={<span className="text-green-500">&#9679;</span>}
            movies={watchedMovies}
            emptyText="No movies watched yet. Start marking movies as watched!"
          />

          {/* ── Watch Later ────────────────────────────────────────────────── */}
          <ProfileCarousel
            title="Watch Later"
            icon={<span className="text-amber-500">&#9679;</span>}
            movies={watchlistMovies}
            emptyText="Your watch later list is empty. Add movies from the detail page!"
          />
        </div>
      </main>
    </div>
  );
}
