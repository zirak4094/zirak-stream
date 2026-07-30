// Hand-authored to mirror `supabase/migrations` exactly, in the same shape
// `supabase gen types typescript` produces. Once the project is linked, run
// `npm run supabase:types` to regenerate this file from the live database
// and keep it as the single source of truth going forward.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AppRole = "user" | "admin";
export type ContentStatus = "draft" | "published" | "archived";
export type CreditRole = "actor" | "director" | "writer" | "producer" | "voice_actor";
export type VideoQuality = "360p" | "480p" | "720p" | "1080p" | "1440p" | "4k";
export type NotificationType =
  | "new_episode"
  | "new_movie"
  | "comment_reply"
  | "comment_like"
  | "system";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar_url: string | null;
          role: AppRole;
          preferred_language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          avatar_url?: string | null;
          role?: AppRole;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };

      viewer_profiles: {
        Row: {
          id: string;
          profile_id: string;
          name: string;
          avatar_url: string | null;
          is_kids: boolean;
          pin_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          name: string;
          avatar_url?: string | null;
          is_kids?: boolean;
          pin_hash?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["viewer_profiles"]["Insert"]>;
      };

      languages: {
        Row: {
          code: string;
          name_en: string;
          name_native: string;
        };
        Insert: {
          code: string;
          name_en: string;
          name_native: string;
        };
        Update: Partial<Database["public"]["Tables"]["languages"]["Insert"]>;
      };

      genres: {
        Row: {
          id: string;
          slug: string;
          name_ku: string;
          name_en: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_ku: string;
          name_en: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["genres"]["Insert"]>;
      };

      movies: {
        Row: {
          id: string;
          slug: string;
          title_en: string;
          title_ku: string;
          description_ku: string | null;
          description_en: string | null;
          poster_url: string | null;
          backdrop_url: string | null;
          trailer_url: string | null;
          release_year: number | null;
          runtime_minutes: number | null;
          country: string | null;
          imdb_rating: number | null;
          age_rating: string | null;
          status: ContentStatus;
          view_count: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_en: string;
          title_ku: string;
          description_ku?: string | null;
          description_en?: string | null;
          poster_url?: string | null;
          backdrop_url?: string | null;
          trailer_url?: string | null;
          release_year?: number | null;
          runtime_minutes?: number | null;
          country?: string | null;
          imdb_rating?: number | null;
          age_rating?: string | null;
          status?: ContentStatus;
          view_count?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["movies"]["Insert"]>;
      };

      movie_genres: {
        Row: { movie_id: string; genre_id: string };
        Insert: { movie_id: string; genre_id: string };
        Update: Partial<Database["public"]["Tables"]["movie_genres"]["Insert"]>;
      };

      movie_credits: {
        Row: {
          id: string;
          movie_id: string;
          person_name: string;
          role: CreditRole;
          character_name: string | null;
          photo_url: string | null;
          order_index: number;
        };
        Insert: {
          id?: string;
          movie_id: string;
          person_name: string;
          role: CreditRole;
          character_name?: string | null;
          photo_url?: string | null;
          order_index?: number;
        };
        Update: Partial<Database["public"]["Tables"]["movie_credits"]["Insert"]>;
      };

      series: {
        Row: {
          id: string;
          slug: string;
          title_en: string;
          title_ku: string;
          description_ku: string | null;
          description_en: string | null;
          poster_url: string | null;
          backdrop_url: string | null;
          trailer_url: string | null;
          first_air_year: number | null;
          last_air_year: number | null;
          country: string | null;
          imdb_rating: number | null;
          age_rating: string | null;
          status: ContentStatus;
          view_count: number;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title_en: string;
          title_ku: string;
          description_ku?: string | null;
          description_en?: string | null;
          poster_url?: string | null;
          backdrop_url?: string | null;
          trailer_url?: string | null;
          first_air_year?: number | null;
          last_air_year?: number | null;
          country?: string | null;
          imdb_rating?: number | null;
          age_rating?: string | null;
          status?: ContentStatus;
          view_count?: number;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["series"]["Insert"]>;
      };

      series_genres: {
        Row: { series_id: string; genre_id: string };
        Insert: { series_id: string; genre_id: string };
        Update: Partial<Database["public"]["Tables"]["series_genres"]["Insert"]>;
      };

      series_credits: {
        Row: {
          id: string;
          series_id: string;
          person_name: string;
          role: CreditRole;
          character_name: string | null;
          photo_url: string | null;
          order_index: number;
        };
        Insert: {
          id?: string;
          series_id: string;
          person_name: string;
          role: CreditRole;
          character_name?: string | null;
          photo_url?: string | null;
          order_index?: number;
        };
        Update: Partial<Database["public"]["Tables"]["series_credits"]["Insert"]>;
      };

      seasons: {
        Row: {
          id: string;
          series_id: string;
          season_number: number;
          title_ku: string | null;
          poster_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          series_id: string;
          season_number: number;
          title_ku?: string | null;
          poster_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["seasons"]["Insert"]>;
      };

      episodes: {
        Row: {
          id: string;
          series_id: string;
          season_id: string;
          episode_number: number;
          title_ku: string;
          title_en: string | null;
          description_ku: string | null;
          thumbnail_url: string | null;
          duration_seconds: number | null;
          air_date: string | null;
          status: ContentStatus;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          series_id: string;
          season_id: string;
          episode_number: number;
          title_ku: string;
          title_en?: string | null;
          description_ku?: string | null;
          thumbnail_url?: string | null;
          duration_seconds?: number | null;
          air_date?: string | null;
          status?: ContentStatus;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["episodes"]["Insert"]>;
      };

      video_sources: {
        Row: {
          id: string;
          movie_id: string | null;
          episode_id: string | null;
          quality: VideoQuality;
          storage_key: string;
          url: string;
          size_bytes: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          movie_id?: string | null;
          episode_id?: string | null;
          quality: VideoQuality;
          storage_key: string;
          url: string;
          size_bytes?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["video_sources"]["Insert"]>;
      };

      subtitles: {
        Row: {
          id: string;
          movie_id: string | null;
          episode_id: string | null;
          language_code: string;
          storage_key: string;
          url: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          movie_id?: string | null;
          episode_id?: string | null;
          language_code: string;
          storage_key: string;
          url: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subtitles"]["Insert"]>;
      };

      watch_history: {
        Row: {
          id: string;
          viewer_profile_id: string;
          movie_id: string | null;
          episode_id: string | null;
          progress_seconds: number;
          duration_seconds: number | null;
          completed: boolean;
          last_watched_at: string;
        };
        Insert: {
          id?: string;
          viewer_profile_id: string;
          movie_id?: string | null;
          episode_id?: string | null;
          progress_seconds?: number;
          duration_seconds?: number | null;
          completed?: boolean;
          last_watched_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["watch_history"]["Insert"]>;
      };

      favorites: {
        Row: {
          id: string;
          viewer_profile_id: string;
          movie_id: string | null;
          series_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          viewer_profile_id: string;
          movie_id?: string | null;
          series_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Insert"]>;
      };

      ratings: {
        Row: {
          id: string;
          viewer_profile_id: string;
          movie_id: string | null;
          series_id: string | null;
          score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          viewer_profile_id: string;
          movie_id?: string | null;
          series_id?: string | null;
          score: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ratings"]["Insert"]>;
      };

      comments: {
        Row: {
          id: string;
          movie_id: string | null;
          series_id: string | null;
          episode_id: string | null;
          viewer_profile_id: string;
          parent_comment_id: string | null;
          content: string;
          like_count: number;
          is_deleted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          movie_id?: string | null;
          series_id?: string | null;
          episode_id?: string | null;
          viewer_profile_id: string;
          parent_comment_id?: string | null;
          content: string;
          like_count?: number;
          is_deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["comments"]["Insert"]>;
      };

      comment_likes: {
        Row: {
          comment_id: string;
          viewer_profile_id: string;
          created_at: string;
        };
        Insert: {
          comment_id: string;
          viewer_profile_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["comment_likes"]["Insert"]>;
      };

      notifications: {
        Row: {
          id: string;
          profile_id: string;
          type: NotificationType;
          title_ku: string;
          body_ku: string | null;
          data: Json;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          type: NotificationType;
          title_ku: string;
          body_ku?: string | null;
          data?: Json;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      owns_viewer_profile: {
        Args: { vp_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: AppRole;
      content_status: ContentStatus;
      credit_role: CreditRole;
      video_quality: VideoQuality;
      notification_type: NotificationType;
    };
    CompositeTypes: Record<string, never>;
  };
}

// Convenience row/insert/update aliases, e.g. Tables<'movies'>
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
