'use client'

import { useEffect } from 'react'

export default function LazyImages() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src || ''
          observer.unobserve(img)
        }
      })
    })
    document.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img))
    return () => observer.disconnect()
  }, [])
  return null
}
