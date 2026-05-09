"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ─── TMDB Genre Map ──────────────────────────────────────────────────────────

interface Genre {
  id: number;
  name: string;
  icon: string;
  gradient: string;
}

const GENRES: Genre[] = [
  { id: 878,   name: "Science Fiction", icon: "🚀", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { id: 18,    name: "Drama",           icon: "🎭", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { id: 53,    name: "Thriller",        icon: "🔪", gradient: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)" },
  { id: 28,    name: "Action",          icon: "💥", gradient: "linear-gradient(135deg, #e50914 0%, #b20710 100%)" },
  { id: 10749, name: "Romance",         icon: "💕", gradient: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)" },
  { id: 35,    name: "Comedy",          icon: "😂", gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
  { id: 14,    name: "Fantasy",         icon: "🧙", gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" },
  { id: 16,    name: "Anime",           icon: "⛩️", gradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)" },
  { id: 9648,  name: "Mystery",         icon: "🔍", gradient: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)" },
  { id: 80,    name: "Crime",           icon: "🕵️", gradient: "linear-gradient(135deg, #374151 0%, #111827 100%)" },
  { id: 12,    name: "Adventure",       icon: "🗺️", gradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)" },
  { id: 99,    name: "Documentary",     icon: "📽️", gradient: "linear-gradient(135deg, #78716c 0%, #44403c 100%)" },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface SearchResult {
  tmdb_id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

// ─── Animated Genre Chip ─────────────────────────────────────────────────────

function GenreChip({
  genre,
  selected,
  onClick,
  index,
}: {
  genre: Genre;
  selected: boolean;
  onClick: () => void;
  index: number;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative shrink-0 transition-all duration-300 ease-out"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: "fadeSlideUp 0.4s ease-out backwards",
      }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-out"
        style={{
          background: selected ? genre.gradient : "rgba(255,255,255,0.06)",
          border: selected
            ? "1px solid rgba(255,255,255,0.3)"
            : "1px solid rgba(255,255,255,0.08)",
          color: selected ? "white" : "rgba(255,255,255,0.6)",
          transform: selected ? "scale(1.05)" : "scale(1)",
          boxShadow: selected
            ? "0 4px 20px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.05)"
            : "none",
        }}
      >
        <span className="text-base transition-transform duration-300" style={{ transform: selected ? "scale(1.2)" : "scale(1)" }}>
          {genre.icon}
        </span>
        <span className="whitespace-nowrap">{genre.name}</span>
        {selected && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="ml-0.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </button>
  );
}

// ─── Search Result Card ──────────────────────────────────────────────────────

function ResultCard({
  movie,
  index,
  onClose,
}: {
  movie: SearchResult;
  index: number;
  onClose: () => void;
}) {
  const year = movie.release_date ? movie.release_date.split("-")[0] : "";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "—";
  const genreNames = movie.genre_ids
    .map((id) => GENRES.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .slice(0, 2);

  return (
    <Link
      href={`/movie/${movie.tmdb_id}`}
      onClick={onClose}
      className="group flex gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-white/[0.06]"
      style={{
        animationDelay: `${index * 60}ms`,
        animation: "fadeSlideUp 0.35s ease-out backwards",
      }}
    >
      {/* Poster thumbnail */}
      <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 bg-white/5">
        {movie.poster_path ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-[10px]">
            No Poster
          </div>
        )}
      </div>

      {/* Movie info */}
      <div className="flex-1 min-w-0 py-0.5">
        <h4 className="text-white text-sm font-semibold truncate group-hover:text-red-400 transition-colors">
          {movie.title}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          {year && <span className="text-white/40 text-xs">{year}</span>}
          {year && rating !== "—" && <span className="text-white/15 text-xs">·</span>}
          {rating !== "—" && (
            <span className="flex items-center gap-1 text-xs">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#facc15">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
              <span className="text-white/50">{rating}</span>
            </span>
          )}
        </div>
        {genreNames.length > 0 && (
          <div className="flex gap-1.5 mt-1.5">
            {genreNames.map((name) => (
              <span
                key={name}
                className="text-[10px] px-2 py-0.5 rounded-full text-white/40"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                {name}
              </span>
            ))}
          </div>
        )}
        {movie.overview && (
          <p className="text-white/30 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {movie.overview}
          </p>
        )}
      </div>

      {/* Arrow */}
      <div className="flex items-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="opacity-40">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </Link>
  );
}

// ─── Main Search Modal ───────────────────────────────────────────────────────

export default function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay for the animation
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    } else {
      // Reset state when modal closes
      setQuery("");
      setSelectedGenres([]);
      setResults([]);
      setSearched(false);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Debounced search
  const performSearch = useCallback(
    (searchQuery: string, genres: number[]) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!searchQuery && genres.length === 0) {
        setResults([]);
        setSearched(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      debounceRef.current = setTimeout(async () => {
        try {
          const params = new URLSearchParams();
          if (searchQuery) params.set("q", searchQuery);
          if (genres.length > 0) params.set("genres", genres.join(","));

          const res = await fetch(`/api/search?${params.toString()}`);
          const data = await res.json();
          setResults(data.results || []);
          setSearched(true);
        } catch {
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 400);
    },
    []
  );

  // Trigger search on query or genre change
  useEffect(() => {
    performSearch(query, selectedGenres);
  }, [query, selectedGenres, performSearch]);

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  if (!isOpen) return null;

  const hasInput = query.length > 0 || selectedGenres.length > 0;

  return (
    <>
      {/* Global keyframe styles */}
      <style jsx global>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100]"
        style={{
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          animation: "backdropFadeIn 0.3s ease-out",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-x-0 top-0 z-[101] flex justify-center px-4 pt-[10vh] sm:pt-[12vh]"
        onClick={onClose}
      >
        <div
          className="w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
          style={{ animation: "modalSlideIn 0.35s ease-out" }}
        >
          {/* ── Search Container ────────────────────────────────────────── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(26,26,46,0.98) 0%, rgba(15,15,30,0.98) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 80px rgba(229,9,20,0.06)",
            }}
          >
            {/* ── Header: AI Badge + Close ───────────────────────────── */}
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #e50914, #ff6b6b)",
                    boxShadow: "0 0 12px rgba(229,9,20,0.4)",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <span
                  className="text-xs font-semibold tracking-wider uppercase"
                  style={{
                    background: "linear-gradient(90deg, #e50914, #ff6b6b, #e50914)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "shimmer 3s linear infinite",
                  }}
                >
                  AI-Powered Search
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="opacity-40 group-hover:opacity-100 transition-opacity">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ── Search Input ───────────────────────────────────────── */}
            <div className="px-5 pb-4">
              <div
                className="relative flex items-center rounded-xl transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Search icon / loading spinner */}
                <div className="pl-4 pr-2 shrink-0">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="opacity-30">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  )}
                </div>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your movie vibe…"
                  className="flex-1 bg-transparent py-3.5 pr-4 text-white text-base placeholder-white/25 outline-none"
                />

                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="pr-4 pl-2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Keyboard shortcut hint */}
              <div className="flex items-center justify-end mt-2 gap-1.5">
                <kbd className="text-[10px] text-white/20 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 font-mono">ESC</kbd>
                <span className="text-[10px] text-white/20">to close</span>
              </div>
            </div>

            {/* ── Genre Chips ────────────────────────────────────────── */}
            <div className="px-5 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-white/30 font-medium uppercase tracking-wider">Genres</span>
                {selectedGenres.length > 0 && (
                  <button
                    onClick={() => setSelectedGenres([])}
                    className="text-[10px] text-red-400/70 hover:text-red-400 transition-colors ml-1"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre, i) => (
                  <GenreChip
                    key={genre.id}
                    genre={genre}
                    selected={selectedGenres.includes(genre.id)}
                    onClick={() => toggleGenre(genre.id)}
                    index={i}
                  />
                ))}
              </div>
            </div>

            {/* ── Divider ────────────────────────────────────────────── */}
            {hasInput && (
              <div className="mx-5">
                <div
                  className="h-px"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(229,9,20,0.3), transparent)",
                  }}
                />
              </div>
            )}

            {/* ── Results ────────────────────────────────────────────── */}
            {hasInput && (
              <div
                className="px-3 py-3 overflow-y-auto"
                style={{ maxHeight: "40vh", scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
              >
                {loading && results.length === 0 ? (
                  /* Loading skeleton */
                  <div className="space-y-3 px-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-4 p-3 animate-pulse">
                        <div className="w-16 h-24 rounded-lg bg-white/5" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-white/5 rounded w-3/4" />
                          <div className="h-3 bg-white/5 rounded w-1/2" />
                          <div className="h-3 bg-white/5 rounded w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searched && results.length === 0 ? (
                  /* No results */
                  <div className="text-center py-10">
                    <div className="text-3xl mb-3">🎬</div>
                    <p className="text-white/40 text-sm">No movies found</p>
                    <p className="text-white/20 text-xs mt-1">Try a different vibe or genre</p>
                  </div>
                ) : (
                  /* Result cards */
                  <div className="space-y-1">
                    {results.slice(0, 8).map((movie, i) => (
                      <ResultCard
                        key={movie.tmdb_id}
                        movie={movie}
                        index={i}
                        onClose={onClose}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Empty state prompt ──────────────────────────────── */}
            {!hasInput && (
              <div className="px-5 pb-6 pt-2">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <div
                      className="w-1 h-1 rounded-full bg-red-500"
                      style={{ animation: "pulseGlow 2s ease-in-out infinite" }}
                    />
                    <div
                      className="w-1 h-1 rounded-full bg-red-500"
                      style={{ animation: "pulseGlow 2s ease-in-out 0.3s infinite" }}
                    />
                    <div
                      className="w-1 h-1 rounded-full bg-red-500"
                      style={{ animation: "pulseGlow 2s ease-in-out 0.6s infinite" }}
                    />
                  </div>
                  <p className="text-white/20 text-xs">
                    Type a mood, pick genres, or describe what you feel like watching
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
