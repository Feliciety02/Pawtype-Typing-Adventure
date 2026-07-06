import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSession } from "./auth";

const gameStateSchema = z.object({
  player: z.record(z.unknown()),
  inventory: z.record(z.unknown()),
  adventures: z.record(z.unknown()),
});

export const saveGameState = createServerFn({ method: "POST" })
  .validator(gameStateSchema)
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session?.user) throw new Error("Not authenticated");

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("game_states").upsert(
      {
        user_id: session.user.id,
        player: data.player as never,
        inventory: data.inventory as never,
        adventures: data.adventures as never,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    if (error) throw new Error(error.message);
    return { success: true };
  });

type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue };

export const loadGameState = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSession();
  if (!session?.user) return null;

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("game_states")
    .select("*")
    .eq("user_id", session.user.id)
    .single();
  if (error && error.code !== "PGRST116") throw new Error(error.message);
  if (!data) return null;

  return {
    player: JSON.parse(JSON.stringify(data.player ?? {})) as JsonValue,
    inventory: JSON.parse(JSON.stringify(data.inventory ?? {})) as JsonValue,
    adventures: JSON.parse(JSON.stringify(data.adventures ?? {})) as JsonValue,
  };
});

export const deleteGameState = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getSession();
  if (!session?.user) throw new Error("Not authenticated");

  const supabase = getSupabaseServerClient();
  const { error } = await supabase.from("game_states").delete().eq("user_id", session.user.id);
  if (error) throw new Error(error.message);
  return { success: true };
});
