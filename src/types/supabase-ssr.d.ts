declare module "@supabase/ssr" {
  import { SupabaseClient } from "@supabase/supabase-js";
  export function createBrowserClient<Database = any>(
    supabaseUrl: string,
    supabaseAnonKey: string,
    options?: any
  ): SupabaseClient<Database>;
  export function createServerClient<Database = any>(
    supabaseUrl: string,
    supabaseAnonKey: string,
    options: any
  ): SupabaseClient<Database>;
}
