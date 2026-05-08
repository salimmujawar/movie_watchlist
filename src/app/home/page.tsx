"use client";

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
    <div className="relative flex-1 max-w-md">
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

function ProfileSection() {
  return (
    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
      <span className="text-white/70 text-sm hidden md:block">
        Welcome, <span className="text-white font-medium">Alex</span>
      </span>

      {/* Profile pic */}
      <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white/20 cursor-pointer hover:ring-white/40 transition-all">
        <div
          className="w-full h-full flex items-center justify-center text-white font-semibold text-xs"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          A
        </div>
      </div>

      {/* Notification bell */}
      <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
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
        {/* Notification dot */}
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>
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
      <div className="max-w-7xl mx-auto flex items-center gap-4 sm:gap-6">
        <Logo />

        {/* Discover tab */}
        <button
          className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
          style={{
            background: "rgba(229, 9, 20, 0.15)",
            color: "#e50914",
            border: "1px solid rgba(229, 9, 20, 0.3)",
          }}
        >
          Discover
        </button>

        <SearchBox />
        <ProfileSection />
      </div>
    </nav>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      {/* Main content area */}
      <main className="pt-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero section */}
          <section className="py-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Good evening, Alex
            </h2>
            <p className="text-white/50 text-sm sm:text-base">
              Discover what to watch next from your circle.
            </p>
          </section>

          {/* Trending section placeholder */}
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

          {/* From your circle placeholder */}
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
