'use client'

import { useEffect, useState } from 'react'
import { trackLead } from '@/lib/tracking'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5513988658518'

export default function WhatsAppBtn() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre o site para meu escritório.')}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Falar no WhatsApp"
      onClick={() => trackLead('WhatsApp Floating Button')}
    >
      <span className="whatsapp-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M20 11.6a7.8 7.8 0 0 1-11.5 6.9L4 20l1.5-4.2A7.8 7.8 0 1 1 20 11.6Z"></path>
          <path d="M9.2 8.9c.2-.4.4-.4.6-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.5.6c-.1.2-.2.4-.1.6.3.5.8 1.2 1.5 1.9.7.7 1.4 1.2 1.9 1.5.2.1.4.1.6-.1l.6-.5c.2-.1.4-.1.6 0l1.6.7c.3.1.4.3.4.5v.5c0 .2 0 .4-.4.6-.4.2-1 .4-1.7.4-1.4 0-3.1-.9-4.8-2.5-1.6-1.7-2.5-3.4-2.5-4.8 0-.7.2-1.3.4-1.7Z"></path>
        </svg>
      </span>
      <span className="whatsapp-btn__text">WhatsApp</span>
    </a>
  )
}

export function sendToWhatsApp(message: string) {
  trackLead('WhatsApp CTA')
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
