"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const processed = useRef(false);

  useEffect(() => {
    // Sync the authenticated Google user into our users table,
    // then redirect to onboarding (new) or home (returning).
    const syncUserAndRedirect = async () => {
      // Guard against double execution from onAuthStateChange + getSession
      if (processed.current) return;
      processed.current = true;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Still no session after SIGNED_IN event — something went wrong
        console.error("Auth callback: no session found after sign-in");
        router.replace("/");
        return;
      }

      const authUser = session.user;
      const metadata = authUser.user_metadata;

      // Check if this user already exists in our users table
      const { data: existingUser } = await supabase
        .from("users")
        .select("id, onboarding_completed")
        .eq("google_id", authUser.id)
        .single();

      if (existingUser) {
        // ── Returning user ─────────────────────────────────────
        await supabase
          .from("users")
          .update({
            last_login_at: new Date().toISOString(),
            name: metadata.full_name || metadata.name || "User",
            email: authUser.email || metadata.email || null,
            profile_image: metadata.avatar_url || metadata.picture || null,
          })
          .eq("id", existingUser.id);

        localStorage.setItem("cinecircle_user_id", existingUser.id);

        if (existingUser.onboarding_completed) {
          router.replace("/home");
        } else {
          router.replace("/onboarding");
        }
      } else {
        // ── New user — create profile row ──────────────────────
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({
            google_id: authUser.id,
            name: metadata.full_name || metadata.name || "User",
            first_name:
              metadata.given_name ||
              (metadata.full_name || "User").split(" ")[0],
            last_name: metadata.family_name || null,
            email: authUser.email || metadata.email || null,
            profile_image: metadata.avatar_url || metadata.picture || null,
            onboarding_completed: false,
          })
          .select("id")
          .single();

        if (insertError) {
          console.error("Failed to create user profile:", insertError.message);

          // Might be a duplicate key race — try fetching instead
          const { data: raceUser } = await supabase
            .from("users")
            .select("id, onboarding_completed")
            .eq("google_id", authUser.id)
            .single();

          if (raceUser) {
            localStorage.setItem("cinecircle_user_id", raceUser.id);
            router.replace(
              raceUser.onboarding_completed ? "/home" : "/onboarding"
            );
            return;
          }

          // Total failure — send back to login
          router.replace("/");
          return;
        }

        if (newUser) {
          localStorage.setItem("cinecircle_user_id", newUser.id);
        }

        router.replace("/onboarding");
      }
    };

    // Listen for the SIGNED_IN event — Supabase fires this when it
    // picks up the OAuth tokens from the URL fragment.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        syncUserAndRedirect();
      }
    });

    // Also check immediately in case the session was already established
    // before the listener was registered (e.g. page refresh with valid cookie).
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        syncUserAndRedirect();
      }
      // If no session yet, we wait for onAuthStateChange — do NOT redirect
    });

    // Timeout fallback: if nothing happens within 10s, redirect to login
    const timeout = setTimeout(() => {
      if (!processed.current) {
        console.error("Auth callback: timed out waiting for session");
        router.replace("/");
      }
    }, 10000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
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
