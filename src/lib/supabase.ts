import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Article = {
  id: string;
  slug: string;
  title: string;
  area: string; // Ex: Direito Tributário, Família, Trabalhista
  summary_ai: string; // Resumo Executivo em 30 segundos feito por IA
  geo_citation_prompt: string; // Resposta semântica formatada para o ChatGPT/Google citarem
  content: string; // Conteúdo completo formatado (Markdown ou HTML)
  author_name: string;
  author_role: string;
  reading_time: string;
  is_published: boolean;
  created_at: string;
};
