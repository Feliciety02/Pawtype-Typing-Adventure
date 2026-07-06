import { createServerFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";

import { signInCredentialsSchema, signUpCredentialsSchema } from "@/lib/auth/shared";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const signUp = createServerFn({ method: "POST" })
  .validator(signUpCredentialsSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const requestUrl = getRequestUrl();
    const emailRedirectTo = new URL("/auth/callback", requestUrl.origin).toString();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo,
      },
    });
    if (error) {
      if (error.message.toLowerCase().includes("user already registered")) {
        throw new Error("This email already has an account. Sign in instead.");
      }
      throw new Error(error.message);
    }
    return { success: true };
  });

export const signIn = createServerFn({ method: "POST" })
  .validator(signInCredentialsSchema)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        throw new Error("Incorrect email or password.");
      }
      throw new Error(error.message);
    }
    return { success: true };
  });

export const signOut = createServerFn({ method: "POST" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  return { success: true };
});

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session ? { user: data.session.user, expiresAt: data.session.expires_at } : null;
});

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return data.user ?? null;
});
