/**
 * Utilitário de tracking unificado para conversões e eventos de Lead
 * Suporta Reddit Pixel (rdt), Google Ads (gtag) e Meta Pixel (fbq).
 */

export function trackLead(label?: string) {
  if (typeof window === 'undefined') return

  // Evita duplo disparo num intervalo menor que 500ms
  const now = Date.now()
  const w = window as any
  if (w.__lastLeadTrackedTime && now - w.__lastLeadTrackedTime < 500) return
  w.__lastLeadTrackedTime = now

  // 1. Reddit Pixel - Lead Event
  try {
    if (typeof (window as any).rdt === 'function') {
      (window as any).rdt('track', 'Lead')
    }
  } catch (err) {
    console.error('[Reddit Pixel] Falha ao rastrear Lead:', err)
  }

  // 2. Google Ads / Tag Manager Conversion
  try {
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', {
        send_to: 'AW-18263949464/25oBCIi71dgcEJiB94RE',
        value: 1.0,
        currency: 'BRL',
      })
      (window as any).gtag('event', 'generate_lead', {
        event_category: 'engagement',
        event_label: label || 'WhatsApp Click',
      })
    }
  } catch (err) {
    console.error('[Google Ads] Falha ao rastrear conversão:', err)
  }

  // 3. Meta Pixel (fallback caso fbq esteja presente)
  try {
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'Lead')
    }
  } catch (err) {}
}
