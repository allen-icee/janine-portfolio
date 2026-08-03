-- ==============================================================================
-- MIGRATION: ADD PAGE VIEWS (VISITOR COUNTER) TABLE
-- Run this snippet in your Supabase SQL Editor to enable visitor tracking
-- ==============================================================================

-- 1. Create page_views table
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null default '/',
  visitor_id text,
  user_agent text,
  created_at timestamptz default now()
);

-- 2. Create index for fast date querying (Today vs Total)
create index if not exists idx_page_views_created_at on page_views(created_at);

-- 3. Enable Row Level Security (RLS)
alter table page_views enable row level security;

-- 4. Safely drop existing policies if re-running
drop policy if exists "Public can record page views" on page_views;
drop policy if exists "Admins can read page views" on page_views;
drop policy if exists "Admins can delete page views" on page_views;

-- 5. Create RLS Policies
-- Public (anonymous or authenticated) can INSERT page views silently
create policy "Public can record page views" on page_views 
  for insert 
  with check (true);

-- Only authenticated Admins can SELECT/READ page views
create policy "Admins can read page views" on page_views 
  for select 
  to authenticated 
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));

-- Only authenticated Admins can DELETE page views (for cleanup if needed)
create policy "Admins can delete page views" on page_views 
  for delete 
  to authenticated 
  using (exists (select 1 from admin_profiles where admin_profiles.id = auth.uid()));
