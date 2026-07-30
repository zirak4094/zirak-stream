-- =========================================================
-- ZIRAK STREAM — Migration 1: Core schema
-- =========================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ---------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------
create type public.app_role as enum ('user', 'admin');
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.credit_role as enum ('actor', 'director', 'writer', 'producer', 'voice_actor');
create type public.video_quality as enum ('360p', '480p', '720p', '1080p', '1440p', '4k');
create type public.notification_type as enum (
  'new_episode',
  'new_movie',
  'comment_reply',
  'comment_like',
  'system'
);

-- ---------------------------------------------------------
-- PROFILES (1:1 with auth.users — the account itself)
-- ---------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text not null,
  avatar_url text,
  role public.app_role not null default 'user',
  preferred_language text not null default 'ckb',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'One row per authenticated account (extends auth.users).';

-- ---------------------------------------------------------
-- VIEWER PROFILES (Netflix-style multiple profiles per account)
-- ---------------------------------------------------------
create table public.viewer_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  avatar_url text,
  is_kids boolean not null default false,
  pin_hash text,
  created_at timestamptz not null default now(),
  constraint viewer_profiles_name_len check (char_length(name) between 1 and 40)
);

create index viewer_profiles_profile_id_idx on public.viewer_profiles (profile_id);

-- ---------------------------------------------------------
-- LANGUAGES & GENRES (shared taxonomy)
-- ---------------------------------------------------------
create table public.languages (
  code text primary key,
  name_en text not null,
  name_native text not null
);

create table public.genres (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ku text not null,
  name_en text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- MOVIES
-- ---------------------------------------------------------
create table public.movies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ku text not null,
  description_ku text,
  description_en text,
  poster_url text,
  backdrop_url text,
  trailer_url text,
  release_year smallint,
  runtime_minutes smallint,
  country text,
  imdb_rating numeric(3, 1),
  age_rating text,
  status public.content_status not null default 'draft',
  view_count bigint not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index movies_status_idx on public.movies (status);
create index movies_release_year_idx on public.movies (release_year desc);
create index movies_title_ku_trgm_idx on public.movies using gin (title_ku gin_trgm_ops);
create index movies_title_en_trgm_idx on public.movies using gin (title_en gin_trgm_ops);

create table public.movie_genres (
  movie_id uuid not null references public.movies (id) on delete cascade,
  genre_id uuid not null references public.genres (id) on delete cascade,
  primary key (movie_id, genre_id)
);

create table public.movie_credits (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid not null references public.movies (id) on delete cascade,
  person_name text not null,
  role public.credit_role not null,
  character_name text,
  photo_url text,
  order_index smallint not null default 0
);

create index movie_credits_movie_id_idx on public.movie_credits (movie_id);

-- ---------------------------------------------------------
-- SERIES / SEASONS / EPISODES
-- ---------------------------------------------------------
create table public.series (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ku text not null,
  description_ku text,
  description_en text,
  poster_url text,
  backdrop_url text,
  trailer_url text,
  first_air_year smallint,
  last_air_year smallint,
  country text,
  imdb_rating numeric(3, 1),
  age_rating text,
  status public.content_status not null default 'draft',
  view_count bigint not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index series_status_idx on public.series (status);
create index series_title_ku_trgm_idx on public.series using gin (title_ku gin_trgm_ops);
create index series_title_en_trgm_idx on public.series using gin (title_en gin_trgm_ops);

create table public.series_genres (
  series_id uuid not null references public.series (id) on delete cascade,
  genre_id uuid not null references public.genres (id) on delete cascade,
  primary key (series_id, genre_id)
);

create table public.series_credits (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.series (id) on delete cascade,
  person_name text not null,
  role public.credit_role not null,
  character_name text,
  photo_url text,
  order_index smallint not null default 0
);

create index series_credits_series_id_idx on public.series_credits (series_id);

create table public.seasons (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.series (id) on delete cascade,
  season_number smallint not null,
  title_ku text,
  poster_url text,
  created_at timestamptz not null default now(),
  unique (series_id, season_number)
);

create table public.episodes (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.series (id) on delete cascade,
  season_id uuid not null references public.seasons (id) on delete cascade,
  episode_number smallint not null,
  title_ku text not null,
  title_en text,
  description_ku text,
  thumbnail_url text,
  duration_seconds integer,
  air_date date,
  status public.content_status not null default 'draft',
  view_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season_id, episode_number)
);

create index episodes_series_id_idx on public.episodes (series_id);
create index episodes_season_id_idx on public.episodes (season_id);
create index episodes_status_idx on public.episodes (status);

-- ---------------------------------------------------------
-- VIDEO SOURCES (multi-quality playback, stored in Cloudflare R2)
-- Exactly one of movie_id / episode_id must be set.
-- ---------------------------------------------------------
create table public.video_sources (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid references public.movies (id) on delete cascade,
  episode_id uuid references public.episodes (id) on delete cascade,
  quality public.video_quality not null,
  storage_key text not null,
  url text not null,
  size_bytes bigint,
  created_at timestamptz not null default now(),
  constraint video_sources_exactly_one_parent check (
    (movie_id is not null and episode_id is null)
    or (movie_id is null and episode_id is not null)
  )
);

create unique index video_sources_movie_quality_uidx
  on public.video_sources (movie_id, quality) where movie_id is not null;
create unique index video_sources_episode_quality_uidx
  on public.video_sources (episode_id, quality) where episode_id is not null;

-- ---------------------------------------------------------
-- SUBTITLES (multi-language, SRT/VTT stored in R2)
-- Exactly one of movie_id / episode_id must be set.
-- ---------------------------------------------------------
create table public.subtitles (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid references public.movies (id) on delete cascade,
  episode_id uuid references public.episodes (id) on delete cascade,
  language_code text not null references public.languages (code),
  storage_key text not null,
  url text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  constraint subtitles_exactly_one_parent check (
    (movie_id is not null and episode_id is null)
    or (movie_id is null and episode_id is not null)
  )
);

create unique index subtitles_movie_lang_uidx
  on public.subtitles (movie_id, language_code) where movie_id is not null;
create unique index subtitles_episode_lang_uidx
  on public.subtitles (episode_id, language_code) where episode_id is not null;

-- ---------------------------------------------------------
-- WATCH HISTORY (continue watching / resume)
-- Exactly one of movie_id / episode_id must be set.
-- ---------------------------------------------------------
create table public.watch_history (
  id uuid primary key default gen_random_uuid(),
  viewer_profile_id uuid not null references public.viewer_profiles (id) on delete cascade,
  movie_id uuid references public.movies (id) on delete cascade,
  episode_id uuid references public.episodes (id) on delete cascade,
  progress_seconds integer not null default 0,
  duration_seconds integer,
  completed boolean not null default false,
  last_watched_at timestamptz not null default now(),
  constraint watch_history_exactly_one_parent check (
    (movie_id is not null and episode_id is null)
    or (movie_id is null and episode_id is not null)
  )
);

create unique index watch_history_viewer_movie_uidx
  on public.watch_history (viewer_profile_id, movie_id) where movie_id is not null;
create unique index watch_history_viewer_episode_uidx
  on public.watch_history (viewer_profile_id, episode_id) where episode_id is not null;
create index watch_history_viewer_last_watched_idx
  on public.watch_history (viewer_profile_id, last_watched_at desc);

-- ---------------------------------------------------------
-- FAVORITES (watchlist) — movie or series
-- ---------------------------------------------------------
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  viewer_profile_id uuid not null references public.viewer_profiles (id) on delete cascade,
  movie_id uuid references public.movies (id) on delete cascade,
  series_id uuid references public.series (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favorites_exactly_one_parent check (
    (movie_id is not null and series_id is null)
    or (movie_id is null and series_id is not null)
  )
);

create unique index favorites_viewer_movie_uidx
  on public.favorites (viewer_profile_id, movie_id) where movie_id is not null;
create unique index favorites_viewer_series_uidx
  on public.favorites (viewer_profile_id, series_id) where series_id is not null;

-- ---------------------------------------------------------
-- RATINGS — movie or series, 1-10
-- ---------------------------------------------------------
create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  viewer_profile_id uuid not null references public.viewer_profiles (id) on delete cascade,
  movie_id uuid references public.movies (id) on delete cascade,
  series_id uuid references public.series (id) on delete cascade,
  score smallint not null check (score between 1 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ratings_exactly_one_parent check (
    (movie_id is not null and series_id is null)
    or (movie_id is null and series_id is not null)
  )
);

create unique index ratings_viewer_movie_uidx
  on public.ratings (viewer_profile_id, movie_id) where movie_id is not null;
create unique index ratings_viewer_series_uidx
  on public.ratings (viewer_profile_id, series_id) where series_id is not null;

-- ---------------------------------------------------------
-- COMMENTS — nested (movie, series, or episode), Instagram/TikTok style
-- ---------------------------------------------------------
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  movie_id uuid references public.movies (id) on delete cascade,
  series_id uuid references public.series (id) on delete cascade,
  episode_id uuid references public.episodes (id) on delete cascade,
  viewer_profile_id uuid not null references public.viewer_profiles (id) on delete cascade,
  parent_comment_id uuid references public.comments (id) on delete cascade,
  content text not null,
  like_count integer not null default 0,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint comments_content_len check (char_length(content) between 1 and 2000),
  constraint comments_exactly_one_parent check (
    (num_nonnulls(movie_id, series_id, episode_id) = 1)
  )
);

create index comments_movie_id_idx on public.comments (movie_id);
create index comments_series_id_idx on public.comments (series_id);
create index comments_episode_id_idx on public.comments (episode_id);
create index comments_parent_comment_id_idx on public.comments (parent_comment_id);

create table public.comment_likes (
  comment_id uuid not null references public.comments (id) on delete cascade,
  viewer_profile_id uuid not null references public.viewer_profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, viewer_profile_id)
);

-- ---------------------------------------------------------
-- NOTIFICATIONS — belong to the account (profiles), not a viewer profile
-- ---------------------------------------------------------
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null,
  title_ku text not null,
  body_ku text,
  data jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_profile_id_idx on public.notifications (profile_id, is_read, created_at desc);
