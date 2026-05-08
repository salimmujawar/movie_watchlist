"use client";

import { useRouter } from "next/navigation";

function Background() {
  return (
    <div className="fixed inset-0">
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      {/* Subtle cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(30,30,30,0.3) 0%, transparent 50%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>
  );
}

function CineCircleLogo() {
  return (
    <div
      className="flex flex-col items-center"
      style={{ animation: "fadeInUp 0.8s ease-out" }}
    >
      {/* Logo icon */}
      <div className="relative mb-5">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #e50914 0%, #b20710 50%, #831010 100%)",
            boxShadow:
              "0 0 40px rgba(229, 9, 20, 0.4), 0 0 80px rgba(229, 9, 20, 0.15)",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="20" cy="20" r="15" stroke="white" strokeWidth="2" fill="none" opacity="0.9" />
            <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
            <polygon points="17,13 17,27 29,20" fill="white" opacity="0.95" />
          </svg>
        </div>
        <div
          className="absolute -inset-2 rounded-full opacity-50"
          style={{
            background: "radial-gradient(circle, rgba(229,9,20,0.3) 0%, transparent 70%)",
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* Brand name */}
      <h1
        className="text-5xl sm:text-6xl font-bold tracking-tight"
        style={{
          background: "linear-gradient(to right, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "shimmer 3s linear infinite",
        }}
      >
        CineCircle
      </h1>
    </div>
  );
}

function FacebookButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push("/onboarding");
      }}
      className="group relative w-full max-w-[340px] mx-auto flex items-center justify-center gap-3 py-4 px-8 rounded-full font-semibold text-[15px] text-white transition-all duration-300 ease-out cursor-pointer"
      style={{
        background: "linear-gradient(180deg, #4a9af5 0%, #1877F2 40%, #0d65d9 100%)",
        boxShadow:
          "0 4px 24px rgba(24, 119, 242, 0.4), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
        animation: "pulseGlow 3s ease-in-out infinite",
      }}
      onMouseEnter={(e) => {
        const btn = e.currentTarget;
        btn.style.transform = "translateY(-2px) scale(1.02)";
        btn.style.boxShadow =
          "0 8px 32px rgba(24, 119, 242, 0.5), 0 2px 8px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        const btn = e.currentTarget;
        btn.style.transform = "translateY(0) scale(1)";
        btn.style.boxShadow =
          "0 4px 24px rgba(24, 119, 242, 0.4), 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(0.98)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
      }}
    >
      {/* Facebook icon */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
      Continue with Facebook
      {/* Glass shine */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, transparent 50%)",
        }}
      />
    </button>
  );
}

export default function LoginPage() {
  return (
    <main className="relative h-screen h-[100dvh] flex flex-col items-center justify-center px-6 overflow-hidden">
      <Background />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        <CineCircleLogo />

        {/* Tagline */}
        <p
          className="mt-6 text-2xl sm:text-3xl text-white font-light text-center leading-snug"
          style={{
            animation: "fadeInUp 0.8s ease-out 0.2s both",
            textShadow: "0 2px 15px rgba(0,0,0,0.5)",
          }}
        >
          Discover what to
          <br />
          watch next.
        </p>

        {/* Spacer */}
        <div className="my-10" />

        {/* Facebook CTA */}
        <div
          className="w-full"
          style={{ animation: "fadeInUp 0.8s ease-out 0.4s both" }}
        >
          <FacebookButton />
        </div>

        {/* AI subtitle */}
        <p
          className="mt-10 text-sm sm:text-base text-white/50 font-light tracking-wide text-center italic"
          style={{
            animation: "fadeInUp 0.8s ease-out 0.6s both",
            textShadow: "0 1px 8px rgba(0,0,0,0.4)",
          }}
        >
          Personalized recommendations
          <br />
          powered by AI
        </p>

        {/* TMDB attribution */}
        <p
          className="mt-12 text-[10px] text-white/20 text-center leading-relaxed max-w-xs"
          style={{ animation: "fadeInUp 0.8s ease-out 0.8s both" }}
        >
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </div>
    </main>
  );
}
