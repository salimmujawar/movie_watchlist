"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar, { UserProfile } from "@/components/Navbar";

interface CircleMovie {
  tmdbId?: number;
  title: string;
  year: number;
  rating: number;
  friendsCount: number;
  poster: string;
}

// Fisher-Yates shuffle for randomizing circle movies
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function CircleMovieCard({ movie }: { movie: CircleMovie }) {
  const cardContent = (
    <>
      {/* Poster */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ width: "100%", height: 260 }}
      >
        {movie.poster ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={movie.poster}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-white/10 flex items-center justify-center text-white/30 text-xs">
            No Poster
          </div>
        )}

        {/* Rating badge */}
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold z-10"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#facc15">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
          <span className="text-white">{movie.rating.toFixed(1)}</span>
        </div>

        {/* Friends' Choice badge at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.85) 0%, rgba(99,102,241,0.85) 100%)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="shrink-0">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Friends&apos; Choice
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Info below poster — fixed height */}
      <div className="px-1 mt-2" style={{ height: 54 }}>
        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex -space-x-1.5">
            {[0, 1, 2].map((j) => (
              <div
                key={j}
                className="w-5 h-5 rounded-full border-2 border-[#0a0a0a]"
                style={{
                  background: ["linear-gradient(135deg,#667eea,#764ba2)", "linear-gradient(135deg,#f093fb,#f5576c)", "linear-gradient(135deg,#4facfe,#00f2fe)"][j],
                }}
              />
            ))}
          </div>
          {movie.friendsCount > 3 && (
            <span className="text-white/40 text-[11px]">+{movie.friendsCount - 3}</span>
          )}
        </div>
        <p className="text-white text-sm font-medium truncate">{movie.title}</p>
        <p className="text-white/40 text-xs truncate">
          {movie.friendsCount === 1
            ? "1 friend watched this"
            : `${movie.friendsCount} friends watched this`}
        </p>
      </div>
    </>
  );

  const cardStyle: React.CSSProperties = {
    width: 180, minWidth: 180, maxWidth: 180,
    flexShrink: 0, overflow: "hidden", display: "block",
  };

  return movie.tmdbId ? (
    <Link href={`/movie/${movie.tmdbId}`} className="group cursor-pointer" style={cardStyle}>
      {cardContent}
    </Link>
  ) : (
    <div className="group cursor-pointer" style={cardStyle}>
      {cardContent}
    </div>
  );
}

function FromYourCircleCarousel({ currentUserId, refreshKey }: { currentUserId: string | null; refreshKey: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [movies, setMovies] = useState<CircleMovie[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load movies watched by people the user follows
  useEffect(() => {
    const myId = currentUserId || localStorage.getItem("cinecircle_user_id");
    if (!myId) { setLoaded(true); return; }
    async function loadCircleMovies() {
      // Get IDs of users I follow
      const { data: follows } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", myId);

      if (!follows || follows.length === 0) {
        setMovies([]);
        setLoaded(true);
        return; // No follows — section will be hidden
      }

      const followingIds = follows.map((f: { following_id: string }) => f.following_id);

      // Get ALL watched movies from followed users (no limit — we'll shuffle & pick)
      const { data: circleWatched } = await supabase
        .from("watched_movies")
        .select("tmdb_id, movie_title, poster_path, user_id")
        .in("user_id", followingIds);

      if (circleWatched && circleWatched.length > 0) {
        // Deduplicate by tmdb_id — count how many friends watched each
        const movieMap: Record<number, { title: string; poster: string; friendIds: Set<string> }> = {};
        for (const m of circleWatched) {
          if (!movieMap[m.tmdb_id]) {
            movieMap[m.tmdb_id] = {
              title: m.movie_title,
              poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "",
              friendIds: new Set(),
            };
          }
          movieMap[m.tmdb_id].friendIds.add(m.user_id);
        }

        const circleMovies: CircleMovie[] = Object.entries(movieMap).map(
          ([tmdbId, info]) => ({
            tmdbId: Number(tmdbId),
            title: info.title,
            year: 0,
            rating: +(4.0 + Math.random() * 0.8).toFixed(1),
            friendsCount: info.friendIds.size,
            poster: info.poster,
          })
        );

        // Shuffle randomly and pick up to 10
        setMovies(shuffleArray(circleMovies).slice(0, 10));
      } else {
        setMovies([]);
      }
      setLoaded(true);
    }
    loadCircleMovies();
  }, [currentUserId, refreshKey]);

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
  }, [checkScroll, loaded]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -380 : 380, behavior: "smooth" });
  };

  // Don't render the section until data has loaded
  if (!loaded) return null;

  // Only show when user actually follows people and there are movies
  if (movies.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-blue-400">&#9679;</span>
          From Your Circle
        </h3>
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
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{
          scrollSnapType: "x mandatory",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {movies.map((movie) => (
          <CircleMovieCard key={movie.tmdbId || movie.title} movie={movie} />
        ))}
      </div>
    </section>
  );
}

// ─── AI Recommendation Types & Components ───────────────────────────────────

interface AIMovie {
  tmdb_id: number;
  title: string;
  release_year: number;
  poster_url: string;
  rating: number;
  match_score: number;
  match_reason: string;
  genres: string[];
}

function AIMovieCard({ movie }: { movie: AIMovie }) {
  const [imgSrc, setImgSrc] = useState(movie.poster_url);
  const [imgError, setImgError] = useState(false);

  const matchColor =
    movie.match_score >= 90 ? "#22c55e"
      : movie.match_score >= 80 ? "#84cc16"
        : movie.match_score >= 70 ? "#f59e0b"
          : "#8b5cf6";

  // Fallback: if the webhook poster_url fails, fetch from TMDB by tmdb_id
  const handleImgError = useCallback(() => {
    if (!imgError && movie.tmdb_id) {
      setImgError(true);
      fetch(`/api/movie/${movie.tmdb_id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.poster_path) {
            setImgSrc(`https://image.tmdb.org/t/p/w500${data.poster_path}`);
          }
        })
        .catch(() => {});
    }
  }, [imgError, movie.tmdb_id]);

  const cardContent = (
    <>
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ width: "100%", height: 260 }}
      >
        {imgSrc ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imgSrc}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={handleImgError}
          />
        ) : (
          <div className="absolute inset-0 bg-white/10 flex items-center justify-center text-white/30 text-xs">
            No Poster
          </div>
        )}

        {/* Match score badge */}
        <div
          className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold z-10"
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill={matchColor}>
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span style={{ color: matchColor }}>{movie.match_score}%</span>
        </div>

        {/* Rating badge */}
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold z-10"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#facc15">
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
          <span className="text-white">{movie.rating}</span>
        </div>

        {/* AI Pick badge at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2 z-10">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.85) 0%, rgba(99,102,241,0.85) 100%)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="shrink-0">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            AI Pick
          </div>
        </div>

        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="px-1 mt-2" style={{ height: 38 }}>
        <p className="text-white text-sm font-medium truncate">{movie.title}</p>
        <p className="text-white/40 text-xs">{movie.release_year}</p>
      </div>
    </>
  );

  const cardStyle: React.CSSProperties = {
    width: 180,
    minWidth: 180,
    maxWidth: 180,
    flexShrink: 0,
    overflow: "hidden",
    display: "block",
  };

  return (
    <Link
      href={`/movie/${movie.tmdb_id}`}
      className="group cursor-pointer"
      style={cardStyle}
    >
      {cardContent}
    </Link>
  );
}

function AIRecommendationCarousel({ currentUserId }: { currentUserId: string | null }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [movies, setMovies] = useState<AIMovie[]>([]);
  const [userSummary, setUserSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!currentUserId) { setLoading(false); return; }

    fetch(`/api/ai-recommend?user_id=${currentUserId}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data.error) {
          setError(true);
          setLoading(false);
          return;
        }

        // Collect all movies from the response
        const allMovies: AIMovie[] = [];

        // Helper: ensure poster_url is a valid full URL
        const fixPoster = (url?: string): string => {
          if (!url) return "";
          // Already a full URL (https://image.tmdb.org/...)
          if (url.startsWith("http")) return url;
          // Bare TMDB path like "/nBNZadXqJSdt05SHLqgT0HuC5Gm.jpg"
          if (url.startsWith("/")) return `https://image.tmdb.org/t/p/w500${url}`;
          return "";
        };

        // Featured movie goes first
        if (data.featured) {
          allMovies.push({
            tmdb_id: data.featured.tmdb_id,
            title: data.featured.title,
            release_year: data.featured.release_year,
            poster_url: fixPoster(data.featured.poster_url),
            rating: data.featured.rating,
            match_score: data.featured.match_score,
            match_reason: data.featured.match_reason || "",
            genres: data.featured.genres || [],
          });
        }

        // Movies from each section
        if (data.sections) {
          for (const section of data.sections) {
            if (section.movies) {
              for (const m of section.movies) {
                // Avoid duplicates
                if (!allMovies.find((am) => am.tmdb_id === m.tmdb_id)) {
                  allMovies.push({
                    tmdb_id: m.tmdb_id,
                    title: m.title,
                    release_year: m.release_year,
                    poster_url: fixPoster(m.poster_url),
                    rating: m.rating,
                    match_score: m.match_score,
                    match_reason: m.match_reason || "",
                    genres: m.genres || [],
                  });
                }
              }
            }
          }
        }

        // Fetch posters from TMDB for any movies still missing images
        const needPosters = allMovies.filter((m) => !m.poster_url && m.tmdb_id);
        if (needPosters.length > 0) {
          await Promise.all(
            needPosters.map(async (m) => {
              try {
                const res = await fetch(`/api/movie/${m.tmdb_id}`);
                const movieData = await res.json();
                if (movieData.poster_path) {
                  m.poster_url = `https://image.tmdb.org/t/p/w500${movieData.poster_path}`;
                }
              } catch { /* skip */ }
            })
          );
        }

        // Take up to 10
        setMovies(allMovies.slice(0, 10));
        if (data.user_summary) setUserSummary(data.user_summary);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [currentUserId]);

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
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -380 : 380, behavior: "smooth" });
  };

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
              boxShadow: "0 0 8px rgba(139,92,246,0.4)",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </span>
          AI Recommendations
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

      {userSummary && (
        <p className="text-white/30 text-sm mb-4 max-w-lg">{userSummary}</p>
      )}
      {!userSummary && !loading && (
        <p className="text-white/30 text-sm mb-4">Personalized picks powered by your movie DNA.</p>
      )}

      {loading ? (
        <div className="flex gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="shrink-0" style={{ width: 180 }}>
              <div
                className="rounded-xl animate-pulse"
                style={{ width: 180, height: 260, background: "rgba(139,92,246,0.08)" }}
              />
              <div className="mt-2 space-y-1.5 px-1">
                <div className="h-3.5 bg-white/5 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-white/5 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : error || movies.length === 0 ? (
        <div
          className="rounded-xl py-10 text-center"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="text-3xl mb-2">🤖</div>
          <p className="text-white/40 text-sm">
            {error
              ? "AI recommendations are warming up. Check back soon!"
              : "Complete onboarding to unlock AI picks."}
          </p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
        >
          {movies.map((movie) => (
            <AIMovieCard key={movie.tmdb_id} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── CineMates Data & Components ──────────────────────────────────────────────

interface CineMate {
  userId: string | null;       // real Supabase user id (null until loaded)
  googleId: string;            // used to match seeded users
  name: string;
  handle: string;
  bio: string;
  watched: number;
  followers: string;
  tags: string[];
  aiSignal: string;
  avatarBg: string;
  initials: string;
}

const CINEMATES_SEED: CineMate[] = [
  { userId: null, googleId: "cinemate_aarav",  name: "Aarav Kapoor",   handle: "@framesbyaarav",       bio: "Lives for Nolan, neon noir & existential sci-fi.",        watched: 428, followers: "1.2K", tags: ["Sci-Fi", "Slow Burn", "Thriller"],              aiSignal: "Top Sci-Fi Curator",         avatarBg: "linear-gradient(135deg, #e50914, #b20710)", initials: "AK" },
  { userId: null, googleId: "cinemate_zoya",   name: "Zoya Mirza",     handle: "@zoyawatches",         bio: "Rom-coms, rainy films & emotionally damaging endings.",   watched: 312, followers: "842",  tags: ["Romance", "Indie", "Drama"],                    aiSignal: "Trusted by 96 cinephiles",   avatarBg: "linear-gradient(135deg, #ec4899, #be185d)", initials: "ZM" },
  { userId: null, googleId: "cinemate_ethan",  name: "Ethan Blake",    handle: "@cinemaholic_ethan",   bio: "Marvel by day, A24 by night.",                            watched: 590, followers: "2.8K", tags: ["Superhero", "Dark Comedy", "Psychological"],    aiSignal: "Most Watched This Month",    avatarBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)", initials: "EB" },
  { userId: null, googleId: "cinemate_sana",   name: "Sana Sheikh",    handle: "@reelwithsana",        bio: "Plot twists > happy endings.",                            watched: 267, followers: "1.1K", tags: ["Mystery", "Thriller", "Crime"],                 aiSignal: "92% Taste Match",            avatarBg: "linear-gradient(135deg, #f59e0b, #d97706)", initials: "SS" },
  { userId: null, googleId: "cinemate_liam",   name: "Liam Carter",    handle: "@pixelreels",          bio: "Give me time travel and heartbreak.",                     watched: 481, followers: "970",  tags: ["Sci-Fi", "Emotional Drama", "Mind-Bending"],   aiSignal: "Your Friends Follow Them",   avatarBg: "linear-gradient(135deg, #06b6d4, #0284c7)", initials: "LC" },
  { userId: null, googleId: "cinemate_maya",   name: "Maya Fernandes", handle: "@mayaatthemovies",     bio: "Bollywood classics & comfort movies forever.",            watched: 355, followers: "1.6K", tags: ["Bollywood", "Musical", "Feel-Good"],            aiSignal: "Top Comfort Movie Curator",  avatarBg: "linear-gradient(135deg, #8b5cf6, #6d28d9)", initials: "MF" },
  { userId: null, googleId: "cinemate_rohan",  name: "Rohan D'Souza", handle: "@rohanrewinds",        bio: "Horror movies are my therapy.",                           watched: 623, followers: "3.1K", tags: ["Horror", "Slasher", "Dark"],                   aiSignal: "Horror Expert Badge",        avatarBg: "linear-gradient(135deg, #ef4444, #b91c1c)", initials: "RD" },
  { userId: null, googleId: "cinemate_chloe",  name: "Chloe Bennett",  handle: "@scenequeenchloe",     bio: "Obsessed with visually beautiful cinema.",                watched: 294, followers: "780",  tags: ["Aesthetic", "Indie", "Slow Cinema"],            aiSignal: "Critics Choice Creator",     avatarBg: "linear-gradient(135deg, #14b8a6, #0d9488)", initials: "CB" },
  { userId: null, googleId: "cinemate_yusuf",  name: "Yusuf Khan",     handle: "@midnightframes",      bio: "Neo-noir, gangster films & chaotic antiheroes.",          watched: 510, followers: "2.2K", tags: ["Crime", "Noir", "Action"],                      aiSignal: "88% Taste Compatibility",    avatarBg: "linear-gradient(135deg, #f97316, #c2410c)", initials: "YK" },
  { userId: null, googleId: "cinemate_elena",  name: "Elena Rossi",    handle: "@elenagoestocinema",   bio: "French films, heartbreak & long monologues.",             watched: 376, followers: "1.4K", tags: ["Foreign Cinema", "Drama", "Art House"],         aiSignal: "Trending Taste Profile",     avatarBg: "linear-gradient(135deg, #6366f1, #4f46e5)", initials: "ER" },
];

function CineMateCard({
  mate,
  isFollowing,
  onToggleFollow,
  followLoading,
}: {
  mate: CineMate;
  isFollowing: boolean;
  onToggleFollow: () => void;
  followLoading: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col transition-all hover:bg-white/[0.06]"
      style={{
        width: 240,
        minWidth: 240,
        maxWidth: 240,
        height: 280,
        flexShrink: 0,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Avatar + Name — fixed height */}
      <div className="flex items-center gap-3 mb-3 shrink-0">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
          style={{ background: mate.avatarBg }}
        >
          {mate.initials}
        </div>
        <div className="min-w-0 flex-1">
          {mate.userId ? (
            <Link href={`/cinemate/${mate.userId}`} className="text-white text-sm font-semibold truncate block hover:text-red-400 transition-colors">
              {mate.name}
            </Link>
          ) : (
            <p className="text-white text-sm font-semibold truncate">{mate.name}</p>
          )}
          <p className="text-white/30 text-xs truncate">{mate.handle}</p>
        </div>
      </div>

      {/* Bio — clamped to 2 lines */}
      <p className="text-white/50 text-xs leading-relaxed mb-2 shrink-0 overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
        &ldquo;{mate.bio}&rdquo;
      </p>

      {/* Tags — single row, overflow hidden */}
      <div className="flex gap-1.5 mb-2 shrink-0 overflow-hidden">
        {mate.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-medium px-2 py-0.5 rounded-full text-white/60 whitespace-nowrap shrink-0"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-2 text-xs text-white/40 shrink-0">
        <span className="flex items-center gap-1 whitespace-nowrap">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          {mate.watched} Watched
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          {mate.followers}
        </span>
      </div>

      {/* AI Signal badge */}
      <div className="flex items-center gap-1.5 mb-auto shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" className="shrink-0">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
        <span className="text-[10px] font-medium text-purple-400 truncate">{mate.aiSignal}</span>
      </div>

      {/* Follow button — pinned to bottom */}
      <button
        onClick={onToggleFollow}
        disabled={followLoading}
        className="w-full py-2 rounded-full text-xs font-semibold transition-all shrink-0 mt-3 disabled:opacity-50"
        style={{
          background: isFollowing
            ? "rgba(255,255,255,0.06)"
            : "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
          color: isFollowing ? "rgba(255,255,255,0.5)" : "white",
          border: isFollowing ? "1px solid rgba(255,255,255,0.15)" : "none",
        }}
      >
        {followLoading ? "..." : isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}

function CineMatesCarousel({ currentUserId, onFollowChange }: { currentUserId: string | null; onFollowChange: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});
  const [mates, setMates] = useState<CineMate[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load real user IDs + filter already-followed mates
  // NOTE: HomePage only renders this component AFTER user is loaded (loading gate),
  // so currentUserId is always valid here — no null-first-render race condition.
  useEffect(() => {
    const myId = currentUserId || localStorage.getItem("cinecircle_user_id");
    if (!myId) {
      setMates(CINEMATES_SEED);
      setLoaded(true);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        // 1. Get real Supabase user IDs for the seeded CineMates
        const googleIds = CINEMATES_SEED.map((m) => m.googleId);
        const { data: users } = await supabase
          .from("users")
          .select("id, google_id")
          .in("google_id", googleIds);

        if (cancelled) return;

        const idMap: Record<string, string> = {};
        if (users) {
          for (const u of users) {
            idMap[u.google_id] = u.id;
          }
        }

        // 2. Get who the current user already follows
        const { data: follows } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", myId);

        if (cancelled) return;

        const followedSet = new Set(
          (follows || []).map((f: { following_id: string }) => f.following_id)
        );

        // 3. Enrich seed data with real IDs and filter out already-followed
        const enriched = CINEMATES_SEED
          .map((m) => ({ ...m, userId: idMap[m.googleId] || null }))
          .filter((m) => !m.userId || !followedSet.has(m.userId));

        if (!cancelled) {
          setMates(enriched);
          setLoaded(true);
        }
      } catch (err) {
        console.error("[CineMates] load error:", err);
        if (!cancelled) {
          setMates(CINEMATES_SEED);
          setLoaded(true);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [currentUserId]);

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
  }, [checkScroll, mates]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -380 : 380, behavior: "smooth" });
  };

  const toggleFollow = async (mate: CineMate) => {
    const userId = currentUserId || localStorage.getItem("cinecircle_user_id");
    if (!userId || !mate.userId) {
      console.warn("[CineMates] toggleFollow skipped — userId:", userId, "mate.userId:", mate.userId);
      return;
    }
    const mateId = mate.userId;
    setFollowLoading((prev) => ({ ...prev, [mateId]: true }));

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ follower_id: userId, following_id: mateId }),
      });
      const json = await res.json();
      if (json.success) {
        // Remove from CineMates list immediately
        setMates((prev) => prev.filter((m) => m.userId !== mateId));
        onFollowChange();
      } else {
        console.error("[CineMates] follow API error:", json.error);
      }
    } catch (err) {
      console.error("[CineMates] follow toggle error:", err);
    }

    setFollowLoading((prev) => ({ ...prev, [mateId]: false }));
  };

  // Don't render until data has loaded — avoids flashing the full unfiltered list
  if (!loaded) {
    return (
      <section className="py-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="text-purple-400">&#9679;</span>
            CineMates
          </h3>
        </div>
        <p className="text-white/30 text-sm mb-4">People whose movie taste matches your vibe.</p>
        <div className="flex gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shrink-0 rounded-xl animate-pulse" style={{ width: 240, height: 280, background: "rgba(255,255,255,0.03)" }} />
          ))}
        </div>
      </section>
    );
  }

  // If all mates have been followed, hide the section
  if (mates.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-purple-400">&#9679;</span>
          CineMates
        </h3>
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
      </div>
      <p className="text-white/30 text-sm mb-4">People whose movie taste matches your vibe.</p>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {mates.map((mate) => (
          <CineMateCard
            key={mate.handle}
            mate={mate}
            isFollowing={false}
            followLoading={!!(mate.userId && followLoading[mate.userId])}
            onToggleFollow={() => toggleFollow(mate)}
          />
        ))}
      </div>
    </section>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [followVersion, setFollowVersion] = useState(0);

  // Load user from Supabase Auth session on mount
  useEffect(() => {
    const loadUser = async () => {
      // First check Supabase Auth session
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // User is authenticated — look up their profile by google_id
        const { data, error } = await supabase
          .from("users")
          .select("id, name, first_name, email, profile_image, onboarding_completed")
          .eq("google_id", session.user.id)
          .single();

        if (!error && data) {
          setUser(data as UserProfile);
          localStorage.setItem("cinecircle_user_id", data.id);
          // Update last login timestamp
          supabase
            .from("users")
            .update({ last_login_at: new Date().toISOString() })
            .eq("id", data.id);
          setLoading(false);
          return;
        }
      }

      // Fallback: check localStorage (for legacy sessions)
      const userId = localStorage.getItem("cinecircle_user_id");
      if (userId) {
        const { data, error } = await supabase
          .from("users")
          .select("id, name, first_name, email, profile_image, onboarding_completed")
          .eq("id", userId)
          .single();

        if (!error && data) {
          setUser(data as UserProfile);
          setLoading(false);
          return;
        }
      }

      // No valid session — redirect to login
      localStorage.removeItem("cinecircle_user_id");
      router.replace("/");
    };

    loadUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = user?.first_name || user?.name?.split(" ")[0] || "User";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar user={user} />

      <main className="pt-20 pb-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <section className="py-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {getGreeting()}, {firstName}
            </h2>
            <p className="text-white/50 text-sm sm:text-base">
              Discover what to watch next from your circle.
            </p>
          </section>

          <AIRecommendationCarousel currentUserId={user?.id || null} />

          <FromYourCircleCarousel currentUserId={user?.id || null} refreshKey={followVersion} />

          <CineMatesCarousel currentUserId={user?.id || null} onFollowChange={() => setFollowVersion((v) => v + 1)} />
        </div>
      </main>
    </div>
  );
}
