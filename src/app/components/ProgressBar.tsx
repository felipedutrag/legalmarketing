'use client'

interface ProgressBarProps {
  currentSlide: number
  totalSlides?: number
  onSelectSlide?: (index: number) => void // Opcional: para tornar os bullets clicáveis!
}

export default function ProgressBar({ currentSlide, totalSlides = 6, onSelectSlide }: ProgressBarProps) {
  // Calcula a porcentagem do progresso com base nos slides (0 a 100%)
  // slide 0 = 0%, slide 5 = 100%
  const progressPct = totalSlides > 1 ? (currentSlide / (totalSlides - 1)) * 100 : 0

  return (
    <div className="progress-container fixed top-0 left-0 right-0 z-50">
      {/* 1. Barra de Linha Contínua (Topo da Tela) */}
      <div
        className="progress-bar-fill h-1 bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-700 ease-out"
        style={{ width: `${progressPct}%` }}
      />

      {/* 2. Bullets / Indicadores de Seções */}
      <div className="bullets-wrapper fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSelectSlide && onSelectSlide(index)}
            aria-label={`Ir para a seção ${index + 1}`}
            className={`bullet-item transition-all duration-300 rounded-full cursor-pointer ${index === currentSlide
                ? 'w-3 h-8 bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                : 'w-3 h-3 bg-white/30 hover:bg-white/60'
              }`}
          />
        ))}
      </div>
    </div>
  )
}