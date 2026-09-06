'use client'

import React, { useEffect, useRef, useState } from 'react'

// --- COMPONENTE DA BARRA DE PROGRESSO E BULLETS ---
interface ProgressBarProps {
  currentSlide: number
  totalSlides: number
  onSelectSlide: (index: number) => void
}

function ProgressBar({ currentSlide, totalSlides, onSelectSlide }: ProgressBarProps) {
  // Porcentagem continuada baseada no número de slides (ex: slide 0 = 0%, slide 5 = 100%)
  const progressPct = totalSlides > 1 ? (currentSlide / (totalSlides - 1)) * 100 : 0

  return (
    <>
      {/* 1. Barra no Topo da Tela */}
      <div className="progress-bar-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div
          className="progress-bar-fill"
          style={{
            width: `${progressPct}%`,
            height: '4px',
            background: 'linear-gradient(90deg, #d4af37, #fff5c0)',
            transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </div>

      {/* 2. Bullets de Navegação Lateral */}
      <div
        className="deck-bullets"
        style={{
          position: 'fixed',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          zIndex: 100
        }}
      >
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSelectSlide(index)}
            aria-label={`Ir para o slide ${index + 1}`}
            style={{
              width: index === currentSlide ? '10px' : '8px',
              height: index === currentSlide ? '24px' : '8px',
              borderRadius: '999px',
              backgroundColor: index === currentSlide ? '#d4af37' : 'rgba(255, 255, 255, 0.3)',
              boxShadow: index === currentSlide ? '0 0 10px rgba(212, 175, 55, 0.6)' : 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </>
  )
}

// --- COMPONENTE PRINCIPAL DO DECK ---
export default function Deck() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 6
  const isAnimating = useRef(false)
  const lastChange = useRef(0)

  const goToSlide = (index: number) => {
    if (index === currentSlide || isAnimating.current) return
    isAnimating.current = true
    setCurrentSlide(index)
    setTimeout(() => { isAnimating.current = false }, 900)
  }

  const handleWheel = (e: WheelEvent) => {
    const now = Date.now()
    const canGoNext = currentSlide < totalSlides - 1
    const canGoPrev = currentSlide > 0

    if (!canGoNext && e.deltaY > 0) return
    if (!canGoPrev && e.deltaY < 0) return
    if (isAnimating.current) return
    if (now - lastChange.current < 1000) return

    e.preventDefault()

    if (e.deltaY > 15) {
      goToSlide(currentSlide + 1)
      lastChange.current = now
    } else if (e.deltaY < -15) {
      goToSlide(currentSlide - 1)
      lastChange.current = now
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 769) return
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [currentSlide, totalSlides])

  const touchStart = useRef(0)
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 769) return

    const handleTouchStart = (e: TouchEvent) => { touchStart.current = e.touches[0].clientY }
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const diff = touchStart.current - touchEndY
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSlide(currentSlide + 1)
        else goToSlide(currentSlide - 1)
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentSlide])

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 769) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') goToSlide(currentSlide + 1)
      if (e.key === 'ArrowUp' || e.key === 'PageUp') goToSlide(currentSlide - 1)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide])

  const slides = [
    { id: 0, type: 'hero', content: getHeroContent() },
    { id: 1, type: 'engenharia', content: getEngenhariaContent() },
    { id: 2, type: 'personalizacao', content: getPersonalizacaoContent() },
    { id: 3, type: 'planos', content: getPlanosContent() },
    { id: 4, type: 'depoimentos', content: getDepoimentosContent() },
    { id: 5, type: 'cta', content: getCTASlide() },
  ]

  return (
    <>
      {/* Progresso e Bullets integrados ao estado das seções */}
      <ProgressBar
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onSelectSlide={goToSlide}
      />

      {slides.map((slide) => (
        <section
          key={slide.id}
          id={`slide-${slide.id}`}
          className={`slide slide-${slide.id + 1}${slide.id === currentSlide ? ' active' : ''}${slide.id < currentSlide ? ' prev' : ''}`}
        >
          <div className="slide-bg">
            <div className="ambient-glow" />
            <div className="noise-overlay" />
          </div>
          <div className="slide-content">
            {renderSlideContent(slide)}
          </div>
        </section>
      ))}
    </>
  )
}

// --- CONTEÚDOS DE CADA SEÇÃO ---

function getHeroContent() {
  return (
    <>
      <div className="badge-gold">
        <span className="badge-icon">⚡</span>
        PRIMEIRA ENTREGA EM ATÉ 24 HORAS
      </div>
      <h1 className="hero-headline">
        Sua Nova Landing Page de Alta Conversão. <span className="gold-gradient">Você Só Paga Se Aprovar.</span>
      </h1>
      <p className="hero-subtext">
        Apresentamos a prévia visual da sua Landing Page em <strong>até 24 horas</strong>. Você analisa, testa e aprova. <strong>Se não gostar, não paga nada</strong> — sem burocracia ou letras miúdas.
      </p>
      <div className="hero-actions">
        <button className="btn-gold-luxury" onClick={() => sendWhatsApp('Olá! Gostaria de solicitar uma prévia gratuita do projeto.')}>TESTAR SEM COMPROMISSO <span>→</span></button>
      </div>
      <div className="scroll-hint">
        <span>ROLE PARA REVELAR</span>
        <div className="scroll-line" />
      </div>
    </>
  )
}

function getEngenhariaContent() {
  return (
    <>
      <span className="slide-number">01 / 05</span>
      <h2 className="slide-heading">Cada Detalhe Feito para <span className="gold">Converter</span></h2>
      <p className="slide-description">Sua página guia cada visitante até a ação — do clique ao fechamento.</p>
      <div className="split-reveal-wrapper">
        <div className="reveal-text-block">
          <div className="tech-item"><h4><span>01</span> IA Personalizada (opcional)</h4><p>Atendente virtual treinada para o seu nicho — tira dúvidas e agenda consultas 24/7. <strong>Não realiza consultoria jurídica.</strong></p></div>
          <div className="tech-item"><h4><span>02</span> Funil de Vendas Integrado</h4><p>Cada lead mapeado do primeiro clique até o fechamento. Você acompanha toda a jornada do cliente em tempo real.</p></div>
          <div className="tech-item"><h4><span>03</span> Google Ads & Conversão</h4><p>Campanhas integradas com pixel de rastreamento e otimização contínua para maximizar o retorno do seu investimento.</p></div>
        </div>
        <div className="reveal-visual-box">
          <div className="stats-cards-wrapper">
            {[
              { value: 'Design Exclusivo', icon: 'user' as const },
              { value: '< 1s', label: 'Carregamento Ultra Rápido' },
              { value: '24/7', label: 'Atendimento Automático por IA' },
              { value: '100%', label: 'Conformidade Código Ético' },
            ].map((stat, i) => (
              <div key={i} className="gold-box-border">
                <div className="inner-box-content">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{'label' in stat ? stat.label : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function getPersonalizacaoContent() {
  return (
    <>
      <span className="slide-number">02 / 05</span>
      <h2 className="slide-heading">Personalização <span className="gold">sob demanda</span></h2>
      <p className="slide-description">Do layout ao tom de voz, tudo é personalizado.</p>
      <div className="cards-reveal-grid">
        {[
          { title: 'Tipografia & Paleta', desc: 'Fontes, cores e identidade visual desenhadas para refletir a personalidade do seu escritório.', icon: 'typography' as const },
          { title: 'Copywriting Matador', desc: 'Textos jurídicos estratégicos escritos para converter — da headline ao CTA, cada palavra pensada para gerar ação.', icon: 'copy' as const, featured: true },
          { title: 'Design Exclusivo', desc: 'Layout, hierarquia visual e experiência de navegação sob medida para impor autoridade e gerar confiança.', icon: 'design' as const },
        ].map((card, i) => (
          <div key={i} className={`glass-card${card.featured ? ' featured-gold' : ''}`}>
            <div className="card-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 20h16" /><path d="M6 20V9l6-4 6 4v11" /><path d="M10 20v-6h4v6" /></svg></div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </div>
        ))}
      </div>
    </>
  )
}

function getPlanosContent() {
  return (
    <>
      <span className="slide-number">03 / 05</span>
      <h2 className="slide-heading">Planos <span className="gold">sob medida</span></h2>
      <p className="slide-description">Pagamento após a aprovação.</p>
      <div className="deck-pricing-grid">
        <div className="pricing-slide-card">
          <span className="plan-type">INDIVIDUAL</span><h3>Starter</h3>
          <div className="plan-price">R$ 199 <span>/mês</span></div>
          <ul className="plan-list"><li>Landing Page Profissional</li><li>Certificado de Segurança SSL</li><li>Otimização Mobile</li></ul>
          <button className="plan-btn" onClick={() => sendWhatsApp('Olá! Tenho interesse no plano Starter (R$ 199/mês).')}>SELECIONAR</button>
        </div>
        <div className="pricing-slide-card">
          <span className="plan-type">ESCRITÓRIOS</span><h3>Premium</h3>
          <div className="plan-price">R$ 299 <span>/mês</span></div>
          <ul className="plan-list"><li>Tudo do Starter</li><li>Atendimento IA em Tempo Real</li><li>Analytics & Mapa de Calor</li></ul>
          <button className="plan-btn" onClick={() => sendWhatsApp('Olá! Quero assinar o plano Profissional Premium (R$ 299/mês).')}>ASSINAR AGORA</button>
        </div>
        <div className="pricing-slide-card luxury-card">
          <div className="gold-tag">MELHOR OFERTA</div><span className="plan-type">CORPORATIVO</span><h3>Enterprise</h3>
          <div className="plan-price">R$ 990</div>
          <ul className="plan-list"><li>Tudo do Premium</li><li>Landing Page Bônus</li><li className="check-highlight">Sem mensalidade — é seu!</li></ul>
          <button className="plan-btn gold-btn" onClick={() => sendWhatsApp('Olá! Tenho interesse no plano Enterprise vitalício (R$ 990).')}>GARANTIR OFERTA</button>
        </div>
      </div>
    </>
  )
}

function getDepoimentosContent() {
  return (
    <>
      <span className="slide-number">04 / 05</span>
      <h2 className="slide-heading">Depoimentos <span className="gold">Recentes</span></h2>
      <p className="slide-description">Escritórios que já transformaram sua presença digital.</p>
      <div className="testimonials-grid">
        <div className="testimonial-card featured">
          <div className="quote-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg></div>
          <div className="testimonial-rating">{[1, 2, 3, 4, 5].map(n => <svg key={n} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}</div>
          <p className="testimonial-quote">"A percepção de valor dos nossos clientes mudou imediatamente. Nosso portal transmite exatamente a solidez que construímos em 15 anos de advocacia."</p>
          <div className="testimonial-author"><div className="testimonial-avatar"><span>CS</span></div><div className="testimonial-author-info"><strong>Dr. Carlos Eduardo</strong><span>Advocacia Civil</span></div></div>
        </div>
        <div className="testimonial-card">
          <div className="quote-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg></div>
          <div className="testimonial-rating">{[1, 2, 3, 4, 5].map(n => <svg key={n} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}</div>
          <p className="testimonial-quote">"Resultado extraordinário. Em menos de 3 dias nosso site estava no ar e os leads qualificados começaram a chegar."</p>
          <div className="testimonial-author"><div className="testimonial-avatar"><span>AM</span></div><div className="testimonial-author-info"><strong>Dra. Ana</strong><span>Advocacia Empresarial</span></div></div>
        </div>
      </div>
    </>
  )
}

function getCTASlide() {
  return (
    <div className="flex flex-col items-center justify-center text-center w-full">
      <span className="slide-number">05 / 05</span>
      <h2 className="final-heading">Pronto para Converter Leads em <span className="gold">Vendas sem Parar</span>?</h2>
      <p className="final-subtext">Solicite sua página de alta conversão agora mesmo.</p>
      <div className="final-cta-wrapper">
        <button className="btn-gold-luxury xl" onClick={() => sendWhatsApp('Olá! Gostaria de solicitar uma prévia gratuita do projeto.')}>FALAR COM ESPECIALISTA</button>
      </div>
    </div>
  )
}

function renderSlideContent(slide: { id: number; type: string; content: React.ReactNode }) {
  const renderers: Record<number, () => React.ReactNode> = {
    0: getHeroContent,
    1: getEngenhariaContent,
    2: getPersonalizacaoContent,
    3: getPlanosContent,
    4: getDepoimentosContent,
    5: getCTASlide,
  }
  const renderer = renderers[slide.id]
  return renderer ? renderer() : null
}

function sendWhatsApp(message: string) {
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5513988658518'
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // @ts-ignore
    window.gtag('event', 'conversion', { 'send_to': 'AW-18263949464/25oBCIi71dgcEJiB94RE', 'value': 1.0, 'currency': 'BRL' })
  }
}