import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client (anon key). Safe for client components.
 * Returns null in demo mode so callers can gracefully fall back.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
