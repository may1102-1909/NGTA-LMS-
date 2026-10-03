import { createBrowserClient } from "@supabase/ssr";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Maintain a single client instance in browser context to prevent multiple GoTrueClient warnings
let globalClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (typeof window === "undefined") {
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  if (!globalClient) {
    globalClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
  return globalClient;
}

export const supabase = getSupabaseClient();
export default supabase;

