-- =========================================================
-- ZIRAK STREAM — Seed data (languages + starter genres)
-- Run automatically by `supabase db reset`, or manually via
-- `psql "$SUPABASE_DB_URL" -f supabase/seed.sql`
-- =========================================================

insert into public.languages (code, name_en, name_native) values
  ('ckb', 'Central Kurdish (Sorani)', 'سۆرانی'),
  ('kmr', 'Northern Kurdish (Kurmanji)', 'Kurmancî'),
  ('ar', 'Arabic', 'العربية'),
  ('en', 'English', 'English'),
  ('tr', 'Turkish', 'Türkçe'),
  ('fa', 'Persian', 'فارسی')
on conflict (code) do nothing;

insert into public.genres (slug, name_ku, name_en) values
  ('action', 'ئاکشن', 'Action'),
  ('drama', 'درامی', 'Drama'),
  ('comedy', 'کۆمیدی', 'Comedy'),
  ('animation', 'ئەنیمەیشن', 'Animation'),
  ('anime', 'ئەنیمی', 'Anime'),
  ('romance', 'ڕۆمانسی', 'Romance'),
  ('thriller', 'راهێنانی مێشک', 'Thriller'),
  ('horror', 'ترسناک', 'Horror'),
  ('sci-fi', 'زانستی-خەیاڵی', 'Sci-Fi'),
  ('fantasy', 'خەیاڵی', 'Fantasy'),
  ('documentary', 'بەڵگەنامەیی', 'Documentary'),
  ('family', 'خێزانی', 'Family')
on conflict (slug) do nothing;
