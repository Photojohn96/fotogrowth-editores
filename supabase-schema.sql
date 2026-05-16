-- ========================================================================
-- FotoGrowth Editores — Supabase schema
-- Run this in Supabase Dashboard → SQL Editor → New query → paste + run
-- ========================================================================

-- ───── editors table ─────
create table if not exists editors (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),

  -- Basic
  name text not null,
  email text not null unique,
  whatsapp text,
  city text,
  country text not null,
  ig_handle text,

  -- Services
  video_types text[] not null,
  languages text[] not null,
  turnaround text not null,

  -- Pricing
  price_min_usd integer not null check (price_min_usd >= 0),
  price_max_usd integer not null check (price_max_usd >= price_min_usd),
  price_unit text not null check (price_unit in ('project','video','hour')),

  -- Portfolio
  portfolio_url text not null,
  portfolio_extras text[],

  -- Bio
  bio text,

  -- Admin
  approved_at timestamptz,
  slug text not null unique
);

-- Index for sorting + filtering
create index if not exists editors_status_idx on editors (status);
create index if not exists editors_created_at_idx on editors (created_at desc);

-- ───── Row Level Security ─────
-- ANON key (browser) can only SELECT approved rows.
-- Service role (API routes) bypasses RLS automatically.
alter table editors enable row level security;

-- Drop old policies if rerunning
drop policy if exists "Public can read approved editors" on editors;
drop policy if exists "Service role does everything" on editors;

-- Anyone (anon) can read APPROVED editors only
create policy "Public can read approved editors"
  on editors for select
  to anon
  using (status = 'approved');

-- NOTE: Inserts happen via API route (service role), so no anon insert policy needed.
-- Admin approval also happens via API route.

-- ───── Done ─────
-- Verify: select count(*) from editors;
