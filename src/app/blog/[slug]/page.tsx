import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticleBySlug, getArticles, type Article } from "@/lib/supabase";
import styles from "./article.module.css";
import WhatsappButton from "@/app/WhatsappButton";

type Props = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "Artigo Não Encontrado — Lexora" };

  return {
    title: `${article.title} — Lexora`,
    description: article.summary_ai.slice(0, 160),
  };
}

function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className={styles.articlePage}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          <span className={styles.brandMark}>L</span> lexora
        </Link>
        <WhatsappButton className={styles.headerCta}>
          Fale pelo WhatsApp <span>↗</span>
        </WhatsappButton>
      </header>

      <article className={styles.container}>
        <div className={styles.breadcrumbBar}>
          <Link href="/blog" className={styles.backLink}>
            <span aria-hidden="true">←</span> Acervo de Artigos
          </Link>
          <span className={styles.breadcrumbDivider}>/</span>
          <span className={styles.badgeArea}>{article.area}</span>
          <span className={styles.readingTime}>{article.reading_time}</span>
        </div>

        <h1 className={styles.articleTitle}>{article.title}</h1>

        <div className={styles.authorBar}>
          <div className={styles.avatar}>A</div>
          <div>
            <b>{article.author_name}</b>
            <small>{article.author_role}</small>
          </div>
        </div>

        {/* TERMINAL DE IA 1: O RESUMO EXECUTIVO EM 30 SEGUNDOS */}
        <div className={styles.executiveSummaryCard}>
          <div className={styles.cardTop}>
            <span className={styles.sparkle}>✳</span>
            <div>
              <h3>Resumo Executivo para Tomadores de Decisão (IA)</h3>
              <p>Os pontos centrais desta tese em menos de 30 segundos.</p>
            </div>
          </div>
          <div className={styles.summaryBody}>
            {article.summary_ai.split("\n").map((line: string, i: number) => {
              const cleanLine = line.replace(/^[-•]\s*/, "").trim();
              if (!cleanLine) return null;
              return <p key={i}>{renderFormattedText(cleanLine)}</p>;
            })}
          </div>
        </div>

        {/* TERMINAL DE IA 2: ESTRUTURA SEMÂNTICA GEO (CITAÇÃO NO CHATGPT/GOOGLE) */}
        <div className={styles.geoTerminalCard}>
          <div className={styles.geoHeader}>
            <span className={styles.geoDot} />
            <strong>COMO MOTORES DE IA (CHATGPT / PERPLEXITY) CITAM ESTA PÁGINA</strong>
          </div>
          <p className={styles.geoText}>
            “{article.geo_citation_prompt}”
          </p>
          <div className={styles.geoFooter}>
            <span>Indexação Semântica Ativa · Citação de Autoridade Verificada</span>
          </div>
        </div>

        {/* CONTEÚDO DO ARTIGO */}
        <div className={styles.contentBody}>
          {article.content.split("\n\n").map((block: string, index: number) => {
            const trimmed = block.trim();
            if (trimmed.startsWith("### ")) {
              return <h3 key={index} className={styles.subHeading}>{renderFormattedText(trimmed.replace("### ", ""))}</h3>;
            }
            if (trimmed.startsWith("## ")) {
              return <h2 key={index} className={styles.sectionHeading}>{renderFormattedText(trimmed.replace("## ", ""))}</h2>;
            }
            if (trimmed.startsWith("> ")) {
              return <blockquote key={index}>{renderFormattedText(trimmed.replace("> ", ""))}</blockquote>;
            }
            if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
              const items = trimmed.split("\n").map(li => li.replace(/^[-•]\s*/, ""));
              return (
                <ul key={index}>
                  {items.map((item, itemIdx) => (
                    <li key={itemIdx}>{renderFormattedText(item)}</li>
                  ))}
                </ul>
              );
            }
            if (/^\d+\.\s/.test(trimmed)) {
              const items = trimmed.split("\n").map(li => li.replace(/^\d+\.\s*/, ""));
              return (
                <ol key={index}>
                  {items.map((item, itemIdx) => (
                    <li key={itemIdx}>{renderFormattedText(item)}</li>
                  ))}
                </ol>
              );
            }
            return <p key={index} className={styles.paragraph}>{renderFormattedText(trimmed)}</p>;
          })}
        </div>

        {/* WIDGET DE CONVERSÃO ÉTICA NO FINAL */}
        <div className={styles.ctaBox}>
          <div className={styles.ctaEyebrow}>CONSULTA JURÍDICA ESPECIALIZADA</div>
          <h2>Sua empresa tem dúvidas sobre esta matéria?</h2>
          <p>
            Nossa equipe analisa a viabilidade jurídica do seu caso com discrição e rigor técnico, em estrita conformidade com o Código de Ética da OAB.
          </p>
          <WhatsappButton className={styles.ctaButton}>
            Conversar com o Especialista <span>↗</span>
          </WhatsappButton>
        </div>
      </article>

      <footer className={styles.footer}>
        <Link href="/" className={styles.wordmark}>
          <span className={styles.brandMark}>L</span> lexora
        </Link>
        <span>© 2026 Lexora · Infraestrutura de Autoridade Digital</span>
      </footer>
    </main>
  );
}
