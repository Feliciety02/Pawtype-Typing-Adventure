import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate({ from: "/auth/callback" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const completeOAuth = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (!code) {
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
        navigate({ to: "/" });
      }
    };

    completeOAuth();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

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
