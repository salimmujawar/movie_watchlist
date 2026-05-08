import { createClient, SupabaseClientOptions } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side (Node < 22) needs ws polyfill for Supabase Realtime.
// Browser has native WebSocket, so no polyfill needed there.
const options: SupabaseClientOptions<"public"> = {};

if (typeof window === "undefined") {
  options.realtime = { transport: eval('require')("ws") };
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);
