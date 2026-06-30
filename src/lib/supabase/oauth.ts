import { getSupabaseBrowserClient } from "./client";
import { buildOAuthCallbackUrl, stashPostAuthPath } from "./auth-redirect";

export type OAuthProvider = "google" | "facebook";

function getProviderOptions(provider: OAuthProvider) {
  if (provider === "facebook") {
    return {
      scopes: "email public_profile",
    };
  }

  return {
    queryParams: {
      access_type: "offline",
      prompt: "select_account",
    },
    scopes: "email profile",
  };
}

export async function signInWithOAuth(provider: OAuthProvider, next = "/") {
  const supabase = getSupabaseBrowserClient();
  const redirectTo = buildOAuthCallbackUrl(next);
  stashPostAuthPath(next);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
      ...getProviderOptions(provider),
    },
  });

  if (error) throw new Error(error.message);
  if (data.url) {
    window.location.assign(data.url);
  }
}
