-- Supabase RLS policies for Raj Pictures
-- Goal: allow the public site to read, and allow ONLY the admin Google account
-- (see src/components/auth/AdminGuard.tsx) to upload/delete/reorder via the admin dashboard.
--
-- IMPORTANT:
-- - Replace the email below if needed.
-- - Run in Supabase SQL Editor.
-- - These policies assume you use the `portfolio` storage bucket (default in src/lib/supabaseClient.ts).

-- =========================
-- Settings
-- =========================
-- Admin email (must match the Google account you sign in with)
-- Current app allowlist: x2ankittripathy@gmail.com

-- =========================
-- Tables: public.portfolio_items
-- =========================
alter table if exists public.portfolio_items enable row level security;

-- Public can read portfolio items (homepage portfolio)
drop policy if exists "public read portfolio_items" on public.portfolio_items;
create policy "public read portfolio_items"
on public.portfolio_items
for select
using (true);

-- Admin can insert/update/delete portfolio items
-- Note: uses the email claim from the JWT.
drop policy if exists "admin write portfolio_items" on public.portfolio_items;
create policy "admin write portfolio_items"
on public.portfolio_items
for all
to authenticated
using ((auth.jwt() ->> 'email') = 'x2ankittripathy@gmail.com')
with check ((auth.jwt() ->> 'email') = 'x2ankittripathy@gmail.com');


-- =========================
-- Tables: public.gallery
-- =========================
alter table if exists public.gallery enable row level security;

-- Public can read gallery items (if you still use /gallery)
drop policy if exists "public read gallery" on public.gallery;
create policy "public read gallery"
on public.gallery
for select
using (true);

-- Admin can insert/update/delete gallery items
-- (GalleryManager.tsx)
drop policy if exists "admin write gallery" on public.gallery;
create policy "admin write gallery"
on public.gallery
for all
to authenticated
using ((auth.jwt() ->> 'email') = 'x2ankittripathy@gmail.com')
with check ((auth.jwt() ->> 'email') = 'x2ankittripathy@gmail.com');


-- =========================
-- Storage: storage.objects (bucket: portfolio)
-- =========================
-- These policies are required for client-side uploads/removals using the anon key + authenticated session.
-- If your bucket name is different, replace 'portfolio' accordingly.

-- Allow admin to list/select objects (optional but helpful)
drop policy if exists "admin select portfolio objects" on storage.objects;
create policy "admin select portfolio objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'portfolio'
  and (auth.jwt() ->> 'email') = 'x2ankittripathy@gmail.com'
);

-- Allow admin to upload (INSERT)
drop policy if exists "admin insert portfolio objects" on storage.objects;
create policy "admin insert portfolio objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio'
  and (auth.jwt() ->> 'email') = 'x2ankittripathy@gmail.com'
);

-- Allow admin to update metadata (rare but safe)
drop policy if exists "admin update portfolio objects" on storage.objects;
create policy "admin update portfolio objects"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portfolio'
  and (auth.jwt() ->> 'email') = 'x2ankittripathy@gmail.com'
)
with check (
  bucket_id = 'portfolio'
  and (auth.jwt() ->> 'email') = 'x2ankittripathy@gmail.com'
);

-- Allow admin to delete objects
drop policy if exists "admin delete portfolio objects" on storage.objects;
create policy "admin delete portfolio objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio'
  and (auth.jwt() ->> 'email') = 'x2ankittripathy@gmail.com'
);
