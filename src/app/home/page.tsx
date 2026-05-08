"use client";

import { useState, useRef, useEffect } from "react";

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

function ProfileMenu() {
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
        className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/20 cursor-pointer hover:ring-white/40 transition-all"
      >
        <div
          className="w-full h-full flex items-center justify-center text-white font-semibold text-xs"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          A
        </div>
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
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              A
            </div>
            <div>
              <p className="text-sm text-white font-medium">Alex</p>
              <p className="text-xs text-white/40">alex@email.com</p>
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

          {/* Logout */}
          <div className="border-t border-white/10 py-1">
            <button className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-red-500/10 transition-colors text-left">
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

function Navbar() {
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
            Welcome, <span className="text-white font-medium">Alex</span>
          </span>

          <ProfileMenu />
          <NotificationBell />
        </div>
      </div>
    </nav>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <main className="pt-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <section className="py-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Good evening, Alex
            </h2>
            <p className="text-white/50 text-sm sm:text-base">
              Discover what to watch next from your circle.
            </p>
          </section>

          <section className="py-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-red-500">&#9679;</span>
              Trending Now
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-lg animate-pulse"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                />
              ))}
            </div>
          </section>

          <section className="py-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-400">&#9679;</span>
              From Your Circle
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] rounded-lg animate-pulse"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
