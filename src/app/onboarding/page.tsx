"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Movie {
  title: string;
  year: number;
  rating: number;
  genres: string[];
  poster: string;
}

const MOVIES: Movie[] = [
  {
    title: "Interstellar",
    year: 2014,
    rating: 8.7,
    genres: ["Sci-Fi", "Drama", "Adventure"],
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    genres: ["Action", "Crime", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911BTUgMe1nFGDi.jpg",
  },
  {
    title: "Inception",
    year: 2010,
    rating: 8.8,
    genres: ["Sci-Fi", "Action", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
  },
  {
    title: "Parasite",
    year: 2019,
    rating: 8.5,
    genres: ["Thriller", "Drama", "Comedy"],
    poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  },
  {
    title: "La La Land",
    year: 2016,
    rating: 8.0,
    genres: ["Romance", "Musical", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKRhcorJPVRJ5v.jpg",
  },
];

function SwipeCard({
  movie,
  isTop,
  stackIndex,
  onSwipe,
}: {
  movie: Movie;
  isTop: boolean;
  stackIndex: number;
  onSwipe: (direction: "left" | "right") => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const [offset, setOffset] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);

  const handleStart = useCallback((clientX: number) => {
    if (!isTop) return;
    isDragging.current = true;
    startX.current = clientX;
    currentX.current = clientX;
  }, [isTop]);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current) return;
    currentX.current = clientX;
    const diff = clientX - startX.current;
    setOffset(diff);
  }, []);

  const handleEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = currentX.current - startX.current;
    const threshold = 100;

    if (Math.abs(diff) > threshold) {
      const dir = diff > 0 ? "right" : "left";
      setSwipeDir(dir);
      setIsAnimatingOut(true);
      setOffset(diff > 0 ? 500 : -500);
      setTimeout(() => onSwipe(dir), 300);
    } else {
      setOffset(0);
    }
  }, [onSwipe]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !isTop) return;

    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX);
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleEnd();
    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => handleEnd();

    card.addEventListener("touchstart", onTouchStart, { passive: true });
    card.addEventListener("touchmove", onTouchMove, { passive: false });
    card.addEventListener("touchend", onTouchEnd);
    card.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      card.removeEventListener("touchstart", onTouchStart);
      card.removeEventListener("touchmove", onTouchMove);
      card.removeEventListener("touchend", onTouchEnd);
      card.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isTop, handleStart, handleMove, handleEnd]);

  const rotation = offset * 0.1;
  const opacity = isAnimatingOut ? 0 : 1;
  const scale = isTop ? 1 : 1 - stackIndex * 0.05;
  const translateY = isTop ? 0 : stackIndex * 8;
  const swipeOpacity = Math.min(Math.abs(offset) / 100, 1);

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 rounded-2xl overflow-hidden select-none"
      style={{
        transform: `translateX(${offset}px) rotate(${rotation}deg) scale(${scale}) translateY(${translateY}px)`,
        transition: isDragging.current ? "none" : "transform 0.3s ease-out, opacity 0.3s ease-out",
        opacity,
        zIndex: 10 - stackIndex,
        cursor: isTop ? "grab" : "default",
        filter: !isTop ? `brightness(${1 - stackIndex * 0.15})` : "none",
      }}
    >
      {/* Movie poster */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={movie.poster}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* Gradient overlay at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* Like indicator */}
      {isTop && offset > 0 && (
        <div
          className="absolute top-6 left-6 px-4 py-2 rounded-lg border-2 border-green-400 z-20"
          style={{
            opacity: swipeOpacity,
            transform: `rotate(-20deg)`,
            boxShadow: `0 0 20px rgba(74, 222, 128, ${swipeOpacity * 0.5})`,
          }}
        >
          <span className="text-green-400 font-bold text-2xl tracking-wider">LIKED</span>
        </div>
      )}

      {/* Nope indicator */}
      {isTop && offset < 0 && (
        <div
          className="absolute top-6 right-6 px-4 py-2 rounded-lg border-2 border-red-400 z-20"
          style={{
            opacity: swipeOpacity,
            transform: `rotate(20deg)`,
            boxShadow: `0 0 20px rgba(248, 113, 113, ${swipeOpacity * 0.5})`,
          }}
        >
          <span className="text-red-400 font-bold text-2xl tracking-wider">NOPE</span>
        </div>
      )}

      {/* Green / Red edge glow */}
      {isTop && offset !== 0 && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              offset > 0
                ? `linear-gradient(to right, transparent 60%, rgba(74, 222, 128, ${swipeOpacity * 0.3}) 100%)`
                : `linear-gradient(to left, transparent 60%, rgba(248, 113, 113, ${swipeOpacity * 0.3}) 100%)`,
          }}
        />
      )}

      {/* Movie info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <h3 className="text-2xl font-bold text-white mb-1">{movie.title}</h3>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-white/60 text-sm">{movie.year}</span>
          <span className="text-white/30">•</span>
          <span className="text-yellow-400 text-sm flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
            {movie.rating}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {movie.genres.map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 rounded-full text-xs font-medium text-white/80"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(4px)",
              }}
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Swipe direction fade overlay on exit */}
      {isAnimatingOut && swipeDir && (
        <div
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            background:
              swipeDir === "right"
                ? "rgba(74, 222, 128, 0.25)"
                : "rgba(248, 113, 113, 0.25)",
          }}
        />
      )}
    </div>
  );
}

function SwipeButtons({
  onSwipe,
}: {
  onSwipe: (direction: "left" | "right") => void;
}) {
  return (
    <div className="flex items-center justify-center gap-8 mt-6">
      <button
        onClick={() => onSwipe("left")}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{
          background: "rgba(248, 113, 113, 0.15)",
          border: "2px solid rgba(248, 113, 113, 0.4)",
          boxShadow: "0 0 20px rgba(248, 113, 113, 0.1)",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <button
        onClick={() => onSwipe("right")}
        className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{
          background: "rgba(74, 222, 128, 0.15)",
          border: "2px solid rgba(74, 222, 128, 0.4)",
          boxShadow: "0 0 20px rgba(74, 222, 128, 0.1)",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    </div>
  );
}

function ProgressMeter({ current, total }: { current: number; total: number }) {
  const pct = (current / total) * 100;
  return (
    <div className="w-full max-w-sm mx-auto mt-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/50 text-xs font-medium tracking-wide">MOVIE DNA ANALYSIS</span>
        <span className="text-white/70 text-sm font-semibold">
          {current} of {total} movies rated
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #e50914 0%, #ff6b6b 50%, #4ade80 100%)",
            boxShadow: "0 0 12px rgba(229, 9, 20, 0.5)",
          }}
        />
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= MOVIES.length) {
        setCurrentIndex(nextIndex);
        setCompleted(true);
        setTimeout(() => router.push("/home"), 1500);
      } else {
        setCurrentIndex(nextIndex);
      }
    },
    [currentIndex, router]
  );

  const remaining = MOVIES.slice(currentIndex);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0a0a0a] flex flex-col items-center justify-center px-6 py-10 overflow-hidden relative">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(229, 9, 20, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 text-center mb-8">
        <h1
          className="text-3xl sm:text-4xl font-bold text-white mb-3"
          style={{ textShadow: "0 2px 20px rgba(229, 9, 20, 0.3)" }}
        >
          Let&apos;s Decode Your Movie DNA
        </h1>
        <p className="text-white/50 text-sm sm:text-base max-w-md mx-auto">
          Swipe through a few films so our AI can understand your vibe
        </p>
      </div>

      {/* Swipe area */}
      <div className="relative z-10 w-full max-w-[320px] aspect-[2/3]">
        {completed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(229,9,20,0.15) 0%, rgba(74,222,128,0.1) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="text-5xl mb-4">🎬</div>
            <h3 className="text-xl font-bold text-white mb-2">DNA Decoded!</h3>
            <p className="text-white/50 text-sm text-center px-4">
              Building your personalized feed...
            </p>
            <div className="mt-4 w-8 h-8 border-2 border-white/20 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : (
          remaining
            .slice(0, 3)
            .reverse()
            .map((movie, i) => {
              const stackIndex = remaining.slice(0, 3).length - 1 - i;
              return (
                <SwipeCard
                  key={movie.title}
                  movie={movie}
                  isTop={stackIndex === 0}
                  stackIndex={stackIndex}
                  onSwipe={handleSwipe}
                />
              );
            })
        )}
      </div>

      {/* Swipe hint */}
      {!completed && (
        <div className="relative z-10 flex items-center gap-6 mt-4 text-xs text-white/30">
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Not for me
          </span>
          <span className="flex items-center gap-1">
            Love it
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
        </div>
      )}

      {/* Swipe buttons removed — swipe or use arrow hints */}

      {/* Progress */}
      <div className="relative z-10 w-full max-w-sm">
        <ProgressMeter
          current={Math.min(currentIndex, MOVIES.length)}
          total={MOVIES.length}
        />
      </div>
    </div>
  );
}
