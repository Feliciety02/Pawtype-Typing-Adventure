export function getAuthErrorMessage(
  error: unknown,
  fallback = "Unable to complete sign-in right now.",
) {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : fallback;
  const lower = message.toLowerCase();

  if (
    lower.includes("provider is not enabled") ||
    lower.includes("unsupported provider") ||
    lower.includes("oauth") && lower.includes("provider")
  ) {
    return "This social login is not enabled yet. Turn on the provider in Supabase Auth and add the Pawtype callback URL.";
  }

  if (lower.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }

  if (lower.includes("email not confirmed")) {
    return "Check your email inbox and confirm your account before signing in.";
  }

  if (lower.includes("user already registered")) {
    return "This email already has an account. Sign in instead.";
  }

  if (lower.includes("password")) {
    return message;
  }

  return message || fallback;
}
