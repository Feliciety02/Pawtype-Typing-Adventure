-- Migration: Initial schema for Pawtype Studio
-- Run this in your Supabase SQL Editor

-- 1. Profiles table (extends auth.users)
create table if not exists public.profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  username  text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Game states table
create table if not exists public.game_states (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade unique,
  player     jsonb not null default '{}'::jsonb,
  inventory  jsonb not null default '{}'::jsonb,
  adventures jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.game_states enable row level security;

create index if not exists idx_game_states_user_id on public.game_states(user_id);

-- RLS policies for game_states
create policy "Users can view their own game state"
  on public.game_states for select
  using (auth.uid() = user_id);

create policy "Users can insert their own game state"
  on public.game_states for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own game state"
  on public.game_states for update
  using (auth.uid() = user_id);

create policy "Users can delete their own game state"
  on public.game_states for delete
  using (auth.uid() = user_id);
