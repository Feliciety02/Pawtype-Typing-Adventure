import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase/client";
import {
  clearStashedPostAuthPath,
  readStashedPostAuthPath,
  sanitizeAuthPath,
} from "@/lib/supabase/auth-redirect";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const completeOAuth = async () => {
      if (!isSupabaseBrowserConfigured()) {
        setError(
          "Supabase auth is not configured for this deployment. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then rebuild.",
        );
        clearStashedPostAuthPath();
        return;
      }

      const url = new URL(window.location.href);
      const providerError =
        url.searchParams.get("error_description") ?? url.searchParams.get("error");
      if (providerError) {
        setError(providerError);
        clearStashedPostAuthPath();
        return;
      }

      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) {
        const supabase = getSupabaseBrowserClient();
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const next = sanitizeAuthPath(
            url.searchParams.get("next") ?? readStashedPostAuthPath(),
          );
          clearStashedPostAuthPath();
          window.location.replace(next);
          return;
        }

        setError("Missing OAuth code. Try signing in again.");
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        if (!cancelled) setError(exchangeError.message);
        return;
      }

      if (!cancelled) {
        const next = sanitizeAuthPath(
          url.searchParams.get("next") ?? readStashedPostAuthPath(),
        );
        clearStashedPostAuthPath();
        window.location.replace(next);
      }
    };

    completeOAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-dvh grid place-items-center px-4">
      <div className="pixel-card max-w-md p-6 text-center">
        <p className="font-pixel text-[0.7rem] text-muted-foreground">
          {error ?? "Linking your social login..."}
        </p>
      </div>
    </main>
  );
}
