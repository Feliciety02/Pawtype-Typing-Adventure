import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";

import { getSupabaseServerEnv } from "./config";
import type { Database } from "./types";

export function getSupabaseServerClient() {
  const { url, anonKey, isConfigured } = getSupabaseServerEnv();

  if (!isConfigured) {
    throw new Error(
      "Supabase server env is missing. Set SUPABASE_URL and SUPABASE_ANON_KEY in your server environment.",
    );
  }

  return createServerClient<Database>(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return Object.entries(getCookies()).map(([name, value]) => ({
            name,
            value,
          }));
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            setCookie(cookie.name, cookie.value, cookie.options);
          });
        },
      },
    },
  );
}
