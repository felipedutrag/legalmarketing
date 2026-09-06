'use client'

import { useEffect, useState } from 'react'

export default function DarkMode() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true'
    setDark(saved)
    if (saved) document.body.classList.add('dark-mode')
  }, [])

  const toggle = () => {
    const next = !dark
    setDark(next)
    document.body.classList.toggle('dark-mode', next)
    localStorage.setItem('darkMode', String(next))
  }

  return (
    <button className="dark-mode-toggle" onClick={toggle} aria-label="Alternar modo escuro">
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
