import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseGalleryBucket =
  (import.meta.env.VITE_SUPABASE_GALLERY_BUCKET as string | undefined) || "portfolio";

function assertEnv(value: string | undefined, key: string): string {
  if (!value) {
    throw new Error(
      `[Raj Pictures] Missing env var ${key}. Add it to .env.local (see .env.example).`
    );
  }
  return value;
}

export const supabase: SupabaseClient = createClient(
  assertEnv(supabaseUrl, "VITE_SUPABASE_URL"),
  assertEnv(supabaseAnonKey, "VITE_SUPABASE_ANON_KEY"),
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export type GalleryCategory = "Weddings" | "Cinematic";

export type GalleryItem = {
  id: number | string;
  title: string | null;
  category: GalleryCategory | null;
  image_url: string;
  storage_path: string | null;
  created_at: string;
};
