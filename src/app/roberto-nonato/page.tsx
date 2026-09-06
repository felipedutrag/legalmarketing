'use client'

import { useState } from 'react'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5513988127048'

export default function RobertoNonatoLanding() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  const openWhatsApp = (message: string) => {
    if (typeof window !== 'undefined' && typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-18263949464/25oBCIi71dgcEJiB94RE',
        'value': 1.0,
        'currency': 'BRL',
      })
    }
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  return (
    <>
      {/* --- HEADER FIXO LUXO --- */}
      <header className="top-header">
        <a href="#hero" className="rn-logo-wrapper" aria-label="Dr. Roberto Nonato Advocacia">
          <div className="rn-logo-monogram">RN</div>
          <div className="rn-logo-text">
            <span className="rn-logo-title">ROBERTO NONATO</span>
          </div>
        </a>

        <div className="header-right">
          <button
            onClick={() => openWhatsApp('Olá Dr. Roberto Nonato! Gostaria de agendar uma consulta prioritária.')}
            className="rn-btn-primary rn-header-btn"
          >
            AGENDAR CONSULTA
          </button>
        </div>
      </header>

      <main>
        {/* --- HERO SECTION --- */}
        <section id="hero" className="rn-hero-section">
          <div className="ambient-glow"></div>
          
          <div className="rn-hero-grid">
            <div className="rn-hero-content">
              <div className="rn-hero-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span>Advocacia Especializada</span>
              </div>

              <h1 className="rn-hero-title">
                Defesa Estratégica & Blindagem do Seu <span>Patrimônio e Família</span>
              </h1>

              <p className="rn-hero-desc">
                Atuação jurídica personalizada, rigorosa e de excelência em <strong>Direito Contratual, Imobiliário, Família e Sucessões</strong>. Proteja seus ativos e garanta tranquilidade com atendimento exclusivo.
              </p>

              <div className="rn-hero-buttons">
                <button
                  onClick={() => openWhatsApp('Olá Dr. Roberto Nonato, preciso de orientação jurídica especializada sobre o meu caso.')}
                  className="rn-btn-primary"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  FALAR COM ADVOGADO
                </button>

                <a href="#areas" className="rn-btn-secondary">
                  CONHECER ÁREAS
                </a>
              </div>
            </div>

            {/* VISUAL DA HERO COM RETRATO E EMBLEMAS FLUTUANTES */}
            <div className="rn-hero-visual">
              <div className="rn-portrait-wrapper">
                <img
                  src="/roberto-nonato/roberto-nonato.png"
                  alt="Dr. Roberto Nonato - Advogado Especialista em Direito Contratual, Imobiliário, Família e Sucessões"
                  className="rn-portrait-img"
                />

                <div className="rn-badge-float top-right">
                  <div className="rn-badge-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div className="rn-badge-text">
                    <span className="rn-badge-title">Segurança Jurídica</span>
                    <span className="rn-badge-sub">Blindagem Patrimonial</span>
                  </div>
                </div>

                <div className="rn-badge-float bottom-left">
                  <div className="rn-badge-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 6v6l4 2"></path>
                    </svg>
                  </div>
                  <div className="rn-badge-text">
                    <span className="rn-badge-title">Atendimento Direto</span>
                    <span className="rn-badge-sub">Sigilo Absoluto</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* --- ÁREAS DE ATUAÇÃO (FOCO PRINCIPAL) --- */}
        <section id="areas" className="rn-section">
          <div className="rn-section-header">
            <span className="rn-section-tag">ESPECIALIDADES DE ALTA COMPLEXIDADE</span>
            <h2 className="rn-section-title">Excelência Jurídica Sob Medida Para Você</h2>
            <p className="rn-section-desc">
              Confira as 4 áreas fundamentais em que o escritório do Dr. Roberto Nonato oferece sólida proteção legal e estratégia de alto nível.
            </p>
          </div>

          <div className="rn-areas-grid">
            {/* ÁREA 1: DIREITO CONTRATUAL */}
            <div className="rn-area-card">
              <div className="rn-area-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>

              <h3>Direito Contratual</h3>
              <p>
                Garantia de segurança máxima em negócios jurídicos, impedindo brechas, multas desproporcionais e inadimplemento contratual.
              </p>

              <ul className="rn-area-list">
                <li><span className="check">✓</span> Elaboração e análise minuciosa de contratos civis e comerciais.</li>
                <li><span className="check">✓</span> Revisão e renegociação de cláusulas abusivas ou desequilibradas.</li>
                <li><span className="check">✓</span> Resolução judicial de descumprimento de obrigações e indenizações.</li>
                <li><span className="check">✓</span> Gestão de riscos contratuais prévios à assinatura de negócios.</li>
              </ul>

              <button
                onClick={() => openWhatsApp('Olá Dr. Roberto Nonato, gostaria de consultar sobre Elaboração/Revisão Contratual.')}
                className="rn-area-cta"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                SOLICITAR ANÁLISE DE CONTRATO &rarr;
              </button>
            </div>

            {/* ÁREA 2: DIREITO IMOBILIÁRIO */}
            <div className="rn-area-card">
              <div className="rn-area-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>

              <h3>Direito Imobiliário</h3>
              <p>
                Regularização integral e proteção de imóveis urbanos e rurais, assegurando transações imobiliárias limpas e sem riscos.
              </p>

              <ul className="rn-area-list">
                <li><span className="check">✓</span> Usucapião judicial e extrajudicial diretamente em cartório.</li>
                <li><span className="check">✓</span> Regularização de registros, matrículas e averbações pendentes.</li>
                <li><span className="check">✓</span> Assessoria em Compra, Venda, Permutas e Locações residenciais/comerciais.</li>
                <li><span className="check">✓</span> Ações possessórias, despejos e defesa contra leilões de imóveis.</li>
              </ul>

              <button
                onClick={() => openWhatsApp('Olá Dr. Roberto Nonato, preciso de ajuda com Direito Imobiliário / Usucapião / Registro de Imóvel.')}
                className="rn-area-cta"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                REGULARIZAR MEU IMÓVEL &rarr;
              </button>
            </div>

            {/* ÁREA 3: DIREITO DE FAMÍLIA */}
            <div className="rn-area-card">
              <div className="rn-area-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>

              <h3>Direito de Família</h3>
              <p>
                Condução humanizada e firme de litígios e acordos familiares, zelando pela dignidade, harmonia e segurança financeira.
              </p>

              <ul className="rn-area-list">
                <li><span className="check">✓</span> Divórcio consensual rápido ou litigioso de alta complexidade.</li>
                <li><span className="check">✓</span> Partilha equitativa de bens e busca por patrimônio oculto.</li>
                <li><span className="check">✓</span> Pensão alimentícia (fixação, revisão, exoneração e execução).</li>
                <li><span className="check">✓</span> Regulação de Guarda, Regime de Convivência e Pacto Antenupcial.</li>
              </ul>

              <button
                onClick={() => openWhatsApp('Olá Dr. Roberto Nonato, preciso de orientação jurídica sobre Divórcio / Guarda / Família.')}
                className="rn-area-cta"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                FALAR SOBRE DIREITO DE FAMÍLIA &rarr;
              </button>
            </div>

            {/* ÁREA 4: DIREITO SUCESSÓRIO & HOLDING */}
            <div className="rn-area-card">
              <div className="rn-area-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>

              <h3>Direito Sucessório & Holding</h3>
              <p>
                Planejamento patrimonial avançado para transferir bens para as próximas gerações sem brigas familiares e com economia fiscal.
              </p>

              <ul className="rn-area-list">
                <li><span className="check">✓</span> Inventários rápidos em cartório (Extrajudicial) e judiciais.</li>
                <li><span className="check">✓</span> Holding Familiar para proteção de bens e redução de tributos (ITCMD).</li>
                <li><span className="check">✓</span> Elaboração estratégica de Testamentos e Doações com Usufruto.</li>
                <li><span className="check">✓</span> Planejamento Sucessório preventivo para famílias e empresários.</li>
              </ul>

              <button
                onClick={() => openWhatsApp('Olá Dr. Roberto Nonato, gostaria de informações sobre Inventário / Planejamento Sucessório.')}
                className="rn-area-cta"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                CONSULTAR PLANEJAMENTO SUCESSÓRIO &rarr;
              </button>
            </div>
          </div>
        </section>

        {/* --- SOBRE O ADVOGADO & ESTRUTURA --- */}
        <section id="sobre" className="rn-about-section">
          <div className="rn-about-grid">
            <div className="rn-about-images">
              <div className="rn-about-img-box rn-hide-mobile">
                <img
                  src="/roberto-nonato/roberto-nonato.png"
                  alt="Dr. Roberto Nonato em seu escritório elaborando documentos contratuais e jurídicos"
                />
              </div>
              <div className="rn-about-img-box tall">
                <img
                  src="/roberto-nonato/escritorio-recepcao.png"
                  alt="Recepção moderna e acolhedora do escritório de advocacia do Dr. Roberto Nonato"
                />
              </div>
            </div>

            <div className="rn-about-content">
              <span className="rn-section-tag">ADVOGADO TITULAR</span>
              <h2>Compromisso com a Verdade, Rigor Técnico e Ética Irrestrita</h2>
              
              <p>
                Com vasta trajetória na advocacia técnica e estratégica, o <strong>Dr. Roberto Nonato</strong> consolidou sua atuação na solução rigorosa de demandas envolvendo patrimônio, negócios imobiliários e conflitos familiares.
              </p>

              <p>
                Compreendendo que por trás de cada contrato, imóvel ou processo de inventário existe a história e a tranquilidade de uma vida, o atendimento é estruturado na escuta atenta, na confidencialidade absoluta e em soluções céleres que priorizam acordos vantajosos e a proteção dos interesses do cliente.
              </p>

              <div className="rn-pillars-grid">
                <div className="rn-pillar-card">
                  <h4>Atendimento Personalizado</h4>
                  <p>Contato direto com o advogado titular em todas as fases da sua demanda.</p>
                </div>
                <div className="rn-pillar-card">
                  <h4>Transparência Completa</h4>
                  <p>Explicação clara do cenário jurídico sem juridiquês inacessível.</p>
                </div>
                <div className="rn-pillar-card">
                  <h4>Agilidade Extrajudicial</h4>
                  <p>Soluções em cartório para economizar tempo e custos desnecessários.</p>
                </div>
                <div className="rn-pillar-card">
                  <h4>Blindagem de Ativos</h4>
                  <p>Estratégia jurídica desenhada para resguardar o patrimônio da família.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- DIFERENCIAIS ESTRATÉGICOS --- */}
        <section className="rn-section">
          <div className="rn-section-header">
            <span className="rn-section-tag">POR QUE ESCOLHER O DR. ROBERTO NONATO</span>
            <h2 className="rn-section-title">Diferenciais Que Garantem Sua Tranquilidade</h2>
          </div>

          <div className="rn-diff-grid">
            <div className="rn-diff-card">
              <div className="rn-diff-num">01</div>
              <h3>Análise Preventiva</h3>
              <p>Identificamos riscos contratuais e imobiliários antes que eles se transformem em prejuízos irreparáveis.</p>
            </div>

            <div className="rn-diff-card">
              <div className="rn-diff-num">02</div>
              <h3>Sigilo & Ética</h3>
              <p>Tratamento absolutamente discreto de dados sensíveis e conflitos de divórcio e partilha patrimonial.</p>
            </div>

            <div className="rn-diff-card">
              <div className="rn-diff-num">03</div>
              <h3>Foco em Acordos</h3>
              <p>Busca prioritária pela via consensual, reduzindo o desgaste emocional e acelerando a solução.</p>
            </div>

            <div className="rn-diff-card">
              <div className="rn-diff-num">04</div>
              <h3>Combate à Burocracia</h3>
              <p>Domínio pleno de trâmites cartorários para solucionar inventários e regularizações com máxima celeridade.</p>
            </div>
          </div>
        </section>



        {/* --- FAQ INTERATIVO --- */}
        <section id="faq" className="rn-section" style={{ background: 'rgba(11, 14, 23, 0.75)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="rn-section-header">
            <span className="rn-section-tag">TIRE SUAS DÚVIDAS</span>
            <h2 className="rn-section-title">Perguntas Frequentes</h2>
            <p className="rn-section-desc">
              Respostas claras para as principais dúvidas sobre inventários, imóveis, contratos e divórcios.
            </p>
          </div>

          <div className="rn-faq-container">
            <div className={`rn-faq-item ${activeFaq === 0 ? 'active' : ''}`}>
              <button className="rn-faq-question" onClick={() => toggleFaq(0)}>
                <span>Qual a vantagem do Inventário Extrajudicial em Cartório?</span>
                <span className="rn-faq-icon">+</span>
              </button>
              {activeFaq === 0 && (
                <div className="rn-faq-answer">
                  O inventário em cartório é incomparavelmente mais rápido (muitas vezes concluído em poucas semanas) e menos dispendioso que o judicial. Ele exige a concordância entre os herdeiros maiores e capazes, além da representação por um advogado especialista.
                </div>
              )}
            </div>

            <div className={`rn-faq-item ${activeFaq === 1 ? 'active' : ''}`}>
              <button className="rn-faq-question" onClick={() => toggleFaq(1)}>
                <span>Como funciona a regularização de imóvel por Usucapião?</span>
                <span className="rn-faq-icon">+</span>
              </button>
              {activeFaq === 1 && (
                <div className="rn-faq-answer">
                  A usucapião permite que o possuidor de um imóvel que preencha os requisitos de tempo (posse mansa, pacífica e contínua) obtenha a propriedade formal com registro em cartório. Hoje é possível realizar o procedimento diretamente em Cartório de Registro de Imóveis (extrajudicial).
                </div>
              )}
            </div>

            <div className={`rn-faq-item ${activeFaq === 2 ? 'active' : ''}`}>
              <button className="rn-faq-question" onClick={() => toggleFaq(2)}>
                <span>Por que é perigoso utilizar modelos prontos de contrato da internet?</span>
                <span className="rn-faq-icon">+</span>
              </button>
              {activeFaq === 2 && (
                <div className="rn-faq-answer">
                  Modelos genéricos não preveem as especificidades da sua negociação, nem cobrem brechas legais que podem anular cláusulas inteiras ou deixar você desprotegido em caso de inadimplência, penalidades ou disputas judiciais.
                </div>
              )}
            </div>

            <div className={`rn-faq-item ${activeFaq === 3 ? 'active' : ''}`}>
              <button className="rn-faq-question" onClick={() => toggleFaq(3)}>
                <span>Como é feita a partilha de bens no divórcio?</span>
                <span className="rn-faq-icon">+</span>
              </button>
              {activeFaq === 3 && (
                <div className="rn-faq-answer">
                  A partilha depende do regime de bens adotado no casamento (Comunhão Parcial, Comunhão Universal ou Separação Total). Analisamos minuciosamente todas as aquisições, investimentos e passivos para garantir uma divisão equitativa e proteger o patrimônio individual.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* --- BANNER CTA FINAL --- */}
        <section id="contato" className="rn-section" style={{ paddingTop: '40px', paddingBottom: '120px' }}>
          <div className="rn-cta-box">
            <h2 className="rn-cta-title">Garanta a Proteção Jurídica Que Seu Patrimônio Exige</h2>
            <p className="rn-cta-desc">
              Não deixe decisões críticas e contratos para depois. Agende uma conversa direta com o Dr. Roberto Nonato e obtenha uma análise técnica completa e sigilosa do seu caso.
            </p>
            
            <button
              onClick={() => openWhatsApp('Olá Dr. Roberto Nonato! Gostaria de agendar um atendimento prioritário para avaliar meu caso.')}
              className="rn-btn-primary"
              style={{ fontSize: '1rem', padding: '18px 44px' }}
            >
              FALAR COM ADVOGADO
            </button>
          </div>
        </section>
      </main>

      {/* --- FOOTER ELEGANTE --- */}
      <footer className="site-footer" style={{ display: 'block' }}>
        <div className="footer-content" style={{ textAlign: 'center', alignItems: 'center' }}>
          <div className="footer-brand" style={{ alignItems: 'center' }}>
            <div className="rn-logo-wrapper" style={{ marginBottom: '10px', justifyContent: 'center' }}>
              <div className="rn-logo-monogram">RN</div>
              <div className="rn-logo-text">
                <span className="rn-logo-title">ROBERTO NONATO</span>
              </div>
            </div>
            <p>Advocacia técnica, ética e de alta precisão em Direito Contratual, Imobiliário, Família e Sucessões.</p>
          </div>

          <div className="footer-bottom" style={{ justifyContent: 'center', width: '100%', textAlign: 'center' }}>
            <span>&copy; {new Date().getFullYear()} Dr. Roberto Nonato Advocacia. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>

      {/* --- FLUTUANTE WHATSAPP --- */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá Dr. Roberto Nonato! Gostaria de agendar uma consulta jurídica.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-btn"
        aria-label="Falar com Dr. Roberto Nonato no WhatsApp"
      >
        <span className="whatsapp-btn__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M20 11.6a7.8 7.8 0 0 1-11.5 6.9L4 20l1.5-4.2A7.8 7.8 0 1 1 20 11.6Z"></path>
            <path d="M9.2 8.9c.2-.4.4-.4.6-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.5.6c-.1.2-.2.4-.1.6.3.5.8 1.2 1.5 1.9.7.7 1.4 1.2 1.9 1.5.2.1.4.1.6-.1l.6-.5c.2-.1.4-.1.6 0l1.6.7c.3.1.4.3.4.5v.5c0 .2 0 .4-.4.6-.4.2-1 .4-1.7.4-1.4 0-3.1-.9-4.8-2.5-1.6-1.7-2.5-3.4-2.5-4.8 0-.7.2-1.3.4-1.7Z"></path>
          </svg>
        </span>
        <span className="whatsapp-btn__text">Falar com Dr. Roberto</span>
      </a>
    </>
  )
}
