"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  name: string;
  first_name: string | null;
  email: string | null;
  profile_image: string | null;
  onboarding_completed: boolean;
}

function Logo() {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="15" stroke="white" strokeWidth="2.5" fill="none" opacity="0.9" />
          <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
          <polygon points="17,13 17,27 29,20" fill="white" opacity="0.95" />
        </svg>
      </div>
      <span className="text-white font-bold text-lg tracking-tight hidden sm:block">
        CineCircle
      </span>
    </div>
  );
}

function SearchBox() {
  return (
    <div className="relative w-full max-w-sm">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Search movies, TV shows..."
        className="w-full bg-white/10 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none focus:border-white/30 focus:bg-white/15 transition-all"
      />
    </div>
  );
}

function ProfileMenu({ user }: { user: UserProfile | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userImage = user?.profile_image;
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("cinecircle_user_id");
    router.push("/");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/20 cursor-pointer hover:ring-white/40 transition-all"
      >
        {userImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={userImage} alt={userName} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white font-semibold text-xs"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            {userInitial}
          </div>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-12 w-56 rounded-xl overflow-hidden shadow-2xl z-50"
          style={{
            background: "linear-gradient(180deg, #1a1a2e 0%, #16162a 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* User info header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3">
            {userImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={userImage} alt={userName} className="w-10 h-10 rounded-full object-cover shrink-0" />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
                style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                {userInitial}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm text-white font-medium truncate">{userName}</p>
              {userEmail && <p className="text-xs text-white/40 truncate">{userEmail}</p>}
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-sm text-white/80">View Profile</span>
            </button>

            <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="text-sm text-white/80">Settings</span>
            </button>
          </div>

          {/* Logout — clears local session and redirects to login */}
          <div className="border-t border-white/10 py-1">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-500/10 transition-colors text-left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e54" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="text-sm text-red-400">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-70"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Notification dropdown */}
      {open && (
        <div
          className="absolute right-0 top-12 w-80 rounded-xl overflow-hidden shadow-2xl z-50"
          style={{
            background: "linear-gradient(180deg, #1a1a2e 0%, #16162a 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Notifications</h4>
            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-medium">
              2 new
            </span>
          </div>

          {/* Welcome notification */}
          <div className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5">
            <div className="flex gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #e50914 0%, #b20710 100%)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">Welcome to CineCircle!</p>
                <p className="text-xs text-white/50 mt-0.5">
                  Start discovering movies and shows recommended by your circle.
                </p>
                <span className="text-[10px] text-white/30 mt-1 block">Just now</span>
              </div>
              <span className="w-2 h-2 bg-blue-400 rounded-full shrink-0 mt-1.5" />
            </div>
          </div>

          {/* Movie recommendation notification */}
          <div className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911BTUgMe1nFGDi.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">Recommended for You</p>
                <p className="text-xs text-white/50 mt-0.5">
                  Based on your circle&apos;s taste, you might enjoy &quot;Inception&quot; — rated 4.8 by 3 friends.
                </p>
                <span className="text-[10px] text-white/30 mt-1 block">5 min ago</span>
              </div>
              <span className="w-2 h-2 bg-blue-400 rounded-full shrink-0 mt-1.5" />
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-white/10 text-center">
            <button className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface CircleMovie {
  title: string;
  year: number;
  rating: number;
  friendsCount: number;
  poster: string;
}

const CIRCLE_MOVIES: CircleMovie[] = [
  { title: "Dune: Part Two", year: 2024, rating: 4.5, friendsCount: 12, poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nez7S.jpg" },
  { title: "Oppenheimer", year: 2023, rating: 4.7, friendsCount: 18, poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg" },
  { title: "Deadpool & Wolverine", year: 2024, rating: 4.2, friendsCount: 9, poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg" },
  { title: "Inside Out 2", year: 2024, rating: 4.3, friendsCount: 15, poster: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg" },
  { title: "The Batman", year: 2022, rating: 4.4, friendsCount: 11, poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg" },
  { title: "Spider-Verse", year: 2023, rating: 4.8, friendsCount: 21, poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg" },
  { title: "Interstellar", year: 2014, rating: 4.6, friendsCount: 16, poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg" },
  { title: "John Wick 4", year: 2023, rating: 4.1, friendsCount: 8, poster: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg" },
  { title: "Barbie", year: 2023, rating: 3.9, friendsCount: 14, poster: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg" },
  { title: "Killers of the Flower Moon", year: 2023, rating: 4.4, friendsCount: 7, poster: "https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg" },
];

function CircleMovieCard({ movie }: { movie: CircleMovie }) {
  return (
    <div className="shrink-0 w-[160px] sm:w-[180px] group cursor-pointer">
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Rating badge */}
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold"
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

        {/* Friends' Choice badge at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.85) 0%, rgba(99,102,241,0.85) 100%)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
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

      {/* Info below poster */}
      <div className="px-1">
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
          <span className="text-white/40 text-[11px]">+{movie.friendsCount - 3}</span>
        </div>
        <p className="text-white text-sm font-medium truncate">{movie.title}</p>
        <p className="text-white/40 text-xs">{movie.friendsCount} friends liked this!</p>
      </div>
    </div>
  );
}

function FromYourCircleCarousel() {
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
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = dir === "left" ? -380 : 380;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

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
        className="flex gap-4 overflow-x-auto overflow-y-visible pb-2 scrollbar-hide"
        style={{
          scrollSnapType: "x mandatory",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {CIRCLE_MOVIES.map((movie) => (
          <div key={movie.title} style={{ scrollSnapAlign: "start" }}>
            <CircleMovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}

interface TrendingMovie {
  title: string;
  year: number;
  rating: number;
  poster: string;
  rank: number;
}

const TRENDING_MOVIES: TrendingMovie[] = [
  { title: "Dune: Part Two", year: 2024, rating: 8.6, poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nez7S.jpg", rank: 1 },
  { title: "Oppenheimer", year: 2023, rating: 8.9, poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", rank: 2 },
  { title: "Deadpool & Wolverine", year: 2024, rating: 7.8, poster: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", rank: 3 },
  { title: "Inside Out 2", year: 2024, rating: 7.6, poster: "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg", rank: 4 },
  { title: "The Batman", year: 2022, rating: 7.8, poster: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg", rank: 5 },
  { title: "Spider-Verse", year: 2023, rating: 8.7, poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", rank: 6 },
  { title: "Interstellar", year: 2014, rating: 8.7, poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", rank: 7 },
  { title: "John Wick 4", year: 2023, rating: 7.7, poster: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg", rank: 8 },
  { title: "Barbie", year: 2023, rating: 6.8, poster: "https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg", rank: 9 },
  { title: "Killers of the Flower Moon", year: 2023, rating: 7.6, poster: "https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg", rank: 10 },
];

function TrendingMovieCard({ movie }: { movie: TrendingMovie }) {
  return (
    <div className="shrink-0 w-[160px] sm:w-[180px] group cursor-pointer">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Rating badge */}
        <div
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold"
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

        {/* Trending badge at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-white"
            style={{
              background: "linear-gradient(135deg, rgba(229,9,20,0.85) 0%, rgba(220,38,38,0.85) 100%)",
              backdropFilter: "blur(8px)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
            Trending
          </div>
        </div>

        {/* Rank number */}
        <div
          className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
          }}
        >
          {movie.rank}
        </div>

        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="px-1">
        <p className="text-white text-sm font-medium truncate">{movie.title}</p>
        <p className="text-white/40 text-xs">{movie.year}</p>
      </div>
    </div>
  );
}

function TrendingCarousel() {
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
  }, [checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -380 : 380, behavior: "smooth" });
  };

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-red-500">&#9679;</span>
          Trending Now
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
        className="flex gap-4 overflow-x-auto overflow-y-visible pb-2 scrollbar-hide"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {TRENDING_MOVIES.map((movie) => (
          <div key={movie.title} style={{ scrollSnapAlign: "start" }}>
            <TrendingMovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Navbar({ user }: { user: UserProfile | null }) {
  const firstName = user?.first_name || user?.name?.split(" ")[0] || "User";

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3"
      style={{
        background: "linear-gradient(180deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.8) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Left: Logo */}
        <Logo />

        {/* Center: Discover + Search */}
        <div className="flex-1 flex items-center justify-center gap-3 px-4">
          <button
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all shrink-0"
            style={{
              background: "rgba(229, 9, 20, 0.15)",
              color: "#e50914",
              border: "1px solid rgba(229, 9, 20, 0.3)",
            }}
          >
            Discover
          </button>
          <SearchBox />
        </div>

        {/* Right: Welcome + Profile + Bell */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <span className="text-white/70 text-sm hidden md:block whitespace-nowrap">
            Welcome, <span className="text-white font-medium">{firstName}</span>
          </span>

          <ProfileMenu user={user} />
          <NotificationBell />
        </div>
      </div>
    </nav>
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

  // Load user from Supabase on mount
  useEffect(() => {
    const userId = localStorage.getItem("cinecircle_user_id");

    if (!userId) {
      // No user session — redirect to login
      router.replace("/");
      return;
    }

    supabase
      .from("users")
      .select("id, name, first_name, email, profile_image, onboarding_completed")
      .eq("id", userId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          // Invalid user — clear and redirect
          localStorage.removeItem("cinecircle_user_id");
          router.replace("/");
        } else {
          setUser(data as UserProfile);
          // Update last login timestamp
          supabase
            .from("users")
            .update({ last_login_at: new Date().toISOString() })
            .eq("id", userId);
        }
        setLoading(false);
      });
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

          <TrendingCarousel />

          <FromYourCircleCarousel />
        </div>
      </main>
    </div>
  );
}
