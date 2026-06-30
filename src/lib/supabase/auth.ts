import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/supabase/server";

export const signUp = createServerFn({ method: "POST" })
  .validator(z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const signIn = createServerFn({ method: "POST" })
  .validator(z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }))
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) throw new Error(error.message);
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
  return data.session
    ? { user: data.session.user, expiresAt: data.session.expires_at }
    : null;
});

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return data.user ?? null;
});
