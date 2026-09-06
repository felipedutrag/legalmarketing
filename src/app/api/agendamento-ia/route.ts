import { genAI } from '@/lib/gemini'

const SYSTEM_INSTRUCTION = `Você é um assistente de triagem de um escritório de advocacia brasileiro.

Sua função é APENAS:
- Categorizar o relato do visitante
- Estruturar perguntas de qualificação
- Listar documentos que o cliente precisa levar para a consulta

NUNCA:
- Ofereça opinião jurídica
- Aconselhe sobre direitos
- Diga se a pessoa tem ou não tem razão
- Analise o mérito do caso
- Sugira estratégias jurídicas

Mantenha-se estritamente na triagem administrativa e organizacional.

Quando solicitado a responder em JSON, retorne JSON válido sem markdown. Caso contrário, responda em texto simples.

Quando o prompt pedir uma árvore de perguntas de triagem, ENCADEIE no mínimo 5 perguntas por área/ramo, aprofundando a coleta de informações a cada resposta (detalhes do contrato, prazos, valores, partes, urgência, histórico). Cada pergunta leva a uma pergunta seguinte mais específica através do campo "next".`

function tryParseJSON(text: string) {
  const cleaned = text.replace(/```(?:json)?\s*([\s\S]*?)```/g, '$1').trim()
  try { return JSON.parse(cleaned) } catch { return null }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { prompt?: string; json?: boolean }
    const { prompt, json } = body || {}

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return new Response(JSON.stringify({ error: 'Campo "prompt" é obrigatório.' }), { status: 400 })
    }

    if (!genAI) {
      return new Response(JSON.stringify({ error: 'IA indisponível no momento.' }), { status: 503 })
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: json ? { responseMimeType: 'application/json' } : undefined,
    })

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    if (json) {
      const parsed = tryParseJSON(text)
      if (parsed) {
        return new Response(JSON.stringify({ data: parsed }), { headers: { 'Content-Type': 'application/json' } })
      }
      return new Response(JSON.stringify({ text }), { headers: { 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ text }), { headers: { 'Content-Type': 'application/json' } })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[agendamento-ia]', message)
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
}