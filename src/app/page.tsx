"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

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

function GoogleButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error("Google login error:", error.message);
      setLoading(false);
    }
    // On success, the browser is redirected to Google — no need to do anything else
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="group relative w-full max-w-[340px] mx-auto flex items-center justify-center gap-3 py-4 px-8 rounded-full font-semibold text-[15px] transition-all duration-300 ease-out cursor-pointer disabled:opacity-60"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f1f1f1 100%)",
        color: "#3c4043",
        boxShadow:
          "0 4px 24px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0,0,0,0.2)",
        animation: "pulseGlow 3s ease-in-out infinite",
      }}
      onMouseEnter={(e) => {
        const btn = e.currentTarget;
        btn.style.transform = "translateY(-2px) scale(1.02)";
        btn.style.boxShadow =
          "0 8px 32px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        const btn = e.currentTarget;
        btn.style.transform = "translateY(0) scale(1)";
        btn.style.boxShadow =
          "0 4px 24px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0,0,0,0.2)";
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(0.98)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
      }}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          {/* Google "G" icon */}
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </>
      )}
    </button>
  );
}

export default function LoginPage() {
  const router = useRouter();

  // If user is already signed in, redirect to home
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/home");
      }
    });
  }, [router]);

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

        {/* Google CTA */}
        <div
          className="w-full"
          style={{ animation: "fadeInUp 0.8s ease-out 0.4s both" }}
        >
          <GoogleButton />
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
