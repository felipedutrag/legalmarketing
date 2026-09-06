'use client'

import Deck from './components/Deck'
import WhatsAppBtn from './components/WhatsAppBtn'
import EmailPopup from './components/EmailPopup'
import ProgressBar from './components/ProgressBar'
import DarkMode from './components/DarkMode'
import SmoothScroll from './components/SmoothScroll'
import LazyImages from './components/LazyImages'
import { sendToWhatsApp } from './components/WhatsAppBtn'

export default function Home() {
  return (
    <>

      <DarkMode />
      <SmoothScroll />
      <LazyImages />

      <header className="top-header">
        <div className="logo">
          <img src="/assets/logo-legalmarketing.svg" alt="LegalMarketing Logo" className="brand-svg-logo" />
        </div>
        <div className="header-right">
          <span className="header-tag">EXCLUSIVE EDITION</span>
          <a href="javascript:void(0)" className="header-btn" onClick={() => sendToWhatsApp('Olá! Gostaria de solicitar uma prévia gratuita do projeto.')}>FALE CONOSCO</a>
        </div>
      </header>


      <main className="deck-container" id="deck">
        <Deck />
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/assets/logo-legalmarketing.svg" alt="LegalMarketing" className="footer-logo" />
            <p>Estratégia digital para advocacia de elite.</p>
          </div>
          <div className="footer-links">
            <a href="javascript:void(0)" onClick={() => sendToWhatsApp('Olá! Gostaria de saber mais sobre o site para meu escritório.')}>Fale Conosco</a>
            <a href="javascript:void(0)" onClick={() => sendToWhatsApp('Olá! Gostaria de solicitar uma prévia gratuita do projeto.')}>Solicitar Projeto</a>
          </div>
          <div className="footer-bottom">
            <span>&copy; 2026 LegalMarketing. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>

      <WhatsAppBtn />
      <EmailPopup />
    </>
  )
}
