-- Persistent JSON store for the Pleniora Node server.
-- Run once in Supabase SQL Editor before configuring Vercel.
create table if not exists public.pleniora_store (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.pleniora_store enable row level security;

insert into public.pleniora_store (id, payload)
values ('main', '{"users":[],"platformAdmins":[],"resetTokens":[],"businesses":[]}'::jsonb)
on conflict (id) do nothing;
