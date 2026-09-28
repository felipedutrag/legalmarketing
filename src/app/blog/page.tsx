import Link from "next/link";
import type { Metadata } from "next";
import { supabase, type Article } from "@/lib/supabase";
import styles from "./blog.module.css";
import WhatsappButton from "../WhatsappButton";

export const metadata: Metadata = {
  title: "Acervo de Inteligência Jurídica — Lexora",
  description:
    "Artigos técnicos, teses consolidadas e estrutura de citação semântica para Google e motores de IA.",
};

export const revalidate = 60; // Revalida a cada 60 segundos

export default async function BlogIndexPage() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <main className={styles.blogPage}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          <span className={styles.brandMark}>L</span> lexora
        </Link>
        <nav className={styles.nav}>
          <Link href="/">Início</Link>
          <Link href="/#como-funciona">Como Funciona</Link>
          <Link href="/#plano">Condições</Link>
        </nav>
        <WhatsappButton className={styles.headerCta}>
          Fale pelo WhatsApp <span>↗</span>
        </WhatsappButton>
      </header>

      <section className={styles.heroSection}>
        <div className={styles.eyebrow}>
          <span /> ACERVO DE INTELIGÊNCIA JURÍDICA (GEO & SEO)
        </div>
        <h1>
          Conhecimento técnico transformado em <em>patrimônio perpétuo.</em>
        </h1>
        <p className={styles.heroSubtitle}>
          Esta é a nova geração de artigos jurídicos: estruturados com resumo executivo de IA para clientes exigentes e arquitetura semântica para citação no Google e ChatGPT.
        </p>
      </section>

      <section className={styles.articlesGrid}>
        {error || !articles || articles.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Nenhum artigo encontrado no acervo no momento.</p>
          </div>
        ) : (
          articles.map((article: Article) => (
            <article key={article.id} className={styles.articleCard}>
              <div className={styles.cardHeader}>
                <span className={styles.areaBadge}>{article.area}</span>
                <span className={styles.readingTime}>{article.reading_time}</span>
              </div>
              
              <h2 className={styles.cardTitle}>
                <Link href={`/blog/${article.slug}`}>{article.title}</Link>
              </h2>

              <div className={styles.aiBox}>
                <div className={styles.aiBoxHeader}>
                  <div className={styles.aiPulseWrap}>
                    <span className={styles.aiPulseDot} />
                    <span className={styles.aiLabel}>Síntese Executiva</span>
                  </div>
                  <span className={styles.geoPill}>Indexado GEO</span>
                </div>
                <div className={styles.aiSummaryList}>
                  {article.summary_ai.split("\n").map((line: string, idx: number) => {
                    const clean = line.replace(/^[-•]\s*/, "").trim();
                    if (!clean) return null;
                    return <p key={idx} className={styles.aiSummary}>{clean}</p>;
                  })}
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.authorInfo}>
                  <span className={styles.avatar}>A</span>
                  <div>
                    <b>{article.author_name}</b>
                    <small>{article.author_role}</small>
                  </div>
                </div>
                <Link href={`/blog/${article.slug}`} className={styles.readBtn}>
                  Ler Artigo <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))
        )}
      </section>

      <footer className={styles.footer}>
        <Link href="/" className={styles.wordmark}>
          <span className={styles.brandMark}>L</span> lexora
        </Link>
        <span>© 2026 Lexora · Infraestrutura de Autoridade Digital</span>
      </footer>
    </main>
  );
}
