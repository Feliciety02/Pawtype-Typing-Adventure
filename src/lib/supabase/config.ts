const PLACEHOLDER_VALUES = new Set(["your-project-url", "your-anon-key"]);

function isConfiguredValue(value: string | undefined) {
  if (!value) return false;

  const trimmed = value.trim();
  return trimmed.length > 0 && !PLACEHOLDER_VALUES.has(trimmed);
}

export function getSupabaseBrowserEnv() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return {
    url,
    anonKey,
    isConfigured: isConfiguredValue(url) && isConfiguredValue(anonKey),
  };
}

export function getSupabaseServerEnv() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  return {
    url,
    anonKey,
    isConfigured: isConfiguredValue(url) && isConfiguredValue(anonKey),
  };
}
