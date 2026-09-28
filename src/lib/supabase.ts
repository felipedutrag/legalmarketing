import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Article, DEFAULT_ARTICLES } from "./articles";

export type { Article };
export { DEFAULT_ARTICLES };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export async function getArticles(limit?: number): Promise<Article[]> {
  if (supabase) {
    try {
      let query = supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Article[];
      }
    } catch (e) {
      console.warn("Supabase fetch warning, using fallback articles:", e);
    }
  }

  return limit ? DEFAULT_ARTICLES.slice(0, limit) : DEFAULT_ARTICLES;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return data as Article;
      }
    } catch (e) {
      console.warn("Supabase single fetch warning, using fallback:", e);
    }
  }

  const found = DEFAULT_ARTICLES.find((a) => a.slug === slug);
  return found || null;
}
