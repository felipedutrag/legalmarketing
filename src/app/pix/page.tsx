'use client'

import { useState } from 'react'

export default function PixPage() {
  const code = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('code') || ''
    : ''
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1222', padding: 24 }}>
      <div style={{ maxWidth: 520, width: '100%', background: '#1a1f38', borderRadius: 16, padding: 32, color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
        <h1 style={{ fontSize: 24, margin: '0 0 8px' }}>PIX Copia e Cola</h1>
        <p style={{ color: '#9aa1c0', margin: '0 0 20px', fontSize: 14 }}>Use o botão abaixo para copiar o código PIX e concluir seu pagamento.</p>

        <div style={{ background: '#0f1222', borderRadius: 8, padding: 16, fontSize: 12, lineHeight: 1.6, wordBreak: 'break-all', color: '#c6cbe4', marginBottom: 16 }}>
          {code}
        </div>

        <button
          onClick={copy}
          disabled={!code}
          style={{
            width: '100%', padding: '14px 16px', borderRadius: 8, border: 'none',
            background: copied ? '#1fbf75' : '#4f7cff', color: '#fff', fontSize: 16,
            fontWeight: 600, cursor: code ? 'pointer' : 'not-allowed', transition: 'background .2s'
          }}
        >
          {copied ? '✓ Código copiado!' : '📋 Copiar PIX'}
        </button>
      </div>
    </main>
  )
}
