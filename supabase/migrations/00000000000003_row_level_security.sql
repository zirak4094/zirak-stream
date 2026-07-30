-- =========================================================
-- ZIRAK STREAM — Migration 3: Row Level Security
-- Every table is RLS-enabled. Policies rely on the
-- public.is_admin() and public.owns_viewer_profile() helpers
-- defined in migration 2.
-- =========================================================

-- ---------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------
alter table public.profiles enable row level security;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "profiles_admin_insert"
  on public.profiles for insert
  with check (public.is_admin());

create policy "profiles_admin_delete"
  on public.profiles for delete
  using (public.is_admin());

-- Prevent a non-admin from granting themselves the admin role via the
-- "update own row" policy above (RLS alone can't restrict single columns).
create or replace function public.prevent_self_role_escalation()
returns trigger
language plpgsql
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'only an admin can change a profile role';
  end if;
  return new;
end;
$$;

create trigger prevent_self_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_self_role_escalation();

-- ---------------------------------------------------------
-- VIEWER PROFILES
-- ---------------------------------------------------------
alter table public.viewer_profiles enable row level security;

create policy "viewer_profiles_select_own_or_admin"
  on public.viewer_profiles for select
  using (profile_id = auth.uid() or public.is_admin());

create policy "viewer_profiles_insert_own"
  on public.viewer_profiles for insert
  with check (profile_id = auth.uid());

create policy "viewer_profiles_update_own_or_admin"
  on public.viewer_profiles for update
  using (profile_id = auth.uid() or public.is_admin())
  with check (profile_id = auth.uid() or public.is_admin());

create policy "viewer_profiles_delete_own_or_admin"
  on public.viewer_profiles for delete
  using (profile_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------
-- LANGUAGES & GENRES — public read, admin write
-- ---------------------------------------------------------
alter table public.languages enable row level security;

create policy "languages_select_all" on public.languages for select using (true);
create policy "languages_admin_write" on public.languages for insert with check (public.is_admin());
create policy "languages_admin_update" on public.languages for update using (public.is_admin()) with check (public.is_admin());
create policy "languages_admin_delete" on public.languages for delete using (public.is_admin());

alter table public.genres enable row level security;

create policy "genres_select_all" on public.genres for select using (true);
create policy "genres_admin_insert" on public.genres for insert with check (public.is_admin());
create policy "genres_admin_update" on public.genres for update using (public.is_admin()) with check (public.is_admin());
create policy "genres_admin_delete" on public.genres for delete using (public.is_admin());

-- ---------------------------------------------------------
-- MOVIES
-- ---------------------------------------------------------
alter table public.movies enable row level security;

create policy "movies_select_published_or_admin"
  on public.movies for select
  using (status = 'published' or public.is_admin());

create policy "movies_admin_insert" on public.movies for insert with check (public.is_admin());
create policy "movies_admin_update" on public.movies for update using (public.is_admin()) with check (public.is_admin());
create policy "movies_admin_delete" on public.movies for delete using (public.is_admin());

alter table public.movie_genres enable row level security;

create policy "movie_genres_select_public"
  on public.movie_genres for select
  using (
    public.is_admin()
    or exists (select 1 from public.movies m where m.id = movie_id and m.status = 'published')
  );

create policy "movie_genres_admin_write" on public.movie_genres for insert with check (public.is_admin());
create policy "movie_genres_admin_delete" on public.movie_genres for delete using (public.is_admin());

alter table public.movie_credits enable row level security;

create policy "movie_credits_select_public"
  on public.movie_credits for select
  using (
    public.is_admin()
    or exists (select 1 from public.movies m where m.id = movie_id and m.status = 'published')
  );

create policy "movie_credits_admin_insert" on public.movie_credits for insert with check (public.is_admin());
create policy "movie_credits_admin_update" on public.movie_credits for update using (public.is_admin()) with check (public.is_admin());
create policy "movie_credits_admin_delete" on public.movie_credits for delete using (public.is_admin());

-- ---------------------------------------------------------
-- SERIES / SEASONS / EPISODES
-- ---------------------------------------------------------
alter table public.series enable row level security;

create policy "series_select_published_or_admin"
  on public.series for select
  using (status = 'published' or public.is_admin());

create policy "series_admin_insert" on public.series for insert with check (public.is_admin());
create policy "series_admin_update" on public.series for update using (public.is_admin()) with check (public.is_admin());
create policy "series_admin_delete" on public.series for delete using (public.is_admin());

alter table public.series_genres enable row level security;

create policy "series_genres_select_public"
  on public.series_genres for select
  using (
    public.is_admin()
    or exists (select 1 from public.series s where s.id = series_id and s.status = 'published')
  );

create policy "series_genres_admin_write" on public.series_genres for insert with check (public.is_admin());
create policy "series_genres_admin_delete" on public.series_genres for delete using (public.is_admin());

alter table public.series_credits enable row level security;

create policy "series_credits_select_public"
  on public.series_credits for select
  using (
    public.is_admin()
    or exists (select 1 from public.series s where s.id = series_id and s.status = 'published')
  );

create policy "series_credits_admin_insert" on public.series_credits for insert with check (public.is_admin());
create policy "series_credits_admin_update" on public.series_credits for update using (public.is_admin()) with check (public.is_admin());
create policy "series_credits_admin_delete" on public.series_credits for delete using (public.is_admin());

alter table public.seasons enable row level security;

create policy "seasons_select_public"
  on public.seasons for select
  using (
    public.is_admin()
    or exists (select 1 from public.series s where s.id = series_id and s.status = 'published')
  );

create policy "seasons_admin_insert" on public.seasons for insert with check (public.is_admin());
create policy "seasons_admin_update" on public.seasons for update using (public.is_admin()) with check (public.is_admin());
create policy "seasons_admin_delete" on public.seasons for delete using (public.is_admin());

alter table public.episodes enable row level security;

create policy "episodes_select_published_or_admin"
  on public.episodes for select
  using (status = 'published' or public.is_admin());

create policy "episodes_admin_insert" on public.episodes for insert with check (public.is_admin());
create policy "episodes_admin_update" on public.episodes for update using (public.is_admin()) with check (public.is_admin());
create policy "episodes_admin_delete" on public.episodes for delete using (public.is_admin());

-- ---------------------------------------------------------
-- VIDEO SOURCES — only signed-in viewers may read playback URLs
-- ---------------------------------------------------------
alter table public.video_sources enable row level security;

create policy "video_sources_select_authenticated"
  on public.video_sources for select
  using (
    public.is_admin()
    or (
      auth.role() = 'authenticated'
      and (
        exists (select 1 from public.movies m where m.id = movie_id and m.status = 'published')
        or exists (select 1 from public.episodes e where e.id = episode_id and e.status = 'published')
      )
    )
  );

create policy "video_sources_admin_insert" on public.video_sources for insert with check (public.is_admin());
create policy "video_sources_admin_update" on public.video_sources for update using (public.is_admin()) with check (public.is_admin());
create policy "video_sources_admin_delete" on public.video_sources for delete using (public.is_admin());

-- ---------------------------------------------------------
-- SUBTITLES — same visibility rule as video_sources
-- ---------------------------------------------------------
alter table public.subtitles enable row level security;

create policy "subtitles_select_authenticated"
  on public.subtitles for select
  using (
    public.is_admin()
    or (
      auth.role() = 'authenticated'
      and (
        exists (select 1 from public.movies m where m.id = movie_id and m.status = 'published')
        or exists (select 1 from public.episodes e where e.id = episode_id and e.status = 'published')
      )
    )
  );

create policy "subtitles_admin_insert" on public.subtitles for insert with check (public.is_admin());
create policy "subtitles_admin_update" on public.subtitles for update using (public.is_admin()) with check (public.is_admin());
create policy "subtitles_admin_delete" on public.subtitles for delete using (public.is_admin());

-- ---------------------------------------------------------
-- WATCH HISTORY — owner only (via viewer_profiles.profile_id = auth.uid())
-- ---------------------------------------------------------
alter table public.watch_history enable row level security;

create policy "watch_history_select_own_or_admin"
  on public.watch_history for select
  using (public.owns_viewer_profile(viewer_profile_id) or public.is_admin());

create policy "watch_history_insert_own"
  on public.watch_history for insert
  with check (public.owns_viewer_profile(viewer_profile_id));

create policy "watch_history_update_own"
  on public.watch_history for update
  using (public.owns_viewer_profile(viewer_profile_id))
  with check (public.owns_viewer_profile(viewer_profile_id));

create policy "watch_history_delete_own_or_admin"
  on public.watch_history for delete
  using (public.owns_viewer_profile(viewer_profile_id) or public.is_admin());

-- ---------------------------------------------------------
-- FAVORITES (watchlist) — owner only
-- ---------------------------------------------------------
alter table public.favorites enable row level security;

create policy "favorites_select_own_or_admin"
  on public.favorites for select
  using (public.owns_viewer_profile(viewer_profile_id) or public.is_admin());

create policy "favorites_insert_own"
  on public.favorites for insert
  with check (public.owns_viewer_profile(viewer_profile_id));

create policy "favorites_delete_own_or_admin"
  on public.favorites for delete
  using (public.owns_viewer_profile(viewer_profile_id) or public.is_admin());

-- ---------------------------------------------------------
-- RATINGS — owner writes their own; ratings are publicly readable
-- (needed to compute/display aggregate scores)
-- ---------------------------------------------------------
alter table public.ratings enable row level security;

create policy "ratings_select_all" on public.ratings for select using (true);

create policy "ratings_insert_own"
  on public.ratings for insert
  with check (public.owns_viewer_profile(viewer_profile_id));

create policy "ratings_update_own"
  on public.ratings for update
  using (public.owns_viewer_profile(viewer_profile_id))
  with check (public.owns_viewer_profile(viewer_profile_id));

create policy "ratings_delete_own_or_admin"
  on public.ratings for delete
  using (public.owns_viewer_profile(viewer_profile_id) or public.is_admin());

-- ---------------------------------------------------------
-- COMMENTS — publicly readable (non-deleted), owner writes/edits own,
-- admin can moderate (update/delete any).
-- ---------------------------------------------------------
alter table public.comments enable row level security;

create policy "comments_select_visible"
  on public.comments for select
  using (is_deleted = false or public.owns_viewer_profile(viewer_profile_id) or public.is_admin());

create policy "comments_insert_own"
  on public.comments for insert
  with check (public.owns_viewer_profile(viewer_profile_id));

create policy "comments_update_own_or_admin"
  on public.comments for update
  using (public.owns_viewer_profile(viewer_profile_id) or public.is_admin())
  with check (public.owns_viewer_profile(viewer_profile_id) or public.is_admin());

create policy "comments_delete_own_or_admin"
  on public.comments for delete
  using (public.owns_viewer_profile(viewer_profile_id) or public.is_admin());

-- ---------------------------------------------------------
-- COMMENT LIKES — owner toggles their own like
-- ---------------------------------------------------------
alter table public.comment_likes enable row level security;

create policy "comment_likes_select_all" on public.comment_likes for select using (true);

create policy "comment_likes_insert_own"
  on public.comment_likes for insert
  with check (public.owns_viewer_profile(viewer_profile_id));

create policy "comment_likes_delete_own_or_admin"
  on public.comment_likes for delete
  using (public.owns_viewer_profile(viewer_profile_id) or public.is_admin());

-- ---------------------------------------------------------
-- NOTIFICATIONS — owner only. Inserts happen via the service-role
-- client (background jobs / admin actions), which bypasses RLS,
-- so there is intentionally no insert policy for regular users.
-- ---------------------------------------------------------
alter table public.notifications enable row level security;

create policy "notifications_select_own_or_admin"
  on public.notifications for select
  using (profile_id = auth.uid() or public.is_admin());

create policy "notifications_update_own"
  on public.notifications for update
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "notifications_delete_own_or_admin"
  on public.notifications for delete
  using (profile_id = auth.uid() or public.is_admin());
