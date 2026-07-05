import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseBrowserEnv } from "./config";
import type { Database } from "./types";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function isSupabaseBrowserConfigured() {
  return getSupabaseBrowserEnv().isConfigured;
}

export function getSupabaseBrowserClient() {
  const { url, anonKey, isConfigured } = getSupabaseBrowserEnv();

  if (!isConfigured) {
    throw new Error(
      "Supabase browser env is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment.",
    );
  }

  if (!browserClient) {
    browserClient = createBrowserClient<Database>(
      url,
      anonKey,
      {
        auth: {
          autoRefreshToken: true,
          detectSessionInUrl: false,
          flowType: "pkce",
          persistSession: true,
          storageKey: "pawtype-auth",
        },
      },
    );
  }

  return browserClient;
}
