import type { Metadata } from "next";
import styles from "./page.module.css";
import WhatsappButton from "./WhatsappButton";
import ArticlesCarousel from "./ArticlesCarousel";
import { supabase, type Article } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Lexora — Infraestrutura de Citação e Autoridade Jurídica no Google e IAs",
  description:
    "Construa patrimônio digital para seu escritório. Artigos jurídicos de alto calibre baseados nas buscas do seu cliente, otimizados para Google e IAs, sob estrita conformidade ética da OAB.",
};

export const revalidate = 60;

const steps = [
  {
    number: "01",
    title: "Mapeamento da Tese e Linha Editorial",
    description:
      "Definimos o nicho de alta rentabilidade do seu escritório, a região e o tom de voz sóbrio. A inteligência opera sobre a doutrina e a realidade da sua advocacia, sem respostas genéricas.",
  },
  {
    number: "02",
    title: "Mineração de Dúvidas Reais (Intenção de Contratação)",
    description:
      "A Lexora identifica exatamente o que clientes com problemas jurídicos concretos estão digitando no Google e nas IAs. Dúvidas com real potencial de honorários viram pautas estratégicas.",
  },
  {
    number: "03",
    title: "Crivo Total: Edite, Autorize ou Peça Nova Revisão",
    description:
      "A IA prepara o rascunho técnico fundamentado. Você tem controle absoluto: pode editar o texto diretamente, autorizar a publicação imediata com 1 clique ou pedir para a IA revisar com novos apontamentos jurídicos seus.",
  },
];

const faqs = [
  {
    question: "Como funciona a entrega em 48h e o pagamento após aprovação?",
    answer:
      "Você não paga nada antecipadamente. Nós coletamos a área e os temas do seu escritório, montamos o site institucional com o blog integrado e os primeiros artigos técnicos prontos em até 48 horas. Você recebe o link privado para auditar. Se o padrão técnico e estético estiver à altura do seu escritório, você ativa o plano mensal sem fidelidade. Se não gostar, custo zero absoluto.",
  },
  {
    question: "Isso fere o Código de Ética e o Provimento 205/2021 da OAB?",
    answer:
      "Absolutamente não. A publicidade jurídica sóbria e informativa é expressamente permitida e recomendada pela OAB. Ao contrário do conteúdo apelativo em redes sociais, o acervo de artigos responde a dúvidas legítimas de quem já está procurando orientação jurídica ativa.",
  },
  {
    question: "Qual a diferença entre isso e contratar uma agência tradicional de SEO?",
    answer:
      "Agências tradicionais cobram entre R$ 3.000 e R$ 6.000 por mês, exigem contratos longos de fidelidade e não entendem a linguagem jurídica. A Lexora é uma infraestrutura ágil, especializada no mercado jurídico, sem fidelidade e por uma fração do custo.",
  },
  {
    question: "O que é GEO (Otimização para Inteligência Artificial)?",
    answer:
      "GEO (Generative Engine Optimization) é a estruturação semântica do seu site para que motores de IA (ChatGPT, Google Gemini, Perplexity) identifiquem seu escritório como a fonte mais confiável e citem seus advogados ao responderem perguntas jurídicas de usuários na sua região.",
  },
  {
    question: "Preciso ter conhecimento de programação ou passar horas escrevendo?",
    answer:
      "Zero código e zero esforço técnico. O site é entregue pronto, hospedado e integrado. O rascunho estruturado já vem preparado; seu trabalho é apenas ler e dar o crivo final do advogado para assegurar a precisão jurídica.",
  },
  {
    question: "Como funciona o cancelamento?",
    answer:
      "Liberdade total e sem pegadinhas. Não exigimos fidelidade nem multas rescisórias. Se decidir encerrar a assinatura, todo o acervo e o conteúdo dos artigos continuam sendo propriedade intelectual do seu escritório.",
  },
];

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default async function Home() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Erro ao buscar artigos para a Home:", error);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.wordmark} href="#inicio" aria-label="Lexora, início">
          <span className={styles.brandMark}>L</span> lexora
        </a>
        <nav className={styles.nav} aria-label="Navegação principal">
          <a href="#comparacao">Redes vs. Acervo</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="/blog">Ver Acervo (Blog)</a>
          <a href="#contato">Falar Conosco</a>
        </nav>
        <WhatsappButton className={styles.headerCta}>Fale pelo WhatsApp <ArrowIcon /></WhatsappButton>
      </header>

      <section className={styles.hero} id="inicio">
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span /> INFRAESTRUTURA DE AUTORIDADE JURÍDICA (GEO & SEO)</div>
          <h1>Advocacia constrói autoridade com reputação. <em>Não disputando atenção no feed.</em></h1>
          <p className={styles.heroText}>
            Enquanto o algoritmo das redes devora seu tempo em troca de visualizações vazias, a <strong>Lexora</strong> constrói o patrimônio do seu escritório: um site institucional de alto nível e um acervo de artigos técnicos para você ser a resposta definitiva no Google e em ferramentas de IA.
          </p>

          <div className={styles.logicBox}>
            <div className={styles.logicCol}>
              <span className={styles.logicTag}>O CIRCO DAS REDES</span>
              <p>Gravar vídeos todo dia, disputar curtidas com entretenimento e ver seu esforço sumir em 24 horas.</p>
            </div>
            <div className={styles.logicColHighlight}>
              <span className={styles.logicTagGreen}>PATRIMÔNIO DIGITAL PERMANENTE</span>
              <p>Responder dúvidas reais de quem precisa contratar um advogado e ser indexado no topo do Google e do ChatGPT.</p>
            </div>
          </div>

          <div className={styles.heroActions}>
            <WhatsappButton className={styles.buttonPrimary}>Receber Minha Demonstração em 48h <ArrowIcon /></WhatsappButton>
            <span className={styles.noContract}>Pague somente após aprovar{/* · R$ 490/mês */}</span>
          </div>
          <div className={styles.trustLine}><span className={styles.check}>✓</span> Entregamos seu site pronto em até 48h. Você só paga se aprovar.</div>
        </div>

        <div className={styles.heroVisual} aria-label="Prévia de artigo jurídico e pauta sugerida por inteligência artificial">
          <div className={styles.visualGlow} />
          <div className={styles.browserCard}>
            <div className={styles.browserTop}><div className={styles.dots}><i /><i /><i /></div><span>seuescritorio.com.br/artigos</span><span className={styles.lock}>⌑</span></div>
            <div className={styles.articlePreview}>
              <div className={styles.articleKicker}>DIREITO TRIBUTÁRIO & EMPRESARIAL <span>· ARTIGO TÉCNICO</span></div>
              <h3>Exclusão do ICMS na base do PIS/COFINS: quem tem direito à restituição?</h3>
              <p>Entenda os critérios de modulação do STF, os prazos prescricionais e as estratégias de recuperação para empresas.</p>
              <div className={styles.articleRule} />
              <div className={styles.articleByline}><span className={styles.avatar}>A</span><span><b>Seu Escritório de Advocacia</b><small>Revisado e assinado pelo advogado</small></span><a href="/blog/exclusao-icms-pis-cofins-restituicao" className={styles.readMore}>Ler artigo →</a></div>
            </div>
          </div>
          <div className={styles.editorCard}>
            <div className={styles.editorHeader}><span className={styles.sparkle}>✳</span><span><b>Minuta Jurídica Gerada por IA</b><small>Aguardando seu crivo editorial</small></span><span className={styles.pulse} /></div>
            <p>“Exclusão do ICMS na base do PIS/COFINS e critérios de modulação pelo STF...”</p>
            <div className={styles.editorActions}>
              <button type="button" className={styles.actionBtnApprove}>✓ Autorizar</button>
              <button type="button" className={styles.actionBtnEdit}>✎ Editar</button>
              <button type="button" className={styles.actionBtnRevision}>↻ Pedir Revisão</button>
            </div>
            <div className={styles.editorFooter}><span>Controle total: nada vai ao ar sem seu aval</span><span className={styles.reviewChip}>CRIVO 100% SEU</span></div>
          </div>
          <div className={styles.floatNote}><span>↗</span> Risco zero: veja pronto antes de pagar</div>
        </div>
        <div className={styles.heroBottom}><span>SEU SITE E BLOG PRONTOS EM 48H</span><div /><span>PAGUE SOMENTE SE APROVAR O PADRÃO</span></div>
      </section>

      <section className={styles.comparison} id="comparacao">
        <div className={styles.sectionHeading}>
          <div className={styles.eyebrow}>ALUGUEL DE ATENÇÃO VS. PROPRIEDADE INTELECTUAL</div>
          <h2>Redes sociais cobram pedágio diário. <em>O acervo próprio constrói valor cumulativo.</em></h2>
          <p>Nas redes, seu conteúdo morre no dia seguinte. Na busca orgânica e nas IAs, cada artigo publicado é um ativo perpétuo que trabalha pelo nome do seu escritório 24 horas por dia.</p>
        </div>
        <div className={styles.compareGrid}>
          <article className={styles.compareCard}>
            <div className={`${styles.channelIcon} ${styles.instagramIcon}`}>◎</div><div className={styles.channelLabel}>O MOINHO DAS REDES</div>
            <h3>Ansiedade e Efemeridade</h3>
            <p>Você passa horas pensando em roteiro, gravando e editando vídeos para falar com curiosos. O algoritmo enterra o post no dia seguinte e exige nova produção.</p>
            <div className={styles.timeline}><span className={styles.timelineLabel}>CICLO</span><div className={styles.fadingLine} /><span className={styles.timelineCaption}>Gravar · postar · sumir em 24h</span></div>
          </article>
          <div className={styles.versus}>VS</div>
          <article className={`${styles.compareCard} ${styles.searchCard}`}>
            <div className={`${styles.channelIcon} ${styles.searchIcon}`}>⌕</div><div className={styles.channelLabel}>INFRAESTRUTURA LEXORA (GOOGLE + IA)</div>
            <h3>Autoridade Cumulativa</h3>
            <p>Seus artigos respondem dúvidas pontuais de quem já tem um problema jurídico urgente e busca solução imediata. Cada artigo fortalece a reputação do seu escritório.</p>
            <div className={styles.timeline}><span className={styles.timelineLabel}>PATRIMÔNIO</span><div className={styles.longLine} /><span className={styles.timelineCaption}>Um acervo que ganha relevância com o tempo</span></div>
          </article>
        </div>
        <p className={styles.comparisonFootnote}>Não gaste seu tempo fazendo o papel de produtor de vídeo amador. Deixe que a inteligência de busca trabalhe pelo seu escritório.</p>
      </section>

      <section className={styles.aiSection}>
        <div className={styles.aiGrid}>
          <div className={styles.aiCopy}>
            <div className={styles.eyebrow}><span /> A JANELA DE OPORTUNIDADE: GEO (GENERATIVE ENGINE OPTIMIZATION)</div>
            <h2>Lembre-se dos escritórios que dominaram o Google no início. <em>A história está se repetindo com a IA.</em></h2>
            <p>Nos anos 2000, quem construiu os primeiros sites e artigos jurídicos consolidou posições que até hoje geram clientes no piloto automático. Anos depois, tentar superá-los ficou quase impossível.</p>
            <p><strong>A mesma revolução está acontecendo agora com motores de IA (ChatGPT, Perplexity e Google AI Overviews).</strong> Milhões de pessoas já tiram dúvidas jurídicas com IA antes de contratar. As inteligências artificiais precisam citar fontes reais e respeitadas.</p>
            <p>Hoje, praticamente nenhum escritório está estruturado para isso. Quem construir esse acervo técnico agora vai fincar a bandeira como a principal referência da sua área antes que a concorrência acorde.</p>
            <a className={styles.textLink} href="#como-funciona">Garantir a liderança do seu escritório <ArrowIcon /></a>
          </div>
          <div className={styles.aiDiagram}>
            <div className={styles.diagramTop}><span className={styles.diagramDot} /> DO PROBLEMA JURÍDICO AO CONTATO NO ESCRITÓRIO</div>
            <div className={styles.flowItem}><span className={styles.flowIcon}>?</span><span><b>Cliente pesquisa uma dor jurídica</b><small>“Minha empresa pode recuperar ICMS retido indevidamente?”</small></span><span className={styles.flowArrow}>→</span></div>
            <div className={styles.flowItem}><span className={styles.flowIcon}>✳</span><span><b>A Lexora estrutura a resposta técnica</b><small>Otimizada para indexação do Google e leitura de IAs</small></span><span className={styles.flowArrow}>→</span></div>
            <div className={styles.flowItem}><span className={styles.flowIcon}>✓</span><span><b>Você dá o aval jurídico em 5 minutos</b><small>Precisão doutrinária e identidade do seu escritório</small></span><span className={styles.flowArrow}>→</span></div>
            <div className={styles.flowItem}><span className={styles.flowIcon}>⌕</span><span><b>Seu escritório vira fonte de autoridade</b><small>Citado pelos motores de busca com link para contato</small></span></div>
            <div className={styles.diagramBottom}><span>GOOGLE · CHATGPT · PERPLEXITY · SITE DO ESCRITÓRIO</span><div className={styles.growthBars}><i /><i /><i /><i /><i /><i /></div></div>
          </div>
        </div>
      </section>

      <section className={styles.process} id="como-funciona">
        <div className={styles.sectionHeading}>
          <div className={styles.eyebrow}>PROCESSO SEM RISCO E SEM ESFORÇO</div>
          <h2>Como estruturamos tudo em 48 horas <em>sem você pagar nada antes.</em></h2>
          <p>Você não assume nenhum risco financeiro. Nós fazemos o trabalho pesado primeiro; você só decide pagar depois de ver o resultado funcionando.</p>
        </div>
        <div className={styles.steps}>
          {steps.map((step) => <article className={styles.step} key={step.number}><span className={styles.stepNumber}>{step.number}</span><div className={styles.stepLine} /><h3>{step.title}</h3><p>{step.description}</p></article>)}
        </div>
        <div className={styles.feedbackLoop}><span>VOCÊ ENVIA O NICHO</span><b>→</b><span>MONTAMOS EM 48H</span><b>→</b><span>VOCÊ AVALIA SEM CUSTO</span><b>→</b><span>SÓ PAGA SE APROVAR</span><b className={styles.loopIcon}>✓</b></div>
        <p className={styles.privacyNote}>Segurança e discrição absolutas: nunca expomos dados de clientes, processos em andamento ou matérias sigilosas.</p>
      </section>

      {/*
      <section className={styles.offer} id="plano">
        <div className={styles.offerInner}>
          <div className={styles.offerCopy}>
            <div className={styles.eyebrow}><span /> PROPOSTA DE RISCO ZERO ABSOLUTO</div>
            <h2>Nós entregamos tudo pronto em 48h. <em>Você só paga se aprovar.</em></h2>
            <p>Confiamos tanto no rigor técnico da nossa infraestrutura que invertemos o risco: nós montamos o seu site institucional e os primeiros artigos técnicos. Se você não gostar do resultado, não nos deve nem um centavo.</p>
            <div className={styles.offerChecks}><span>✓</span> Entrega em 48h sem adiantamento <span>✓</span> 100% de acordo com o Provimento OAB <span>✓</span> Cancele quando quiser sem multa</div>
          </div>
          <div className={styles.priceCard}>
            <div className={styles.planBadge}>RISCO ZERO · 48H</div>
            <div className={styles.planTag}>INFRAESTRUTURA COMPLETA</div>
            <p className={styles.priceIntro}>Primeiro você confere a entrega no ar, depois decide ativar.</p>
            <ul><li>Site institucional exclusivo com blog integrado</li><li>Artigos assistidos por IA e treinados no seu nicho</li><li>Pautas mineradas a partir de buscas reais de clientes</li><li>Indexação semântica para Google e citação em IAs (GEO)</li><li>Entrega completa em até 48 horas</li><li>Hospedagem rápida, SSL e suporte contínuo</li></ul>
            <WhatsappButton className={styles.buttonPrimary}>Pedir Minha Demonstração em 48h <ArrowIcon /></WhatsappButton>
            <div className={styles.cancelNote}>Sem cobrança antecipada. Você avalia o site no ar antes de fechar.</div>
          </div>
        </div>
      </section>
      */}

      <section className={styles.ctaSection} id="contato">
        <div className={styles.ctaCard}>
          <div className={styles.ctaGlow} />
          <div className={styles.eyebrow}><span /> AUTORIDADE E RESULTADO IMEDIATO</div>
          <h2>Pronto para posicionar seu escritório no topo das buscas e das IAs?</h2>
          <p>
            Converse diretamente com nossos especialistas. Mapeamos seu nicho de atuação e desenhamos a estrutura sob medida para a reputação e o crescimento dos seus advogados.
          </p>
          <div className={styles.ctaActions}>
            <WhatsappButton className={styles.ctaButtonLarge}>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M20.52 3.48A11.87 11.87 0 0 0 12.07 0C5.5 0 .15 5.34.15 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.78 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.17-3.47-8.42ZM12.07 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.73.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.52-5.26c0-5.47 4.45-9.92 9.93-9.92a9.86 9.86 0 0 1 7.02 2.91 9.86 9.86 0 0 1 2.9 7.02c0 5.47-4.45 9.92-9.93 9.92Zm5.45-7.43c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.44-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.06 2.88 1.2 3.08c.15.2 2.09 3.19 5.06 4.47.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
              </svg>
              <span>Conversar pelo WhatsApp com Especialista</span>
              <ArrowIcon />
            </WhatsappButton>
          </div>
          <div className={styles.ctaTrust}>
            <span>✓ Atendimento direto e confidencial</span>
            <span>✓ 100% em conformidade com o Provimento 205/2021 da OAB</span>
            <span>✓ Sem compromisso ou taxas antecipadas</span>
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.faqHeading}><div className={styles.eyebrow}>SEGURANÇA JURÍDICA E COMERCIAL</div><h2>Respostas diretas para <em>profissionais exigentes.</em></h2></div>
        <div className={styles.faqList}>{faqs.map((faq) => <details className={styles.faq} key={faq.question}><summary>{faq.question}<span>+</span></summary><p>{faq.answer}</p></details>)}</div>
      </section>

      <footer className={styles.footer}>
        <a className={styles.wordmark} href="#inicio"><span className={styles.brandMark}>L</span> lexora</a>
        <span>© 2026 Lexora · Presença digital com consistência</span>
      </footer>
      <WhatsappButton className={styles.whatsappFloating} floating>
        <span>Fale pelo WhatsApp</span>
      </WhatsappButton>
    </main>
  );
}
