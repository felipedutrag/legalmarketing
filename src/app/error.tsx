'use client'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="error-screen">
      <h1>Algo deu errado</h1>
      <p>{error.message || 'Ocorreu um erro inesperado.'}</p>
      <button onClick={() => reset()}>Tentar novamente</button>
    </div>
  )
}
