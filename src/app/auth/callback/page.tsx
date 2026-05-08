"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase JS client automatically detects tokens in the URL fragment
      // and establishes the session. We just need to wait for it.
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        // Auth failed — redirect to login
        console.error("Auth callback error:", error?.message);
        router.replace("/");
        return;
      }

      const googleUser = session.user;
      const metadata = googleUser.user_metadata;

      // Check if this user already exists in our users table
      const { data: existingUser } = await supabase
        .from("users")
        .select("id, onboarding_completed")
        .eq("google_id", googleUser.id)
        .single();

      if (existingUser) {
        // Returning user — update last login
        await supabase
          .from("users")
          .update({
            last_login_at: new Date().toISOString(),
            name: metadata.full_name || metadata.name || existingUser.id,
            profile_image: metadata.avatar_url || metadata.picture || null,
          })
          .eq("id", existingUser.id);

        // Store user ID for quick access
        localStorage.setItem("cinecircle_user_id", existingUser.id);

        if (existingUser.onboarding_completed) {
          router.replace("/home");
        } else {
          router.replace("/onboarding");
        }
      } else {
        // New user — create profile in users table
        const { data: newUser } = await supabase
          .from("users")
          .insert({
            google_id: googleUser.id,
            name: metadata.full_name || metadata.name || "User",
            first_name:
              metadata.given_name ||
              (metadata.full_name || "User").split(" ")[0],
            last_name: metadata.family_name || null,
            email: googleUser.email || metadata.email || null,
            profile_image: metadata.avatar_url || metadata.picture || null,
            onboarding_completed: false,
          })
          .select("id")
          .single();

        if (newUser) {
          localStorage.setItem("cinecircle_user_id", newUser.id);
        }

        // New user always goes to onboarding
        router.replace("/onboarding");
      }
    };

    // Listen for auth state changes — Supabase fires SIGNED_IN when it
    // detects tokens in the URL fragment
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        handleAuth();
      }
    });

    // Also try immediately in case the session is already established
    handleAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#0a0a0a] flex flex-col items-center justify-center">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(229, 9, 20, 0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Spinner */}
        <div className="w-12 h-12 border-2 border-white/20 border-t-red-500 rounded-full animate-spin mb-6" />
        <p className="text-white/60 text-sm font-medium tracking-wide">
          Signing you in...
        </p>
      </div>
    </div>
  );
}
