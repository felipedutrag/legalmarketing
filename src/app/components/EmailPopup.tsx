'use client'

import { useEffect, useState } from 'react'

export default function EmailPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('emailCaptured')) return
    const timer = setTimeout(() => setVisible(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = (e.target as HTMLFormElement).email.value
    if (email) {
      fetch('/api/subscriber/0', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }).catch(() => {})
      localStorage.setItem('emailCaptured', 'true')
      setVisible(false)
    }
  }

  const handleClose = () => {
    localStorage.setItem('emailCaptured', 'true')
    setVisible(false)
  }

  return (
    <div className="email-popup-overlay" onClick={handleClose}>
      <div className="email-popup" onClick={(e) => e.stopPropagation()}>
        <h3>Teste Grátis por 30 Dias!</h3>
        <p>Receba dicas exclusivas para advogados modernos</p>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="seu@email.com" required />
          <button type="submit">Enviar</button>
        </form>
        <button onClick={handleClose}>Não, obrigado</button>
      </div>
    </div>
  )
}
