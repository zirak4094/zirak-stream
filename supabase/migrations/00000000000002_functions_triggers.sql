-- =========================================================
-- ZIRAK STREAM — Migration 2: Functions & triggers
-- =========================================================

-- ---------------------------------------------------------
-- updated_at auto-touch
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.movies
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.series
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.episodes
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.ratings
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.comments
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- New auth.users row -> create profiles row + a default viewer profile
-- ---------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen_name text;
begin
  chosen_name := coalesce(
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'full_name',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    chosen_name,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.viewer_profiles (profile_id, name, avatar_url)
  values (new.id, chosen_name, new.raw_user_meta_data ->> 'avatar_url')
  on conflict do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------
-- Comment like counter maintenance
-- ---------------------------------------------------------
create or replace function public.adjust_comment_like_count()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    update public.comments set like_count = like_count + 1 where id = new.comment_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.comments set like_count = greatest(like_count - 1, 0) where id = old.comment_id;
    return old;
  end if;
  return null;
end;
$$;

create trigger comment_likes_after_insert
  after insert on public.comment_likes
  for each row execute function public.adjust_comment_like_count();

create trigger comment_likes_after_delete
  after delete on public.comment_likes
  for each row execute function public.adjust_comment_like_count();

-- ---------------------------------------------------------
-- Helper: is the current JWT holder an admin?
-- Used throughout RLS policies (migration 3).
-- ---------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------
-- Helper: does the current user own this viewer_profile_id?
-- ---------------------------------------------------------
create or replace function public.owns_viewer_profile(vp_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.viewer_profiles
    where id = vp_id and profile_id = auth.uid()
  );
$$;
