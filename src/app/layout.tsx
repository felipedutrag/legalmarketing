import Script from 'next/script'
import './globals.css'

export const metadata = {
  title: 'LegalMarketing — Estratégia & Alta Performance para Advogados',
  description: 'A plataforma definitiva de posicionamento e captação digital para advogados e escritórios de elite.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-18263949464" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'AW-18263949464');`}
        </Script>
        <Script id="reddit-pixel" strategy="afterInteractive">
          {`!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=a2_jo82q4y3vyus",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','a2_jo82q4y3vyus');rdt('track', 'PageVisit');`}
        </Script>
        <Script id="whatsapp-lead-tracker" strategy="afterInteractive">
          {`
            (function() {
              document.addEventListener('click', function(e) {
                var el = e.target;
                while (el && el !== document) {
                  var isWa = (el.tagName === 'A' && el.href && (el.href.indexOf('wa.me') !== -1 || el.href.indexOf('whatsapp.com') !== -1)) ||
                             (el.classList && el.classList.contains('whatsapp-btn'));
                  if (isWa) {
                    var now = Date.now();
                    if (!window.__lastLeadTrackedTime || (now - window.__lastLeadTrackedTime > 500)) {
                      window.__lastLeadTrackedTime = now;
                      if (typeof window.rdt === 'function') {
                        window.rdt('track', 'Lead');
                      }
                      if (typeof window.gtag === 'function') {
                        window.gtag('event', 'conversion', {
                          'send_to': 'AW-18263949464/25oBCIi71dgcEJiB94RE',
                          'value': 1.0,
                          'currency': 'BRL'
                        });
                        window.gtag('event', 'generate_lead', {
                          'event_category': 'engagement',
                          'event_label': 'WhatsApp Click'
                        });
                      }
                    }
                    break;
                  }
                  el = el.parentNode;
                }
              }, true);
            })();
          `}
        </Script>
      </body>
    </html>
  )
}
