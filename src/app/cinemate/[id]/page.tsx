"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar, { UserProfile } from "@/components/Navbar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CineMateProfile {
  id: string;
  name: string;
  first_name: string | null;
  email: string | null;
  profile_image: string | null;
  bio: string | null;
  created_at: string;
}

interface MovieItem {
  id: string;
  tmdb_id: number;
  movie_title: string;
  poster_path: string | null;
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

// ─── Movie Card ───────────────────────────────────────────────────────────────

function ProfileMovieCard({ movie }: { movie: MovieItem }) {
  return (
    <Link
      href={`/movie/${movie.tmdb_id}`}
      className="group cursor-pointer"
      style={{ width: 180, minWidth: 180, maxWidth: 180, flexShrink: 0, overflow: "hidden", display: "block" }}
    >
      <div className="relative rounded-xl overflow-hidden" style={{ width: "100%", height: 260 }}>
        {movie.poster_path ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.movie_title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-white/10 flex items-center justify-center text-white/30 text-xs">
            No Poster
          </div>
        )}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="px-1 mt-2" style={{ height: 38 }}>
        <p className="text-white text-sm font-medium truncate">{movie.movie_title}</p>
      </div>
    </Link>
  );
}

// ─── Movie Carousel ───────────────────────────────────────────────────────────

function ProfileCarousel({
  title,
  icon,
  movies,
  emptyText,
}: {
  title: string;
  icon: React.ReactNode;
  movies: MovieItem[];
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
    scrollRef.current?.scrollBy({ left: dir === "left" ? -380 : 380, behavior: "smooth" });
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
            <button onClick={() => scroll("left")} disabled={!canScrollLeft}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-20 hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button onClick={() => scroll("right")} disabled={!canScrollRight}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-20 hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
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
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {movies.map((m) => (
            <ProfileMovieCard key={m.tmdb_id} movie={m} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Main CineMate Profile Page ───────────────────────────────────────────────

export default function CineMateProfilePage() {
  const { id } = useParams();
  const [navUser, setNavUser] = useState<UserProfile | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<CineMateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchedMovies, setWatchedMovies] = useState<MovieItem[]>([]);
  const [watchlistMovies, setWatchlistMovies] = useState<MovieItem[]>([]);
  const [watchedCount, setWatchedCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    const cinemateId = id as string;

    // ── Load current logged-in user for navbar ──
    let myUserId: string | null = null;
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data } = await supabase
        .from("users")
        .select("id, name, first_name, email, profile_image, onboarding_completed")
        .eq("google_id", session.user.id)
        .single();
      if (data) {
        setNavUser(data as UserProfile);
        myUserId = data.id;
        localStorage.setItem("cinecircle_user_id", data.id);
      }
    }
    if (!myUserId) {
      myUserId = localStorage.getItem("cinecircle_user_id");
      if (myUserId) {
        const { data } = await supabase
          .from("users")
          .select("id, name, first_name, email, profile_image, onboarding_completed")
          .eq("id", myUserId)
          .single();
        if (data) setNavUser(data as UserProfile);
      }
    }
    setCurrentUserId(myUserId);

    // ── Load CineMate profile ──
    const { data: profileData } = await supabase
      .from("users")
      .select("id, name, first_name, email, profile_image, bio, created_at")
      .eq("id", cinemateId)
      .single();

    if (!profileData) {
      setLoading(false);
      return;
    }
    setProfile(profileData as CineMateProfile);

    // ── Load watched movies ──
    const { data: watched, count: wCount } = await supabase
      .from("watched_movies")
      .select("id, tmdb_id, movie_title, poster_path", { count: "exact" })
      .eq("user_id", cinemateId)
      .order("watched_at", { ascending: false });
    if (watched) setWatchedMovies(watched);
    if (wCount !== null) setWatchedCount(wCount);

    // ── Load watchlist ──
    const { data: watchlist } = await supabase
      .from("watchlist")
      .select("id, tmdb_id, movie_title, poster_path")
      .eq("user_id", cinemateId)
      .order("added_at", { ascending: false });
    if (watchlist) setWatchlistMovies(watchlist);

    // ── Follower / following counts ──
    const { count: fwerCount } = await supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("following_id", cinemateId);
    if (fwerCount !== null) setFollowerCount(fwerCount);

    const { count: fwingCount } = await supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("follower_id", cinemateId);
    if (fwingCount !== null) setFollowingCount(fwingCount);

    // ── Am I following this person? ──
    if (myUserId) {
      const { data: followRow } = await supabase
        .from("follows")
        .select("id")
        .eq("follower_id", myUserId)
        .eq("following_id", cinemateId)
        .maybeSingle();
      setIsFollowing(!!followRow);
    }

    setLoading(false);
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Follow / Unfollow handler ──
  const handleFollowToggle = async () => {
    if (!currentUserId || !profile) return;
    setFollowLoading(true);

    if (isFollowing) {
      await fetch("/api/follow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ follower_id: currentUserId, following_id: profile.id }),
      });
      setIsFollowing(false);
      setFollowerCount((c) => Math.max(0, c - 1));
    } else {
      await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ follower_id: currentUserId, following_id: profile.id }),
      });
      setIsFollowing(true);
      setFollowerCount((c) => c + 1);
    }

    setFollowLoading(false);
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  // ── Not found ──
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-white/50 text-lg">CineMate not found</p>
        <Link href="/home" className="text-red-400 hover:text-red-300 text-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  // ── Computed values ──
  const totalHours = watchedCount * 2;
  const months = Math.floor(totalHours / (24 * 30));
  const days = Math.floor((totalHours % (24 * 30)) / 24);
  const hours = totalHours % 24;

  const userName = profile.name || "User";
  const userHandle = `@${(profile.first_name || profile.name || "user").replace(/\s+/g, "").toLowerCase()}`;
  const userImage = profile.profile_image;
  const userInitial = userName.charAt(0).toUpperCase();
  const badgeTitle = watchedCount >= 100 ? "Gold Taste Critic" : watchedCount >= 20 ? "Silver Critic" : "Movie Explorer";

  // Pick an avatar gradient based on the first letter
  const gradients: Record<string, string> = {
    A: "linear-gradient(135deg, #e50914, #b20710)",
    Z: "linear-gradient(135deg, #ec4899, #be185d)",
    E: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    S: "linear-gradient(135deg, #f59e0b, #d97706)",
    L: "linear-gradient(135deg, #06b6d4, #0284c7)",
    M: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    R: "linear-gradient(135deg, #ef4444, #b91c1c)",
    C: "linear-gradient(135deg, #14b8a6, #0d9488)",
    Y: "linear-gradient(135deg, #f97316, #c2410c)",
  };
  const avatarBg = gradients[userInitial] || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar user={navUser} />

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
                  style={{ background: avatarBg }}
                >
                  {userInitial}
                </div>
              )}
              {/* Badge */}
              <div
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                  border: "3px solid #0a0a0a",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
            </div>

            {/* Name + Handle + Bio */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{userName}</h1>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" }}
                >
                  {badgeTitle}
                </span>
              </div>
              <p className="text-white/40 text-sm mb-2">{userHandle}</p>
              <p className="text-white/50 text-sm max-w-md">
                {profile.bio || "Movie enthusiast on CineCircle."}
              </p>
            </div>

            {/* Follow + Message Buttons */}
            <div className="flex gap-3 shrink-0">
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                className="px-6 py-2.5 rounded-full text-sm font-semibold transition-all disabled:opacity-50"
                style={{
                  background: isFollowing
                    ? "rgba(255,255,255,0.1)"
                    : "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
                  color: isFollowing ? "rgba(255,255,255,0.6)" : "white",
                  border: isFollowing ? "1px solid rgba(255,255,255,0.2)" : "none",
                }}
              >
                {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
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
              <span className="text-xl font-bold text-white">{followerCount}</span>
              <span className="text-white/40 text-sm ml-1.5">Followers</span>
            </div>
            <div className="w-px h-5 bg-white/15" />
            <div className="text-center sm:text-left">
              <span className="text-xl font-bold text-white">{followingCount}</span>
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
            <p className="text-white/30 text-sm mb-5">Their cinematic journey</p>

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
            emptyText="No movies watched yet."
          />

          {/* ── Watch Later ────────────────────────────────────────────────── */}
          <ProfileCarousel
            title="Watch Later"
            icon={<span className="text-amber-500">&#9679;</span>}
            movies={watchlistMovies}
            emptyText="Watch later list is empty."
          />
        </div>
      </main>
    </div>
  );
}
