import { getSupabaseBrowserClient } from "./client";

export type OAuthProvider = "google" | "facebook";

export async function signInWithOAuth(provider: OAuthProvider) {
  const supabase = getSupabaseBrowserClient();
  const redirectTo = `${window.location.origin}/auth/callback`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
    },
  });

  if (error) throw new Error(error.message);
  if (data.url) {
    window.location.assign(data.url);
  }
}
