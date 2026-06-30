const POST_AUTH_PATH_KEY = "pawtype-post-auth-path";

export function sanitizeAuthPath(path?: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

export function buildOAuthCallbackUrl(next = "/") {
  const url = new URL("/auth/callback", window.location.origin);
  url.searchParams.set("next", sanitizeAuthPath(next));
  return url.toString();
}

export function stashPostAuthPath(next = "/") {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(POST_AUTH_PATH_KEY, sanitizeAuthPath(next));
}

export function readStashedPostAuthPath() {
  if (typeof window === "undefined") return "/";
  const value = window.sessionStorage.getItem(POST_AUTH_PATH_KEY);
  return sanitizeAuthPath(value);
}

export function clearStashedPostAuthPath() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(POST_AUTH_PATH_KEY);
}
