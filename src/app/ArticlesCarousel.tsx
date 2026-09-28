"use client";

import { useRef } from "react";
import Link from "next/link";
import styles from "./ArticlesCarousel.module.css";
import type { Article } from "@/lib/supabase";

type Props = {
  articles: Article[];
};

export default function ArticlesCarousel({ articles }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }

  if (!articles || articles.length === 0) return null;

  return (
    <section className={styles.carouselSection}>
      <div className={styles.sectionHeader}>
        <div>
          <div className={styles.eyebrow}>
            <span /> ACERVO EM DESTAQUE
          </div>
          <h2 className={styles.heading}>
            Modelos de artigos que <em>geram autoridade e clientes.</em>
          </h2>
          <p className={styles.subheading}>
            Veja como a inteligência da Lexora formata cada artigo com síntese executiva e precisão técnica.
          </p>
        </div>

        <div className={styles.navControls}>
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Artigo anterior"
            className={styles.navBtn}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Próximo artigo"
            className={styles.navBtn}
          >
            →
          </button>
        </div>
      </div>

      <div className={styles.carouselTrack} ref={scrollRef}>
        {articles.map((article) => {
          const firstSummaryLine = article.summary_ai
            .split("\n")[0]
            ?.replace(/^[-•]\s*/, "")
            ?.trim();

          return (
            <div key={article.id} className={styles.carouselCard}>
              <div className={styles.cardTop}>
                <span className={styles.areaBadge}>{article.area}</span>
                <span className={styles.readingTime}>{article.reading_time}</span>
              </div>

              <h3 className={styles.cardTitle}>
                <Link href={`/blog/${article.slug}`}>{article.title}</Link>
              </h3>

              <div className={styles.summaryBox}>
                <div className={styles.summaryHeader}>
                  <span className={styles.aiDot} />
                  <span>Síntese Executiva</span>
                </div>
                <p className={styles.summaryText}>{firstSummaryLine}</p>
              </div>

              <div className={styles.cardBottom}>
                <Link href={`/blog/${article.slug}`} className={styles.readLink}>
                  Ler Artigo Completo <span>→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.bottomCtaRow}>
        <Link href="/blog" className={styles.viewAllBtn}>
          Explorar Todo o Acervo de Artigos (Blog) <span>↗</span>
        </Link>
      </div>
    </section>
  );
}
